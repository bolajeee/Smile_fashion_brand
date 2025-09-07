import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { useFavorite } from '@/hooks/useFavorite';
import { Product } from '@/types/product';
import ProductOptions from './options';
import ProductTabs from './tabs';
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

  const { isFavorite, toggleFavorite } = useFavorite(product.id);
  
  // Product only has color and sizes (optional)
  const [selectedColor, setSelectedColor] = useState(product.color || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes?.length) {
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
        color: selectedColor,
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

  // Favorite toggle handled by useFavorite

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="product-content">
      {/* Product Header */}
      <div className="product-content__header">
        <h1 className="product-details__title">{product.name}</h1>
        
        <div className="product-details__rating">
          <ProductRating />
        </div>

        <div className="product-details__price">
          <PriceDisplay 
            currentPrice={product.currentPrice ?? product.price}
            originalPrice={product.price}
            discount={product.discount}
          />
        </div>
      </div>

      {/* Product Description */}
      <div className="product-details__description">
        <p>{product.description}</p>
      </div>

      {/* Product Meta */}
      <div className="product-details__meta">
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
          <span>2-year warranty</span>
        </div>
      </div>

      {/* Product Options */}
      <div className="product-details__options">
        <ProductOptions
          colors={product.color ? [product.color] : undefined}
          sizes={product.sizes}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
          stock={product.stock}
        />
      </div>

      {/* Actions */}
      <div className="product-details__actions">
        <QuantityControl
          value={quantity}
          onChange={setQuantity}
          max={product.stock || 99}
          min={1}
        />

        <div className="product-details__buttons">
          <button
            className="btn btn--primary"
            onClick={handleAddToCart}
            disabled={loading || (typeof product.stock === 'number' && product.stock <= 0)}
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

          <button
            className="btn btn--secondary"
            onClick={handleBuyNow}
            disabled={loading || (typeof product.stock === 'number' && product.stock <= 0)}
          >
            <i className="fas fa-bolt"></i>
            Buy Now
          </button>

          <button
            className={`btn btn--outline ${isFavorite ? 'btn--active' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
          </button>
        </div>
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

      {/* Product Tabs (stub, as Product has no specifications or reviews) */}
      <div className="product-details__content">
        <ProductTabs 
          description={product.description}
          productId={product.id}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
