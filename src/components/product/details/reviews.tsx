import { useState } from 'react';


interface ReviewsProps {
  show: boolean;
  reviews?: Array<{
    id: string;
    rating: number;
    review: string;
    user: {
      name: string;
    };
    createdAt: string;
  }>;
}

const Reviews: React.FC<ReviewsProps> = ({ show, reviews = [] }) => {
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
            <span className="rating-overall__score">
              {reviews.length > 0
                ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                : "No ratings"}
            </span>
            <div className="rating-overall__stars">
              {"★".repeat(5)}
            </div>
            <span className="rating-overall__count">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </div>

      <div className="product-reviews__filters">
        <button
          className={`btn btn--rounded ${activeTab === 'all' ? 'btn--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          className={`btn btn--rounded ${activeTab === 'positive' ? 'btn--active' : ''}`}
          onClick={() => setActiveTab('positive')}
        >
          Positive ({reviews.filter(review => review.rating >= 4).length})
        </button>
        <button
          className={`btn btn--rounded ${activeTab === 'negative' ? 'btn--active' : ''}`}
          onClick={() => setActiveTab('negative')}
        >
          Critical ({reviews.filter(review => review.rating < 4).length})
        </button>
      </div>

      <div className="product-reviews__list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews
            .filter(review => {
              if (activeTab === 'positive') return review.rating >= 4;
              if (activeTab === 'negative') return review.rating < 4;
              return true;
            })
            .map(review => (
              <div key={review.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__user">
                    <div className="review-card__avatar">
                      <i className="icon-user" />
                    </div>
                    <div className="review-card__user-info">
                      <h4>{review.user.name}</h4>
                      <span>Verified Purchase</span>
                    </div>
                  </div>
                  <div className="review-card__rating">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                </div>
                <div className="review-card__content">
                  <p>{review.review}</p>
                </div>
                <div className="review-card__date">
                  Posted {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
        )}
      </div>

      {reviews.length > 5 && (
        <div className="product-reviews__load-more">
          <button className="btn btn--rounded">
            Load More Reviews
          </button>
        </div>
      )}
    </section>
  );
};

export default Reviews;
