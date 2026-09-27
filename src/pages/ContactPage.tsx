import{useState}from'react';import{Mail,Phone,MapPin,MessageCircle,Send,Clock,Building2}from'lucide-react';
import{Seo}from'../lib/seo';import{supabase,BIZ,WHATSAPP}from'../lib/supabase';
import{useToast}from'../lib/toast';import{useAuth}from'../lib/auth';import{waLink}from'../lib/utils';
export function ContactPage(){
  const{user}=useAuth();const{toast}=useToast();const[sub,setSub]=useState(false);
  const[f,setF]=useState({name:'',email:user?.email??'',phone:'',subject:'',message:''});
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setSub(true);
    const{error}=await supabase.from('support_tickets').insert({user_id:user?.id??null,subject:f.subject,message:`From: ${f.name} <${f.email}> (${f.phone})\n\n${f.message}`});
    setSub(false);if(error){toast(error.message,'error');return}
    toast('Message sent — we reply within 24 hours');
    setF({name:'',email:user?.email??'',phone:'',subject:'',message:''});
  };
  return<div className="cx py-10">
    <Seo title="Contact us" description="Reach Jagan Electronics via WhatsApp, email, phone or visit our office." path="/contact"/>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="surface p-6">
        <h1 className="font-display text-2xl font-bold">Get in touch</h1>
        <p className="mt-1 text-sm text-[var(--soft)]">Questions about products, projects or services? We reply within 24 hours.</p>
        <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <F l="Your name" v={f.name} on={v=>setF({...f,name:v})} required/><F l="Phone" v={f.phone} on={v=>setF({...f,phone:v})} required/>
          <F l="Email" type="email" v={f.email} on={v=>setF({...f,email:v})} required cls="sm:col-span-2"/>
          <F l="Subject" v={f.subject} on={v=>setF({...f,subject:v})} required cls="sm:col-span-2"/>
          <div className="sm:col-span-2"><label className="label">Message</label><textarea value={f.message} onChange={e=>setF({...f,message:e.target.value})} required rows={5} className="input"/></div>
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button type="submit" disabled={sub} className="btn-primary">{sub?'Sending…':'Send message'} <Send className="h-4 w-4"/></button>
            <a href={waLink('Hi Jagan Electronics, I have a query')} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4"/> WhatsApp</a>
          </div>
        </form>
      </div>
      <div className="space-y-4">
        <div className="surface p-6">
          <h2 className="font-display text-xl font-bold">Business information</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2"><Building2 className="mt-0.5 h-4 w-4 text-brand-600"/><span className="text-[var(--soft)]">{BIZ.name}</span></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-brand-600"/><span className="text-[var(--soft)]">{BIZ.address}</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-600"/><a href={`tel:${BIZ.phone}`} className="text-[var(--soft)] hover:text-brand-600">{BIZ.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-600"/><a href={`mailto:${BIZ.email}`} className="text-[var(--soft)] hover:text-brand-600">{BIZ.email}</a></li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-600"/><span className="text-[var(--soft)]">Mon–Sat 9:30 AM – 8 PM</span></li>
          </ul>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="btn mt-4 w-full bg-emerald-500 text-white hover:bg-emerald-600"><MessageCircle className="h-4 w-4"/> Chat on WhatsApp now</a>
        </div>
        <div className="surface overflow-hidden">
          <iframe title="Map" src={`https://maps.google.com/maps?q=${BIZ.mapsQ}&output=embed`} className="h-64 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
        </div>
      </div>
    </div>
  </div>;
}
function F({l,v,on,type='text',required,cls=''}:{l:string;v:string;on:(v:string)=>void;type?:string;required?:boolean;cls?:string}){
  return<div className={cls}><label className="label">{l}</label><input type={type} value={v} onChange={e=>on(e.target.value)} required={required} className="input"/></div>;
}
