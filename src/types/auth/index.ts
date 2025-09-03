import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export type UserId = string;

export type Role = 'ADMIN' | 'USER';

export interface UserProfile {
  id: UserId;
  name: string;
  email: string;
  address?: string;
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
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}
