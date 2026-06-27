import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, setIsOpen } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1e1e1e]';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#C9A84C]">
              <polygon points="12,2 15.5,8.5 23,9.5 17.5,14.5 19,22 12,18.5 5,22 6.5,14.5 1,9.5 8.5,8.5" fill="currentColor" opacity="0.9"/>
            </svg>
            <div>
              <span className="font-display text-lg font-bold text-white tracking-wide group-hover:text-[#C9A84C] transition-colors duration-300">
                Park Ave
              </span>
              <span className="font-display text-lg font-bold text-[#C9A84C] tracking-wide ml-1">
                Jewelry
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Shop', to: '/shop' },
              { label: 'Rings', to: '/shop?category=Rings' },
              { label: 'Watches', to: '/shop?category=Watches' },
              { label: 'Custom', to: '/shop?category=Custom Jewellery' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-[#aaa] hover:text-white text-xs tracking-[2px] uppercase font-medium transition-colors duration-200 relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[#aaa] hover:text-[#C9A84C] transition-colors duration-200"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="relative text-[#aaa] hover:text-[#C9A84C] transition-colors duration-200"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <Link
              to="/admin"
              className="hidden lg:block text-[#555] hover:text-[#C9A84C] transition-colors duration-200"
              aria-label="Admin"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#aaa] hover:text-white transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-[#0a0a0a] border-t border-[#1e1e1e] px-6 py-6">
            <ul className="space-y-4">
              {[
                { label: 'Shop All', to: '/shop' },
                { label: 'Rings', to: '/shop?category=Rings' },
                { label: 'Necklaces', to: '/shop?category=Necklaces' },
                { label: 'Bracelets', to: '/shop?category=Bracelets' },
                { label: 'Earrings', to: '/shop?category=Earrings' },
                { label: 'Watches', to: '/shop?category=Watches' },
                { label: 'Custom', to: '/shop?category=Custom Jewellery' },
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[#aaa] hover:text-[#C9A84C] text-sm tracking-wider uppercase block transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <CartDrawer />
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
