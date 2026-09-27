import{useEffect,useState}from'react';import{Link}from'react-router-dom';import{Plus}from'lucide-react';
import{useAuth}from'../../lib/auth';import{supabase}from'../../lib/supabase';
import type{ProjectRequest}from'../../types';import{ago,fmt}from'../../lib/utils';
export function DashProjects(){
  const{user}=useAuth();const[items,setItems]=useState<ProjectRequest[]>([]);
  useEffect(()=>{if(!user)return;(async()=>{const{data}=await supabase.from('project_requests').select('*').eq('user_id',user.id).order('created_at',{ascending:false});setItems((data??[])as ProjectRequest[])})()},[user]);
  return<div><div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold">Project requests</h1><p className="text-sm text-[var(--soft)]">Track your custom project orders.</p></div><Link to="/project-solutions" className="btn-primary"><Plus className="h-4 w-4"/> New</Link></div>
    <div className="mt-5 space-y-3">{items.map(p=><div key={p.id} className="surface p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{p.title}</h3><span className="chip capitalize">{p.status.replace(/_/g,' ')}</span></div><p className="mt-1 line-clamp-2 text-sm text-[var(--soft)]">{p.description}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]"><span>Type: <b className="capitalize">{p.project_type.replace(/_/g,' ')}</b></span><span>· {ago(p.created_at)}</span>{p.estimated_cost&&<span>· Estimate: <b>{fmt(p.estimated_cost)}</b></span>}</div></div>)}
      {items.length===0&&<p className="text-sm text-[var(--muted)]">No requests yet.</p>}
    </div>
  </div>;
}
