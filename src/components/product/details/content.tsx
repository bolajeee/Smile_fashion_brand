import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
import QuantityControl from './quantity-control';
import PriceDisplay from './price-display';
import ProductRating from './rating';

interface ProductDetailsProps {
  product: Product;
  excludeIds?: string[];

}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter();
  const { addProduct } = useCart();
  
  // Determine available colors and sizes
  const availableColors = product.color ? [product.color] : ['black', 'navy', 'red', 'green', 'purple'];
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'];
  
  // Debug logs
  console.log('Product:', product);
  console.log('Available colors:', availableColors);
  console.log('Available sizes:', availableSizes);
  
  // Product state management
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || '');
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Debug state changes
  console.log('Selected color:', selectedColor);
  console.log('Selected size:', selectedSize);

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

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setLoading(true);
    try {
      addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        count: quantity,
        colorId: selectedColor,
        size: selectedSize,
        discount: product.discount,
        currentPrice: product.currentPrice,
        thumb: product.images?.[0] || '',
      }, quantity);
      // Show success message or redirect
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-content">
      {/* Product Header */}
      <div className="product-content__header">
        <h1 className="product-details__title">{product.name}</h1>
        
        <div className="product-details__rating">
          <ProductRating />
        </div>

           {/* Stock Status */}
        <div className="product-details__stock">
          {typeof product.stock === 'number' && product.stock > 0 ? (
            <span className="stock-status stock-status--in-stock">
              <i className="fas fa-check-circle"></i>
              {product.stock < 10 
                ? `Only ${product.stock} left in stock!` 
                : 'In Stock'
              }
            </span>
          ) : (
            <span className="stock-status stock-status--out-of-stock">
              <i className="fas fa-times-circle"></i>
              Out of Stock
            </span>
          )}
        </div>

        <div className="product-details__price">
          <PriceDisplay 
            currentPrice={product.currentPrice ?? (typeof product.price === 'string' ? parseFloat(product.price) : product.price)}
            originalPrice={typeof product.price === 'string' ? parseFloat(product.price) : product.price}
            discount={product.discount}
          />
        </div>
      </div>

      {/* Product Description */}
      <div className="product-details__description">
        <p>{product.description}</p>
      </div>

      {/* Product Meta */}
      {/* <div className="product-details__meta">
        <div className="product-details__meta-item">
          <i className="fas fa-truck"></i>
          <span>Free delivery on orders over $50</span>
        </div>
        <div className="product-details__meta-item">
          <i className="fas fa-undo"></i>
          <span>30-day return policy</span>
        </div>
        <div className="product-details__meta-item">
          <i className="fas fa-shield-alt"></i>
          <span>1-year warranty</span>
        </div>
      </div> */}

      {/* Product Options */}
      <div className="product-details__options">
        {/* Colors */}
        {availableColors.length > 0 && (
          <div className="product-option-group">
            <h3 className="option-title">Color</h3>
            <div className="product-options__colors">
              {availableColors.map((color) => (
                <button
                  key={color}
                  className={`product-options__color-btn${selectedColor === color ? ' product-options__color-btn--selected' : ''}`}
                  onClick={() => {
                    console.log('Color clicked:', color);
                    setSelectedColor(color);
                  }}
                  aria-label={`Select color ${color}`}
                  style={{ backgroundColor: getColorHex(color) }}
                  type="button"
                />
              ))}
            </div>
          </div>
        )}

        {/* Size and Quantity Row */}
        <div className="product-details__size-quantity">
          {/* Size Selection */}
          <div className="size-group" style={{ marginTop: '0.75rem' }}>
            <div className="size-header">
              <h3 className="option-title">Size</h3>
              <button 
                className="size-guide-link"
                onClick={() => {
                  // TODO: Open size guide modal or redirect
                  alert('Size Guide will be implemented soon!');
                }}
                type="button"
              >
                <i className="fas fa-ruler"></i>
                Size Guide
              </button>
            </div>
            <div className="product-options__sizes">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`product-options__size-btn${selectedSize === size ? ' product-options__size-btn--selected' : ''}`}
                  onClick={() => {
                    console.log('Size clicked:', size);
                    setSelectedSize(size);
                  }}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="quantity-group" style={{ marginTop: '0.75rem' }}>
            <h3 className="option-title">Quantity</h3>
            <QuantityControl
              value={quantity}
              onChange={setQuantity}
              max={product.stock || 99}
              min={1}
            />
          </div>
        </div>

     
      </div>

      {/* Action Buttons */}
      <div className="product-details__actions">
        <div className="product-details__buttons">
          <button
            className="btn btn--primary"
            onClick={handleAddToCart}
            disabled={loading || (typeof product.stock === 'number' && product.stock <= 0)}
            style={{ marginTop: '0.75rem' }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
