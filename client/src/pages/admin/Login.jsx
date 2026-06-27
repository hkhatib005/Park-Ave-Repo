import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#C9A84C" className="mx-auto mb-4">
            <polygon points="12,2 15.5,8.5 23,9.5 17.5,14.5 19,22 12,18.5 5,22 6.5,14.5 1,9.5 8.5,8.5"/>
          </svg>
          <h1 className="font-display text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-[#555] text-sm mt-2">Park Ave Jewelry Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#555] text-xs block mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-luxury"
              placeholder="admin@parkavejewelry.com"
            />
          </div>
          <div>
            <label className="text-[#555] text-xs block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-luxury"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-[#333] text-xs text-center mt-8">
          Default: admin@parkavejewelry.com / ParkAve2024!
        </p>
      </div>
    </div>
  );
}
