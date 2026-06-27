import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../utils/api';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'text-[#d29922] bg-[#d29922]/10 border-[#d29922]/20',
  confirmed: 'text-[#58a6ff] bg-[#58a6ff]/10 border-[#58a6ff]/20',
  processing: 'text-[#bc8cff] bg-[#bc8cff]/10 border-[#bc8cff]/20',
  shipped: 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/20',
  delivered: 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/20',
  cancelled: 'text-[#f85149] bg-[#f85149]/10 border-[#f85149]/20',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => getOrders().then(({ data }) => setOrders(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, status).catch(() => {});
    load();
    if (selected?.id === id) setSelected(o => ({ ...o, status }));
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-[#080808]">
      <nav className="bg-[#0e0e0e] border-b border-[#1e1e1e] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-[#555] hover:text-white text-xs tracking-widest uppercase transition-colors">← Dashboard</Link>
          <div className="h-4 w-px bg-[#2a2a2a]" />
          <span className="text-white text-sm font-semibold">Orders</span>
        </div>
        <span className="text-[#555] text-xs">{orders.length} total orders</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-4 py-1.5 text-[10px] tracking-[2px] uppercase border transition-colors ${
                filter === s ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[#2a2a2a] text-[#555] hover:text-white hover:border-[#555]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Orders list */}
          <div className="lg:col-span-2 space-y-2">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-[#444] text-sm">No orders</div>
            )}
            {filtered.map(o => (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                className={`w-full text-left p-4 border transition-colors ${
                  selected?.id === o.id ? 'border-[#C9A84C] bg-[#111]' : 'border-[#1e1e1e] bg-[#111] hover:border-[#2a2a2a]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#C9A84C] font-mono text-xs">{o.order_number}</span>
                  <span className={`text-[9px] tracking-[2px] uppercase px-2 py-0.5 border ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-white text-sm font-medium">{o.customer_name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[#555] text-xs">{new Date(o.created_at).toLocaleDateString()}</p>
                  <p className="text-[#C9A84C] text-sm font-semibold">${o.total.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Order detail */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="h-64 flex items-center justify-center text-[#333] text-sm">
                Select an order to view details
              </div>
            ) : (
              <div className="bg-[#111] border border-[#1e1e1e] p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">{selected.order_number}</h2>
                    <p className="text-[#555] text-xs mt-1">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] tracking-[2px] uppercase px-3 py-1 border ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                </div>

                {/* Customer */}
                <div className="mb-5">
                  <h3 className="text-[#444] text-[10px] tracking-[2px] uppercase mb-3">Customer</h3>
                  <p className="text-white text-sm font-medium">{selected.customer_name}</p>
                  <p className="text-[#666] text-xs">{selected.customer_email}</p>
                  {selected.customer_phone && <p className="text-[#666] text-xs">{selected.customer_phone}</p>}
                </div>

                {/* Address */}
                <div className="mb-5">
                  <h3 className="text-[#444] text-[10px] tracking-[2px] uppercase mb-3">Shipping Address</h3>
                  <p className="text-[#888] text-xs leading-relaxed">
                    {selected.shipping_address?.address}<br />
                    {selected.shipping_address?.city}, {selected.shipping_address?.state} {selected.shipping_address?.zip}
                  </p>
                </div>

                {/* Items */}
                <div className="mb-5">
                  <h3 className="text-[#444] text-[10px] tracking-[2px] uppercase mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selected.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-2 border-b border-[#1a1a1a]">
                        <span className="text-[#888]">{item.name} × {item.qty}</span>
                        <span className="text-[#C9A84C]">${(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-1">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-[#C9A84C] font-bold">${selected.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selected.notes && (
                  <div className="mb-5 p-3 bg-[#0a0a0a] border border-[#1e1e1e]">
                    <p className="text-[#444] text-[10px] tracking-[2px] uppercase mb-1">Notes</p>
                    <p className="text-[#888] text-xs">{selected.notes}</p>
                  </div>
                )}

                {/* Update status */}
                <div>
                  <h3 className="text-[#444] text-[10px] tracking-[2px] uppercase mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => changeStatus(selected.id, s)}
                        disabled={selected.status === s}
                        className={`text-[10px] tracking-[2px] uppercase px-3 py-1.5 border transition-colors disabled:opacity-30 disabled:cursor-default ${
                          selected.status === s
                            ? `border-[#C9A84C] text-[#C9A84C]`
                            : 'border-[#2a2a2a] text-[#555] hover:border-[#555] hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
