import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: 'smile_fashion',
      use_filename: true,
    });

    res.status(200).json({ url: result.secure_url, public_id: result.public_id });
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: error.message || 'Error uploading image' });
  }
}
