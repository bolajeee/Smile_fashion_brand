import { formatCurrency } from '@/utils/format';

type ProductPriceProps = {
  currentPrice?: number;
  originalPrice: number;
  discount?: number | string;
};

export const ProductPrice = ({ currentPrice, originalPrice, discount }: ProductPriceProps) => {
  const discountValue = typeof discount === 'string' ? parseFloat(discount) : (discount || 0);
  const hasDiscount = discountValue > 0;
  const displayPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const displayCurrentPrice = currentPrice || displayPrice;

  return (
    <div className="product-price">
      <span className="product-price__current">
        {formatCurrency(displayCurrentPrice)}
      </span>
      {hasDiscount && (
        <>
          <span className="product-price__original">
            {formatCurrency(displayPrice)}
          </span>
          <span className="product-price__discount">
            Save {discountValue}%
          </span>
        </>
      )}
    </div>
  );
};
