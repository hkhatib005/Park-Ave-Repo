import { Link } from 'react-router-dom';
import { useState } from 'react';
import { subscribeNewsletter } from '../utils/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async e => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // stay silent on the form UI, but don't falsely claim success
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#071009] border-t border-[#1b2e25]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A84C">
                <path d="M6 3L2 9l10 13L22 9l-4-6H6z"/>
                <path d="M8 7h8M8 7l4 15m4-15-4 15M2 9h20" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1" strokeLinejoin="round"/>
              </svg>
              <span className="font-display text-lg font-bold text-white">Park Ave <span className="text-[#C9A84C]">Jewelers</span></span>
            </div>
            <p className="text-[#666] text-sm leading-relaxed mb-6">
              Fine jewellery and luxury timepieces from the heart of Manhattan's historic Diamond District.
            </p>
            <div className="space-y-2 text-sm text-[#666]">
              <p className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" className="mt-0.5 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                25 W 47th St, Booth #8, New York, NY 10036
              </p>
              <p className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.59 2.72h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                (917) 599-3862
              </p>
              <p className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Parkavejewelers1@gmail.com
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-5">Collections</h4>
            <ul className="space-y-3">
              {['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants', 'Watches', 'Custom Jewellery'].map(cat => (
                <li key={cat}>
                  <Link to={`/shop?category=${cat}`} className="text-[#666] hover:text-[#C9A84C] text-sm transition-colors duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-5">Information</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Custom Orders', to: '/contact' },
                { label: 'Care & Maintenance', to: '/about' },
                { label: 'Shipping Policy', to: '/about#policies' },
                { label: 'Return Policy', to: '/about#policies' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[#666] hover:text-[#C9A84C] text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Hours */}
          <div>
            <h4 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-5">Newsletter</h4>
            <p className="text-[#666] text-sm mb-4">Be the first to know about new arrivals and exclusive events.</p>
            {subscribed ? (
              <p className="text-[#C9A84C] text-sm">Thank you for subscribing.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="input-luxury text-sm"
                  required
                />
                <button type="submit" disabled={loading} className="btn-gold w-full text-center disabled:opacity-50">
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}

            <div className="mt-8">
              <h4 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-3">Hours</h4>
              <div className="space-y-1 text-sm text-[#666]">
                <p>Mon – Fri: 10am – 5:30pm</p>
                <p>Saturday: Closed</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1b2e25] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#444] text-xs">
            © {new Date().getFullYear()} Park Ave Jewelers. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Social icons */}
            {[
              { label: 'Instagram', href: '#', icon: <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>, extra: <><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/></> },
              { label: 'Facebook', href: '#', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
            ].map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} className="text-[#444] hover:text-[#C9A84C] transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {s.icon}{s.extra}
                </svg>
              </a>
            ))}
          </div>
          <p className="text-[#333] text-xs">
            Handcrafted in New York City
          </p>
        </div>
      </div>
    </footer>
  );
}
