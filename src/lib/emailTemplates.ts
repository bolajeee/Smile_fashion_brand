export const templates = {
  newsletterWelcome: (email: string) => `
    <h2>Welcome to Smile Fashion!</h2>
    <p>Thank you for subscribing, ${email}!</p>
  `,
  orderConfirmation: (order: any) => `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order, ${order.customerName}!</p>
    <p>Order ID: ${order.id}</p>
    <!-- Add more order details here -->
  `,
  adminNewOrder: (order: any) => `
    <h2>New Order Placed</h2>
    <p>Order ID: ${order.id}</p>
    <p>Customer: ${order.customerName} (${order.customerEmail})</p>
    <!-- Add more order details here -->
  `,
  contactReceived: (data: any) => `
    <h2>New Contact Message</h2>
    <p><b>Name:</b> ${data.name}</p>
    <p><b>Email:</b> ${data.email}</p>
    <p><b>Message:</b> ${data.message}</p>
  `,
  contactUserReply: (data: any) => `
    <h2>Thank you for contacting Smile Fashion!</h2>
    <p>Hi ${data.name}, we received your message and will get back to you soon.</p>
  `,
  registrationWelcome: ({ name, email }: { name?: string; email: string }) => `
    <h2>Welcome to Smile Fashion!</h2>
    <p>Hi ${name || email}, thank you for registering. Please verify your email to activate your account.</p>
  `,
  passwordReset: ({ name, email, resetToken }: { name?: string; email: string; resetToken: string }) => `
    <h2>Password Reset Request</h2>
    <p>Hi ${name || email},</p>
    <p>We received a request to reset your password. Click the link below to set a new password:</p>
    <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}">Reset Password</a></p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `,
};