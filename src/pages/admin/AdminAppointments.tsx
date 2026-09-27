import{useEffect,useState}from'react';import{supabase}from'../../lib/supabase';
import type{Appointment}from'../../types';import{useToast}from'../../lib/toast';import{waLink}from'../../lib/utils';
const SS=['requested','confirmed','completed','cancelled'];
export function AdminAppointments(){
  const{toast}=useToast();const[items,setItems]=useState<Appointment[]>([]);
  const load=async()=>{const{data}=await supabase.from('appointments').select('*').order('preferred_date');setItems((data??[])as Appointment[])};
  useEffect(()=>{load()},[]);
  const setStatus=async(a:Appointment,status:string)=>{const{error}=await supabase.from('appointments').update({status}).eq('id',a.id);if(error)toast(error.message,'error');else{toast(`→ ${status}`);load()}};
  return<div>
    <h1 className="font-display text-2xl font-bold">Appointments</h1>
    <div className="mt-4 space-y-3">{items.map(a=><div key={a.id} className="surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h3 className="font-semibold">{a.topic}</h3><p className="text-xs text-[var(--muted)]">{a.name} · {a.phone}</p></div>
        <select defaultValue={a.status} onChange={e=>setStatus(a,e.target.value)} className="input !py-1 !w-auto text-xs">{SS.map(s=><option key={s} value={s}>{s}</option>)}</select>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
        <span className="chip">{a.service_type}</span><span>{a.preferred_date} · {a.preferred_time}</span>
        {a.notes&&<span>Notes: {a.notes}</span>}
        <a href={waLink(`Hi ${a.name}, about your appointment "${a.topic}"`)} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">WhatsApp</a>
      </div>
    </div>)}{items.length===0&&<p className="text-sm text-[var(--muted)]">No appointments.</p>}</div>
  </div>;
}
