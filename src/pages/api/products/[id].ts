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
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: updateData,
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
