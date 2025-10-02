import { useState, useEffect } from "react";
import type { ProductTypeList } from "@/types";
import ProductCard from "@/components/product/card";

type ProductsCarouselType = {
  products: ProductTypeList[];
};

const ProductsCarousel = ({ products }: ProductsCarouselType) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

    const updateCarousel = (newIndex: number) => {
    if (isAnimating || !Array.isArray(products) || products.length === 0) return;
    setIsAnimating(true);

    const normalizedIndex = (newIndex + products.length) % products.length;
    setCurrentIndex(normalizedIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // Timed auto-transition every 3s
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isMobile) {
      interval = setInterval(() => {
        updateCarousel(currentIndex + 1);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentIndex, isMobile]);

  if (!Array.isArray(products) || products.length === 0) return <div>Loading...</div>;



  const getSlideClass = (index: number) => {
  const offset = (index - currentIndex + products.length) % products.length;
  if (offset === 0) return 'center';
  if (offset === 1) return 'right';
  if (offset === products.length - 1) return 'left';
  return '';
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

      {/* Hide navigation buttons on mobile */}
      {!isMobile && (
        <>
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
        </>
      )}

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
