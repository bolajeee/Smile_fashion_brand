// TypeScript declaration for PaystackPop
declare global {
  interface Window {
    PaystackPop?: any;
  }
}
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
// Paystack public key (replace with your real key)
const PAYSTACK_PUBLIC_KEY = "YOUR_PAYSTACK_PUBLIC_KEY";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import CheckoutItems from "@/components/checkout/items";
import CheckoutStatus from "@/components/checkout-status";
import { useCart } from "@/contexts/CartContext";

import Layout from "@/layouts/Main";

const CheckoutPage = () => {
  // Helper to check if all shipping fields are filled
  const isShippingComplete = () => {
    return (
      !!formData.firstName &&
      !!formData.lastName &&
      !!formData.email &&
      !!formData.phone &&
      !!formData.address &&
      !!formData.city &&
      !!formData.state &&
      !!formData.country &&
      !!formData.postalCode
    );
  };
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
  // Refs for latest values
  const sessionRef = useRef(session);
  const formDataRef = useRef(formData);
  const cartItemsRef = useRef(cartItems);
  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { formDataRef.current = formData; }, [formData]);
  useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

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

  // Paystack launch function

  
  interface PaystackResponse {
    reference: string;
    [key: string]: any;
  }

  interface SessionUser {
    id: string;
    email: string;
    [key: string]: any;
  }

  interface Session {
    user?: SessionUser;
    [key: string]: any;
  }

  interface FormData {
    email: string;
    address: string;
    firstName: string;
    city: string;
    lastName: string;
    postalCode: string;
    phone: string;
    country: string;
    state: string;
  }
  
  interface CartItem {
    id: string;
    price: number;
    count: number;
    [key: string]: any;
  }

  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  function paystackCallback(response: PaystackResponse): void {
    console.log('[DEBUG] Paystack payment callback', response);
    const session: Session | null = sessionRef.current;
    const formData: FormData = formDataRef.current;
    const cartItems: CartItem[] = cartItemsRef.current;
    if (!session || !session.user) {
      showToast('Session expired. Please log in again.');
      setIsProcessing(false);
      router.push('/login');
      return;
    }
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        total: priceTotal(),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
        items: cartItems.map((item: CartItem) => ({
          productId: item.id,
          quantity: item.count,
          price: item.price
        })),
        paystackRef: response.reference
      }),
    })
      .then(async (orderResponse: Response) => {
        if (orderResponse.ok) {
          console.log('[DEBUG] Order created successfully');
          clearCart();
          router.push('/account/profile');
        } else {
          const error: { message?: string } = await orderResponse.json();
          console.log('[DEBUG] Order error', error);
          showToast(`Order error: ${error.message}`);
          setIsProcessing(false);
        }
      })
      .catch((error: unknown) => {
        console.log('[DEBUG] Order error', error);
        showToast('Order error.');
        setIsProcessing(false);
      });
  }

  const launchPaystack = () => {
    if (!window.PaystackPop) {
      console.log('[DEBUG] window.PaystackPop is not available');
      showToast('Paystack script not loaded. Please try again.');
      setIsProcessing(false);
      return;
    }
    console.log('[DEBUG] Setting up PaystackPop');
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formDataRef.current.email,
      amount: Math.round(priceTotal() * 100), // kobo
      currency: 'NGN',
      ref: `SMILE_${Date.now()}`,
      callback: paystackCallback,
      onClose: function() {
        console.log('[DEBUG] Paystack payment closed by user');
        alert('Payment was not completed.');
        setIsProcessing(false);
      }
    });
    if (handler) {
      console.log('[DEBUG] Opening Paystack iframe');
      handler.openIframe();
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('[DEBUG] handleSubmit called');
    if (!session?.user?.id) {
      console.log('[DEBUG] No user session, redirecting to login');
      router.push('/login');
      return;
    }
    if (cartItems.length === 0) {
      console.log('[DEBUG] Cart is empty');
      showToast('Your cart is empty');
      return;
    }
    setIsProcessing(true);
    // Dynamically load Paystack script if not present
    const launch = () => {
      console.log('[DEBUG] Launching Paystack');
      launchPaystack();
    };
    if (!document.getElementById('paystack-js')) {
      console.log('[DEBUG] Loading Paystack script');
      const script = document.createElement('script');
      script.id = 'paystack-js';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = launch;
      document.body.appendChild(script);
    } else {
      console.log('[DEBUG] Paystack script already loaded');
      launch();
    }
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
                  <div className="cart-actions cart-actions--checkout" style={{marginTop: 32}}>
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
                        disabled={isProcessing || !session || !isShippingComplete()}
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
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* cart-actions block removed, now only inside the form */}
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
