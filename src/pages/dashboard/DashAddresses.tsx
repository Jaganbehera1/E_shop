import{useEffect,useState}from'react';import{Plus,Trash2}from'lucide-react';
import{useAuth}from'../../lib/auth';import{supabase}from'../../lib/supabase';
import{useToast}from'../../lib/toast';import type{Address}from'../../types';import{Modal}from'../../components/Modal';
export function DashAddresses(){
  const{user}=useAuth();const{toast}=useToast();
  const[addrs,setAddrs]=useState<Address[]>([]);const[open,setOpen]=useState(false);
  const[f,setF]=useState({full_name:'',phone:'',line1:'',line2:'',city:'',state:'',pincode:''});
  const load=async()=>{if(!user)return;const{data}=await supabase.from('addresses').select('*').eq('user_id',user.id).order('created_at',{ascending:false});setAddrs((data??[])as Address[])};
  useEffect(()=>{load()},[user]);
  const save=async(e:React.FormEvent)=>{e.preventDefault();if(!user)return;const{error}=await supabase.from('addresses').insert({...f,user_id:user.id});if(error){toast(error.message,'error');return}toast('Address saved');setOpen(false);setF({full_name:'',phone:'',line1:'',line2:'',city:'',state:'',pincode:''});load()};
  const del=async(id:string)=>{await supabase.from('addresses').delete().eq('id',id);toast('Removed');load()};
  return<div>
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold">Saved addresses</h1><p className="text-sm text-[var(--soft)]">Manage delivery addresses.</p></div><button onClick={()=>setOpen(true)} className="btn-primary"><Plus className="h-4 w-4"/> Add</button></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {addrs.map(a=><div key={a.id} className="surface p-4"><p className="font-semibold">{a.full_name}</p><p className="mt-1 text-sm text-[var(--soft)]">{a.line1}{a.line2?`, ${a.line2}`:''}<br/>{a.city}, {a.state} - {a.pincode}<br/>Ph: {a.phone}</p><button onClick={()=>del(a.id)} className="mt-3 inline-flex items-center gap-1 text-xs text-rose-500 hover:underline"><Trash2 className="h-3.5 w-3.5"/> Remove</button></div>)}
      {addrs.length===0&&<p className="text-sm text-[var(--muted)]">No addresses yet.</p>}
    </div>
    <Modal open={open} onClose={()=>setOpen(false)} title="Add address">
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
        {([['full_name','Full name'],['phone','Phone'],['line1','Line 1','sm:col-span-2'],['line2','Line 2 (opt)','sm:col-span-2'],['city','City'],['state','State'],['pincode','Pincode']] as [keyof typeof f,string,string?][]).map(([k,l,cls])=>(
          <div key={k} className={cls||''}><label className="label">{l}</label><input value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} className="input"/></div>
        ))}
        <button type="submit" className="btn-primary mt-2 sm:col-span-2">Save</button>
      </form>
    </Modal>
  </div>;
}
