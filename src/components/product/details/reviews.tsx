import { useState } from 'react';
import type { Product } from '@/types/product';

interface ReviewsProps {
  show: boolean;
  product: Product;
}

const Reviews: React.FC<ReviewsProps> = ({ show, product }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'positive' | 'negative'

  const style = {
    display: show ? "flex" : "none",
  };

  return (
    <section style={style} className="product-reviews">
      <div className="product-reviews__header">
        <h3>Customer Reviews</h3>
        <div className="product-reviews__stats">
          <div className="rating-overall">
            <span className="rating-overall__score">4.8</span>
            <div className="rating-overall__stars">
              {"★".repeat(5)}
            </div>
            <span className="rating-overall__count">Based on 120 reviews</span>
          </div>
        </div>
      </div>

      <div className="product-reviews__filters">
        <button
          className={`btn btn--rounded ${activeTab === 'all' ? 'btn--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Reviews
        </button>
        <button
          className={`btn btn--rounded ${activeTab === 'positive' ? 'btn--active' : ''}`}
          onClick={() => setActiveTab('positive')}
        >
          Positive
        </button>
        <button
          className={`btn btn--rounded ${activeTab === 'negative' ? 'btn--active' : ''}`}
          onClick={() => setActiveTab('negative')}
        >
          Critical
        </button>
      </div>

      <div className="product-reviews__list">
        <div className="review-card">
          <div className="review-card__header">
            <div className="review-card__user">
              <div className="review-card__avatar">
                <i className="icon-user" />
              </div>
              <div className="review-card__user-info">
                <h4>John Doe</h4>
                <span>Verified Purchase</span>
              </div>
            </div>
            <div className="review-card__rating">
              {"★".repeat(5)}
            </div>
          </div>
          <div className="review-card__content">
            <p>Great product! Exactly as described and arrived quickly.</p>
          </div>
          <div className="review-card__date">
            Posted 2 days ago
          </div>
        </div>

        {/* More review cards would be added here */}
      </div>

      <div className="product-reviews__load-more">
        <button className="btn btn--rounded">
          Load More Reviews
        </button>
      </div>
    </section>
  );
};

export default Reviews;
