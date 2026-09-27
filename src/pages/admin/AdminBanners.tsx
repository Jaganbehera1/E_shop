import{useEffect,useState}from'react';import{Plus}from'lucide-react';
import{supabase}from'../../lib/supabase';import type{Banner}from'../../types';
import{useToast}from'../../lib/toast';import{Modal}from'../../components/Modal';
export function AdminBanners(){
  const{toast}=useToast();const[items,setItems]=useState<Banner[]>([]);const[open,setOpen]=useState(false);
  const[f,setF]=useState({title:'',image_url:'',link:'',position:'hero',sort_order:0,is_active:true});
  const load=async()=>{const{data}=await supabase.from('banners').select('*').order('sort_order');setItems((data??[])as Banner[])};
  useEffect(()=>{load()},[]);
  const save=async(e:React.FormEvent)=>{e.preventDefault();const{error}=await supabase.from('banners').insert({...f,sort_order:Number(f.sort_order)});if(error){toast(error.message,'error');return}toast('Created');setOpen(false);setF({title:'',image_url:'',link:'',position:'hero',sort_order:0,is_active:true});load()};
  const del=async(id:string)=>{if(!confirm('Delete?'))return;const{error}=await supabase.from('banners').delete().eq('id',id);if(error)toast(error.message,'error');else{toast('Deleted');load()}};
  const toggle=async(b:Banner)=>{await supabase.from('banners').update({is_active:!b.is_active}).eq('id',b.id);load()};
  return<div>
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold">Banners</h1></div><button onClick={()=>setOpen(true)} className="btn-primary"><Plus className="h-4 w-4"/> New</button></div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(b=><div key={b.id} className="surface overflow-hidden">
      {b.image_url&&<img src={b.image_url} alt={b.title} className="h-32 w-full object-cover"/>}
      <div className="p-3"><div className="flex items-center justify-between"><h3 className="font-semibold">{b.title}</h3><span className="chip capitalize">{b.position}</span></div>
        <div className="mt-2 flex gap-3 text-xs"><button onClick={()=>toggle(b)} className={b.is_active?'text-emerald-600':'text-[var(--muted)]'}>{b.is_active?'Active':'Hidden'}</button><button onClick={()=>del(b.id)} className="ml-auto text-rose-500 hover:underline">Delete</button></div>
      </div>
    </div>)}{items.length===0&&<p className="text-sm text-[var(--muted)]">No banners.</p>}</div>
    <Modal open={open} onClose={()=>setOpen(false)} title="New banner">
      <form onSubmit={save} className="space-y-3">
        <div><label className="label">Title</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} required className="input"/></div>
        <div><label className="label">Image URL</label><input value={f.image_url} onChange={e=>setF({...f,image_url:e.target.value})} required className="input"/></div>
        <div><label className="label">Link</label><input value={f.link} onChange={e=>setF({...f,link:e.target.value})} className="input" placeholder="/products"/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Position</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})} className="input"><option>hero</option><option>promo</option><option>category</option><option>footer</option></select></div>
          <div><label className="label">Order</label><input type="number" value={f.sort_order} onChange={e=>setF({...f,sort_order:Number(e.target.value)})} className="input"/></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_active} onChange={e=>setF({...f,is_active:e.target.checked})} className="accent-brand-600"/> Active</label>
        <button type="submit" className="btn-primary w-full">Create</button>
      </form>
    </Modal>
  </div>;
}
