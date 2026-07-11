import { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Only clear if we actually came back from a Stripe redirect (has a session_id),
    // so a stray/guessed URL to this page doesn't wipe someone's cart.
    if (sessionId) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-6 page-enter">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 border border-[#C9A84C] flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="section-label mb-2">Order Confirmed</p>
        <h1 className="font-display text-4xl font-bold text-white mb-3">Thank You</h1>
        <div className="divider-gold" />
        <p className="text-[#888] text-sm mb-2">Your order has been received.</p>
        <p className="text-[#C9A84C] font-mono text-sm mb-8">{orderNumber}</p>
        <p className="text-[#666] text-xs mb-8 leading-relaxed">
          Your payment has been received. A confirmation has been sent to your email, and our team
          will be in touch shortly regarding delivery. We look forward to serving you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn-gold">Continue Shopping</Link>
          <Link to="/contact" className="btn-outline-gold">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
