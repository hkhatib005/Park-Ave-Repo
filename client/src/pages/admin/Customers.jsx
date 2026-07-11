import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../../utils/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then(({ data }) => setCustomers(data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#071009]">
      <nav className="bg-[#0c1714] border-b border-[#1b2e25] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-[#555] hover:text-white text-xs tracking-widest uppercase transition-colors">← Dashboard</Link>
          <div className="h-4 w-px bg-[#24402f]" />
          <span className="text-white text-sm font-semibold">Customer Accounts</span>
        </div>
        <span className="text-[#555] text-xs">{customers.length} accounts</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-[#0f1d17] border border-[#1b2e25]">
          {customers.length === 0 ? (
            <div className="p-10 text-center text-[#444] text-sm">No customer accounts yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#182a20]">
                    {['Name', 'Email', 'Signed up via', 'Orders', 'Total Spent', 'Joined'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[#444] text-[10px] tracking-[2px] uppercase font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="border-b border-[#182a20] hover:bg-[#0c1714] transition-colors">
                      <td className="px-6 py-3 text-white">{c.name}</td>
                      <td className="px-6 py-3 text-[#888]">{c.email}</td>
                      <td className="px-6 py-3 text-[#666]">{c.via_google ? 'Google' : 'Email'}</td>
                      <td className="px-6 py-3 text-white">{c.order_count}</td>
                      <td className="px-6 py-3 text-[#C9A84C] font-semibold">${c.total_spent.toLocaleString()}</td>
                      <td className="px-6 py-3 text-[#555] text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
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
