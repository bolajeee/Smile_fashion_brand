import React from 'react';

interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  inStock: boolean;
  stock: number;
}

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor?: string;
  onColorSelect: (color: ProductColor) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="color-selector">
      <label className="color-label">Color:</label>
      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color.id}
            className={`color-option ${selectedColor === color.id ? 'selected' : ''} ${
              !color.inStock ? 'out-of-stock' : ''
            }`}
            onClick={() => color.inStock && onColorSelect(color)}
            disabled={!color.inStock}
            style={{
              backgroundColor: color.hexCode,
              border: color.hexCode.toLowerCase() === '#ffffff' ? '1px solid #e2e8f0' : 'none',
            }}
            title={`${color.name}${!color.inStock ? ' (Out of Stock)' : ''}`}
          >
            <span className="sr-only">{color.name}</span>
            {selectedColor === color.id && (
              <span className="selected-indicator" aria-hidden="true">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
