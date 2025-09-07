import type { DefaultSession } from 'next-auth';
import type { Role } from './auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      phoneNumber?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: Role;
    phoneNumber?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    phoneNumber?: string | null;
  }
}
