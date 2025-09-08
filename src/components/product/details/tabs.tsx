import React, { useState } from 'react';

interface ProductTabsProps {
  description?: string;
  specifications?: string;
  reviews?: any[];
  productId: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ description, specifications, reviews }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  return (
    <div className="product-tabs">
      <div className="product-tabs__nav">
        <button
          className={`product-tabs__btn${activeTab === 'description' ? ' product-tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`product-tabs__btn${activeTab === 'specs' ? ' product-tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Specifications
        </button>
        <button
          className={`product-tabs__btn${activeTab === 'reviews' ? ' product-tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>
      <div className="product-tabs__content">
        {activeTab === 'description' && (
          <div className="product-tabs__panel">
            <h4>Description</h4>
            <p>{description || 'No description available.'}</p>
          </div>
        )}
        {activeTab === 'specs' && (
          <div className="product-tabs__panel">
            <h4>Specifications</h4>
            <p>{specifications || 'No specifications available.'}</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="product-tabs__panel">
            <h4>Reviews</h4>
            {/* Render reviews here if available */}
            {reviews && reviews.length > 0 ? (
              <ul>
                {reviews.map((review, idx) => (
                  <li key={idx}>{review.content || 'No content'}</li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
