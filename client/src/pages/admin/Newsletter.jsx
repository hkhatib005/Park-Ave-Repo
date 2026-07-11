import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewsletterSubscribers } from '../../utils/api';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getNewsletterSubscribers().then(({ data }) => setSubscribers(data)).catch(() => {});
  }, []);

  const copyAll = () => {
    navigator.clipboard.writeText(subscribers.map(s => s.email).join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#071009]">
      <nav className="bg-[#0c1714] border-b border-[#1b2e25] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-[#555] hover:text-white text-xs tracking-widest uppercase transition-colors">← Dashboard</Link>
          <div className="h-4 w-px bg-[#24402f]" />
          <span className="text-white text-sm font-semibold">Newsletter Subscribers</span>
        </div>
        <span className="text-[#555] text-xs">{subscribers.length} subscribers</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={copyAll}
            disabled={subscribers.length === 0}
            className="text-[#C9A84C] hover:text-[#E2C47A] text-xs tracking-widest uppercase transition-colors disabled:opacity-30"
          >
            {copied ? 'Copied!' : 'Copy All Emails'}
          </button>
        </div>

        <div className="bg-[#0f1d17] border border-[#1b2e25]">
          {subscribers.length === 0 ? (
            <div className="p-10 text-center text-[#444] text-sm">No subscribers yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#182a20]">
                    {['Email', 'Subscribed'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[#444] text-[10px] tracking-[2px] uppercase font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s.id} className="border-b border-[#182a20] hover:bg-[#0c1714] transition-colors">
                      <td className="px-6 py-3 text-white">{s.email}</td>
                      <td className="px-6 py-3 text-[#555] text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
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
