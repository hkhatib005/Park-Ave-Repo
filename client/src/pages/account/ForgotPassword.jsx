import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[#002902] flex items-center justify-center px-6 page-enter">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#C9A84C" className="mx-auto mb-4">
            <path d="M6 3L2 9l10 13L22 9l-4-6H6z"/>
            <path d="M8 7h8M8 7l4 15m4-15-4 15M2 9h20" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <h1 className="font-display text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-[#555] text-sm mt-2">We'll email you a link to get back in</p>
        </div>

        {sent ? (
          <div className="card-luxury p-6 text-center">
            <p className="text-white text-sm mb-1">Check your inbox</p>
            <p className="text-[#666] text-sm">
              If an account exists for <span className="text-[#C9A84C]">{email}</span>, a reset link is on its way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#555] text-xs block mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-luxury" placeholder="you@example.com" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-[#555] text-sm text-center mt-8">
          <Link to="/account/login" className="text-[#C9A84C] hover:text-[#E2C47A]">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
