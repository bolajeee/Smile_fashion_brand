import React from 'react';
import clsx from 'clsx';
import { COLORS, DEFAULT_SIZES, COLOR_MAP } from '@/utils/constants';

interface ProductOptionsProps {
  colors?: string[];
  sizes?: string[];
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  colors = COLORS.map(c => c.value),
  sizes = DEFAULT_SIZES,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}) => {
  const getColorInfo = (colorValue: string) => COLOR_MAP.get(colorValue.toLowerCase());

  return (
    <div className="product-options">
      {colors && colors.length > 0 && (
        <div className="product-options__section">
          <h3 className="product-options__title">Color</h3>
          <div className="product-options__colors">
            {colors.map((colorValue) => {
              const colorInfo = getColorInfo(colorValue);
              if (!colorInfo) return null;

              return (
                <button
                  key={colorInfo.value}
                  className={clsx('product-options__color-btn', {
                    'product-options__color-btn--selected': selectedColor === colorInfo.value,
                  })}
                  onClick={() => onColorChange(colorInfo.value)}
                  aria-label={`Select color: ${colorInfo.name}`}
                  style={{ backgroundColor: colorInfo.hex }}
                  type="button"
                />
              );
            })}
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
                className={clsx('product-options__size-btn', {
                  'product-options__size-btn--selected': selectedSize === size,
                })}
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
