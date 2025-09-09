export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}


