import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { getMyOrders } from '../../utils/api';

const STATUS_COLORS = {
  pending: 'text-[#d29922] bg-[#d29922]/10',
  confirmed: 'text-[#58a6ff] bg-[#58a6ff]/10',
  processing: 'text-[#bc8cff] bg-[#bc8cff]/10',
  shipped: 'text-[#3fb950] bg-[#3fb950]/10',
  delivered: 'text-[#3fb950] bg-[#3fb950]/10',
  cancelled: 'text-[#f85149] bg-[#f85149]/10',
};

export default function Account() {
  const { customer, logout } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders().then(({ data }) => setOrders(data)).catch(() => {});
  }, []);

  return (
    <div className="pt-20 min-h-screen page-enter">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label">My Account</p>
            <h1 className="font-display text-4xl font-bold text-white">{customer?.name}</h1>
            <p className="text-[#666] text-sm mt-1">{customer?.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-[#555] hover:text-[#C9A84C] text-xs tracking-widest uppercase transition-colors"
          >
            Sign Out
          </button>
        </div>

        <h2 className="text-white text-sm tracking-[3px] uppercase font-semibold mb-5">Order History</h2>
        {orders.length === 0 ? (
          <div className="card-luxury p-10 text-center text-[#555] text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
              <div key={o.id} className="card-luxury p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#C9A84C] font-mono text-xs">{o.order_number}</span>
                  <span className={`text-[9px] tracking-[2px] uppercase px-2 py-1 ${STATUS_COLORS[o.status] || 'text-[#666]'}`}>{o.status}</span>
                </div>
                <div className="space-y-1 mb-3">
                  {o.items.map((item, i) => (
                    <p key={i} className="text-[#888] text-sm">{item.name} × {item.qty}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#182a20]">
                  <span className="text-[#555] text-xs">{new Date(o.created_at).toLocaleDateString()}</span>
                  <span className="text-white font-semibold">${o.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
