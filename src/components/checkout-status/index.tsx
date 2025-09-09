type CheckoutStatusProps = {
  step: 'cart' | 'checkout';
};

const CheckoutStatus = ({ step }: CheckoutStatusProps) => {
  return (
    <div className="checkout-status">
      <div className={`checkout-status__item ${step === 'cart' ? 'active' : ''} ${step === 'checkout' ? 'delivered' : ''}`}>
        <div className="checkout-status__item-number">1</div>
        <div className="checkout-status__item-text">Shopping Cart</div>
      </div>
      <div className={`checkout-status__item ${step === 'checkout' ? 'active' : ''}`}>
        <div className="checkout-status__item-number">2</div>
        <div className="checkout-status__item-text">Checkout</div>
      </div>
    </div>
  );
};

export default CheckoutStatus;
