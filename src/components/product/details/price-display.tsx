import React from 'react';

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ currentPrice, originalPrice, discount }) => {
  return (
    <div className="price-display">
      <span className="price-display__current">
        ${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : '0.00'}
      </span>
      {typeof originalPrice === 'number' && originalPrice > (currentPrice ?? 0) && (
        <span className="price-display__original">
          ${originalPrice.toFixed(2)}
        </span>
      )}
      {typeof discount === 'number' && discount > 0 && (
        <span className="price-display__discount">-{discount}%</span>
      )}
    </div>
  );
};

export default PriceDisplay;
