import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0c1714] border-l border-[#005b04] z-50 flex flex-col transform transition-transform duration-400 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#005b04]">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Your Cart</h2>
            <p className="text-[#555] text-xs mt-0.5">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#666] hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" className="mb-4">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p className="text-[#555] text-sm mb-6">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-outline-gold text-xs"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-[#005403]">
                  {/* Image */}
                  <div className="w-20 h-20 bg-[#003e02] flex-shrink-0 overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full product-placeholder" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-white text-sm font-semibold leading-tight mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[#555] text-xs mb-3">{item.category}</p>
                    <div className="flex items-center justify-between">
                      {/* Qty */}
                      <div className="flex items-center gap-2 border border-[#007605]">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#666] hover:text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="text-white text-sm w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#666] hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[#C9A84C] font-semibold text-sm">
                        ${(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#444] hover:text-[#C9A84C] transition-colors self-start mt-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[#005b04]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#666] text-sm">Subtotal</span>
              <span className="text-white font-semibold">${total.toLocaleString()}</span>
            </div>
            <p className="text-[#444] text-xs mb-5">Taxes & shipping calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-gold w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-[#555] text-xs tracking-widest uppercase mt-3 hover:text-[#C9A84C] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
