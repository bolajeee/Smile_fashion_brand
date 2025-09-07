import React from 'react';

interface ProductOptionsProps {
  colors?: string[];
  sizes?: string[];
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
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
}) => {
  const getColorHex = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      black: '#000000',
      navy: '#1a237e',
      red: '#d32f2f',
      green: '#388e3c',
      purple: '#7b1fa2',
      white: '#ffffff',
      blue: '#1976d2',
      gray: '#616161',
      brown: '#5d4037',
      yellow: '#fbc02d',
      pink: '#c2185b',
      orange: '#f57c00'
    };
    return colorMap[colorName.toLowerCase()] || '#000000';
  };

  return (
    <div className="product-options">
      {colors && colors.length > 0 && (
        <div className="product-options__section">
          <h3 className="product-options__title">Color</h3>
          <div className="product-options__colors">
            {colors.map((color) => (
              <button
                key={color}
                className={`product-options__color-btn${selectedColor === color ? ' product-options__color-btn--selected' : ''}`}
                onClick={() => onColorChange(color)}
                aria-label={`Select color ${color}`}
                style={{ backgroundColor: getColorHex(color) }}
                type="button"
              />
            ))}
          </div>
        </div>
      )}
      
      {sizes && sizes.length > 0 && (
        <div className="product-options__section">
          <h3 className="product-options__title">Size</h3>
          <div className="product-options__sizes">
            {sizes.map((size) => (
              <button
                key={size}
                className={`product-options__size-btn${selectedSize === size ? ' product-options__size-btn--selected' : ''}`}
                onClick={() => onSizeChange(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOptions;
