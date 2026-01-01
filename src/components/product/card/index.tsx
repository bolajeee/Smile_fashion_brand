// import { some } from "lodash";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
// import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { formatCurrency } from "@/utils/format";
import type { ProductTypeList } from "@/types";

const ProductCard = ({
  discount,
  images,
  id,
  name,
  price,
  currentPrice,
  // ...existing code...
}: ProductTypeList) => {
  // const { state: { favoriteProducts }, toggleFavoriteProduct } = useUser();
  const { addProduct } = useCart();
  const { addNotification } = useUI();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // const isFavourite = some(favoriteProducts, (productId) => productId === id);
  // Favorite button and logic removed

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);

    // Add a small delay for better UX
    setTimeout(() => {
      // Ensure we get the correct price, prioritizing currentPrice (discounted) over regular price
      const productPrice = currentPrice 
        ? (typeof currentPrice === 'number' ? currentPrice : parseFloat(String(currentPrice)))
        : (typeof price === 'number' ? price : parseFloat(String(price || 0)));

      addProduct({
        id,
        name,
        thumb: images && images.length > 0 ? images[0] : '',
        price: productPrice,
        count: 1,
        colorId: '', // Empty string since colorId is optional
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
  const discountValue = typeof discount === 'string' ? parseFloat(discount) : (discount || 0);
  const hasDiscount = discountValue > 0;
  const displayPrice = typeof price === 'string' ? parseFloat(price) : price;
  const displayCurrentPrice = currentPrice || displayPrice;

  return (
    <article className="product-item">
      <div className="product-item__inner">
        <div className="product-item__image">
          <Link href={`/product/${id}`}>
            <Image
              src={currentImage || '/images/products/default.jpg'}
              alt={name}
              width={300}
              height={300}
              priority={false}
              onMouseEnter={handleImageHover}
              onMouseLeave={handleImageLeave}
            />
          </Link>
          
          {hasDiscount && (
            <div className="product-item__badge">
              <span className="product-item__discount">-{discountValue}%</span>
            </div>
          )}

          {/* Like/Favorite button removed */}
        </div>

        <div className="product-item__content">
          <h3 className="product-item__name">
            <Link href={`/product/${id}`}>{name}</Link>
          </h3>
          
          <div className="product-item__price">
            <span className="product-item__price-current">
              {formatCurrency(displayCurrentPrice)}
            </span>
            {hasDiscount && (
              <span className="product-item__price-original">
                {formatCurrency(displayPrice)}
              </span>
            )}
          </div>

          <div className="product-item__buttons">
            <Link href={`/product/${id}`} passHref>
              <span className="btn btn--rounded btn--quick-view">Quick View</span>
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="btn btn--rounded btn--primary"
              aria-label={`Add ${name} to cart`}
            >
              {isAddingToCart ? (
                <i className="icon-loading" />
              ) : (
                <>Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
