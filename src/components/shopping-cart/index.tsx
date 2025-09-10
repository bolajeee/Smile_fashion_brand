import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import type { ProductStoreType } from "@/types";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CheckoutStatus = dynamic(() => import("../checkout-status"), {
  ssr: false
});
import Item from "./item";

const ShoppingCart = () => {
  const { state: { cartItems, totalPrice } } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking cart state
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <section className="cart">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="cart-loading">
            <p>Loading cart...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="cart__intro">
          <h3 className="cart__title">Shopping Cart</h3>
          <CheckoutStatus step="cart" />
        </div>

        <div className="cart-list">
          {cartItems.length > 0 && (
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="cart-table__header" style={{ width: '40%' }}>Product</th>
                  <th className="cart-table__header" style={{ width: '15%' }}>Color</th>
                  <th className="cart-table__header" style={{ width: '15%' }}>Size</th>
                  <th className="cart-table__header" style={{ width: '15%' }}>Quantity</th>
                  <th className="cart-table__header" style={{ width: '10%' }}>Price</th>
                  <th className="cart-table__header" style={{ width: '5%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: ProductStoreType) => (
                  <Item
                    key={item.id}
                    id={item.id}
                    thumb={item?.images?.[0]}
                    images={item.images}
                    name={item.name}
                    colorId={item.colorId}
                    price={item.price}
                    size={item.size}
                    count={item.count}
                    discount={item.discount}
                    currentPrice={item.currentPrice}
                  />
                ))}
              </tbody>
            </table>
          )}

          {cartItems.length === 0 && (
            <div className="cart-empty">
              <p className="cart-empty__message">Your cart is currently empty</p>
              <Link href="/product" className="btn btn--primary btn--large">
                <i className="icon-shopping-bag" style={{ marginRight: '0.5rem' }} />
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-actions">
            <Link href="/product" className="cart__btn-back">
              <i className="icon-left" /> Continue Shopping
            </Link>

            <div className="cart-promo">
              <input
                type="text"
                placeholder="Enter promo code"
                className="cart__promo-code"
              />
              <button type="button" className="btn btn--secondary">
                Apply Code
              </button>
            </div>

            <div className="cart-actions__items-wrapper">
              <p className="cart-actions__total">
                Total: <strong>${totalPrice.toFixed(2)}</strong>
              </p>
              <Link
                href="/cart/checkout"
                className="btn btn--primary btn--large"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  fontWeight: '700',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  fontSize: '1.125rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                <i className="icon-credit-card" />
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShoppingCart;
