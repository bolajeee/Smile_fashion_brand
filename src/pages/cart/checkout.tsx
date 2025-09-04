import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import CheckoutItems from "@/components/checkout/items";
import CheckoutStatus from "@/components/checkout-status";
import { useCart } from "@/contexts/CartContext";
import type { ProductStoreType } from "@/types";

import Layout from "../../layouts/Main";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { state: { cartItems }, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    firstName: '',
    city: '',
    lastName: '',
    postalCode: '',
    phone: '',
    country: 'Nigeria'
  });

  const priceTotal = () => {
    let totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((item: ProductStoreType) => (totalPrice += item.price * item.count));
    }
    return totalPrice;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          total: priceTotal(),
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          items: cartItems.map((item: ProductStoreType) => ({
            productId: item.id,
            quantity: item.count,
            price: item.price
          }))
        }),
      });

      if (orderResponse.ok) {
        // Clear cart and redirect to success page
        clearCart();
        router.push('/checkout-success');
      } else {
        const error = await orderResponse.json();
        alert(`Error creating order: ${error.message}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Shipping and Payment</h3>
            <CheckoutStatus step="checkout" />
          </div>

          <div className="checkout-content">
            <div className="checkout__col-6">
              {!session ? (
                <div className="checkout__btns">
                  <Link href="/login" className="btn btn--rounded btn--yellow">Log in</Link>
                  <Link href="/register" className="btn btn--rounded btn--border">Sign up</Link>
                </div>
              ) : (
                <div className="checkout__user-info">
                  <p>Logged in as: {session.user.email}</p>
                </div>
              )}

              <div className="block">
                <h3 className="block__title">Shipping information</h3>
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="postalCode"
                        placeholder="Postal code / ZIP"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        >
                          <option value="Argentina">Argentina</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="checkout__col-4">
              <div className="block">
                <h3 className="block__title">Payment method</h3>
                <ul className="round-options round-options--three">
                  <li className="round-item">
                    <img src="/images/logos/paypal.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/visa.png" alt="Visa" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/mastercard.png" alt="Mastercard" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/maestro.png" alt="Maestro" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/discover.png" alt="Discover" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/ideal-logo.svg" alt="Ideal" />
                  </li>
                </ul>
              </div>

              <div className="block">
                <h3 className="block__title">Delivery method</h3>
                <ul className="round-options round-options--two">
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/inpost.svg" alt="InPost" />
                    <p>$20.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dpd.svg" alt="DPD" />
                    <p>$12.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dhl.svg" alt="DHL" />
                    <p>$15.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/maestro.png" alt="Maestro" />
                    <p>$10.00</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Your cart</h3>
                <CheckoutItems />

                <div className="checkout-total">
                  <p>Total cost</p>
                  <h3>${priceTotal().toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <Link href="/cart" className="cart__btn-back">
              <i className="icon-left" /> Back
            </Link>
            <div className="cart-actions__items-wrapper">
              <Link href="/products" className="btn btn--rounded btn--border">
                Continue shopping
              </Link>
              <button
                type="submit"
                className="btn btn--rounded btn--yellow"
                disabled={isProcessing}
                onClick={handleSubmit}
              >
                {isProcessing ? 'Processing...' : 'Proceed to payment'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
