import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants', 'Watches', 'Custom Jewellery'];
const MATERIALS = ['All', '18k White Gold', '18k Yellow Gold', 'Platinum', 'Stainless Steel'];
const PRICE_RANGES = [
  { label: 'All', min: 0, max: 999999 },
  { label: 'Under $2,000', min: 0, max: 2000 },
  { label: '$2,000 – $5,000', min: 2000, max: 5000 },
  { label: '$5,000 – $10,000', min: 5000, max: 10000 },
  { label: '$10,000+', min: 10000, max: 999999 },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || 'All';
  const activeMaterial = searchParams.get('material') || 'All';
  const activePriceIdx = Number(searchParams.get('price') || 0);

  const setFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'All' || val === 0 || val === '0') next.delete(key);
    else next.set(key, val);
    setSearchParams(next);
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (activeMaterial !== 'All') params.material = activeMaterial;
    if (activePriceIdx > 0) {
      params.min_price = PRICE_RANGES[activePriceIdx].min;
      params.max_price = PRICE_RANGES[activePriceIdx].max;
    }
    if (searchParams.get('featured')) params.featured = '1';

    getProducts(params)
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="pt-20 min-h-screen page-enter">
      {/* Header */}
      <div className="bg-[#071009] border-b border-[#1b2e25] py-12 px-6 text-center">
        <p className="section-label">Discover</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
          {activeCategory === 'All' ? 'All Collections' : activeCategory}
        </h1>
        <div className="divider-gold" />
        <p className="text-[#666] text-sm mb-3">{products.length} pieces</p>
        <div className="flex items-center justify-center gap-2">
          <div className="flex text-[#C9A84C]">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <span className="text-[#888] text-xs">5.0 · 93 Google Reviews</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat)}
              className={`flex-shrink-0 px-5 py-2 text-xs tracking-[2px] uppercase border transition-all duration-200 ${
                activeCategory === cat
                  ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5'
                  : 'border-[#24402f] text-[#666] hover:border-[#555] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-white text-[10px] tracking-[3px] uppercase font-semibold mb-4">Price Range</h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((r, i) => (
                    <button
                      key={r.label}
                      onClick={() => setFilter('price', i)}
                      className={`block text-sm w-full text-left transition-colors duration-200 ${
                        activePriceIdx === i ? 'text-[#C9A84C]' : 'text-[#666] hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white text-[10px] tracking-[3px] uppercase font-semibold mb-4">Material</h3>
                <div className="space-y-2">
                  {MATERIALS.map(m => (
                    <button
                      key={m}
                      onClick={() => setFilter('material', m)}
                      className={`block text-sm w-full text-left transition-colors duration-200 ${
                        activeMaterial === m ? 'text-[#C9A84C]' : 'text-[#666] hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-[#666] text-xs tracking-widest uppercase mb-5 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters
            </button>

            {showFilters && (
              <div className="lg:hidden mb-6 p-4 bg-[#0f1d17] border border-[#1b2e25] space-y-6">
                <div>
                  <h3 className="text-white text-[10px] tracking-[3px] uppercase font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((r, i) => (
                      <button key={r.label} onClick={() => { setFilter('price', i); setShowFilters(false); }}
                        className={`block text-sm w-full text-left ${activePriceIdx === i ? 'text-[#C9A84C]' : 'text-[#666]'}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white text-[10px] tracking-[3px] uppercase font-semibold mb-3">Material</h3>
                  <div className="space-y-2">
                    {MATERIALS.map(m => (
                      <button key={m} onClick={() => { setFilter('material', m); setShowFilters(false); }}
                        className={`block text-sm w-full text-left ${activeMaterial === m ? 'text-[#C9A84C]' : 'text-[#666]'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#1b2e25]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#0a1512] aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-[#555] text-lg font-display mb-2">No pieces found</p>
                <p className="text-[#444] text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-[#1b2e25]">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
