import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';
import { fmt, ago } from '../../lib/utils';
import { useToast } from '../../lib/toast';
import { Modal } from '../../components/Modal';
import { Search, Package, Truck, CheckCircle2, XCircle, Clock, MapPin, CreditCard } from 'lucide-react';

const SS = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'] as const;

const STATUS_STYLES: Record<string, { bg: string; text: string; Icon: any }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', Icon: Clock },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', Icon: Package },
  shipped: { bg: 'bg-indigo-100', text: 'text-indigo-700', Icon: Truck },
  out_for_delivery: { bg: 'bg-cyan-100', text: 'text-cyan-700', Icon: Truck },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', Icon: CheckCircle2 },
  cancelled: { bg: 'bg-rose-100', text: 'text-rose-700', Icon: XCircle },
  refunded: { bg: 'bg-slate-100', text: 'text-slate-600', Icon: XCircle },
};

export function AdminOrders() {
  const { toast } = useToast();
  const [items, setItems] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sel, setSel] = useState<Order | null>(null);
  const [track, setTrack] = useState('');

  const load = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*,order_items(*)')
      .order('placed_at', { ascending: false });
    setItems((data ?? []) as unknown as Order[]);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (o: Order, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', o.id);
    if (error) toast(error.message, 'error');
    else { toast(`Order ${o.order_number} → ${status.replace(/_/g, ' ')}`); load(); }
  };

  const saveTrack = async () => {
    if (!sel) return;
    await supabase.from('orders').update({ tracking_number: track }).eq('id', sel.id);
    toast('Tracking number saved');
    setSel(null);
    load();
  };

  const filtered = items.filter(o => {
    if (filter && o.status !== filter) return false;
    if (search && !o.order_number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCounts = SS.reduce((acc, s) => {
    acc[s] = items.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <p className="text-sm text-[var(--soft)]">Process and manage customer orders.</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === '' ? 'bg-[#2874f0] text-white' : 'bg-[var(--surface2)] text-[var(--soft)] hover:bg-slate-200'}`}
        >
          All ({items.length})
        </button>
        {SS.map(s => {
          const st = STATUS_STYLES[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? '' : s)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === s ? st.bg + ' ' + st.text : 'bg-[var(--surface2)] text-[var(--soft)] hover:bg-slate-200'}`}
            >
              <st.Icon className="h-3.5 w-3.5" />
              {s.replace(/_/g, ' ')} ({statusCounts[s] || 0})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mt-4 max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search order number…"
          className="input pl-9"
        />
      </div>

      {/* Table */}
      <div className="surface mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const st = STATUS_STYLES[o.status] ?? STATUS_STYLES.pending;
              return (
                <tr key={o.id} className="border-t border-[var(--border)] hover:bg-[var(--surface2)]/50">
                  <td className="px-4 py-3 font-bold text-[#2874f0]">{o.order_number}</td>
                  <td className="px-4 py-3 font-bold">{fmt(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs capitalize">{o.payment_method}</span>
                    <span className={`ml-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold ${o.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={e => setStatus(o, e.target.value)}
                      className={`rounded-lg border-0 px-2 py-1.5 text-xs font-semibold ${st.bg} ${st.text} cursor-pointer outline-none`}
                    >
                      {SS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[var(--soft)]">{ago(o.placed_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setSel(o); setTrack(o.tracking_number ?? ''); }} className="text-[#2874f0] hover:underline font-semibold">
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <Modal open={!!sel} onClose={() => setSel(null)} title={`Order ${sel?.order_number}`} size="lg">
        {sel && (
          <div className="space-y-4 text-sm">
            {/* Status & payment */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface p-4">
                <div className="label">Delivery Address</div>
                <p className="mt-1 font-semibold text-slate-800">{sel.shipping_address.full_name}</p>
                <p className="text-slate-500">{sel.shipping_address.phone}</p>
                <p className="mt-1 text-slate-500 flex items-start gap-1">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {sel.shipping_address.line1}{sel.shipping_address.line2 ? `, ${sel.shipping_address.line2}` : ''}, {sel.shipping_address.city}, {sel.shipping_address.state} - {sel.shipping_address.pincode}
                </p>
              </div>
              <div className="surface p-4">
                <div className="label">Payment</div>
                <p className="mt-1 flex items-center gap-1.5 font-bold text-slate-800">
                  <CreditCard className="h-4 w-4 text-[#2874f0]" /> {fmt(sel.total)}
                </p>
                <p className="text-slate-500 capitalize">{sel.payment_method} · {sel.payment_status}</p>
                {sel.coupon_code && <p className="mt-1 text-xs text-[#388e3c]">Coupon: {sel.coupon_code}</p>}
              </div>
            </div>

            {/* Items */}
            <div className="surface p-4">
              <div className="label">Items ({sel.order_items?.length ?? 0})</div>
              <ul className="mt-2 space-y-2">
                {sel.order_items?.map(it => (
                  <li key={it.id} className="flex items-center gap-3">
                    {it.image_url && <img src={it.image_url} alt="" className="h-10 w-10 rounded bg-slate-50 object-contain" />}
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{it.name}</p>
                      <p className="text-xs text-slate-400">SKU: {it.sku} · Qty: {it.quantity}</p>
                    </div>
                    <p className="font-semibold">{fmt(it.total)}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tracking */}
            <div className="surface p-4">
              <div className="label">Tracking Number</div>
              <div className="mt-2 flex gap-2">
                <input value={track} onChange={e => setTrack(e.target.value)} className="input" placeholder="Enter AWB / tracking number" />
                <button onClick={saveTrack} className="btn-primary whitespace-nowrap">Save</button>
              </div>
            </div>

            {/* Quick status */}
            <div className="flex flex-wrap gap-2">
              {['confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => {
                const st = STATUS_STYLES[s];
                return (
                  <button
                    key={s}
                    onClick={() => { setStatus(sel, s); setSel(null); }}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${st.bg} ${st.text} hover:opacity-80 transition`}
                  >
                    <st.Icon className="h-3.5 w-3.5" />
                    {s.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
