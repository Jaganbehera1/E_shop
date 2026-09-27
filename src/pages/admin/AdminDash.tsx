import{useEffect,useState}from'react';import{supabase}from'../../lib/supabase';
import{fmt}from'../../lib/utils';import{Boxes,ShoppingBag,Users,FolderKanban,TrendingUp}from'lucide-react';
export function AdminDash(){
  const[stats,setStats]=useState({rev:0,orders:0,products:0,customers:0,projects:0});
  const[recent,setRecent]=useState<any[]>([]);
  useEffect(()=>{(async()=>{
    const[o,p,u,pr]=await Promise.all([supabase.from('orders').select('total,status,placed_at'),supabase.from('products').select('id'),supabase.from('profiles').select('id,role'),supabase.from('project_requests').select('id')]);
    const ol=o.data??[];
    setStats({rev:ol.reduce((s:number,x:any)=>s+Number(x.total),0),orders:ol.length,products:(p.data??[]).length,customers:(u.data??[]).filter((x:any)=>x.role==='customer').length,projects:(pr.data??[]).length});
    const r=await supabase.from('orders').select('order_number,total,status,placed_at').order('placed_at',{ascending:false}).limit(6);
    setRecent(r.data??[]);
  })()},[]);
  return<div>
    <h1 className="font-display text-2xl font-bold">Dashboard</h1>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[{I:TrendingUp,l:'Revenue',v:fmt(stats.rev),c:'bg-emerald-600'},{I:ShoppingBag,l:'Orders',v:stats.orders},{I:Boxes,l:'Products',v:stats.products},{I:Users,l:'Customers',v:stats.customers},{I:FolderKanban,l:'Projects',v:stats.projects}].map(({I,l,v,c},i)=>(
        <div key={i} className="surface flex items-center gap-3 p-4"><span className={`grid h-11 w-11 place-items-center rounded-xl text-white ${c||'bg-brand-600'}`}><I className="h-5 w-5"/></span><div><div className="text-xs text-[var(--muted)]">{l}</div><div className="font-display text-lg font-bold">{v}</div></div></div>
      ))}
    </div>
    <section className="surface mt-6 overflow-hidden">
      <div className="border-b border-[var(--border)] p-4"><h2 className="font-display font-bold">Recent orders</h2></div>
      <table className="w-full text-sm"><thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead>
        <tbody>{recent.map((o:any)=><tr key={o.order_number} className="border-t border-[var(--border)]"><td className="px-4 py-3 font-semibold">{o.order_number}</td><td className="px-4 py-3 font-bold">{fmt(o.total)}</td><td className="px-4 py-3"><span className="chip capitalize">{o.status}</span></td><td className="px-4 py-3 text-[var(--soft)]">{new Date(o.placed_at).toLocaleDateString('en-IN')}</td></tr>)}
          {recent.length===0&&<tr><td colSpan={4} className="px-4 py-6 text-center text-[var(--muted)]">No orders yet.</td></tr>}
        </tbody>
      </table>
    </section>
  </div>;
}
