import{useEffect,useState}from'react';import{Plus,Send}from'lucide-react';
import{useAuth}from'../../lib/auth';import{supabase}from'../../lib/supabase';
import{useToast}from'../../lib/toast';import type{SupportTicket}from'../../types';
import{ago}from'../../lib/utils';import{Modal}from'../../components/Modal';
export function DashSupport(){
  const{user}=useAuth();const{toast}=useToast();
  const[tickets,setTickets]=useState<SupportTicket[]>([]);const[open,setOpen]=useState(false);
  const[f,setF]=useState({subject:'',message:''});
  const load=async()=>{if(!user)return;const{data}=await supabase.from('support_tickets').select('*').eq('user_id',user.id).order('created_at',{ascending:false});setTickets((data??[])as SupportTicket[])};
  useEffect(()=>{load()},[user]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!user)return;const{error}=await supabase.from('support_tickets').insert({user_id:user.id,subject:f.subject,message:f.message});if(error){toast(error.message,'error');return}toast('Ticket created — we will reply soon');setOpen(false);setF({subject:'',message:''});load()};
  return<div>
    <div className="flex items-center justify-between"><div><h1 className="font-display text-2xl font-bold">Support tickets</h1><p className="text-sm text-[var(--soft)]">Need help? Raise a ticket.</p></div><button onClick={()=>setOpen(true)} className="btn-primary"><Plus className="h-4 w-4"/> New</button></div>
    <div className="mt-5 space-y-3">{tickets.map(t=><div key={t.id} className="surface p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{t.subject}</h3><span className="chip capitalize">{t.status.replace(/_/g,' ')}</span></div><p className="mt-1 text-sm text-[var(--soft)]">{t.message}</p>{t.admin_reply&&<div className="mt-3 rounded-lg bg-brand-50 p-3 text-sm dark:bg-brand-900/30"><div className="font-semibold text-brand-700 dark:text-brand-300">Support reply</div>{t.admin_reply}</div>}<p className="mt-2 text-xs text-[var(--muted)]">{ago(t.created_at)}</p></div>)}
      {tickets.length===0&&<p className="text-sm text-[var(--muted)]">No tickets yet.</p>}
    </div>
    <Modal open={open} onClose={()=>setOpen(false)} title="New ticket">
      <form onSubmit={submit} className="space-y-3">
        <div><label className="label">Subject</label><input value={f.subject} onChange={e=>setF({...f,subject:e.target.value})} required className="input"/></div>
        <div><label className="label">Message</label><textarea value={f.message} onChange={e=>setF({...f,message:e.target.value})} required rows={4} className="input"/></div>
        <button type="submit" className="btn-primary w-full"><Send className="h-4 w-4"/> Submit</button>
      </form>
    </Modal>
  </div>;
}
