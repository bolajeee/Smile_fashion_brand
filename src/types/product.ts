export interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
  type: string;
  sizes: string[];
  images: string[];
  discount?: number;
  currentPrice?: number;
  description?: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductType {
  id: string;
  name: string;
}

export interface ProductSize {
  id: string;
  label: string;
}

export interface ProductColor {
  id: string;
  color: string;
}