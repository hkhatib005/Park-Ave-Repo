import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

const categories = [
  { name: 'Rings', icon: '💍', desc: 'Engagement, wedding & fashion rings' },
  { name: 'Necklaces', icon: '📿', desc: 'Diamond, gold & pearl necklaces' },
  { name: 'Bracelets', icon: '✨', desc: 'Bangles, chains & tennis bracelets' },
  { name: 'Earrings', icon: '💎', desc: 'Studs, hoops & drop earrings' },
  { name: 'Watches', icon: '⌚', desc: 'Rolex, Cartier & fine timepieces' },
  { name: 'Custom Jewellery', icon: '🎨', desc: 'Bespoke pieces made for you' },
];

const press = [
  { name: 'Vogue', quote: '"The finest jewellery boutique in Manhattan"' },
  { name: 'Town & Country', quote: '"A gem on Park Avenue"' },
  { name: 'New York Times', quote: '"Unrivaled craftsmanship since 1987"' },
  { name: "Harper's Bazaar", quote: '"Where NYC\'s elite shop for luxury"' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts({ featured: '1', limit: 8 })
      .then(({ data }) => setFeatured(data))
      .catch(() => {});
  }, []);

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.06) 0%, transparent 60%),
                              radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)`
          }}
        />

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent ml-16 hidden lg:block" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent mr-16 hidden lg:block" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="section-label mb-6 animate-fade-in">New York City · Est. 1987</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
            Where Luxury
            <br />
            <span className="gold-shimmer">Meets Legacy</span>
          </h1>
          <div className="divider-gold" />
          <p className="text-[#888] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Park Avenue's finest collection of diamonds, fine jewellery, and luxury timepieces.
            Curated for those who demand only the extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="btn-gold px-10 py-4 text-xs">
              Explore Collection
            </Link>
            <Link to="/contact" className="btn-outline-gold px-10 py-4 text-xs">
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[#444] text-[9px] tracking-[4px] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#C9A84C] to-transparent" />
        </div>
      </section>

      {/* PRESS BAR */}
      <div className="border-y border-[#1e1e1e] bg-[#080808] py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-8 overflow-x-auto no-scrollbar">
            {press.map(p => (
              <div key={p.name} className="flex-shrink-0 text-center">
                <p className="font-display text-[#888] text-sm italic">{p.quote}</p>
                <p className="text-[#C9A84C] text-[10px] tracking-[3px] uppercase mt-1">— {p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">Shop by Category</p>
            <h2 className="section-title">Our Collections</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#1e1e1e]">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                className="group bg-[#0a0a0a] p-6 flex flex-col items-center text-center hover:bg-[#111] transition-colors duration-300"
              >
                <div className="w-14 h-14 border border-[#2a2a2a] group-hover:border-[#C9A84C] rounded-full flex items-center justify-center text-2xl mb-4 transition-colors duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-[#C9A84C] transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="text-[#555] text-[11px] leading-relaxed hidden md:block">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-24 px-6 bg-[#080808]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-label">Handpicked for You</p>
                <h2 className="section-title">Featured Pieces</h2>
              </div>
              <Link to="/shop?featured=1" className="btn-outline-gold hidden md:block">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1e1e1e]">
              {featured.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="text-center mt-10 md:hidden">
              <Link to="/shop" className="btn-outline-gold">View All Pieces</Link>
            </div>
          </div>
        </section>
      )}

      {/* CRAFTSMANSHIP BANNER */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)`
        }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="section-label">Our Promise</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Every Piece Tells<br />
            <span className="text-[#C9A84C]">Your Story</span>
          </h2>
          <div className="divider-gold" />
          <p className="text-[#888] text-base leading-relaxed mb-10 max-w-xl mx-auto">
            From our studio on Park Avenue, each jewel is sourced, certified, and set by master craftsmen
            with decades of experience. We stand behind every piece with our lifetime guarantee.
          </p>
          <div className="grid grid-cols-3 gap-8 mb-10">
            {[
              { num: '35+', label: 'Years of Excellence' },
              { num: '10K+', label: 'Happy Clients' },
              { num: '100%', label: 'Certified Stones' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-3xl md:text-4xl font-bold text-[#C9A84C]">{s.num}</p>
                <p className="text-[#666] text-xs tracking-widest uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-outline-gold">Our Story</Link>
        </div>
      </section>

      {/* CUSTOM ORDERS */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="border border-[#C9A84C]/20 p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent" />
            <div className="relative z-10">
              <p className="section-label">Bespoke Service</p>
              <h2 className="section-title mb-4">Custom Jewellery</h2>
              <div className="divider-gold" />
              <p className="text-[#888] text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Work directly with our master jewellers to create a one-of-a-kind piece.
                Engagement rings, anniversary gifts, heirlooms — we bring your vision to life.
              </p>
              <Link to="/contact" className="btn-gold">Start Your Custom Order</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
