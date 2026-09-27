import{useEffect,useState}from'react';import{supabase}from'../../lib/supabase';
import type{ProjectRequest}from'../../types';import{ago,fmt,waLink}from'../../lib/utils';
import{useToast}from'../../lib/toast';import{Modal}from'../../components/Modal';import{MessageCircle}from'lucide-react';
const SS=['new','reviewing','quoted','in_progress','completed','rejected'];
export function AdminProjects(){
  const{toast}=useToast();const[items,setItems]=useState<ProjectRequest[]>([]);
  const[sel,setSel]=useState<ProjectRequest|null>(null);const[est,setEst]=useState('');
  const load=async()=>{const{data}=await supabase.from('project_requests').select('*').order('created_at',{ascending:false});setItems((data??[])as ProjectRequest[])};
  useEffect(()=>{load()},[]);
  const setStatus=async(p:ProjectRequest,status:string)=>{const{error}=await supabase.from('project_requests').update({status}).eq('id',p.id);if(error)toast(error.message,'error');else{toast(`→ ${status}`);load()}};
  const sendWA=(p:ProjectRequest)=>{window.open(waLink(`Hello ${p.name}, regarding your project "${p.title}" at Jagan Electronics.`),'_blank');supabase.from('project_requests').update({whatsapp_sent:true}).eq('id',p.id);load()};
  const saveEst=async()=>{if(!sel)return;const{error}=await supabase.from('project_requests').update({estimated_cost:Number(est),status:'quoted'}).eq('id',sel.id);if(error)toast(error.message,'error');else{toast('Estimate saved');setSel(null);load()}};
  return<div>
    <h1 className="font-display text-2xl font-bold">Project requests</h1>
    <div className="mt-4 space-y-3">{items.map(p=><div key={p.id} className="surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="font-semibold">{p.title}</h3><p className="text-xs text-[var(--muted)]">{p.name} · {p.phone} · {ago(p.created_at)}</p></div>
        <div className="flex items-center gap-2">
          <select defaultValue={p.status} onChange={e=>setStatus(p,e.target.value)} className="input !py-1 !w-auto text-xs">{SS.map(s=><option key={s} value={s}>{s}</option>)}</select>
          <button onClick={()=>sendWA(p)} className="btn-ghost !py-1 !text-xs"><MessageCircle className="h-3.5 w-3.5"/> WA</button>
          <button onClick={()=>{setSel(p);setEst(p.estimated_cost?.toString()??'')}} className="btn-primary !py-1 !text-xs">Estimate</button>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-[var(--soft)]">{p.description}</p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
        <span className="chip capitalize">{p.project_type.replace(/_/g,' ')}</span>
        {p.budget&&<span>Budget: {fmt(p.budget)}</span>}{p.estimated_cost&&<span>Estimate: <b>{fmt(p.estimated_cost)}</b></span>}
        {p.requirements_url&&<a href={p.requirements_url} target="_blank" rel="noreferrer" className="text-brand-600">Req ↗</a>}
        {p.whatsapp_sent&&<span className="text-emerald-600">WA sent</span>}
      </div>
    </div>)}{items.length===0&&<p className="text-sm text-[var(--muted)]">No requests.</p>}</div>
    <Modal open={!!sel} onClose={()=>setSel(null)} title="Cost estimate">
      {sel&&<div className="space-y-3"><p className="text-sm text-[var(--soft)]"><b>{sel.title}</b></p><div><label className="label">Estimated cost (₹)</label><input type="number" value={est} onChange={e=>setEst(e.target.value)} className="input"/></div><button onClick={saveEst} className="btn-primary w-full">Save & set status → quoted</button></div>}
    </Modal>
  </div>;
}
