import { useState } from 'react';
import { sendContact } from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendContact(form);
      setSent(true);
    } catch {
      setError('Failed to send message. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 page-enter">
      {/* Header */}
      <div className="py-20 px-6 bg-[#080808] border-b border-[#1e1e1e] text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)` }} />
        <div className="relative z-10">
          <p className="section-label">Get In Touch</p>
          <h1 className="section-title mb-3">Contact Us</h1>
          <div className="divider-gold" />
          <p className="text-[#888] text-sm max-w-md mx-auto">
            We'd love to hear from you. Whether you have a question about a piece, want to book a consultation,
            or enquire about a custom order — we're here.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Our Boutique</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
                    label: 'Address',
                    value: '520 Park Avenue\nNew York, NY 10022'
                  },
                  {
                    icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.59 2.72h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
                    label: 'Phone',
                    value: '(212) 555-0192'
                  },
                  {
                    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
                    label: 'Email',
                    value: 'info@parkavejewelry.com'
                  },
                ].map(c => (
                  <div key={c.label} className="flex gap-4">
                    <div className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                        {c.icon}
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#555] text-[10px] tracking-[2px] uppercase mb-0.5">{c.label}</p>
                      <p className="text-white text-sm whitespace-pre-line">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1e1e1e] pt-8">
              <h3 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-4">Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666]">Mon – Fri</span>
                  <span className="text-white">10am – 7pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Saturday</span>
                  <span className="text-white">10am – 6pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Sunday</span>
                  <span className="text-white">12pm – 5pm</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1e1e1e] pt-8">
              <h3 className="text-white text-xs tracking-[3px] uppercase font-semibold mb-4">Enquiry Types</h3>
              <div className="space-y-2">
                {['Product Enquiry', 'Custom Jewellery', 'Watch Consultation', 'Repairs & Restoration', 'Corporate Gifts'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-[#666] text-sm">
                    <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 border border-[#C9A84C] flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-3">Message Received</h2>
                <p className="text-[#888] text-sm max-w-sm">
                  Thank you for reaching out. A member of our team will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#555] text-xs block mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} required className="input-luxury" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-[#555] text-xs block mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-luxury" placeholder="+1 (212) 555-0100" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#555] text-xs block mb-1.5">Email Address *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="input-luxury" placeholder="your@email.com" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#555] text-xs block mb-1.5">Subject</label>
                    <select value={form.subject} onChange={e => set('subject', e.target.value)} className="input-luxury">
                      <option value="">Select a subject...</option>
                      {['Product Enquiry', 'Custom Jewellery', 'Watch Consultation', 'Repairs & Restoration', 'Corporate Gifts', 'Other'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[#555] text-xs block mb-1.5">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      required
                      rows={6}
                      className="input-luxury resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button type="submit" disabled={loading} className="btn-gold w-full py-4 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
