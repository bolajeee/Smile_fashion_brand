export type Role = 'USER' | 'ADMIN';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  phoneNumber?: string | null;
}
