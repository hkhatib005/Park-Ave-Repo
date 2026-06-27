import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../utils/api';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await getProducts({ search: query, limit: 6 });
        setResults(data);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const go = id => {
    navigate(`/product/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center pt-24 px-6">
      <div className="w-full max-w-2xl">
        <div className="relative flex items-center border-b-2 border-[#C9A84C] pb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search jewellery, watches..."
            className="flex-1 bg-transparent text-white text-xl px-4 placeholder-[#444] focus:outline-none"
          />
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {loading && (
          <p className="text-[#555] text-sm mt-6">Searching...</p>
        )}

        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            {results.map(p => (
              <button
                key={p.id}
                onClick={() => go(p.id)}
                className="w-full flex items-center gap-4 p-3 hover:bg-[#111] transition-colors text-left group"
              >
                <div className="w-12 h-12 bg-[#111] flex-shrink-0 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full product-placeholder" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium group-hover:text-[#C9A84C] transition-colors">{p.name}</p>
                  <p className="text-[#555] text-xs">{p.category}</p>
                </div>
                <span className="text-[#C9A84C] font-semibold text-sm">${p.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <p className="text-[#555] text-sm mt-6">No results for "{query}"</p>
        )}

        {!query && (
          <div className="mt-8">
            <p className="text-[#444] text-xs tracking-[3px] uppercase mb-4">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Diamond Ring', 'Rolex', 'Gold Necklace', 'Earrings', 'Bracelet', 'Custom'].map(t => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="border border-[#2a2a2a] text-[#666] hover:border-[#C9A84C] hover:text-[#C9A84C] px-3 py-1.5 text-xs transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
