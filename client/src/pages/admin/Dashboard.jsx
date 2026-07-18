import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, getOrders, getCustomers, getContacts, getNewsletterSubscribers } from '../../utils/api';

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0, customers: 0, unreadMessages: 0, subscribers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([getProducts({ limit: 200 }), getOrders(), getCustomers(), getContacts(), getNewsletterSubscribers()])
      .then(([pRes, oRes, cRes, mRes, nRes]) => {
        const products = pRes.data;
        const orders = oRes.data;
        const revenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0);
        const pending = orders.filter(o => o.status === 'pending').length;
        const unreadMessages = mRes.data.filter(m => !m.read).length;
        setStats({ products: products.length, orders: orders.length, revenue, pending, customers: cRes.data.length, unreadMessages, subscribers: nRes.data.length });
        setRecentOrders(orders.slice(0, 5));
      }).catch(() => {});
  }, []);

  const STATUS_COLORS = {
    pending: 'text-[#d29922] bg-[#d29922]/10',
    confirmed: 'text-[#58a6ff] bg-[#58a6ff]/10',
    processing: 'text-[#bc8cff] bg-[#bc8cff]/10',
    shipped: 'text-[#3fb950] bg-[#3fb950]/10',
    delivered: 'text-[#3fb950] bg-[#3fb950]/10',
    cancelled: 'text-[#f85149] bg-[#f85149]/10',
  };

  return (
    <div className="min-h-screen bg-[#002902]">
      {/* Admin nav */}
      <nav className="bg-[#0c1714] border-b border-[#005b04] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#C9A84C">
              <path d="M6 3L2 9l10 13L22 9l-4-6H6z"/>
              <path d="M8 7h8M8 7l4 15m4-15-4 15M2 9h20" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1" strokeLinejoin="round"/>
            </svg>
            <span className="font-display text-white text-sm font-bold">Park Ave</span>
          </Link>
          <div className="h-4 w-px bg-[#007605]" />
          <span className="text-[#555] text-xs tracking-widest uppercase">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#555] text-xs">{admin?.email}</span>
          <button onClick={() => { logout(); navigate('/admin'); }} className="text-[#555] hover:text-[#C9A84C] text-xs tracking-widest uppercase transition-colors">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-[#555] text-sm mt-1">Welcome back, {admin?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Revenue (Paid)', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: 'text-[#3fb950]' },
            { label: 'Total Orders', value: stats.orders, icon: '📦', color: 'text-[#58a6ff]' },
            { label: 'Pending Orders', value: stats.pending, icon: '⏳', color: 'text-[#d29922]' },
            { label: 'Total Products', value: stats.products, icon: '💎', color: 'text-[#C9A84C]' },
            { label: 'Customer Accounts', value: stats.customers, icon: '👤', color: 'text-[#bc8cff]' },
            { label: 'Unread Messages', value: stats.unreadMessages, icon: '✉️', color: 'text-[#f85149]' },
            { label: 'Newsletter Subscribers', value: stats.subscribers, icon: '📰', color: 'text-[#58a6ff]' },
          ].map(s => (
            <div key={s.label} className="bg-[#003e02] border border-[#005b04] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
              </div>
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[#555] text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Link to="/admin/products" className="group bg-[#003e02] border border-[#005b04] hover:border-[#C9A84C]/40 p-6 flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-xl">💎</div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-[#C9A84C] transition-colors">Manage Products</h3>
              <p className="text-[#555] text-xs mt-0.5">Add, edit, delete jewellery and watches</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" className="ml-auto group-hover:stroke-[#C9A84C] transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/admin/orders" className="group bg-[#003e02] border border-[#005b04] hover:border-[#C9A84C]/40 p-6 flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 bg-[#58a6ff]/10 border border-[#58a6ff]/20 flex items-center justify-center text-xl">📦</div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-[#C9A84C] transition-colors">Orders &amp; Payments</h3>
              <p className="text-[#555] text-xs mt-0.5">Review orders, statuses, and payment status</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" className="ml-auto group-hover:stroke-[#C9A84C] transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/admin/customers" className="group bg-[#003e02] border border-[#005b04] hover:border-[#C9A84C]/40 p-6 flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 bg-[#bc8cff]/10 border border-[#bc8cff]/20 flex items-center justify-center text-xl">👤</div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-[#C9A84C] transition-colors">Customer Accounts</h3>
              <p className="text-[#555] text-xs mt-0.5">See who's signed up and what they've bought</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" className="ml-auto group-hover:stroke-[#C9A84C] transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/admin/contacts" className="group bg-[#003e02] border border-[#005b04] hover:border-[#C9A84C]/40 p-6 flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 bg-[#f85149]/10 border border-[#f85149]/20 flex items-center justify-center text-xl">✉️</div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-[#C9A84C] transition-colors">Client Messages</h3>
              <p className="text-[#555] text-xs mt-0.5">Contact form submissions and client emails</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" className="ml-auto group-hover:stroke-[#C9A84C] transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/admin/newsletter" className="group bg-[#003e02] border border-[#005b04] hover:border-[#C9A84C]/40 p-6 flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 bg-[#58a6ff]/10 border border-[#58a6ff]/20 flex items-center justify-center text-xl">📰</div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-[#C9A84C] transition-colors">Newsletter</h3>
              <p className="text-[#555] text-xs mt-0.5">Everyone who's subscribed for updates</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" className="ml-auto group-hover:stroke-[#C9A84C] transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Recent orders */}
        <div className="bg-[#003e02] border border-[#005b04]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#005b04]">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[#C9A84C] text-xs tracking-widest uppercase hover:text-[#E2C47A] transition-colors">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-10 text-center text-[#444] text-sm">No orders yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#005403]">
                    {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[#444] text-[10px] tracking-[2px] uppercase font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className="border-b border-[#005403] hover:bg-[#0c1714] transition-colors">
                      <td className="px-6 py-3 text-[#C9A84C] font-mono text-xs">{o.order_number}</td>
                      <td className="px-6 py-3 text-white">{o.customer_name}</td>
                      <td className="px-6 py-3 text-white">${o.total.toLocaleString()}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] tracking-[2px] uppercase px-2 py-1 ${STATUS_COLORS[o.status] || 'text-[#666]'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[#555] text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
