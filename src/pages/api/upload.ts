import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { type Fields, type Files } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({ 
    multiples: true, 
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    filter: (part) => {
        // Only allow image files
        return part.mimetype?.startsWith('image/') || false;
    }
});

    form.parse(req, async (err: unknown, _fields: Fields, files: Files) => {
        if (err) {
            // eslint-disable-next-line no-console
            console.error('Upload error:', err);
            return res.status(400).json({ message: 'Invalid form data' });
        }
        
        try {

            const photos = files.photos;
            if (!photos) {
                return res.status(400).json({ message: 'No files provided' });
            }

            const photoArray = Array.isArray(photos) ? photos : [photos];
            const uploadedUrls = await Promise.all(photoArray.map(async (photo) => {
                if (!photo.filepath || !photo.originalFilename) {
                    throw new Error('Invalid file data');
                }

                const ext = path.extname(photo.originalFilename);
                const base = path.basename(photo.originalFilename, ext).replace(/[^a-z0-9-_]/gi, '_');
                const filename = `${base}_${Date.now()}${ext || '.png'}`;
                const destPath = path.join(uploadDir, filename);

                await fs.promises.copyFile(photo.filepath, destPath);
                return `/uploads/${filename}`;
            }));

            res.status(200).json({ urls: uploadedUrls });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Upload processing error:', e);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Send a timeout response after 10 seconds if no response has been sent
    const timeout = setTimeout(() => {
        if (!res.writableEnded) {
            res.status(408).json({ message: 'Request timeout' });
        }
    }, 10000);

    // Clean up the timeout when the request ends
    req.on('close', () => clearTimeout(timeout));
}


