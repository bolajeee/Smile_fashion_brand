import { DefaultSession, DefaultUser } from 'next-auth';

export type UserId = string;

export type Role = 'ADMIN' | 'USER';

export interface UserProfile {
  id: UserId;
  name: string;
  email: string;
  address?: string;
  image?: string;
  phoneNumber?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
}

export interface SafeUser {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: Role;
      phoneNumber?: string | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: Role;
    image?: string | null;
    phoneNumber?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    image?: string | null;
    phoneNumber?: string | null;
  }
}
