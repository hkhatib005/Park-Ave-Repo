import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  if (items.length === 0) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-6 page-enter">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#007605" strokeWidth="1">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <h1 className="font-display text-3xl font-bold text-white">Your Cart is Empty</h1>
      <p className="text-[#555] text-sm">Discover our exquisite collections</p>
      <Link to="/shop" className="btn-gold mt-2">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen page-enter">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label">Review Your Order</p>
            <h1 className="font-display text-4xl font-bold text-white">Shopping Cart</h1>
          </div>
          <button onClick={clearCart} className="text-[#555] hover:text-[#C9A84C] text-xs tracking-widest uppercase transition-colors">
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-6 p-5 bg-[#003e02] border border-[#005b04] hover:border-[#C9A84C]/20 transition-colors">
                <Link to={`/product/${item.id}`} className="w-24 h-24 bg-[#003102] flex-shrink-0 overflow-hidden">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full product-placeholder" />
                  )}
                </Link>

                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <Link to={`/product/${item.id}`} className="font-display text-white font-semibold hover:text-[#C9A84C] transition-colors">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.id)} className="text-[#444] hover:text-[#C9A84C] transition-colors ml-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-[#555] text-xs mb-4">{item.category} {item.material && `· ${item.material}`}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#007605]">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white transition-colors text-sm">−</button>
                      <span className="text-white text-sm w-8 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white transition-colors text-sm">+</button>
                    </div>
                    <span className="text-[#C9A84C] font-display font-bold text-lg">
                      ${(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-[#003e02] border border-[#005b04] p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Subtotal</span>
                  <span className="text-white">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Shipping</span>
                  <span className="text-[#C9A84C] text-xs">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Tax (NYC)</span>
                  <span className="text-[#666]">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-[#005b04] pt-5 mb-6">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Estimated Total</span>
                  <span className="text-[#C9A84C] font-display text-xl font-bold">${total.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-gold w-full text-center block mb-3">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="text-center text-[#555] text-xs tracking-widest uppercase block hover:text-[#C9A84C] transition-colors">
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t border-[#005b04]">
                <div className="flex items-center justify-center gap-5 text-[#666]">
                  {[
                    { text: 'Secure', icon: <><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></> },
                    { text: 'Insured', icon: <><rect x="2" y="7" width="13" height="10"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.6"/><circle cx="18" cy="19" r="1.6"/></> },
                    { text: 'Certified', icon: <><polygon points="12,3 20,8 20,15 12,21 4,15 4,8"/></> },
                  ].map(t => (
                    <span key={t.text} className="flex items-center gap-1.5 text-[10px] tracking-wide uppercase">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{t.icon}</svg>
                      {t.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
