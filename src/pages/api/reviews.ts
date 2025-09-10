import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/error-helpers';
import type { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get user session
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
  return handlePost(req, res, session);
      case 'PATCH':
  return handlePatch(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Reviews API Error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

// GET /api/reviews?productId={id}
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.query;
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.status(200).json(reviews);
}

// POST /api/reviews
async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  const { productId, rating, review, photos = [] } = req.body;

  if (!productId || !rating || !review) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }


  // Defensive: ensure user fields are present
  const userId = session.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if user has already reviewed this product
  const existingReview = await prisma.review.findFirst({
    where: {
      productId,
      userId: userId
    }
  });

  if (existingReview) {
    return res.status(400).json({ error: 'You have already reviewed this product' });
  }

  // Check if the product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Create the review
  const newReview = await prisma.review.create({
    data: {
      productId,
      userId: userId,
      rating,
      review,
      photos,
      verified: true, // Set to true if user has purchased the product
      helpful: 0
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });

  // Update product rating statistics




  return res.status(201).json(newReview);
}

// PATCH /api/reviews/{id}/helpful
async function handlePatch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { helpful } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Review ID is required' });
  }

  // Find the review
  const review = await prisma.review.findUnique({
    where: { id }
  });

  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  // Update the helpful count
  const updatedReview = await prisma.review.update({
    where: { id },
    data: {
      helpful: {
        increment: helpful ? 1 : -1
      }
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });

  return res.status(200).json(updatedReview);
}
