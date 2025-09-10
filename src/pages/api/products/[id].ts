import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    console.log('Request method:', req.method);
    console.log('Product ID:', id);
    
    switch (req.method) {
      case 'GET': {
        console.log('Attempting to fetch product from database...');
        const product = await prisma.product.findUnique({
          where: { id }
        });

        if (!product) {
          console.log('Product not found in database');
          return res.status(404).json({ error: 'Product not found' });
        }

        console.log('Product found:', product.id);
        return res.status(200).json(product);
      }

      case 'PUT': {
        // Check if user is admin
        if (!session?.user || session.user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Unauthorized' });
        }

        // Get the existing product first
        const existingProduct = await prisma.product.findUnique({
          where: { id }
        });

        if (!existingProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }

        // Create update data object with only the fields that are provided
        const updateData: any = {};
        
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.images !== undefined) updateData.images = req.body.images;
        if (req.body.featured !== undefined) updateData.featured = req.body.featured;
        
        // Handle numeric fields with proper type conversion
        if (req.body.price !== undefined) {
          updateData.price = typeof req.body.price === 'string' 
            ? parseFloat(req.body.price) 
            : req.body.price;
        }
        
        if (req.body.stock !== undefined) {
          updateData.stock = typeof req.body.stock === 'string' 
            ? parseInt(req.body.stock, 10) 
            : req.body.stock;
        }

        // Update the product with only the changed fields
        // Handle color updates if provided
        if (req.body.colors !== undefined) {
          // Get existing colors
          const existingColors = await prisma.productColor.findMany({
            where: { productId: id }
          });

          // Delete colors that are no longer present
          const newColorHexCodes = new Set(req.body.colors.map((c: any) => c.hexCode));
          const colorsToDelete = existingColors.filter(
            (color: any) => !newColorHexCodes.has(color.hexCode)
          );

          if (colorsToDelete.length > 0) {
            await prisma.productColor.deleteMany({
              where: {
                id: {
                  in: colorsToDelete.map((c: any) => c.id)
                }
              }
            });
          }

          // Update or create colors
          const colorPromises = req.body.colors.map((color: any) => {
            const existingColor = existingColors.find(
              (ec: any) => ec.hexCode === color.hexCode
            );

            if (existingColor) {
              // Update existing color
              return prisma.productColor.update({
                where: { id: existingColor.id },
                data: {
                  name: color.name,
                  stock: color.stock,
                  inStock: color.inStock,
                }
              });
            } else {
              // Create new color
              return prisma.productColor.create({
                data: {
                  name: color.name,
                  hexCode: color.hexCode,
                  stock: color.stock,
                  inStock: color.inStock,
                  productId: id,
                }
              });
            }
          });

          await Promise.all(colorPromises);
          delete updateData.colors; // Remove colors from main product update
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: updateData,
          include: {
            colors: true
          }
        });

        return res.status(200).json(updatedProduct);
      }

      case 'DELETE': {
        // Check if user is admin
        if (!session?.user || session.user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.product.delete({
          where: { id },
        });

        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling product:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
