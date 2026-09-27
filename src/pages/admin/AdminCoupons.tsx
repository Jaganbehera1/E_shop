import{useEffect,useState}from'react';import{Plus}from'lucide-react';
import{supabase}from'../../lib/supabase';import type{Coupon}from'../../types';
import{useToast}from'../../lib/toast';import{Modal}from'../../components/Modal';
export function AdminCoupons(){
  const{toast}=useToast();const[items,setItems]=useState<Coupon[]>([]);const[open,setOpen]=useState(false);
  const[f,setF]=useState({code:'',description:'',discount_type:'percent',discount_value:10,min_order:0,is_active:true});
  const load=async()=>{const{data}=await supabase.from('coupons').select('*').order('created_at',{ascending:false});setItems((data??[])as Coupon[])};
  useEffect(()=>{load()},[]);
  const save=async(e:React.FormEvent)=>{e.preventDefault();const{error}=await supabase.from('coupons').insert({...f,code:f.code.toUpperCase()});if(error){toast(error.message,'error');return}toast('Created');setOpen(false);setF({code:'',description:'',discount_type:'percent',discount_value:10,min_order:0,is_active:true});load()};
  const del=async(id:string)=>{if(!confirm('Delete?'))return;const{error}=await supabase.from('coupons').delete().eq('id',id);if(error)toast(error.message,'error');else{toast('Deleted');load()}};
  return<div>
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold">Coupons</h1></div><button onClick={()=>setOpen(true)} className="btn-primary"><Plus className="h-4 w-4"/> New</button></div>
    <div className="surface mt-4 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]"><tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Used</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead>
        <tbody>{items.map(c=><tr key={c.id} className="border-t border-[var(--border)]">
          <td className="px-4 py-3 font-bold">{c.code}</td><td className="px-4 py-3 capitalize">{c.discount_type}</td>
          <td className="px-4 py-3">{c.discount_type==='percent'?`${c.discount_value}%`:`₹${c.discount_value}`}</td>
          <td className="px-4 py-3">{c.used_count}</td>
          <td className="px-4 py-3">{c.is_active?<span className="chip !bg-emerald-50 !text-emerald-700 dark:!bg-emerald-900/30 dark:!text-emerald-400">Active</span>:<span className="chip">Off</span>}</td>
          <td className="px-4 py-3 text-right"><button onClick={()=>del(c.id)} className="text-rose-500 hover:underline">Delete</button></td>
        </tr>)}{items.length===0&&<tr><td colSpan={6} className="px-4 py-6 text-center text-[var(--muted)]">No coupons.</td></tr>}</tbody>
      </table>
    </div>
    <Modal open={open} onClose={()=>setOpen(false)} title="New coupon">
      <form onSubmit={save} className="space-y-3">
        <div><label className="label">Code</label><input value={f.code} onChange={e=>setF({...f,code:e.target.value})} required className="input"/></div>
        <div><label className="label">Description</label><input value={f.description} onChange={e=>setF({...f,description:e.target.value})} className="input"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Type</label><select value={f.discount_type} onChange={e=>setF({...f,discount_type:e.target.value})} className="input"><option value="percent">Percent</option><option value="flat">Flat</option></select></div>
          <div><label className="label">Value</label><input type="number" value={f.discount_value} onChange={e=>setF({...f,discount_value:Number(e.target.value)})} className="input"/></div>
        </div>
        <div><label className="label">Min order (₹)</label><input type="number" value={f.min_order} onChange={e=>setF({...f,min_order:Number(e.target.value)})} className="input"/></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_active} onChange={e=>setF({...f,is_active:e.target.checked})} className="accent-brand-600"/> Active</label>
        <button type="submit" className="btn-primary w-full">Create</button>
      </form>
    </Modal>
  </div>;
}
