import{useEffect,useState}from'react';import{Link}from'react-router-dom';
import{Package}from'lucide-react';import{useAuth}from'../../lib/auth';
import{supabase}from'../../lib/supabase';import type{Order}from'../../types';import{fmt,ago}from'../../lib/utils';
export function DashOrders(){
  const{user}=useAuth();const[orders,setOrders]=useState<Order[]>([]);const[loading,setLoading]=useState(true);
  useEffect(()=>{if(!user)return;(async()=>{const{data}=await supabase.from('orders').select('*').eq('user_id',user.id).order('placed_at',{ascending:false});setOrders((data??[])as Order[]);setLoading(false)})()},[user]);
  return<div>
    <h1 className="font-display text-2xl font-bold">Your orders</h1>
    {loading?<div className="skeleton mt-4 h-40"/>:orders.length===0?<div className="surface mt-4 p-10 text-center"><Package className="mx-auto h-12 w-12 text-[var(--muted)]"/><p className="mt-3 font-semibold">No orders yet</p><Link to="/products" className="btn-primary mt-4">Start shopping</Link></div>:
    <div className="surface mt-4 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead>
        <tbody>{orders.map(o=><tr key={o.id} className="border-t border-[var(--border)]"><td className="px-4 py-3 font-semibold">{o.order_number}</td><td className="px-4 py-3 text-[var(--soft)]">{ago(o.placed_at)}</td><td className="px-4 py-3 font-bold">{fmt(o.total)}</td><td className="px-4 py-3"><span className="chip capitalize">{o.status.replace(/_/g,' ')}</span></td><td className="px-4 py-3"><Link to={`/order/${o.order_number}`} className="font-semibold text-brand-600 hover:underline">View</Link></td></tr>)}</tbody>
      </table>
    </div>}
  </div>;
}
