import React from 'react';

interface ProductQuantityProps {
  quantity: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  icons?: {
    increment: string;
    decrement: string;
  };
}

export const ProductQuantity: React.FC<ProductQuantityProps> = ({ 
  quantity, 
  onChange, 
  min = 1, 
  max = 10,
  icons = {
    increment: "icon-plus",
    decrement: "icon-minus"
  }
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      onChange(value);
    }
  };

  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        <i className={icons.decrement} />
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <i className={icons.increment} />
      </button>
    </div>
  );
};
