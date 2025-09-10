import React from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { ColorSelector } from './ColorSelector';
import { useColorSelection } from '@/hooks/useColorSelection';
import type { ProductStoreType } from '@/types';


// ProductColor as used in product prop
interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
  inStock: boolean;
  stock: number;
}

// ColorOption as used by useColorSelection
import type { ColorOption } from '@/hooks/useColorSelection';

interface Product extends Omit<ProductStoreType, 'colorId' | 'colorName' | 'colorHexCode'> {
  colors: ProductColor[];
}

interface ProductDisplayProps {
  product: Product;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  const { addProduct } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  

  // Map ProductColor[] to ColorOption[]
  const colorOptions: ColorOption[] = product.colors.map((c) => ({
    colorId: c.id,
    colorName: c.name,
    colorHexCode: c.hexCode,
    inStock: c.inStock,
    stock: c.stock,
  }));

  const { selectedColor, handleColorSelect, getAvailableStock } = useColorSelection({
    colors: colorOptions,
    onChange: () => setQuantity(1), // Reset quantity when color changes
  });

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    addProduct({
      ...product,
      colorId: selectedColor.colorId,
      colorName: selectedColor.colorName,
      colorHexCode: selectedColor.colorHexCode,
    }, quantity);
  };

  const availableStock = getAvailableStock();
  const canAddToCart = selectedColor?.inStock && quantity > 0 && quantity <= availableStock;

  return (
    <div className="product-display">
      <div className="product-images">
        {product.images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`${product.name} - Image ${index + 1}`}
            width={600}
            height={600}
            className="product-image"
          />
        ))}
      </div>

      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">${product.price.toFixed(2)}</p>
        
        {product.colors.length > 0 && (
          <div className="product-colors">
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor?.colorId}
              onColorSelect={(color) => {
                // Map ProductColor to ColorOption and vice versa
                const found = colorOptions.find((c) => c.colorId === color.id);
                if (found) handleColorSelect(found);
              }}
            />
            {selectedColor && (
              <p className="stock-info">
                {availableStock} {availableStock === 1 ? 'item' : 'items'} available
              </p>
            )}
          </div>
        )}

        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity:</label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={!selectedColor?.inStock}
          >
            {Array.from({ length: availableStock }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
        >
          {!selectedColor
            ? 'Select a Color'
            : !selectedColor.inStock
            ? 'Out of Stock'
            : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
