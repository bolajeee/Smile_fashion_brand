import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from 'react';
import useOnClickOutside from "use-onclickoutside";
import Image from "next/image";

import { useCart } from '@/contexts/CartContext'; // Assuming this context exists
import { ThemeToggle } from '../theme/ThemeToggle';

const Header = () => {
  const { data: session } = useSession();
  const { state: { cartItems } } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useOnClickOutside(navRef, (event) => {
    if (menuToggleRef.current && !menuToggleRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container">
        <div className="site-header__wrapper">
          <Link href="/" className="site-header__logo">
            Smile 
          </Link>
          <nav
            className={`site-header__nav ${
              menuOpen ? 'site-header__nav--open' : ''
            }`}
            ref={navRef}
          >
            {/* Neon Glass Effects */}
            <span className="shine shine-top"></span>
            <span className="shine shine-bottom"></span>
            <span className="glow glow-top"></span>
            <span className="glow glow-bottom"></span>
            <span className="glow glow-bright glow-top"></span>
            <span className="glow glow-bright glow-bottom"></span>

            <div className="site-header__nav-inner">
              {session && (
                <Link href="/account/profile" className="site-header__nav-profile">
                  <div className="site-header__nav-profile-avatar">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={80}
                        height={80}
                      />
                    ) : (
                      <i className="icon-avatar"></i>
                    )}
                  </div>
                  <strong className="site-header__nav-profile-name">{session.user.name}</strong>
                  <span className="site-header__nav-profile-email">
                    {session.user.email}
                  </span>
                </Link>
              )}

              {session && <hr className="site-header__nav-separator" />}

              <div className="site-header__nav-links">
                <Link href="/products" className="site-header__nav-link">
                  Shop
                </Link>
                <Link href="/about" className="site-header__nav-link">
                  About
                </Link>
                <Link href="/contact" className="site-header__nav-link">
                  Contact Us
                </Link>
              </div>

              {/* Mobile only links */}
              <div className="site-header__nav-mobile-actions">
                {session ? (
                  <button className="btn btn--primary" onClick={() => signOut()}>
                    Logout
                  </button>
                ) : (
                  <Link href="/login" className="btn btn--primary">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>
          <div className="site-header__actions">
            <ThemeToggle />
            <Link href="/cart" className="site-header__action-link site-header__cart">
              <i className="icon-cart"></i>
              <span className="site-header__cart-count">{cartItems.length}</span>
            </Link>
            {session ? (
              <Link href="/account/profile" className="site-header__action-link site-header__profile">
                <i className="icon-avatar"></i>
                <div className="site-header__profile-info">
                  <span>Hello,</span>
                  <strong>{session.user.name?.split(' ')[0]}</strong>
                </div>
              </Link>
            ) : (
              <Link href="/login" className="site-header__action-link">
                Login
              </Link>
            )}
            <button ref={menuToggleRef} onClick={toggleMenu} className="site-header__menu-toggle">
              <i className={`icon-${menuOpen ? 'cancel' : 'filters'}`}></i>
            </button>
            {session && (
              <button onClick={() => signOut()} className="site-header__action-link site-header__logout-btn">Logout</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;