import { sendEmail } from '@/lib/email';
import { templates } from '@/lib/emailTemplates';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withCors } from '@/utils/cors';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const data = req.body;
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: templates.contactReceived(data),
    });
    await sendEmail({
      to: data.email,
      subject: 'We Received Your Message',
      html: templates.contactUserReply(data),
    });
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
};

export default withCors(handler);