import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Admin Configuration
  ADMIN_EMAIL: z.string().email(),
  ADMIN_NAME: z.string().min(2),
  ADMIN_PASSWORD: z.string().min(8),

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // Application Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default(3000),

  // Security Configuration
  CORS_ORIGINS: z.string().default('*'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default(900000), // 15 minutes
  RATE_LIMIT_MAX: z.string().transform(Number).default(100),
});

export const env = envSchema.parse({
  ...process.env,
  // Add any default values here
  PORT: process.env.PORT || '3000',
  CORS_ORIGINS: process.env.CORS_ORIGINS || '*',
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '900000',
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || '100',
});

// Type definition for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
