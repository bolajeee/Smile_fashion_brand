import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: any[];
}) {
  return resend.emails.send({
    from: 'no-reply@yourdomain.com',
    to,
    subject,
    html,
    attachments,
  });
}