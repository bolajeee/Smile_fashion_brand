import Image from "next/image";
import Link from "next/link";
import { Logo } from '@/components/logo/Logo';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <div className="site-footer__logo">
              <Logo width={70} height={24} />
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
            </div>
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
                  <button type="submit" className="newsletter-button" aria-label="Subscribe">
                    <i className="icon-send" />
                  </button>
                </form>
                <p className="newsletter-note">
                  Get the latest drops, style tips, and exclusive deals.
                </p>
              </div>
              <div className="contact-info">
                <a href="mailto:Ibrahimomoblaji1999@gmail.com" className="contact-link">
                  Ibrahimomoblaji1999@gmail.com
                </a>
                <a href="tel:+2348149189399" className="contact-link">
                  +234 814 918 9399
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
