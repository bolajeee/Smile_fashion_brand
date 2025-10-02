import { useState } from "react";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);


  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    setError(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        setDiscountCode(data.code);
        setEmail("");
      } else {
        setError(data.error || 'Failed to subscribe.');
      }
    } catch (err) {
      setError('Failed to subscribe.');
    }
    setIsSubscribing(false);
  };

  return (
    <section className="subscribe">
      <div className="container">
        <div className="subscribe__content">
          <div className="subscribe__image">
            <img src="/images/subscribe.jpg" alt="Fashion Newsletter" />
            <div className="subscribe__overlay"></div>
          </div>

          <div className="subscribe__text">
            <div className="subscribe__header">
              <h2 className="subscribe__title">
                Join the <span className="highlight">Style Squad</span> 💌
              </h2>
              <p className="subscribe__description">
                Get exclusive access to new drops, styling tips, and member-only discounts.
                Plus, score 15% off your first order when you sign up!
              </p>
            </div>


            {!isSubscribed ? (
              <form className="subscribe__form" onSubmit={handleSubmit}>
                <div className="subscribe__input-wrapper">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="subscribe__input"
                    required
                  />
                  <button
                    type="submit"
                    className="subscribe__button"
                    disabled={isSubscribing || !email}
                  >
                    {isSubscribing ? (
                      <span className="subscribe__loading">
                        <i className="icon-loading" />
                        Joining...
                      </span>
                    ) : (
                      <span>
                        Join Now
                        <i className="icon-arrow-right" />
                      </span>
                    )}
                  </button>
                </div>
                {error && <p className="subscribe__error">{error}</p>}
                <p className="subscribe__terms">
                  By joining, you agree to receive emails from us.
                  <a href="/privacy" className="subscribe__link">Privacy Policy</a>
                </p>
              </form>
            ) : (
              <div className="subscribe__success">
                <div className="subscribe__success-icon" style={{
                  background: '#22c55e',
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="none" />
                    <path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="subscribe__success-title">You're in! 🎉</h3>
                <p className="subscribe__success-text">
                  Welcome to the Style Squad! Check your email for your 15% off code.<br />
                  {discountCode && (
                    <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.2em' }}>Your code: {discountCode}</span>
                  )}
                </p>
              </div>
            )}

            <div className="subscribe__features">
              <div className="subscribe__feature">
                <i className="icon-star" />
                <span>Early access to sales</span>
              </div>
              <div className="subscribe__feature">
                <i className="icon-gift" />
                <span>Exclusive member perks</span>
              </div>
              <div className="subscribe__feature">
                <i className="icon-trends" />
                <span>Weekly style inspo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
