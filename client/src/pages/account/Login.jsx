import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function AccountLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/account';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async credential => {
    setError('');
    try {
      await loginWithGoogle(credential);
      navigate(redirectTo);
    } catch {
      setError('Google sign-in failed. Please try again.');
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
          <h1 className="font-display text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-[#555] text-sm mt-2">Sign in to view your orders</p>
        </div>

        <div className="space-y-3 mb-6">
          <GoogleSignInButton onCredential={handleGoogle} />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-[#005b04] flex-1" />
          <span className="text-[#444] text-[10px] tracking-[2px] uppercase">Or</span>
          <div className="h-px bg-[#005b04] flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#555] text-xs block mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-luxury" placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[#555] text-xs">Password</label>
              <Link to="/account/forgot-password" className="text-[#555] hover:text-[#C9A84C] text-xs transition-colors">Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-luxury" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-[#555] text-sm text-center mt-8">
          Don't have an account? <Link to="/account/register" className="text-[#C9A84C] hover:text-[#E2C47A]">Create one</Link>
        </p>
      </div>
    </div>
  );
}
