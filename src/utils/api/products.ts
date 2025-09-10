import { Product } from '@/types/product';
import { prisma } from '@/utils/db';

export const getProducts = async (): Promise<Product[]> => {
  try {
    if (typeof window === 'undefined') {
      // Server-side: Use Prisma directly
      const products = await prisma.product.findMany({
        orderBy: [
          { featuredOrder: 'asc' },
          { createdAt: 'desc' }
        ],
      });

      // Transform Prisma Product to our Product type
      return products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description ?? '',
        price: Number(p.price),
        images: p.images,
        stock: p.stock || 0,
        sizes: [],
        currentPrice: Number(p.price),
        featured: p.featured || false,
        featuredOrder: p.featuredOrder ?? null,
        reviews: [] as Array<{
          id: string;
          rating: number;
          review: string;
          user: { name: string };
          createdAt: string;
        }>
      }));
    } else {
      // Client-side: Use API route
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const products = await response.json();
      return products.map((p: { id: string; name: string; price: number | string; images: string[]; discount?: number | string; color?: string; type?: string; sizes?: string[]; description?: string; stock?: number }) => ({
        ...p,
        price: Number(p.price),
        currentPrice: Number(p.price),
        discount: p.discount ? Number(p.discount) : null,
        color: p.color || null,
        type: p.type || null,
        sizes: p.sizes || [],
        description: p.description || null,
        stock: p.stock || 0
      }));
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`/api/product/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const response = await fetch(`/api/product/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/product/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};