import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { createCheckoutSession } from '../utils/api';

const INIT = {
  first_name: '', last_name: '', email: '', phone: '',
  address: '', city: '', state: '', zip: '', country: 'US', notes: ''
};

export default function Checkout() {
  const { items, total } = useCart();
  const { customer } = useCustomerAuth();
  const [form, setForm] = useState(() => {
    if (!customer) return INIT;
    const [first, ...rest] = (customer.name || '').split(' ');
    return { ...INIT, first_name: first || '', last_name: rest.join(' '), email: customer.email };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await createCheckoutSession({
        customer_name: `${form.first_name} ${form.last_name}`,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_address: {
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        items: items.map(i => ({ id: i.id, qty: i.qty })),
        notes: form.notes,
      });
      // Cart is cleared on the success page once Stripe redirects back —
      // not here, so the cart survives if the user cancels payment.
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4 page-enter">
      <p className="font-display text-2xl text-white">Your cart is empty</p>
      <Link to="/shop" className="btn-gold">Shop Now</Link>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen page-enter">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="section-label">Secure Checkout</p>
          <h1 className="font-display text-4xl font-bold text-white">Complete Your Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            {/* Contact */}
            <div>
              <h2 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-5">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">First Name *</label>
                  <input value={form.first_name} onChange={e => set('first_name', e.target.value)} required className="input-luxury" placeholder="John" />
                </div>
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">Last Name *</label>
                  <input value={form.last_name} onChange={e => set('last_name', e.target.value)} required className="input-luxury" placeholder="Smith" />
                </div>
                <div className="col-span-2">
                  <label className="text-[#555] text-xs block mb-1.5">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="input-luxury" placeholder="john@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="text-[#555] text-xs block mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-luxury" placeholder="+1 (212) 555-0100" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h2 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">Street Address *</label>
                  <input value={form.address} onChange={e => set('address', e.target.value)} required className="input-luxury" placeholder="5th Avenue" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#555] text-xs block mb-1.5">City *</label>
                    <input value={form.city} onChange={e => set('city', e.target.value)} required className="input-luxury" placeholder="New York" />
                  </div>
                  <div>
                    <label className="text-[#555] text-xs block mb-1.5">State *</label>
                    <input value={form.state} onChange={e => set('state', e.target.value)} required className="input-luxury" placeholder="NY" />
                  </div>
                  <div>
                    <label className="text-[#555] text-xs block mb-1.5">ZIP Code *</label>
                    <input value={form.zip} onChange={e => set('zip', e.target.value)} required className="input-luxury" placeholder="10022" />
                  </div>
                  <div>
                    <label className="text-[#555] text-xs block mb-1.5">Country</label>
                    <input value={form.country} onChange={e => set('country', e.target.value)} className="input-luxury" placeholder="US" />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-5">Order Notes</h2>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                className="input-luxury resize-none"
                rows={3}
                placeholder="Special instructions, gift messages, custom requests..."
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-sm disabled:opacity-50">
              {loading ? 'Redirecting to payment...' : `Continue to Payment · $${total.toLocaleString()}`}
            </button>

            <p className="text-[#444] text-xs text-center">
              By placing your order you agree to our{' '}
              <span className="text-[#C9A84C]">Terms of Service</span> and{' '}
              <span className="text-[#C9A84C]">Privacy Policy</span>.
              <br />You'll be securely redirected to Stripe to complete payment.
            </p>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#003e02] border border-[#005b04] p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-white mb-5">Your Order</h2>
              <div className="space-y-4 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 bg-[#003102] flex-shrink-0">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full product-placeholder" />}
                      <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium leading-tight">{item.name}</p>
                      <p className="text-[#555] text-xs">{item.category}</p>
                    </div>
                    <span className="text-[#C9A84C] text-sm font-semibold">${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#005b04] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Subtotal</span>
                  <span className="text-white">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Shipping</span>
                  <span className="text-[#C9A84C] text-xs">Complimentary</span>
                </div>
              </div>
              <div className="border-t border-[#005b04] mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-[#C9A84C] font-display text-xl font-bold">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
