import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const DiamondIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4">
    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8"/>
    <line x1="2" y1="8" x2="22" y2="8"/>
    <line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="2" y1="8" x2="12" y2="22"/>
    <line x1="22" y1="8" x2="12" y2="22"/>
  </svg>
);

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const image = product.images?.[0];
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null;
  const lowStock = product.in_stock !== 0 && product.stock_qty != null && product.stock_qty <= 3;

  return (
    <div className="card-luxury group relative flex flex-col">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[3/4] bg-[#0f1d17]">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full product-placeholder flex flex-col items-center justify-center gap-3">
            <DiamondIcon />
            <span className="text-[#333] text-[10px] tracking-[3px] uppercase">{product.category}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured === 1 && (
            <span className="bg-[#C9A84C] text-black text-[9px] tracking-[2px] uppercase font-bold px-2 py-1">
              Featured
            </span>
          )}
          {discountPct && (
            <span className="bg-[#0a1512] text-[#C9A84C] border border-[#C9A84C]/30 text-[9px] tracking-[2px] uppercase font-bold px-2 py-1">
              -{discountPct}%
            </span>
          )}
          {product.in_stock === 0 && (
            <span className="bg-[#1b2e25] text-[#666] text-[9px] tracking-[2px] uppercase font-bold px-2 py-1">
              Sold Out
            </span>
          )}
          {lowStock && (
            <span className="bg-[#0a1512] text-[#d29922] border border-[#d29922]/30 text-[9px] tracking-[2px] uppercase font-bold px-2 py-1">
              Only {product.stock_qty} Left
            </span>
          )}
        </div>

        {/* Quick add */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={e => { e.preventDefault(); if (product.in_stock !== 0) addItem(product); }}
            disabled={product.in_stock === 0}
            className="w-full bg-[#C9A84C] text-black text-[10px] tracking-[3px] uppercase font-bold py-3 hover:bg-[#E2C47A] transition-colors duration-200 disabled:bg-[#333] disabled:text-[#666] disabled:cursor-not-allowed"
          >
            {product.in_stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <p className="text-[#555] text-[10px] tracking-[3px] uppercase mb-1">{product.category}</p>
          <h3 className="font-display text-white text-base font-semibold leading-snug mb-1 group-hover:text-[#C9A84C] transition-colors duration-300">
            {product.name}
          </h3>
          {product.material && (
            <p className="text-[#555] text-xs mb-3">{product.material}</p>
          )}
        </Link>

        <div className="mt-auto flex items-center gap-3">
          <span className="text-[#C9A84C] font-display text-lg font-semibold">
            ${product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[#444] text-sm line-through">
              ${product.compare_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
