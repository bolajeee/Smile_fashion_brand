import { some } from "lodash";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import type { ProductTypeList } from "@/types";

const ProductItem = ({
  discount,
  images,
  id,
  name,
  price,
  currentPrice,
}: ProductTypeList) => {
  const { state: { favoriteProducts }, toggleFavoriteProduct } = useUser();
  const { addProduct } = useCart();
  const { addNotification } = useUI();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavourite = some(favoriteProducts, (productId) => productId === id);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteProduct(id);

    addNotification({
      type: isFavourite ? 'info' : 'success',
      message: isFavourite ? 'Removed from favorites' : 'Added to favorites',
      duration: 2000
    });
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);

    // Add a small delay for better UX
    setTimeout(() => {
      const productPrice = typeof currentPrice === 'number' ? currentPrice : parseFloat(String(currentPrice || 0));

      addProduct({
        id,
        name,
        thumb: images && images.length > 0 ? images[0] : '',
        price: productPrice,
        count: 1,
        color: '',
        size: '',
        images: images || [],
      }, 1);

      addNotification({
        type: 'success',
        message: `${name} added to cart!`,
        duration: 3000
      });

      setIsAddingToCart(false);
    }, 300);
  };

  const handleImageHover = () => {
    if (images && images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setCurrentImageIndex(0);
  };

  const currentImage = images && images.length > 0 ? images[currentImageIndex] : '';
  const discountValue = typeof discount === 'string' ? parseFloat(discount) : 0;
  const hasDiscount = discountValue > 0;

  return (
    <article className="product-item">
      <div className="product-item__image">
        <Link href={`/product/${id}`}>
          <img
            src={currentImage}
            alt={name}
            loading="lazy"
          />
        </Link>
        
        {hasDiscount && (
          <div className="product-item__badge">
            <span className="product-item__discount">-{discountValue}%</span>
          </div>
        )}
      </div>

      <div className="product-item__content">
        <h3 className="product-item__name">
          <Link href={`/product/${id}`}>{name}</Link>
        </h3>
        
        <div className="product-item__price">
          <span className="product-item__price-current">${currentPrice}</span>
          {hasDiscount && (
            <span className="product-item__price-original">${price}</span>
          )}
        </div>

        <div className="product-item__buttons">
          <Link href={`/product/${id}`} className="btn btn--rounded btn--border">
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="btn btn--rounded btn--primary"
          >
            {isAddingToCart ? (
              <i className="icon-loading" />
            ) : (
              <>Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductItem;
