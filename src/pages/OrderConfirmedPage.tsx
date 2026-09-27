import{useEffect,useState}from'react';import{Link,useParams}from'react-router-dom';
import{CheckCircle2}from'lucide-react';import{supabase}from'../lib/supabase';
import{Seo}from'../lib/seo';import{fmt,waLink}from'../lib/utils';import type{Order}from'../types';
export function OrderConfirmedPage(){
  const{num}=useParams();const[order,setOrder]=useState<Order|null>(null);
  useEffect(()=>{(async()=>{const{data}=await supabase.from('orders').select('*,order_items(*)').eq('order_number',num).maybeSingle();setOrder(data as unknown as Order|null)})()},[num]);
  return<div className="cx py-12"><Seo title={`Order ${num}`}/>
    <div className="mx-auto max-w-2xl text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500"/>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Thank you for your order!</h1>
      <p className="mt-2 text-[var(--soft)]">Your order has been confirmed. Track it anytime from your dashboard.</p>
      <div className="surface mx-auto mt-6 max-w-md p-5 text-left text-sm">
        <div className="flex justify-between"><span className="text-[var(--soft)]">Order number</span><span className="font-bold">{num}</span></div>
        {order&&<><div className="flex justify-between mt-2"><span className="text-[var(--soft)]">Total</span><span className="font-bold">{fmt(order.total)}</span></div><div className="flex justify-between mt-2"><span className="text-[var(--soft)]">Status</span><span className="font-semibold capitalize">{order.status}</span></div></>}
      </div>
      <div className="mt-6 flex justify-center gap-3 flex-wrap">
        <Link to="/dashboard/orders" className="btn-primary">Track order</Link>
        <a href={waLink(`Hello, I placed order ${num}. Please confirm.`)} target="_blank" rel="noreferrer" className="btn-ghost">WhatsApp us</a>
        <Link to="/products" className="btn-ghost">Continue shopping</Link>
      </div>
    </div>
  </div>;
}
