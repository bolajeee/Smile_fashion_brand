type CheckoutStatusProps = {
  step: string;
};

const CheckoutStatus = ({ step }: CheckoutStatusProps) => {
  return (
    <div className="checkout-status">
      <div className="checkout-steps">
        <div className={`checkout-step ${step === "cart" ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Shopping Cart</span>
        </div>
        <div className="checkout-divider"></div>
        <div className={`checkout-step ${step === "checkout" ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStatus;
