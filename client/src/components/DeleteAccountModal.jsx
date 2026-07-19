import { useState } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function DeleteAccountModal({ hasPassword, onClose, onDeleted }) {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { deleteAccount } = useCustomerAuth();

  const canSubmit = hasPassword ? password.length > 0 : confirmText === 'DELETE';

  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      await deleteAccount(hasPassword ? password : undefined);
      onDeleted();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
      <div className="bg-[#0c1714] border border-red-900/40 w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b2e25]">
          <h2 className="font-display text-lg font-bold text-white">Delete Account</h2>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[#888] text-sm leading-relaxed">
            This permanently deletes your login and profile. It can't be undone.
          </p>

          {hasPassword ? (
            <div>
              <label className="text-[#555] text-xs block mb-1.5">Enter your password to confirm</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="input-luxury"
                placeholder="••••••••"
              />
            </div>
          ) : (
            <div>
              <label className="text-[#555] text-xs block mb-1.5">Type DELETE to confirm</label>
              <input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                autoFocus
                className="input-luxury"
                placeholder="DELETE"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline-gold flex-1 py-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="flex-1 py-3 text-xs tracking-[3px] uppercase font-bold bg-red-900/80 text-white hover:bg-red-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
