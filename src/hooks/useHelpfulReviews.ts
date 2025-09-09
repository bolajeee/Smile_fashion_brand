import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useHelpfulReviews() {
  const { data: session } = useSession();
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);

  // Load helpful reviews from localStorage on mount
  useEffect(() => {
    if (session?.user) {
      const savedHelpful = localStorage.getItem(`smile-helpful-reviews-${session.user.id}`);
      if (savedHelpful) {
        try {
          setHelpfulReviews(JSON.parse(savedHelpful));
        } catch (error) {
          console.error('Error parsing helpful reviews:', error);
        }
      }
    }
  }, [session?.user]);

  // Save helpful reviews to localStorage whenever they change
  useEffect(() => {
    if (session?.user) {
      localStorage.setItem(`smile-helpful-reviews-${session.user.id}`, JSON.stringify(helpfulReviews));
    }
  }, [helpfulReviews, session?.user]);

  const toggleHelpful = async (reviewId: string) => {
    try {
      const isHelpful = helpfulReviews.includes(reviewId);
      
      // Update the server
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          helpful: !isHelpful
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update helpful status');
      }

      // Update local state
      setHelpfulReviews(prev => 
        isHelpful
          ? prev.filter(id => id !== reviewId)
          : [...prev, reviewId]
      );

      return true;
    } catch (error) {
      console.error('Error updating helpful status:', error);
      return false;
    }
  };

  const isHelpful = (reviewId: string) => helpfulReviews.includes(reviewId);

  return {
    helpfulReviews,
    toggleHelpful,
    isHelpful
  };
}
