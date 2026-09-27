import{useEffect,useState}from'react';import{Plus}from'lucide-react';
import{supabase}from'../../lib/supabase';import type{Category}from'../../types';
import{useToast}from'../../lib/toast';import{slug as slugify}from'../../lib/utils';import{Modal}from'../../components/Modal';
export function AdminCategories(){
  const{toast}=useToast();const[items,setItems]=useState<Category[]>([]);const[open,setOpen]=useState(false);
  const[f,setF]=useState({name:'',slug:'',description:'',icon:''});
  const load=async()=>{const{data}=await supabase.from('categories').select('*').order('sort_order');setItems((data??[])as Category[])};
  useEffect(()=>{load()},[]);
  const save=async(e:React.FormEvent)=>{e.preventDefault();const{error}=await supabase.from('categories').insert({name:f.name,slug:f.slug||slugify(f.name),description:f.description||null,icon:f.icon||null});if(error){toast(error.message,'error');return}toast('Created');setOpen(false);setF({name:'',slug:'',description:'',icon:''});load()};
  const del=async(id:string)=>{if(!confirm('Delete?'))return;const{error}=await supabase.from('categories').delete().eq('id',id);if(error)toast(error.message,'error');else{toast('Deleted');load()}};
  return<div>
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold">Categories</h1></div><button onClick={()=>setOpen(true)} className="btn-primary"><Plus className="h-4 w-4"/> New</button></div>
    <div className="surface mt-4 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3"></th></tr></thead>
        <tbody>{items.map(c=><tr key={c.id} className="border-t border-[var(--border)]"><td className="px-4 py-3 font-semibold">{c.name}</td><td className="px-4 py-3 text-[var(--muted)]">{c.slug}</td><td className="px-4 py-3 text-right"><button onClick={()=>del(c.id)} className="text-rose-500 hover:underline">Delete</button></td></tr>)}
          {items.length===0&&<tr><td colSpan={3} className="px-4 py-6 text-center text-[var(--muted)]">No categories.</td></tr>}
        </tbody>
      </table>
    </div>
    <Modal open={open} onClose={()=>setOpen(false)} title="New category">
      <form onSubmit={save} className="space-y-3">
        <div><label className="label">Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} required className="input"/></div>
        <div><label className="label">Slug (auto)</label><input value={f.slug} onChange={e=>setF({...f,slug:e.target.value})} className="input"/></div>
        <div><label className="label">Icon (lucide name)</label><input value={f.icon} onChange={e=>setF({...f,icon:e.target.value})} className="input" placeholder="cpu"/></div>
        <div><label className="label">Description</label><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} rows={2} className="input"/></div>
        <button type="submit" className="btn-primary w-full">Create</button>
      </form>
    </Modal>
  </div>;
}
