import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <div className="site-footer__logo">
              <Image src="/images/smile_logo.jpg" alt="Smile" width={60} height={60} />
              <h3 className="site-footer__brand-name">
                <span className="highlight">Smile</span> Fashion
              </h3>
            </div>
            <p className="site-footer__description">
              Crafting fashion for the bold, the beautiful, and the fearless.
              From streetwear to statement pieces, we design for the generation
              that dares to be different. ✨
            </p>
            <div className="site-footer__social">
              <h4>Follow the Vibe</h4>
              <ul className="social-networks">
                <li>
                  <a href="#" aria-label="Instagram" className="social-link social-link--instagram">
                    <i className="icon-instagram" />
                    <span>@SmileFashion</span>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="TikTok" className="social-link social-link--tiktok">
                    <i className="icon-tiktok" />
                    <span>@SmileVibes</span>
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

          <div className="site-footer__links">
            <div className="footer-column">
              <h4 className="footer-column__title">Shop</h4>
              <ul className="footer-column__links">
                <li><Link href="/products">All Products</Link></li>
                <li><Link href="/products?category=new">New Arrivals</Link></li>
                <li><Link href="/products?category=trending">Trending Now</Link></li>
                <li><Link href="/products?category=sale">Sale Items</Link></li>
                <li><Link href="/size-guide">Size Guide</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column__title">Customer Care</h4>
              <ul className="footer-column__links">
                <li><Link href="/shipping">Shipping & Delivery</Link></li>
                <li><Link href="/returns">Returns & Exchanges</Link></li>
                <li><Link href="/contact">Contact Support</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/track-order">Track Your Order</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column__title">About</h4>
              <ul className="footer-column__links">
                <li><Link href="/about">Our Story</Link></li>
                <li><Link href="/sustainability">Sustainability</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/press">Press</Link></li>
                <li><Link href="/blog">Style Blog</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-column__title">Connect</h4>
              <div className="footer-column__content">
                <p className="footer-column__text">Stay in the loop</p>
                <div className="newsletter-signup">
                  <form className="newsletter-form">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="newsletter-input"
                    />
                    <button type="submit" className="newsletter-button">
                      <i className="icon-arrow-right" />
                    </button>
                  </form>
                  <p className="newsletter-note">
                    Get the latest drops, style tips, and exclusive deals.
                    Unsubscribe anytime.
                  </p>
                </div>
                <div className="contact-info">
                  <a href="mailto:hello@smilefashion.com" className="contact-link">
                    <i className="icon-mail" />
                    hello@smilefashion.com
                  </a>
                  <a href="tel:+1234567890" className="contact-link">
                    <i className="icon-phone" />
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer__payment">
          <div className="payment-methods">
            <h4>We Accept</h4>
            <ul className="payment-list">
              <li>
                <img src="/images/logos/visa.png" alt="Visa" className="payment-logo" />
              </li>
              <li>
                <img src="/images/logos/mastercard.png" alt="Mastercard" className="payment-logo" />
              </li>
              <li>
                <img src="/images/logos/paypal.png" alt="PayPal" className="payment-logo" />
              </li>
              <li>
                <img src="/images/logos/maestro.png" alt="Maestro" className="payment-logo" />
              </li>
              <li>
                <img src="/images/logos/discover.png" alt="Discover" className="payment-logo" />
              </li>
              <li>
                <img src="/images/logos/ideal-logo.svg" alt="iDEAL" className="payment-logo" />
              </li>
            </ul>
          </div>

          <div className="shipping-methods">
            <h4>Fast & Secure Shipping</h4>
            <ul className="shipping-list">
              <li>
                <img src="/images/logos/dhl.svg" alt="DHL" className="shipping-logo" />
              </li>
              <li>
                <img src="/images/logos/dpd.svg" alt="DPD" className="shipping-logo" />
              </li>
              <li>
                <img src="/images/logos/inpost.svg" alt="InPost" className="shipping-logo" />
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
                Made with 💜 for the fashion-forward generation
              </p>
            </div>

            <div className="footer-bottom__right">
              <ul className="footer-legal">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
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
