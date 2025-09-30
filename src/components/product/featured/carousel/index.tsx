import { useState } from "react";
import type { ProductTypeList } from "@/types";
import ProductCard from "@/components/product/card";

type ProductsCarouselType = {
  products: ProductTypeList[];
};

const ProductsCarousel = ({ products }: ProductsCarouselType) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!Array.isArray(products) || products.length === 0) return <div>Loading...</div>;

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const normalizedIndex = (newIndex + products.length) % products.length;
    setCurrentIndex(normalizedIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const getSlideClass = (index: number) => {
    const offset = (index - currentIndex + products.length) % products.length;
    if (offset === 0) return 'center';
    if (offset === 1) return 'right-1';
    if (offset === 2) return 'right-2';
    if (offset === products.length - 1) return 'left-1';
    if (offset === products.length - 2) return 'left-2';
    return 'hidden';
  };

  return (
    <div className="products-carousel">
      <div className="products-carousel__track">
        {products.map((item, index) => (
          <div key={item.id} className={`swiper-slide ${getSlideClass(index)}`}>
            <ProductCard
              id={item.id}
              name={item.name}
              price={item.price}
              color={item.color}
              discount={item.discount}
              currentPrice={item.currentPrice}
              images={item.images}
            />
          </div>
        ))}
      </div>

      <button 
        className="nav-arrow btn btn--primary left" 
        onClick={() => updateCarousel(currentIndex - 1)}
        aria-label="Previous product"
      >
        <i className="icon-arrow-long-left"></i>
      </button>
      
      <button 
        className="nav-arrow btn btn--primary right" 
        onClick={() => updateCarousel(currentIndex + 1)}
        aria-label="Next product"
      >
        <i className="icon-arrow-long-right"></i>
      </button>

      <div className="dots">
        {products.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => updateCarousel(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsCarousel;
