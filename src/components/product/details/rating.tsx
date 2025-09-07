import React from 'react';

interface ProductRatingProps {
  // No rating field in Product type, so just show placeholder
}

const ProductRating: React.FC<ProductRatingProps> = () => {
  return (
    <div className="product-rating">
      {/* Placeholder: No rating data available */}
      <span>No ratings yet</span>
    </div>
  );
};

export default ProductRating;
