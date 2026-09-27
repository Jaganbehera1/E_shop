import{useEffect,useState}from'react';import{supabase}from'../../lib/supabase';
import type{Profile}from'../../types';import{useToast}from'../../lib/toast';import{ago}from'../../lib/utils';
export function AdminCustomers(){
  const{toast}=useToast();const[items,setItems]=useState<Profile[]>([]);const[q,setQ]=useState('');
  const load=async()=>{const{data}=await supabase.from('profiles').select('*').order('created_at',{ascending:false});setItems((data??[])as Profile[])};
  useEffect(()=>{load()},[]);
  const toggleRole=async(p:Profile)=>{const role=p.role==='admin'?'customer':'admin';const{error}=await supabase.from('profiles').update({role}).eq('id',p.id);if(error)toast(error.message,'error');else{toast(`${p.email} is now ${role}`);load()}};
  const filtered=q?items.filter(p=>p.email.toLowerCase().includes(q.toLowerCase())||(p.full_name??'').toLowerCase().includes(q.toLowerCase())):items;
  return<div>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display text-2xl font-bold">Customers</h1></div><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="input max-w-xs"/></div>
    <div className="surface mt-4 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3"></th></tr></thead>
        <tbody>{filtered.map(p=><tr key={p.id} className="border-t border-[var(--border)]">
          <td className="px-4 py-3"><div className="font-semibold">{p.full_name??'—'}</div><div className="text-xs text-[var(--muted)]">{p.email}</div></td>
          <td className="px-4 py-3">{p.phone??'—'}</td>
          <td className="px-4 py-3">{p.role==='admin'?<span className="chip !bg-brand-100 !text-brand-700 dark:!bg-brand-900/40 dark:!text-brand-300">Admin</span>:<span className="chip">Customer</span>}</td>
          <td className="px-4 py-3 text-[var(--soft)]">{ago(p.created_at)}</td>
          <td className="px-4 py-3 text-right"><button onClick={()=>toggleRole(p)} className="text-brand-600 hover:underline">{p.role==='admin'?'Demote':'Promote'}</button></td>
        </tr>)}{filtered.length===0&&<tr><td colSpan={5} className="px-4 py-6 text-center text-[var(--muted)]">No customers.</td></tr>}</tbody>
      </table>
    </div>
  </div>;
}
