export interface Product {
  id: string;
  name: string;
  price: number;  // Always store as number internally
  color?: string;
  type?: string;
  sizes?: string[];
  images: string[];
  discount?: number;  // Always store as number
  currentPrice?: number;
  description?: string;
  stock?: number;
  featured?: boolean;
  featuredOrder?: number | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
    reviews: Array<{
    id: string;
    rating: number;
    review: string;
    user: {
      name: string;
    };
    createdAt: string;
  }>;
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

