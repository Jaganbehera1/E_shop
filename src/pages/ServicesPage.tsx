import{useState}from'react';import{motion}from'framer-motion';
import{Calendar,Clock,MessageCircle,CheckCircle2,ArrowRight,Calculator,Wrench}from'lucide-react';
import{Seo}from'../lib/seo';import{supabase}from'../lib/supabase';
import{useToast}from'../lib/toast';import{useAuth}from'../lib/auth';import{waLink}from'../lib/utils';
const SVCS=[{t:'Embedded systems',I:Wrench,d:'Custom firmware on STM32/ESP32/AVR with PCB design.'},{t:'IoT development',I:Wrench,d:'Connected devices + cloud dashboard + mobile app.'},{t:'Robotics & automation',I:Wrench,d:'AGVs, arms and automated systems.'},{t:'Web application',I:Wrench,d:'React platforms with back-end and APIs.'},{t:'Android application',I:Wrench,d:'Mobile apps with hardware integration.'},{t:'Cost estimation',I:Calculator,d:'Detailed quotations and feasibility analysis.'}];
const TIMES=['09:00','10:30','12:00','14:00','15:30','17:00','18:30'];
export function ServicesPage(){
  const{user}=useAuth();const{toast}=useToast();const[sub,setSub]=useState(false);
  const[f,setF]=useState({name:'',email:user?.email??'',phone:'',topic:'',service:'Embedded systems',date:'',time:'10:30',notes:''});
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setSub(true);
    const{error}=await supabase.from('appointments').insert({user_id:user?.id??null,name:f.name||(user?.email??'Anonymous'),email:f.email,phone:f.phone,topic:f.topic,service_type:f.service,preferred_date:f.date,preferred_time:f.time,notes:f.notes||null});
    setSub(false);if(error){toast(error.message,'error');return}
    toast('Appointment requested — we will confirm shortly');
    setF({...f,topic:'',notes:''});
  };
  return<>
    <Seo title="Services — Book Consultation" description="Book a free consultation for embedded, IoT, robotics, web and Android development." path="/services"/>
    <section className="relative overflow-hidden"><div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-700 to-cyan-700"/>
      <div className="cx py-16 text-white"><motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="max-w-2xl font-display text-3xl font-extrabold sm:text-5xl">Services & consultations</motion.h1>
        <p className="mt-3 max-w-xl text-white/80">Book a free 30-minute consultation. Get clarity, feasibility analysis and cost estimates before you commit.</p>
      </div>
    </section>
    <section className="cx py-12">
      <h2 className="font-display text-2xl font-bold">What we offer</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SVCS.map(({t,I,d},i)=>(
          <motion.div key={t} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="card p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"><I className="h-6 w-6"/></span>
            <h3 className="mt-3 font-display font-bold">{t}</h3><p className="mt-1 text-sm text-[var(--soft)]">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
    <section className="cx pb-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <div className="mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-brand-600"/><h3 className="font-display text-xl font-bold">Book a consultation</h3></div>
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
            <F l="Name" v={f.name} on={v=>setF({...f,name:v})}/><F l="Phone" v={f.phone} on={v=>setF({...f,phone:v})} required/>
            <F l="Email" type="email" v={f.email} on={v=>setF({...f,email:v})} required cls="sm:col-span-2"/>
            <F l="Topic" v={f.topic} on={v=>setF({...f,topic:v})} required cls="sm:col-span-2"/>
            <div><label className="label">Service</label><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} className="input">{SVCS.map(s=><option key={s.t}>{s.t}</option>)}</select></div>
            <F l="Preferred date" type="date" v={f.date} on={v=>setF({...f,date:v})} required/>
            <div className="sm:col-span-2"><label className="label">Preferred time</label><div className="flex flex-wrap gap-2">{TIMES.map(t=><button key={t} type="button" onClick={()=>setF({...f,time:t})} className={`chip transition ${f.time===t?'!bg-brand-600 !text-white':''}`}><Clock className="h-3 w-3"/>{t}</button>)}</div></div>
            <div className="sm:col-span-2"><label className="label">Notes (optional)</label><textarea value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} rows={3} className="input"/></div>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={sub} className="btn-primary">{sub?'Booking…':'Book appointment'} <ArrowRight className="h-4 w-4"/></button>
              <a href={waLink('Hi, I want to book a consultation')} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4"/> WhatsApp</a>
            </div>
          </form>
        </div>
        <div className="surface p-6">
          <h3 className="font-display text-xl font-bold">Why book with us</h3>
          <ul className="mt-4 space-y-3">{['Free 30-min consultation call','Honest, itemized cost estimates','Free feasibility analysis','NDA-friendly engineering partner','From idea to delivery in days','Support after delivery'].map(p=><li key={p} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600"/><span className="text-[var(--soft)]">{p}</span></li>)}</ul>
          <div className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm dark:bg-brand-900/30">
            <div className="font-display font-bold text-brand-700 dark:text-brand-300">Need an instant quote?</div>
            <p className="mt-1 text-[var(--soft)]">Message us your requirements with photos or PDF — get a quote the same day.</p>
            <a href={waLink('Hi, please give me a quick quote')} target="_blank" rel="noreferrer" className="btn-primary mt-3">Get quote on WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  </>;
}
function F({l,v,on,type='text',required,cls=''}:{l:string;v:string;on:(v:string)=>void;type?:string;required?:boolean;cls?:string}){
  return<div className={cls}><label className="label">{l}</label><input type={type} value={v} onChange={e=>on(e.target.value)} required={required} className="input"/></div>;
}
