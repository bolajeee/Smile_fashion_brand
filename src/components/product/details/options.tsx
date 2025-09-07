import React from 'react';

interface ProductOptionsProps {
  colors?: string[];
  sizes?: string[];
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  stock?: number;
}

const COLORS = [
  { name: 'Black', value: 'black' },
  { name: 'Navy', value: 'navy' },
  { name: 'Red', value: 'red' },
  { name: 'Green', value: 'green' },
  { name: 'Purple', value: 'purple' },
];

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const ProductOptions: React.FC<ProductOptionsProps> = ({
  colors = COLORS.map(c => c.value),
  sizes = DEFAULT_SIZES,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  stock,
}) => {
  return (
    <div className="product-options">
      <div className="product-options__section">
        <h3 className="product-options__title">Color</h3>
        <div className="product-options__row">
          {colors.map((color) => (
            <button
              key={color}
              className={`color-option${selectedColor === color ? ' color-option--selected' : ''}`}
              onClick={() => onColorChange(color)}
              aria-label={`Select color ${color}`}
              data-color={color}
              type="button"
            />
          ))}
        </div>
      </div>
      <div className="product-options__section">
        <h3 className="product-options__title">Size</h3>
        <div className="product-options__row">
          {sizes.map((size) => (
            <button
              key={size}
              className={`size-option${selectedSize === size ? ' size-option--selected' : ''}`}
              onClick={() => onSizeChange(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
