import{useEffect,useState}from'react';import{Plus}from'lucide-react';
import{supabase}from'../../lib/supabase';import type{Blog}from'../../types';
import{useToast}from'../../lib/toast';import{slug as slugify,ago}from'../../lib/utils';import{Modal}from'../../components/Modal';
const E={title:'',slug:'',excerpt:'',content:'',cover_image:'',tags:'',category:'',author:'Jagan Team',meta_title:'',meta_description:'',published:false};
export function AdminBlogs(){
  const{toast}=useToast();const[items,setItems]=useState<Blog[]>([]);const[open,setOpen]=useState(false);
  const[editing,setEditing]=useState<Blog|null>(null);const[f,setF]=useState(E);
  const load=async()=>{const{data}=await supabase.from('blogs').select('*').order('created_at',{ascending:false});setItems((data??[])as Blog[])};
  useEffect(()=>{load()},[]);
  const startCreate=()=>{setEditing(null);setF(E);setOpen(true)};
  const startEdit=(b:Blog)=>{setEditing(b);setF({...E,title:b.title,slug:b.slug,excerpt:b.excerpt??'',content:b.content,cover_image:b.cover_image??'',tags:(b.tags??[]).join(', '),category:b.category??'',author:b.author??'Jagan Team',meta_title:b.meta_title??'',meta_description:b.meta_description??'',published:b.published});setOpen(true)};
  const save=async(e:React.FormEvent)=>{
    e.preventDefault();
    const payload={title:f.title,slug:f.slug||slugify(f.title),excerpt:f.excerpt||null,content:f.content,cover_image:f.cover_image||null,tags:f.tags.split(',').map(t=>t.trim()).filter(Boolean),category:f.category||null,author:f.author,meta_title:f.meta_title||null,meta_description:f.meta_description||null,published:f.published,published_at:f.published?new Date().toISOString():null};
    const{error}=editing?await supabase.from('blogs').update(payload).eq('id',editing.id):await supabase.from('blogs').insert(payload);
    if(error){toast(error.message,'error');return}toast(editing?'Updated':'Created');setOpen(false);load();
  };
  const del=async(id:string)=>{if(!confirm('Delete?'))return;const{error}=await supabase.from('blogs').delete().eq('id',id);if(error)toast(error.message,'error');else{toast('Deleted');load()}};
  return<div>
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold">Blog posts</h1></div><button onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4"/> New</button></div>
    <div className="surface mt-4 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3"></th></tr></thead>
        <tbody>{items.map(b=><tr key={b.id} className="border-t border-[var(--border)]">
          <td className="px-4 py-3 font-semibold">{b.title}</td>
          <td className="px-4 py-3">{b.published?<span className="chip !bg-emerald-50 !text-emerald-700 dark:!bg-emerald-900/30 dark:!text-emerald-400">Published</span>:<span className="chip">Draft</span>}</td>
          <td className="px-4 py-3 text-[var(--soft)]">{ago(b.created_at)}</td>
          <td className="px-4 py-3 text-right"><button onClick={()=>startEdit(b)} className="mr-2 text-brand-600 hover:underline">Edit</button><button onClick={()=>del(b.id)} className="text-rose-500 hover:underline">Delete</button></td>
        </tr>)}{items.length===0&&<tr><td colSpan={4} className="px-4 py-6 text-center text-[var(--muted)]">No posts.</td></tr>}</tbody>
      </table>
    </div>
    <Modal open={open} onClose={()=>setOpen(false)} title={editing?'Edit post':'New post'} size="lg">
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Title</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} required className="input"/></div>
        <div><label className="label">Slug (auto)</label><input value={f.slug} onChange={e=>setF({...f,slug:e.target.value})} className="input"/></div>
        <div><label className="label">Category</label><input value={f.category} onChange={e=>setF({...f,category:e.target.value})} className="input"/></div>
        <div className="sm:col-span-2"><label className="label">Cover image URL</label><input value={f.cover_image} onChange={e=>setF({...f,cover_image:e.target.value})} className="input"/></div>
        <div className="sm:col-span-2"><label className="label">Excerpt</label><input value={f.excerpt} onChange={e=>setF({...f,excerpt:e.target.value})} className="input"/></div>
        <div className="sm:col-span-2"><label className="label">Content</label><textarea rows={6} value={f.content} onChange={e=>setF({...f,content:e.target.value})} required className="input"/></div>
        <div className="sm:col-span-2"><label className="label">Tags (comma-sep)</label><input value={f.tags} onChange={e=>setF({...f,tags:e.target.value})} className="input"/></div>
        <div><label className="label">Author</label><input value={f.author} onChange={e=>setF({...f,author:e.target.value})} className="input"/></div>
        <div><label className="label">Meta title</label><input value={f.meta_title} onChange={e=>setF({...f,meta_title:e.target.value})} className="input"/></div>
        <div className="sm:col-span-2"><label className="label">Meta description</label><input value={f.meta_description} onChange={e=>setF({...f,meta_description:e.target.value})} className="input"/></div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={f.published} onChange={e=>setF({...f,published:e.target.checked})} className="accent-brand-600"/> Publish now</label>
        <div className="flex gap-2 sm:col-span-2"><button type="submit" className="btn-primary">{editing?'Save':'Create'}</button><button type="button" onClick={()=>setOpen(false)} className="btn-ghost">Cancel</button></div>
      </form>
    </Modal>
  </div>;
}
