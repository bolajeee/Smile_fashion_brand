import { render, screen } from '@testing-library/react';
import ProductCard from '../index';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  currentPrice: 99.99,
  description: 'Test description',
  images: ['test-image.jpg'],
  stock: 10,
  discount: 0,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard {...mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('displays out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard {...outOfStockProduct} />);

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });
});
