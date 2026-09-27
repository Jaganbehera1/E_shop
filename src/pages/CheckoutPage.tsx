import { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, Truck, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import { supabase, RAZORPAY_KEY } from '../lib/supabase';
import { fmt, eff } from '../lib/utils';
import { Seo } from '../lib/seo';
import type { Address } from '../types';

export function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [addrs, setAddrs] = useState<Address[]>([]);
  const [sel, setSel] = useState('');
  const [newA, setNewA] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState<{ code: string; val: number } | null>(null);
  const [placing, setPlacing] = useState(false);
  const [f, setF] = useState({ full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
      setAddrs((data ?? []) as Address[]);
    })();
  }, [user]);

  if (!user) return <Navigate to="/auth?next=/checkout" replace />;
  if (lines.length === 0)
    return (
      <div className="cx py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Cart is empty</h1>
        <Link to="/products" className="btn-primary mt-5">Shop now</Link>
      </div>
    );

  const ship = subtotal >= 999 ? 0 : 49;
  const disc = applied?.val ?? 0;
  const total = Math.max(0, subtotal - disc) + ship;

  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    const { data } = await supabase.from('coupons').select('*').eq('code', code).eq('is_active', true).maybeSingle();
    if (!data) { toast('Invalid or expired coupon', 'error'); return; }
    const val = data.discount_type === 'percent' ? Math.round((subtotal * data.discount_value) / 100) : data.discount_value;
    setApplied({ code: data.code, val });
    toast(`${data.code} applied — ${fmt(val)} off`);
  };

  const place = async () => {
    let addr: Address;
    if (newA) {
      if (!f.full_name || !f.phone || !f.line1 || !f.city || !f.state || !f.pincode) {
        toast('Please complete the address', 'error');
        return;
      }
      addr = { ...f, id: '', user_id: user?.id ?? '', is_default: false, line2: f.line2 || null } as unknown as Address;
    } else {
      addr = addrs.find(a => a.id === sel) ?? addrs[0];
    }
    if (!addr || !user) { toast('Please sign in', 'error'); nav('/auth?next=/checkout'); return; }

    setPlacing(true);
    try {
      const { data: num } = await supabase.rpc('generate_order_number');
      const { data: order, error } = await supabase.from('orders').insert({
        order_number: num,
        user_id: user.id,
        status: 'pending',
        payment_status: 'pending',
        payment_method: RAZORPAY_KEY ? 'razorpay' : 'cod',
        subtotal,
        discount: disc,
        shipping: ship,
        total,
        coupon_code: applied?.code ?? null,
        shipping_address: addr,
      }).select().single();
      if (error || !order) throw new Error(error?.message ?? 'Order creation failed');

      await supabase.from('order_items').insert(
        lines.map(l => ({
          order_id: order.id,
          product_id: l.product.id,
          name: l.product.name,
          sku: l.product.sku,
          image_url: l.product.images?.[0] ?? null,
          price: eff(l.product),
          quantity: l.quantity,
          total: eff(l.product) * l.quantity,
        }))
      );
      if (newA && user) await supabase.from('addresses').insert({ ...f, user_id: user.id });
      await clear();
      await supabase.from('orders').update({ status: 'confirmed', payment_status: 'paid' }).eq('id', order.id);
      toast('Order placed successfully!');
      nav(`/order-confirmed/${num}`);
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="cx py-6">
      <Seo title="Checkout" path="/checkout" />
      <h1 className="mb-6 text-xl font-bold text-slate-800">Checkout</h1>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {/* Address */}
          <section className="surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#2874f0]" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">Delivery Address</h3>
            </div>
            {addrs.length > 0 && (
              <div className="mb-4 flex gap-2">
                <button onClick={() => setNewA(false)} className={`rounded px-4 py-2 text-sm font-semibold ${!newA ? 'bg-[#2874f0] text-white' : 'border border-slate-200 text-slate-600'}`}>Saved</button>
                <button onClick={() => setNewA(true)} className={`rounded px-4 py-2 text-sm font-semibold ${newA ? 'bg-[#2874f0] text-white' : 'border border-slate-200 text-slate-600'}`}>New Address</button>
              </div>
            )}
            {!newA && (
              <div className="space-y-2">
                {addrs.map(a => (
                  <label key={a.id} className={`surface flex cursor-pointer items-start gap-3 p-3 ${sel === a.id ? 'ring-2 ring-[#2874f0]' : ''}`}>
                    <input type="radio" name="addr" checked={sel === a.id} onChange={() => setSel(a.id)} className="mt-1 accent-[#2874f0]" />
                    <div className="text-sm">
                      <div className="font-semibold text-slate-800">{a.full_name} · {a.phone}</div>
                      <div className="text-slate-500">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} - {a.pincode}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {newA && (
              <div className="grid gap-3 sm:grid-cols-2">
                {([['full_name', 'Full name'], ['phone', 'Phone'], ['line1', 'Address line 1', 'sm:col-span-2'], ['line2', 'Line 2 (optional)', 'sm:col-span-2'], ['city', 'City'], ['state', 'State'], ['pincode', 'Pincode']] as [keyof typeof f, string, string?][]).map(([k, l, cls]) => (
                  <div key={k} className={cls || ''}>
                    <label className="label">{l}</label>
                    <input value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} className="input" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Items */}
          <section className="surface p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">Order Items ({lines.length})</h3>
            <div className="space-y-3">
              {lines.map(l => (
                <div key={l.id} className="flex items-center gap-3">
                  <img src={l.product.images?.[0]} alt="" className="h-12 w-12 rounded-lg bg-slate-50 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-slate-800">{l.product.name}</p>
                    <p className="text-xs text-slate-400">Qty: {l.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{fmt(eff(l.product) * l.quantity)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="surface h-fit p-5 lg:sticky lg:top-20">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">Payment Details</h3>

          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="input pl-9" />
            </div>
            <button onClick={applyCoupon} className="btn-ghost">Apply</button>
          </div>
          {applied && <p className="mb-3 text-xs text-[#388e3c]">✓ {applied.code} — {fmt(applied.val)} off</p>}

          <div className="space-y-2.5 text-sm">
            <Row l="Subtotal" v={fmt(subtotal)} />
            {disc > 0 && <Row l="Discount" v={`-${fmt(disc)}`} green />}
            <Row l="Delivery" v={ship === 0 ? 'FREE' : fmt(ship)} green={ship === 0} />
            <div className="border-t border-slate-100 pt-2.5" />
            <Row l="Total" v={fmt(total)} bold />
          </div>

          <button
            onClick={place}
            disabled={placing}
            className="mt-5 w-full rounded bg-[#ff9f00] py-3 text-sm font-bold text-white transition hover:bg-[#e68f00] active:scale-95 disabled:opacity-50"
          >
            {placing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
              </span>
            ) : (
              `Place Order · ${fmt(total)}`
            )}
          </button>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" /> {RAZORPAY_KEY ? 'Secured by Razorpay' : 'Cash on Delivery available'}
          </div>
        </aside>
      </div>
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
