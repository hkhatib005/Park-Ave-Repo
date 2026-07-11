import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import AppleSignInButton from '../../components/AppleSignInButton';

export default function AccountRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useCustomerAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async credential => {
    setError('');
    try {
      await loginWithGoogle(credential);
      navigate('/account');
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[#071009] flex items-center justify-center px-6 page-enter">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#C9A84C" className="mx-auto mb-4">
            <path d="M6 3L2 9l10 13L22 9l-4-6H6z"/>
            <path d="M8 7h8M8 7l4 15m4-15-4 15M2 9h20" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="text-[#555] text-sm mt-2">Track orders and check out faster</p>
        </div>

        <div className="space-y-3 mb-6">
          <GoogleSignInButton onCredential={handleGoogle} />
          <AppleSignInButton />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-[#1b2e25] flex-1" />
          <span className="text-[#444] text-[10px] tracking-[2px] uppercase">Or</span>
          <div className="h-px bg-[#1b2e25] flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#555] text-xs block mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="input-luxury" placeholder="Jane Smith" />
          </div>
          <div>
            <label className="text-[#555] text-xs block mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-luxury" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-[#555] text-xs block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="input-luxury" placeholder="At least 8 characters" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-[#555] text-sm text-center mt-8">
          Already have an account? <Link to="/account/login" className="text-[#C9A84C] hover:text-[#E2C47A]">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
