import Link from "next/link";
import { useState } from "react";
// Paystack public key (replace with your real key)
const PAYSTACK_PUBLIC_KEY = "YOUR_PAYSTACK_PUBLIC_KEY";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import CheckoutItems from "@/components/checkout/items";
import CheckoutStatus from "@/components/checkout-status";
import { useCart } from "@/contexts/CartContext";
import type { ProductStoreType } from "@/types";

import Layout from "@/layouts/Main";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { state: { cartItems }, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    address: '',
    firstName: '',
    city: '',
    lastName: '',
    postalCode: '',
    phone: '',
    country: 'Nigeria',
    state: '',
  });

  // Supported countries
  const countries = [
    { code: 'NG', name: 'Nigeria' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' }
  ];

  const priceTotal = () => {
    let totalPrice = 0;
    if (cartItems.length > 0) {
      totalPrice = cartItems.reduce((total, item) => total + item.price * item.count, 0);
    }
    return totalPrice;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Toast helper
  const showToast = (msg: string) => {
    if (typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast.error(msg);
    } else {
      alert(msg);
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }
    if (cartItems.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    setIsProcessing(true);
    // Dynamically load Paystack script if not present
    const launch = () => launchPaystack();
    if (!document.getElementById('paystack-js')) {
      const script = document.createElement('script');
      script.id = 'paystack-js';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = launch;
      document.body.appendChild(script);
    } else {
      launch();
    }
  };

  const launchPaystack = () => {
    // @ts-ignore
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: Math.round(priceTotal() * 100), // kobo
      currency: 'NGN',
      ref: `SMILE_${Date.now()}`,
      callback: async function(response: any) {
        // Optionally verify transaction on backend here
        // On success, create order, clear cart, redirect
        try {
          if (!session || !session.user) {
            showToast('Session expired. Please log in again.');
            setIsProcessing(false);
            router.push('/login');
            return;
          }
          const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: session.user.id,
              total: priceTotal(),
              shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
              items: cartItems.map((item: ProductStoreType) => ({
                productId: item.id,
                quantity: item.count,
                price: item.price
              })),
              paystackRef: response.reference
            }),
          });
          if (orderResponse.ok) {
            clearCart();
            router.push('/profile');
          } else {
            const error = await orderResponse.json();
            showToast(`Order error: ${error.message}`);
            setIsProcessing(false);
          }
        } catch (error) {
          showToast('Order error.');
          setIsProcessing(false);
        }
      },
      onClose: function() {
        alert('Payment was not completed.');
        setIsProcessing(false);
      }
    });
    if (handler) handler.openIframe();
  };

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Checkout</h3>
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
                  <p>Welcome back, <strong>{session.user.email}</strong></p>
                </div>
              )}

              <div className="block">
                <h3 className="block__title">Shipping Information</h3>
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="address"
                        placeholder="Street Address"
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
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="state"
                        placeholder="State/Province"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <select
                        className="form__input form__input--sm"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Order Summary</h3>
                <CheckoutItems />

                <div className="checkout-total">
                  <p>Total Amount</p>
                  <h3>${priceTotal().toFixed(2)}</h3>
                </div>

                <div className="payment-notes">
                  <p>
                    <i className="icon-shield"></i>
                    Your transaction will be securely processed by Paystack
                  </p>
                  <p>
                    <i className="icon-info"></i>
                    International orders may be subject to customs duties and taxes
                  </p>
                </div>
              </div>
            </div>

            <div className="checkout__col-4">
              <div className="block">
                <h3 className="block__title">Payment Method</h3>
                <div className="payment-info">
                  <p>Payment will be processed securely via Paystack</p>
                  <ul className="round-options round-options--three">
                    <li className="round-item">
                      <img src="/images/logos/visa.png" alt="Visa" />
                    </li>
                    <li className="round-item">
                      <img src="/images/logos/mastercard.png" alt="Mastercard" />
                    </li>
                    <li className="round-item">
                      <img src="/images/logos/verve.png" alt="Verve" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <Link href="/cart" className="cart__btn-back">
              <i className="icon-left"></i> Back to Cart
            </Link>
            <div className="cart-actions__items-wrapper">
              <Link href="/product" className="btn btn--rounded btn--border">
                Continue Shopping
              </Link>
              <button
                type="submit"
                className="btn btn--rounded btn--yellow"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <i className="icon-spinner animate-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment
                    <i className="icon-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
