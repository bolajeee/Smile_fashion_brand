import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRef, useState } from 'react';
import useOnClickOutside from "use-onclickoutside";

import { useCart } from '@/contexts/CartContext'; // Assuming this context exists
import { ThemeToggle } from '../theme/ThemeToggle';
// import Image from "next/image";

type HeaderType = {
  isErrorPage?: boolean;
};

const Header = ({}: HeaderType) => {
  const { data: session } = useSession();
  const { state: { cartItems } } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef(null); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useOnClickOutside(navRef, () => setMenuOpen(false));

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header__wrapper">
          <Link href="/" className="site-header__logo">
            Smile 
          </Link>
          <nav className={`site-header__nav ${menuOpen ? 'site-header__nav--open' : ''}`} ref={navRef}> 
            <Link href="/" className="site-header__nav-link">
              Shop
            </Link>
            <Link href="/about" className="site-header__nav-link">
              About
            </Link>
            {/* Mobile only links */}
            <div className="site-header__nav-mobile-actions">
              {session ? (
                <button className="btn btn--primary" onClick={() => signOut()}>Logout</button>
              ) : (
                <Link href="/login" className="btn btn--primary">Login</Link>
              )}
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
            <button onClick={toggleMenu} className="site-header__menu-toggle">
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