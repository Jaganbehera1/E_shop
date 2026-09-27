import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { fmt, pct, eff, cx } from '../lib/utils';
import { useCart } from '../lib/cart';
import { useWishlist } from '../lib/wishlist';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';

export function ProductCard({ product: p, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const off = pct(p.price, p.discount_price);
  const price = eff(p);
  const liked = has(p.id);

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast('Please login to add items to cart', 'error');
      nav('/auth?next=/products');
      return;
    }
    await add(p);
    toast(`${p.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="card group flex flex-col overflow-hidden bg-white"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50 p-3">
        <Link to={`/products/${p.slug}`}>
          <img
            src={p.images?.[0]}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded bg-[#ff9f00] px-1.5 py-0.5 text-[11px] font-bold text-white">
            {off}% OFF
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(p); }}
          aria-label="wishlist"
          className={cx(
            'absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm transition',
            liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
          )}
        >
          <Heart className="h-3.5 w-3.5" fill={liked ? 'currentColor' : 'none'} />
        </button>
        {p.stock_qty <= 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-slate-800/80 py-1 text-center text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link to={`/products/${p.slug}`} className="line-clamp-2 text-sm font-medium leading-snug text-slate-800 hover:text-[#2874f0]">
          {p.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          {p.rating_avg > 0 ? (
            <>
              <span className="flex items-center gap-0.5 rounded bg-[#388e3c] px-1.5 py-0.5 text-[11px] font-bold text-white">
                {p.rating_avg.toFixed(1)} <Star className="h-2.5 w-2.5 fill-white" />
              </span>
              <span className="text-slate-500">({p.rating_count})</span>
            </>
          ) : (
            <span className="text-[11px] text-slate-400">No ratings</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end gap-2 pt-2">
          <span className="text-lg font-bold text-slate-900">{fmt(price)}</span>
          {off > 0 && <span className="text-xs text-slate-400 line-through">{fmt(p.price)}</span>}
        </div>

        <button
          onClick={onAdd}
          disabled={p.stock_qty <= 0}
          className="mt-2 flex items-center justify-center gap-1.5 rounded bg-[#ff9f00] py-2 text-xs font-bold text-white transition hover:bg-[#e68f00] disabled:opacity-50"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {user ? 'Add to Cart' : 'Login to Buy'}
        </button>
      </div>
    </motion.div>
  );
}
