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
        size: ''
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
      <div className="product-item__wrapper">
        <div className="product-item__image"
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}>

          <button
            type="button"
            onClick={toggleFav}
            className={`product-item__favorite ${isFavourite ? "product-item__favorite--active" : ""}`}
            aria-label={isFavourite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className="icon-heart" />
          </button>

          {hasDiscount && (
            <div className="product-item__badge">
              <span className="product-item__discount">-{discountValue}%</span>
            </div>
          )}

          <Link href={`/product/${id}`} className="product-item__link">
            <div className="product-item__image-container">
              <img
                src={currentImage}
                alt={name}
                className="product-item__img"
                loading="lazy"
              />
              {images && images.length > 1 && (
                <div className="product-item__image-indicators">
                  {images.slice(0, 3).map((_, index) => (
                    <span
                      key={index}
                      className={`product-item__indicator ${index === currentImageIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>

          <div className="product-item__actions">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="product-item__add-to-cart"
              aria-label="Add to cart"
            >
              {isAddingToCart ? (
                <i className="icon-loading" />
              ) : (
                <i className="icon-cart" />
              )}
            </button>

            <Link href={`/product/${id}`} className="product-item__quick-view">
              <i className="icon-eye" />
              <span>Quick View</span>
            </Link>
          </div>
        </div>

        <div className="product-item__content">
          <div className="product-item__details">
            <h3 className="product-item__title">
              <Link href={`/product/${id}`}>{name}</Link>
            </h3>

            <div className="product-item__price">
              <span className="product-item__current-price">${currentPrice}</span>
              {hasDiscount && (
                <span className="product-item__original-price">${price}</span>
              )}
            </div>
          </div>

          <div className="product-item__rating">
            <div className="product-item__stars">
              <i className="icon-star" />
              <i className="icon-star" />
              <i className="icon-star" />
              <i className="icon-star" />
              <i className="icon-star-empty" />
            </div>
            <span className="product-item__rating-count">(24)</span>
          </div>

          <div className="product-item__tags">
            {hasDiscount && <span className="product-item__tag product-item__tag--sale">Sale</span>}
            <span className="product-item__tag product-item__tag--new">New</span>
            <span className="product-item__tag product-item__tag--trending">Trending</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductItem;
