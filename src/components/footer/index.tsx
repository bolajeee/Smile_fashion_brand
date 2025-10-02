import { useState } from 'react';
import Link from "next/link";
import { Logo } from '@/components/logo/Logo';

function FooterConnectForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/footer-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(data.error || 'Failed to connect.');
      }
    } catch (err) {
      setError('Failed to connect.');
    }
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="newsletter-success" style={{ textAlign: 'center', margin: '1rem 0' }}>
        <div style={{
          background: '#22c55e',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.5rem',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="none" />
            <path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ color: '#22c55e', fontWeight: 600 }}>Connected!</div>
        <div style={{ color: '#555', fontSize: '0.95em' }}>You're now subscribed to updates.</div>
      </div>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email"
        className="newsletter-input"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="newsletter-button" aria-label="Subscribe" disabled={isSubmitting || !email}>
        {isSubmitting ? (
          <span>Connecting...</span>
        ) : (
          <i className="icon-send" />
        )}
      </button>
      {error && <div className="newsletter-error" style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </form>
  );
}

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <div className="site-footer__logo">
              <Logo width={150} height={60} />
              <h3 className="site-footer__brand-name">
                <span className="highlight ">Smile</span> Fashion
              </h3>
            </div>
            <p className="site-footer__description">
              Crafting fashion for the bold, the beautiful, and the fearless.
              From streetwear to statement pieces, we design for the generation
              that dares to be different. ✨
            </p>
            <div className="site-footer__social">
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-column__title">Connect</h4>
            <div className="footer-column__content">
              <p className="footer-column__text">Stay in the loop</p>
              <div className="newsletter-signup">
                <FooterConnectForm />
                <p className="newsletter-note">
                  Get the latest drops, style tips, and exclusive deals.
                </p>
              </div>
              <div className="contact-info">
                <a href="mailto:dsmilesignature@gmail.com" className="contact-link">
                  dsmilesignature@gmail.com
                </a>
                <a href="tel:+17144965240" className="contact-link">
                  +17144965240
                </a>
              </div>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-column__title">Follow the Vibe</h4>
            <ul className="social-networks">
              <li>
                <a href="#" aria-label="Instagram" className="social-link social-link--instagram">
                  <i className="icon-instagram" />
                  <span>@SmileFashion</span>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Twitter" className="social-link social-link--twitter">
                  <i className="icon-twitter" />
                  <span>@SmileFashion</span>
                </a>
              </li>
              <li>
                <a href="#" aria-label="YouTube" className="social-link social-link--youtube">
                  <i className="icon-youtube-play" />
                  <span>Smile TV</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="footer-bottom__content">
            <div className="footer-bottom__left">
              <p className="copyright">
                © {new Date().getFullYear()} Smile Fashion. All rights reserved.
              </p>
              <p className="design-credit">
                Made with 💜 by{' '}
                <a
                  href="https://github.com/bolajeee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="design-credit__link"
                >
                  bolajeee
                </a>
              </p>
            </div>

            <div className="footer-bottom__right">
              <ul className="footer-legal">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service">Terms of Service</Link></li>
                <li><Link href="/cookie-policy">Cookie Policy</Link></li>
                <li><Link href="/accessibility">Accessibility</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
