import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useHelpfulReviews } from '@/hooks/useHelpfulReviews';
import { useTheme } from '@/contexts/ThemeContext';
import StarIcon from '@/components/icons/StarIcon';

interface ReviewsProps {
  show: boolean;
  reviews?: Array<{
    id: string;
    rating: number;
    review: string;
    user: {
      name: string;
      image?: string;
    };
    createdAt: string;
    photos?: string[];
    helpful?: number;
    verified?: boolean;
  }>;
}

const Reviews: React.FC<ReviewsProps> = ({ show, reviews: initialReviews = [] }) => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<ReviewsProps['reviews']>(initialReviews);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { helpfulReviews, toggleHelpful, isHelpful } = useHelpfulReviews();

  const fetchReviews = async () => {
    try {
      const productId = window.location.pathname.split('/').pop();
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!show) return null;

  const averageRating = reviews?.length ? (
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  ) : 0;

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i;
    const count = reviews?.filter(r => r.rating === rating)?.length || 0;
    return {
      rating,
      count,
      percentage: reviews?.length ? (count / reviews.length * 100) : 0
    };
  });

  const handleHelpfulClick = async (reviewId: string) => {
    if (!session) {
      // Handle unauthenticated users
      return;
    }
    await toggleHelpful(reviewId);
  };

  return (
    <motion.section 
      className="product-reviews"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="product-reviews__header">
        <h3>Customer Reviews</h3>
        <div className="product-reviews__summary">
          <div className="rating-overall">
            <div className="rating-overall__score">
              <span className="score">{averageRating.toFixed(1)}</span>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon 
                    key={i}
                    filled={i < Math.round(averageRating)}
                    className="star-icon"
                  />
                ))}
              </div>
              <span className="count">
                Based on {reviews?.length || 0} {(reviews?.length || 0) === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            <div className="rating-distribution">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="rating-bar">
                  <div className="rating-bar__label">{rating} stars</div>
                  <div className="rating-bar__track">
                    <div 
                      className="rating-bar__fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="rating-bar__count">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="product-reviews__controls">
        <div className="product-reviews__filters">
          <button
            className={`btn btn--rounded ${activeTab === 'all' ? 'btn--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Reviews ({reviews?.length || 0})
          </button>
          <button
            className={`btn btn--rounded ${activeTab === 'positive' ? 'btn--active' : ''}`}
            onClick={() => setActiveTab('positive')}
          >
            Positive ({reviews?.filter(review => review.rating >= 4)?.length || 0})
          </button>
          <button
            className={`btn btn--rounded ${activeTab === 'negative' ? 'btn--active' : ''}`}
            onClick={() => setActiveTab('negative')}
          >
            Critical ({reviews?.filter(review => review.rating < 4)?.length || 0})
          </button>
        </div>

        <div className="product-reviews__sort">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          className="product-reviews__list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={activeTab + sortBy}
        >
          {!reviews?.length ? (
            <div className="product-reviews__empty">
              <StarIcon className="empty-star" />
              <p>No reviews yet. Be the first to review this product!</p>
              {session && (
                <button 
                  className="btn btn--primary btn--rounded"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </button>
              )}
            </div>
          ) : (
            <>
              {(reviews || [])
                .filter(review => {
                  if (activeTab === 'positive') return review.rating >= 4;
                  if (activeTab === 'negative') return review.rating < 4;
                  return true;
                })
                .sort((a, b) => {
                  switch (sortBy) {
                    case 'helpful':
                      return (b.helpful || 0) - (a.helpful || 0);
                    case 'highest':
                      return b.rating - a.rating;
                    case 'lowest':
                      return a.rating - b.rating;
                    default:
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  }
                })
                .map(review => (
                  <motion.div 
                    key={review.id}
                    className="review-card"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="review-card__header">
                      <div className="review-card__user">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="review-card__avatar"
                          />
                        ) : (
                          <div className="review-card__avatar">
                            {review.user.name.charAt(0)}
                          </div>
                        )}
                        <div className="review-card__user-info">
                          <h4>{review.user.name}</h4>
                          {review.verified && (
                            <span className="verified-badge">
                              <i className="icon-check" /> Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="review-card__rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i 
                            key={i}
                            className={`icon-star${i < review.rating ? ' filled' : ''}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="review-card__content">
                      <p>{review.review}</p>
                      {review.photos && review.photos.length > 0 && (
                        <div className="review-card__photos">
                          {review.photos.map((photo, index) => (
                            <Image
                              key={index}
                              src={photo}
                              alt={`Review photo ${index + 1}`}
                              width={80}
                              height={80}
                              className="review-photo"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="review-card__footer">
                      <div className="review-card__date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <button
                        className={`btn btn--text helpful-btn${
                          isHelpful(review.id) ? ' helpful-btn--active' : ''
                        }`}
                        onClick={() => handleHelpfulClick(review.id)}
                        disabled={!session}
                        title={!session ? 'Please sign in to mark reviews as helpful' : undefined}
                      >
                        <i className="icon-thumbs-up" />
                        Helpful ({(review.helpful || 0) + 
                          (isHelpful(review.id) ? 1 : 0)})
                      </button>
                    </div>
                  </motion.div>
                ))
              }
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {session && (
        <motion.div 
          className="product-reviews__cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)'
          }}
        >
          {showReviewForm ? (
            <ReviewForm 
              onClose={() => setShowReviewForm(false)} 
              onSubmitSuccess={fetchReviews} />
          ) : (
            <div className="cta-content">
              <h3>Share Your Experience</h3>
              <p>Help others make better choices by sharing your thoughts about this product.</p>
              <button 
                className="btn btn--primary btn--rounded"
                onClick={() => setShowReviewForm(true)}
              >
                <i className="icon-edit" />
                Write a Review
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  );
};

interface ReviewFormProps {
  onClose: () => void;
  onSubmitSuccess?: () => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, onSubmitSuccess }) => {
  const { theme } = useTheme();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleStarClick = (rating: number) => {
    setRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });
      
      // Upload photos first
      let uploadedPhotos: string[] = [];
      if (photos.length > 0) {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        uploadedPhotos = uploadData.urls;
      }

      // Submit review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: window.location.pathname.split('/').pop(),
          rating,
          review,
          photos: uploadedPhotos,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Add the new review and refresh the list
      if (onSubmitSuccess) {
        await onSubmitSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      className="review-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      style={{
        backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : 'var(--bg-primary)',
      }}
    >
      <div className="review-form__header">
        <h4>Write a Review</h4>
        <button 
          type="button" 
          className="close-btn" 
          onClick={onClose}
          aria-label="Close review form"
        >
          <i className="icon-close" />
        </button>
      </div>

      <div className="review-form__rating">
        <label>Overall Rating</label>
        <div 
          className="stars" 
          onMouseLeave={handleStarLeave}
          role="group"
          aria-label="Rate from 1 to 5 stars"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`star-btn ${i < (hoveredRating || rating) ? 'active' : ''}`}
              onClick={() => handleStarClick(i + 1)}
              onMouseEnter={() => handleStarHover(i + 1)}
              aria-label={`Rate ${i + 1} stars`}
              aria-pressed={rating === i + 1}
            >
              <StarIcon filled={i < (hoveredRating || rating)} />
            </button>
          ))}
        </div>
        <div className="rating-display">
          {Array.from({ length: 5 }).map((_, i) => (
            <i 
              key={i} 
              className={`icon-star ${i < (rating) ? 'filled' : ''}`}
              style={{ color: i < (hoveredRating || rating) ? 'var(--star-color)' : 'var(--text-secondary)' }}
            />
          ))}
          <span className="rating-text">
            {hoveredRating || rating 
              ? `${hoveredRating || rating} star${(hoveredRating || rating) !== 1 ? 's' : ''}`
              : ''}
          </span>
        </div>
      </div>

      <div className="review-form__content">
        <label htmlFor="review">Your Review</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="What did you like or dislike? What did you use this product for?"
          required
        />
      </div>

      <div className="review-form__photos">
        <label>Add Photos (optional)</label>
        <div className="photo-upload">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setPhotos(Array.from(e.target.files).slice(0, 5));
              }
            }}
          />
          {photos.length > 0 && (
            <div className="photo-preview">
              {photos.map((photo, index) => (
                <div key={index} className="photo-preview__item">
                  <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                  >
                    <i className="icon-close" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="review-form__actions" style={{ borderColor: 'var(--border-color)' }}>
        <button
          type="button"
          className="btn btn--text"
          onClick={onClose}
          disabled={isSubmitting}
          style={{
            color: 'var(--text-secondary)',
            '&:hover': {
              color: 'var(--text-primary)'
            }
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary btn--rounded"
          disabled={isSubmitting || !rating || !review.trim()}
          style={{
            backgroundColor: isSubmitting || !rating || !review.trim() 
              ? 'var(--primary-color-alpha)' 
              : 'var(--primary-color)',
            color: 'var(--primary-contrast)',
            transform: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {isSubmitting ? (
            <>
              <i className="icon-spinner animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <i className="icon-check" />
              Submit Review
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default Reviews;
