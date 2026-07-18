import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContacts, markContactRead } from '../../utils/api';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => getContacts().then(({ data }) => setContacts(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const open = async c => {
    setSelected(c);
    if (!c.read) {
      await markContactRead(c.id).catch(() => {});
      setContacts(prev => prev.map(x => x.id === c.id ? { ...x, read: 1 } : x));
    }
  };

  return (
    <div className="min-h-screen bg-[#002902]">
      <nav className="bg-[#0c1714] border-b border-[#005b04] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-[#555] hover:text-white text-xs tracking-widest uppercase transition-colors">← Dashboard</Link>
          <div className="h-4 w-px bg-[#007605]" />
          <span className="text-white text-sm font-semibold">Client Messages</span>
        </div>
        <span className="text-[#555] text-xs">{contacts.filter(c => !c.read).length} unread</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {contacts.length === 0 && <div className="py-12 text-center text-[#444] text-sm">No messages yet</div>}
            {contacts.map(c => (
              <button
                key={c.id}
                onClick={() => open(c)}
                className={`w-full text-left p-4 border transition-colors ${
                  selected?.id === c.id ? 'border-[#C9A84C] bg-[#003e02]' : 'border-[#005b04] bg-[#003e02] hover:border-[#007605]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  {!c.read && <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />}
                </div>
                <p className="text-[#666] text-xs truncate">{c.subject || c.message}</p>
                <p className="text-[#444] text-xs mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {!selected ? (
              <div className="h-64 flex items-center justify-center text-[#333] text-sm">
                Select a message to view details
              </div>
            ) : (
              <div className="bg-[#003e02] border border-[#005b04] p-6">
                <h2 className="font-display text-xl font-bold text-white mb-1">{selected.subject || 'General Inquiry'}</h2>
                <p className="text-[#555] text-xs mb-5">{new Date(selected.created_at).toLocaleString()}</p>

                <div className="mb-5 space-y-1">
                  <p className="text-white text-sm font-medium">{selected.name}</p>
                  <p className="text-[#888] text-xs">
                    <a href={`mailto:${selected.email}`} className="text-[#C9A84C] hover:text-[#E2C47A]">{selected.email}</a>
                  </p>
                  {selected.phone && <p className="text-[#888] text-xs">{selected.phone}</p>}
                </div>

                <div className="p-4 bg-[#003102] border border-[#005b04]">
                  <p className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <a href={`mailto:${selected.email}`} className="btn-gold inline-block mt-5">Reply by Email</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
