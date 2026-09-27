import{useEffect,useState}from'react';import{Link,useParams}from'react-router-dom';
import{Truck,Package,CheckCircle2,Clock,MapPin}from'lucide-react';
import{supabase}from'../lib/supabase';import{Seo}from'../lib/seo';
import type{Order}from'../types';import{fmt,ago,waLink}from'../lib/utils';
const STEPS=['pending','confirmed','shipped','out_for_delivery','delivered'];
const LABELS:Record<string,string>={'pending':'Pending','confirmed':'Confirmed','shipped':'Shipped','out_for_delivery':'Out for delivery','delivered':'Delivered','cancelled':'Cancelled','refunded':'Refunded'};
export function OrderDetailPage(){
  const{num}=useParams();const[order,setOrder]=useState<Order|null>(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const{data}=await supabase.from('orders').select('*,order_items(*)').eq('order_number',num).maybeSingle();setOrder(data as unknown as Order|null);setLoading(false)})()},[num]);
  if(loading)return<div className="cx py-20 text-center text-[var(--muted)]">Loading…</div>;
  if(!order)return<div className="cx py-20 text-center">Order not found.</div>;
  const si=Math.max(0,STEPS.indexOf(order.status));
  return<div className="cx py-8">
    <Seo title={`Order ${order.order_number}`}/>
    <Link to="/dashboard/orders" className="text-sm font-semibold text-brand-600 hover:underline">← Back to orders</Link>
    <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="font-display text-2xl font-bold">Order {order.order_number}</h1><p className="text-sm text-[var(--muted)]">Placed {ago(order.placed_at)}</p></div>
      <span className="chip capitalize">{LABELS[order.status]||order.status}</span>
    </div>
    {!['cancelled','refunded'].includes(order.status)&&<div className="surface mt-6 p-5">
      <h3 className="mb-4 font-display font-bold">Tracking</h3>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {STEPS.map((s,i)=>{
          const done=i<=si;const Icon=s==='shipped'?Truck:s==='delivered'?CheckCircle2:s==='out_for_delivery'?Package:Clock;
          return<div key={s} className="flex flex-1 items-center gap-2">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${done?'bg-brand-600 text-white':'bg-[var(--surface2)] text-[var(--muted)]'}`}><Icon className="h-4 w-4"/></span>
            <span className={`text-sm ${done?'font-semibold':'text-[var(--muted)]'}`}>{LABELS[s]}</span>
            {i<STEPS.length-1&&<div className={`hidden h-px flex-1 sm:block ${i<si?'bg-brand-600':'bg-[var(--border)]'}`}/>}
          </div>
        })}
      </div>
      {order.tracking_number&&<p className="mt-4 text-sm text-[var(--soft)]">Tracking #: <span className="font-semibold">{order.tracking_number}</span></p>}
    </div>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="surface p-5">
        <h3 className="font-display font-bold">Items</h3>
        <div className="mt-3 space-y-3">{order.order_items?.map(it=><div key={it.id} className="flex items-center gap-3 border-b border-[var(--border)] pb-3 last:border-0">
          <div className="h-14 w-14 overflow-hidden rounded-lg bg-[var(--surface2)]">{it.image_url&&<img src={it.image_url} alt={it.name} className="h-full w-full object-cover"/>}</div>
          <div className="min-w-0 flex-1"><p className="line-clamp-1 text-sm font-semibold">{it.name}</p><p className="text-xs text-[var(--muted)]">×{it.quantity} · {fmt(it.price)}</p></div>
          <p className="font-semibold">{fmt(it.total)}</p>
        </div>)}</div>
      </section>
      <aside className="space-y-4">
        <div className="surface p-5">
          <div className="mb-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600"/><h3 className="font-display font-bold">Delivery</h3></div>
          {order.shipping_address&&<p className="text-sm text-[var(--soft)]">{order.shipping_address.full_name}<br/>{order.shipping_address.line1}{order.shipping_address.line2?`, ${order.shipping_address.line2}`:''}<br/>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br/>Ph: {order.shipping_address.phone}</p>}
        </div>
        <div className="surface p-5">
          <h3 className="font-display font-bold">Summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <R l="Subtotal" v={fmt(order.subtotal)}/>{order.discount>0&&<R l="Discount" v={`-${fmt(order.discount)}`}/>}
            <R l="Shipping" v={order.shipping===0?'Free':fmt(order.shipping)}/><div className="my-2 h-px bg-[var(--border)]"/><R l="Total" v={fmt(order.total)} bold/>
            <R l="Payment" v={order.payment_status}/>
          </div>
          <a href={waLink(`Hi, query on order ${order.order_number}`)} target="_blank" rel="noreferrer" className="btn-ghost mt-4 w-full">Need help? WhatsApp</a>
        </div>
      </aside>
    </div>
  </div>;
}
function R({l,v,bold}:{l:string;v:string;bold?:boolean}){
  return<div className="flex items-center justify-between"><span className={bold?'font-display font-bold':'text-[var(--soft)]'}>{l}</span><span className={bold?'text-base font-extrabold text-brand-600 dark:text-brand-400':'font-semibold capitalize'}>{v}</span></div>;
}
