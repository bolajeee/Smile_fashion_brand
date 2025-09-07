import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

interface GalleryProps {
  images: string[];
  productName: string;
}

const Gallery: React.FC<GalleryProps> = ({ images, productName }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery__main">
          <div className="product-gallery__placeholder">
            <i className="fas fa-image"></i>
            <p>No image available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div className="product-gallery__main">
        <Swiper
          modules={[Navigation, Thumbs, Zoom]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation={{
            nextEl: '.gallery-button-next',
            prevEl: '.gallery-button-prev',
          }}
          zoom={{
            maxRatio: 3,
            minRatio: 1,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="gallery-main-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-zoom-container">
                <Image
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  className="product-gallery__main-image"
                  priority={index === 0}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </SwiperSlide>
          ))}
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <div className="gallery-button-prev gallery-button">
                <i className="fas fa-chevron-left"></i>
              </div>
              <div className="gallery-button-next gallery-button">
                <i className="fas fa-chevron-right"></i>
              </div>
            </>
          )}
        </Swiper>
        {/* Image counter */}
        {images.length > 1 && (
          <div className="product-gallery__counter">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="product-gallery__thumbs">
          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={10}
            watchSlidesProgress={true}
            modules={[Navigation, Thumbs]}
            breakpoints={{
              480: {
                slidesPerView: 5,
              },
              768: {
                slidesPerView: 4,
              },
            }}
            className="gallery-thumbs-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div 
                  className={`product-gallery__thumb ${
                    index === activeIndex ? 'product-gallery__thumb--active' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="product-gallery__thumb-image"
                    quality={70}
                    sizes="100px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      {/* Zoom hint */}
      <div className="product-gallery__zoom-hint">
        <i className="fas fa-search-plus"></i>
        <span>Click to zoom</span>
      </div>
    </div>
  );
};

export default Gallery;
