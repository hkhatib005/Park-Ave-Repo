import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProducts } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { RingIcon, CATEGORY_ICONS } from '../components/CategoryIcons';

const TRUST_SIGNALS = [
  { text: 'Secure checkout', icon: <><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></> },
  { text: 'GIA certified stones', icon: <><polygon points="12,3 20,8 20,15 12,21 4,15 4,8"/></> },
  { text: 'Free insured shipping', icon: <><rect x="2" y="7" width="13" height="10"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.6"/><circle cx="18" cy="19" r="1.6"/></> },
  { text: 'Store credit returns', icon: <><path d="M3 10a8 8 0 1 1 2.7 6"/><path d="M3 4v6h6"/></> },
];

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    getProduct(id).then(({ data }) => {
      setProduct(data);
      setActiveImg(0);
      getProducts({ category: data.category, limit: 4 })
        .then(r => setRelated(r.data.filter(p => p.id !== data.id).slice(0, 4)));
    }).catch(() => {});
  }, [id]);

  const handleAdd = () => {
    if (!product || product.in_stock === 0) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!product) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const images = product.images?.length ? product.images : [null];
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <div className="pt-20 min-h-screen page-enter">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-[#555] text-xs">
          <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C9A84C] transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#C9A84C] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#888]">{product.name}</span>
        </nav>
      </div>

      {/* Main product */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Images */}
          <div>
            <div className="aspect-square bg-[#003e02] mb-3 overflow-hidden">
              {images[activeImg] ? (
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full product-placeholder flex items-center justify-center">
                  {(() => {
                    const Icon = CATEGORY_ICONS[product.category] || RingIcon;
                    return <Icon width="88" height="88" className="text-[#C9A84C]/35" />;
                  })()}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square bg-[#003e02] overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-[#C9A84C]' : 'border-transparent'}`}
                  >
                    {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            <p className="section-label">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-[#C9A84C]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <span className="text-[#888] text-xs">5.0 · 93 Google Reviews</span>
            </div>
            {product.material && (
              <p className="text-[#666] text-sm mb-4">{product.material}</p>
            )}
            {product.sku && (
              <p className="text-[#444] text-xs tracking-wider mb-6">SKU: {product.sku}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-display text-3xl font-bold text-[#C9A84C]">
                ${product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-[#555] text-lg line-through">
                  ${product.compare_price.toLocaleString()}
                </span>
              )}
            </div>

            <div className="w-full h-px bg-[#005b04] mb-6" />

            {/* Description */}
            {product.description && (
              <p className="text-[#888] text-sm leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Qty + Add */}
            {product.in_stock !== 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#007605]">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#666] hover:text-white transition-colors">−</button>
                    <span className="text-white w-10 text-center text-sm">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-[#666] hover:text-white transition-colors">+</button>
                  </div>
                  <p className={`text-xs font-medium ${product.stock_qty <= 3 ? 'text-[#d29922]' : 'text-[#555]'}`}>
                    {product.stock_qty <= 3 ? `Only ${product.stock_qty} left in stock` : `${product.stock_qty} in stock`}
                  </p>
                </div>

                <button
                  onClick={handleAdd}
                  className={`w-full py-4 text-xs tracking-[3px] uppercase font-bold transition-all duration-300 ${
                    added
                      ? 'bg-[#3fb950] text-black'
                      : 'bg-[#C9A84C] text-black hover:bg-[#E2C47A] hover:shadow-[0_0_40px_rgba(201,168,76,0.25)]'
                  }`}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <Link to="/contact" className="btn-outline-gold w-full text-center block">
                  Inquire About This Piece
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full py-4 text-center text-xs tracking-[3px] uppercase bg-[#005403] text-[#555] border border-[#007605]">
                  Sold Out
                </div>
                <Link to="/contact" className="btn-outline-gold w-full text-center block">
                  Join the Waitlist
                </Link>
              </div>
            )}

            {/* Trust signals */}
            <div className="mt-8 pt-8 border-t border-[#005b04] grid grid-cols-2 gap-4">
              {TRUST_SIGNALS.map(t => (
                <div key={t.text} className="flex items-center gap-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" className="flex-shrink-0">{t.icon}</svg>
                  <span className="text-[#666] text-xs">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-10">
              <p className="section-label">You May Also Like</p>
              <h2 className="font-display text-3xl font-bold text-white">Related Pieces</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
