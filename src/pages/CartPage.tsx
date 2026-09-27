import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { fmt, eff } from '../lib/utils';
import { Seo } from '../lib/seo';
import { motion, AnimatePresence } from 'framer-motion';

export function CartPage() {
  const { lines, loading, update, remove, subtotal, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const ship = subtotal >= 999 ? 0 : 49;
  const total = subtotal + ship;

  if (!user && !loading) return <Navigate to="/auth?next=/cart" replace />;

  return (
    <div className="cx py-6">
      <Seo title="Cart" path="/cart" />
      {loading ? (
        <div className="h-64 rounded-lg bg-slate-100 animate-pulse" />
      ) : lines.length === 0 ? (
        <div className="surface p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-800">Your cart is empty</h3>
          <p className="mt-1 text-sm text-slate-500">Browse our electronics and project kits.</p>
          <Link to="/products" className="btn-primary mt-5">
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          {/* Cart items */}
          <div className="surface">
            <div className="border-b border-slate-100 px-4 py-3">
              <h1 className="text-lg font-bold text-slate-800">My Cart ({lines.length})</h1>
            </div>
            <div className="divide-y divide-slate-100">
              <AnimatePresence>
                {lines.map(l => (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-4"
                  >
                    <Link to={`/products/${l.product.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                      <img src={l.product.images?.[0]} alt={l.product.name} className="h-full w-full object-contain" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${l.product.slug}`} className="line-clamp-1 text-sm font-medium text-slate-800 hover:text-[#2874f0]">
                        {l.product.name}
                      </Link>
                      <p className="text-xs text-slate-400">SKU: {l.product.sku}</p>
                      <p className="mt-1 text-base font-bold text-slate-900">{fmt(eff(l.product))}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded border border-slate-200">
                      <button onClick={() => update(l.id, l.quantity - 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{l.quantity}</span>
                      <button onClick={() => update(l.id, l.quantity + 1)} className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{fmt(eff(l.product) * l.quantity)}</p>
                      <button onClick={() => remove(l.id)} className="mt-1 text-xs text-[#2874f0] hover:underline">
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <button onClick={clear} className="text-sm text-slate-500 hover:text-rose-500">
                Clear cart
              </button>
              <Link to="/products" className="text-sm font-semibold text-[#2874f0] hover:underline">
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <aside className="surface h-fit p-5 lg:sticky lg:top-20">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Price Details</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row l={`Price (${lines.length} items)`} v={fmt(subtotal)} />
              <Row l="Discount" v="—" green />
              <Row l="Delivery" v={ship === 0 ? 'FREE' : fmt(ship)} green={ship === 0} />
              {ship > 0 && (
                <p className="text-xs text-slate-500">Add {fmt(999 - subtotal)} more for FREE delivery</p>
              )}
              <div className="border-t border-slate-100 pt-3" />
              <Row l="Total" v={fmt(total)} bold />
            </div>
            <button
              onClick={() => nav('/checkout')}
              className="mt-5 w-full rounded bg-[#ff9f00] py-3 text-sm font-bold text-white transition hover:bg-[#e68f00] active:scale-95"
            >
              Proceed to Checkout
            </button>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Safe & secure payments
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ l, v, bold, green }: { l: string; v: string; bold?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-bold text-slate-800' : 'text-slate-600'}>{l}</span>
      <span className={`${bold ? 'text-lg font-bold text-slate-900' : 'font-semibold'} ${green ? 'text-[#388e3c]' : ''}`}>{v}</span>
    </div>
  );
}
