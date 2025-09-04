import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import CheckoutStatus from "../checkout-status";
import Item from "./item";

const ShoppingCart = () => {
  const { cartItems } = useCart();

  const priceTotal = () => {
    let totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count));
    }

    return totalPrice;
  };

  return (
    <section className="cart">
      <div className="container">
        <div className="cart__intro">
          <h3 className="cart__title">Shopping Cart</h3>
          <CheckoutStatus step="cart" />
        </div>

        <div className="cart-list">
          {cartItems.length > 0 && (
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="cart-table__header">Product</th>
                  <th className="cart-table__header">Color</th>
                  <th className="cart-table__header">Size</th>
                  <th className="cart-table__header">Amount</th>
                  <th className="cart-table__header">Price</th>
                  <th className="cart-table__header"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <Item
                    key={item.id}
                    id={item.id}
                    thumb={item.thumb}
                    name={item.name}
                    color={item.color}
                    price={item.price}
                    size={item.size}
                    count={item.count}
                  />
                ))}
              </tbody>
            </table>
          )}

          {cartItems.length === 0 && (
            <div className="cart-empty">
              <p className="cart-empty__message">Your cart is empty</p>
              <Link href="/products" className="btn btn--primary">
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-actions">
            <Link href="/products" className="cart__btn-back">
              <i className="icon-left" /> Continue Shopping
            </Link>

            <div className="cart-promo">
              <input
                type="text"
                placeholder="Promo Code"
                className="cart__promo-code"
              />
              <button type="button" className="btn btn--secondary btn--small">
                Apply
              </button>
            </div>

            <div className="cart-actions__items-wrapper">
              <p className="cart-actions__total">
                Total cost <strong>${priceTotal().toFixed(2)}</strong>
              </p>
              <Link
                href="/cart/checkout"
                className="btn btn--rounded btn--yellow"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShoppingCart;
