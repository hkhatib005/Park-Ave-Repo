import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { completePasswordReset } = useCustomerAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await completePasswordReset(token, password);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.error || 'This reset link is invalid or has expired');
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
          <h1 className="font-display text-3xl font-bold text-white">Set New Password</h1>
        </div>

        {!token ? (
          <div className="card-luxury p-6 text-center">
            <p className="text-white text-sm mb-3">This reset link is missing its token.</p>
            <Link to="/account/forgot-password" className="text-[#C9A84C] hover:text-[#E2C47A] text-sm">Request a new one</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#555] text-xs block mb-1.5">New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="input-luxury" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-[#555] text-xs block mb-1.5">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8} className="input-luxury" placeholder="••••••••" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50">
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
