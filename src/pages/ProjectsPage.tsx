import{useState}from'react';import{Link,useSearchParams}from'react-router-dom';
import{motion}from'framer-motion';
import{GraduationCap,Rocket,CircuitBoard,Bot,Globe,Smartphone,FlaskConical,Cpu,MessageCircle,Send,ArrowRight}from'lucide-react';
import{Seo}from'../lib/seo';import{supabase}from'../lib/supabase';
import{useToast}from'../lib/toast';import{useAuth}from'../lib/auth';import{waLink}from'../lib/utils';

const TYPES=[
  {k:'school',t:'School Projects',I:GraduationCap,d:'Affordable science fair kits — auto street light, rain alarm and more.'},
  {k:'science',t:'Science Projects',I:FlaskConical,d:'Visual demo kits for physics, chemistry and biology.'},
  {k:'engineering',t:'Engineering Projects',I:CircuitBoard,d:'Mini & major projects on Arduino, ESP32, PIC and STM32.'},
  {k:'final_year',t:'Final Year Projects',I:Rocket,d:'Full bundle with code, report, PPT and hardware.'},
  {k:'iot',t:'IoT Projects',I:Cpu,d:'Connected devices with cloud dashboards and mobile apps.'},
  {k:'robotics',t:'Robotics Projects',I:Bot,d:'Line follower, arm, AGV and humanoid kits.'},
  {k:'web',t:'Web Applications',I:Globe,d:'Custom React platforms with back-end APIs.'},
  {k:'android',t:'Android Apps',I:Smartphone,d:'Mobile apps integrated with hardware and BLE.'},
];

export function ProjectsPage(){
  const[sp]=useSearchParams();const{user}=useAuth();const{toast}=useToast();
  const[type,setType]=useState(sp.get('type')||'custom');
  const[sub,setSub]=useState(false);
  const[f,setF]=useState({name:'',email:user?.email??'',phone:'',title:'',description:'',budget:'',requirements_url:''});

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setSub(true);
    const{error}=await supabase.from('project_requests').insert({user_id:user?.id??null,name:f.name||(user?.email??'Anonymous'),email:f.email,phone:f.phone,project_type:type,title:f.title,description:f.description,budget:f.budget?Number(f.budget):null,requirements_url:f.requirements_url||null});
    setSub(false);
    if(error){toast(error.message,'error');return}
    toast('Request submitted — we will WhatsApp you shortly!');
    setF({name:'',email:user?.email??'',phone:'',title:'',description:'',budget:'',requirements_url:''});
  };
  return<>
    <Seo title="Project Solutions" description="Order complete school & college project kits, plus custom IoT, embedded, robotics, web and Android development." path="/project-solutions"/>
    <section className="relative overflow-hidden"><div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-700 via-brand-700 to-brand-900"/>
      <div className="cx py-16 text-white"><motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="font-display text-3xl font-extrabold sm:text-5xl">Project Solutions</motion.h1>
        <p className="mt-3 max-w-xl text-white/80">From school science demos to industry IoT systems — pick a category, share your idea, get a quote in 24 hours.</p>
        <a href={waLink('Hi Jagan Electronics, I want to discuss a project')} target="_blank" rel="noreferrer" className="btn mt-5 bg-emerald-500 text-white hover:bg-emerald-600"><MessageCircle className="h-4 w-4"/> Chat on WhatsApp</a>
      </div>
    </section>
    <section className="cx py-12">
      <h2 className="font-display text-2xl font-bold">Browse by category</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TYPES.map(({k,t,I,d},i)=>(
          <motion.button key={k} onClick={()=>setType(k)} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.04}}
            className={`card p-5 text-left transition ${type===k?'border-brand-500 ring-2 ring-brand-500/30':'hover:border-brand-400'}`}>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><I className="h-6 w-6"/></span>
            <h3 className="mt-3 font-display font-bold">{t}</h3><p className="mt-1 text-xs text-[var(--soft)]">{d}</p>
          </motion.button>
        ))}
      </div>
    </section>
    <section className="cx pb-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <h3 className="font-display text-xl font-bold">Request a project</h3>
          <p className="text-sm text-[var(--soft)]">We'll estimate the cost and timeline within 24 hours.</p>
          <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
            <F l="Your name" v={f.name} on={v=>setF({...f,name:v})}/><F l="Phone" v={f.phone} on={v=>setF({...f,phone:v})} required/>
            <F l="Email" type="email" v={f.email} on={v=>setF({...f,email:v})} required cls="sm:col-span-2"/>
            <F l="Project title" v={f.title} on={v=>setF({...f,title:v})} required cls="sm:col-span-2"/>
            <div className="sm:col-span-2"><label className="label">Description</label><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} required rows={4} className="input" placeholder="What you want to build, features, deadline…"/></div>
            <F l="Budget (₹, optional)" v={f.budget} on={v=>setF({...f,budget:v})}/>
            <F l="Requirements link (optional)" v={f.requirements_url} on={v=>setF({...f,requirements_url:v})}/>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={sub} className="btn-primary">{sub?'Submitting…':'Submit request'} <Send className="h-4 w-4"/></button>
              <a href={waLink('Hi, I want to discuss a project')} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4"/> WhatsApp</a>
            </div>
          </form>
        </div>
        <div className="surface p-6">
          <h3 className="font-display text-xl font-bold">How it works</h3>
          <ol className="mt-4 space-y-4">
            {[['Submit request','Share your idea, requirements doc or a rough sketch.'],['Free consultation','Our engineers call or WhatsApp you within 24 hours.'],['Cost estimate','Itemized quote — components, dev, testing, delivery.'],['Build & deliver','Working prototype + docs + code shipped to you.']].map(([t,d],i)=>(
              <li key={i} className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{i+1}</span><div><div className="font-semibold">{t}</div><div className="text-sm text-[var(--soft)]">{d}</div></div></li>
            ))}
          </ol>
          <Link to="/services" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">Book consultation <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </div>
    </section>
  </>;
}
function F({l,v,on,type='text',required,cls=''}:{l:string;v:string;on:(v:string)=>void;type?:string;required?:boolean;cls?:string}){
  return<div className={cls}><label className="label">{l}</label><input type={type} value={v} onChange={e=>on(e.target.value)} required={required} className="input"/></div>;
}
