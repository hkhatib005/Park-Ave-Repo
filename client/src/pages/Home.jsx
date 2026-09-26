import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { RingIcon, NecklaceIcon, BraceletIcon, EarringIcon, WatchIcon, CustomIcon } from '../components/CategoryIcons';

const categories = [
  { name: 'Watches', Icon: WatchIcon, desc: 'Rare and iconic timepieces' },
  { name: 'Pendants', Icon: NecklaceIcon, desc: 'Diamonds made personal' },
  { name: 'Rings', Icon: RingIcon, desc: 'For promises and milestones' },
  { name: 'Necklaces', Icon: NecklaceIcon, desc: 'Modern heirlooms' },
  { name: 'Bracelets', Icon: BraceletIcon, desc: 'Everyday brilliance' },
  { name: 'Custom Jewellery', Icon: CustomIcon, desc: 'Made only for you' },
];

const promises = [
  ['Natural diamonds', 'Every stone is carefully selected for beauty and character.'],
  ['Personal guidance', 'Speak with a jeweller, not a sales script.'],
  ['Insured delivery', 'Secure shipping and careful presentation, every time.'],
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts({ limit: 8 })
      .then(({ data }) => setProducts(data))
      .catch(() => {});
  }, []);

  return (
    <div className="page-enter bg-white">
      <section className="relative min-h-[760px] pt-20 overflow-hidden border-b border-[#D8E3DC]">
        <div className="absolute inset-0 editorial-grid opacity-50" />
        <div className="absolute inset-y-0 right-0 w-[48%] bg-[#F0F5F1] hidden lg:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20 lg:py-24 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center min-h-[680px]">
          <div className="max-w-xl">
            <p className="section-label mb-6">New York · Dubai</p>
            <h1 className="font-display text-[clamp(3.8rem,7vw,7.2rem)] font-medium text-[#14291F] leading-[0.83] tracking-[-0.045em] mb-8">
              Objects of desire.
              <span className="block italic text-[#0F5A3A] mt-3">Chosen for a lifetime.</span>
            </h1>
            <p className="text-[#53655B] text-base md:text-lg max-w-lg leading-relaxed mb-9">
              Fine jewellery and exceptional watches, selected with a New Yorker’s eye and delivered with truly personal service.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/shop" className="btn-gold px-9 py-4">Shop New Arrivals</Link>
              <Link to="/contact" className="btn-outline-gold px-9 py-4">Book a Private Visit</Link>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-[#53655B]">
              <span className="text-[#0F5A3A] tracking-[0.08em]">★★★★★</span>
              <span className="w-px h-4 bg-[#D8E3DC]" />
              <span><strong className="text-[#14291F]">5.0</strong> from 93 Google reviews</span>
            </div>
          </div>

          <div className="relative h-[510px] md:h-[600px] lg:h-[620px]">
            <div className="absolute top-0 right-0 w-[83%] h-[82%] bg-white border border-[#D8E3DC] shadow-[0_30px_80px_rgba(20,41,31,0.10)] overflow-hidden">
              <img src="/images/editorial/daytona.png" alt="Rolex Daytona from the Park Ave collection" className="w-full h-full object-contain p-8 md:p-12" />
              <div className="absolute top-5 left-5 bg-white/90 border border-[#D8E3DC] px-4 py-2 text-[9px] uppercase tracking-[0.24em] font-semibold text-[#0F5A3A]">The watch edit</div>
            </div>
            <div className="absolute bottom-0 left-0 w-[46%] h-[43%] bg-[#EAF2ED] border-[10px] border-white shadow-[0_20px_50px_rgba(20,41,31,0.12)] overflow-hidden">
              <img src="/images/editorial/hamsa.png" alt="Diamond Hamsa pendant" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-4 right-0 max-w-[230px] bg-[#0F5A3A] text-white p-5 hidden md:block">
              <p className="font-display text-xl leading-tight">One-of-one feeling.</p>
              <p className="text-white/70 text-xs mt-2 leading-relaxed">Pieces with presence, sourced for people who know exactly what they like.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8E3DC] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8E3DC]">
          {promises.map(([title, copy]) => (
            <div key={title} className="py-5 md:py-1 md:px-8 first:pl-0 last:pr-0">
              <p className="text-[#14291F] text-sm font-semibold mb-1">{title}</p>
              <p className="text-[#6A7A71] text-xs leading-relaxed">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-[#F7F9F7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-label">Find your piece</p>
              <h2 className="section-title">The collections</h2>
            </div>
            <p className="text-[#53655B] text-sm max-w-md leading-relaxed">A considered collection of watches and jewellery—distinctive, wearable, and never ordinary.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link key={cat.name} to={`/shop?category=${cat.name}`} className="group bg-white border border-[#D8E3DC] min-h-52 p-5 flex flex-col justify-between hover:bg-[#0F5A3A] hover:border-[#0F5A3A] transition-all duration-500">
                <cat.Icon width="28" height="28" className="text-[#0F5A3A] group-hover:text-white transition-colors" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#14291F] group-hover:text-white transition-colors">{cat.name}</h3>
                  <p className="text-[#6A7A71] text-[11px] mt-1 leading-relaxed group-hover:text-white/65 transition-colors">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-label">Just in</p>
                <h2 className="section-title">New arrivals</h2>
              </div>
              <Link to="/shop" className="text-[#0F5A3A] text-[11px] uppercase tracking-[0.2em] font-semibold border-b border-[#0F5A3A] pb-1">View the collection</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-2 bg-[#0F5A3A] text-white">
        <div className="min-h-[520px] bg-[#F2F6F3] flex items-center justify-center overflow-hidden">
          <img src="/images/editorial/land-dweller.png" alt="Rolex Land-Dweller" className="w-full h-full object-contain p-10 lg:p-16" />
        </div>
        <div className="px-7 py-20 md:p-20 lg:p-24 flex flex-col justify-center">
          <p className="text-white/65 text-[10px] tracking-[0.3em] uppercase font-semibold mb-5">Private sourcing</p>
          <h2 className="font-display text-5xl md:text-6xl font-medium leading-[0.95] mb-6">Looking for the one everyone else is looking for?</h2>
          <p className="text-white/72 text-sm md:text-base leading-relaxed max-w-lg mb-9">Tell us the reference, stone, or idea. Our network spans New York, Dubai, and beyond to source exceptional pieces discreetly.</p>
          <Link to="/contact" className="inline-flex self-start border border-white text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-white hover:text-[#0F5A3A] transition-colors">Start a private search</Link>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#F7F9F7]">
        <div className="max-w-5xl mx-auto text-center border border-[#BFD0C5] bg-white px-6 py-16 md:px-16">
          <p className="section-label">Made for one</p>
          <h2 className="font-display text-5xl md:text-6xl font-medium text-[#14291F] leading-none mb-6">Your idea, made extraordinary.</h2>
          <p className="text-[#53655B] max-w-xl mx-auto leading-relaxed mb-9">From first sketch to final setting, work directly with our jewellers on a piece that could only belong to you.</p>
          <Link to="/contact" className="btn-gold">Begin a custom piece</Link>
        </div>
      </section>
    </div>
  );
}
