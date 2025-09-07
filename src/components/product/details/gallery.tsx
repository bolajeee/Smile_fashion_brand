import { useState } from 'react';
import Image from 'next/image';

type GalleryProps = {
  images: string[];
};

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-details__gallery">
        <div className="product-details__gallery-main">
          <Image
            src="/images/products/default.jpg"
            alt="Product placeholder"
            width={600}
            height={600}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="product-details__gallery">
      <div className="product-details__gallery-main">
        <Image
          src={images[selectedImage]}
          alt={`Product image ${selectedImage + 1}`}
          width={600}
          height={600}
          priority={selectedImage === 0}
        />
      </div>
      
      {images.length > 1 && (
        <div className="product-details__gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={index}
              className={`product-details__gallery-thumbs-item ${
                selectedImage === index ? 'product-details__gallery-thumbs-item--active' : ''
              }`}
              onClick={() => setSelectedImage(index)}
              aria-label={`View product image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                width={120}
                height={120}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
