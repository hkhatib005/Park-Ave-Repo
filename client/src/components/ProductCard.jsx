import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { RingIcon, CATEGORY_ICONS } from './CategoryIcons';

export default function ProductCard({ product }) {
  const PlaceholderIcon = CATEGORY_ICONS[product.category] || RingIcon;
  const { addItem } = useCart();
  const image = product.images?.[0];
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null;
  const lowStock = product.in_stock !== 0 && product.stock_qty != null && product.stock_qty <= 3;

  return (
    <article className="card-luxury group relative flex flex-col overflow-hidden">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/5] bg-[#F4F7F4]">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="w-full h-full product-placeholder flex flex-col items-center justify-center gap-3">
            <PlaceholderIcon width="40" height="40" className="text-[#0F5A3A]/35" />
            <span className="text-[#7A8980] text-[10px] tracking-[3px] uppercase">{product.category}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured === 1 && (
            <span className="bg-[#0F5A3A] text-white text-[9px] tracking-[2px] uppercase font-bold px-2 py-1.5">
              Featured
            </span>
          )}
          {discountPct && (
            <span className="bg-white text-[#0F5A3A] border border-[#BFD0C5] text-[9px] tracking-[2px] uppercase font-bold px-2 py-1.5">
              -{discountPct}%
            </span>
          )}
          {product.in_stock === 0 && (
            <span className="bg-[#14291F] text-white text-[9px] tracking-[2px] uppercase font-bold px-2 py-1.5">
              Sold Out
            </span>
          )}
          {lowStock && (
            <span className="bg-white text-[#8A5A20] border border-[#D9C3A5] text-[9px] tracking-[2px] uppercase font-bold px-2 py-1.5">
              Only {product.stock_qty} Left
            </span>
          )}
        </div>

        {/* Quick add */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={e => { e.preventDefault(); if (product.in_stock !== 0) addItem(product); }}
            disabled={product.in_stock === 0}
            className="w-full bg-[#0F5A3A] text-white text-[10px] tracking-[3px] uppercase font-bold py-3.5 hover:bg-[#143E2D] transition-colors duration-200 disabled:bg-[#D8E3DC] disabled:text-[#7A8980] disabled:cursor-not-allowed"
          >
            {product.in_stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 md:p-6 flex flex-col flex-1 bg-white">
        <Link to={`/product/${product.id}`}>
          <p className="text-[#0F5A3A] text-[9px] font-semibold tracking-[3px] uppercase mb-2">{product.category}</p>
          <h3 className="font-display text-[#14291F] text-xl font-semibold leading-[1.05] mb-2 group-hover:text-[#0F5A3A] transition-colors duration-300">
            {product.name}
          </h3>
          {product.material && (
            <p className="text-[#6A7A71] text-xs mb-4">{product.material}</p>
          )}
        </Link>

        <div className="mt-auto flex items-center gap-3">
          <span className="text-[#14291F] font-display text-xl font-semibold">
            ${product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[#8C9991] text-sm line-through">
              ${product.compare_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
