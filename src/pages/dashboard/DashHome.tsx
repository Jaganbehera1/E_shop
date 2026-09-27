import{useEffect,useState}from'react';import{Link}from'react-router-dom';
import{Package,Clock,Heart,LifeBuoy}from'lucide-react';
import{useAuth}from'../../lib/auth';import{supabase}from'../../lib/supabase';
import{fmt,ago}from'../../lib/utils';import type{Order,ProjectRequest}from'../../types';
export function DashHome(){
  const{user,profile}=useAuth();
  const[orders,setOrders]=useState<Order[]>([]);const[projects,setProjects]=useState<ProjectRequest[]>([]);
  const[stats,setStats]=useState({orders:0,spent:0,projects:0,tickets:0});
  useEffect(()=>{if(!user)return;(async()=>{
    const[o,p,t]=await Promise.all([
      supabase.from('orders').select('*').eq('user_id',user.id).order('placed_at',{ascending:false}).limit(5),
      supabase.from('project_requests').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(3),
      supabase.from('support_tickets').select('id').eq('user_id',user.id)
    ]);
    setOrders((o.data??[])as Order[]);setProjects((p.data??[])as ProjectRequest[]);
    const ol=(o.data??[])as Order[];
    setStats({orders:ol.length,spent:ol.reduce((s,x)=>s+Number(x.total),0),projects:(p.data??[]).length,tickets:(t.data??[]).length});
  })()},[user]);
  if(!user)return null;
  return<div>
    <h1 className="font-display text-2xl font-bold">Welcome back, {profile?.full_name||user.email?.split('@')[0]} 👋</h1>
    <p className="mt-1 text-sm text-[var(--soft)]">Here's your account snapshot.</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[{I:Package,l:'Orders',v:stats.orders},{I:Clock,l:'Total spent',v:fmt(stats.spent)},{I:Heart,l:'Projects',v:stats.projects},{I:LifeBuoy,l:'Tickets',v:stats.tickets}].map(({I,l,v},i)=>(
        <div key={i} className="surface flex items-center gap-3 p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><I className="h-5 w-5"/></span><div><div className="text-xs text-[var(--muted)]">{l}</div><div className="font-display text-lg font-bold">{v}</div></div></div>
      ))}
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="surface p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-display font-bold">Recent orders</h2><Link to="/dashboard/orders" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link></div>
        {orders.length===0?<p className="text-sm text-[var(--muted)]">No orders yet.</p>:
        <ul className="space-y-2 text-sm">{orders.map(o=><li key={o.id}><Link to={`/order/${o.order_number}`} className="flex items-center justify-between hover:text-brand-600"><span className="font-semibold">{o.order_number}</span><span className="text-[var(--soft)]">{ago(o.placed_at)}</span><span className="font-bold">{fmt(o.total)}</span><span className="chip">{o.status}</span></Link></li>)}</ul>}
      </section>
      <section className="surface p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-display font-bold">Project requests</h2><Link to="/project-solutions" className="text-sm font-semibold text-brand-600 hover:underline">New</Link></div>
        {projects.length===0?<p className="text-sm text-[var(--muted)]">No requests yet.</p>:
        <ul className="space-y-2 text-sm">{projects.map(p=><li key={p.id} className="flex items-center justify-between"><span className="font-semibold">{p.title}</span><span className="chip">{p.status}</span></li>)}</ul>}
      </section>
    </div>
  </div>;
}
