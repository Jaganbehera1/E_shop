import{useEffect,useState}from'react';
import{Link}from'react-router-dom';
import{motion}from'framer-motion';
import{ArrowRight,Cpu,Wifi,Server,Ruler,Thermometer,Move,Fan,RotateCw,Square,Monitor,LayoutGrid,Cable,PlugZap,BatteryFull,Package,Bot,Satellite,GraduationCap,Star,MessageCircle,ShoppingCart,Sparkles,Wrench,Globe,Smartphone,FlaskConical,Truck,ShieldCheck,Clock,CheckCircle2}from'lucide-react';
import{Seo}from'../lib/seo';
import{supabase}from'../lib/supabase';
import type{Product}from'../types';
import{ProductCard}from'../components/ProductCard';
import{waLink}from'../lib/utils';

const CATS=[
  {slug:'arduino-boards',name:'Arduino',Icon:Cpu},{slug:'esp8266',name:'ESP8266',Icon:Wifi},{slug:'esp32',name:'ESP32',Icon:Wifi},
  {slug:'raspberry-pi',name:'Raspberry Pi',Icon:Server},{slug:'ultrasonic-sensors',name:'Ultrasonic',Icon:Ruler},{slug:'temperature-sensors',name:'Temp Sensors',Icon:Thermometer},
  {slug:'motion-sensors',name:'Motion',Icon:Move},{slug:'motors',name:'Motors',Icon:Fan},{slug:'servo-motors',name:'Servos',Icon:RotateCw},
  {slug:'lcd-displays',name:'LCD',Icon:Square},{slug:'oled-displays',name:'OLED',Icon:Monitor},{slug:'breadboards',name:'Breadboards',Icon:LayoutGrid},
  {slug:'jumper-wires',name:'Wires',Icon:Cable},{slug:'power-supplies',name:'Power',Icon:PlugZap},{slug:'batteries',name:'Batteries',Icon:BatteryFull},
  {slug:'electronics-kits',name:'Kits',Icon:Package},{slug:'robotics-components',name:'Robotics',Icon:Bot},{slug:'iot-components',name:'IoT',Icon:Satellite},
  {slug:'school-project-kits',name:'School Kits',Icon:GraduationCap},{slug:'college-project-kits',name:'College Kits',Icon:GraduationCap},
];
const SERVICES=[
  {Icon:Cpu,t:'Embedded Systems',d:'Custom firmware on ESP32/STM32/AVR with PCB design.'},
  {Icon:Satellite,t:'IoT Solutions',d:'End-to-end connected devices with cloud dashboards.'},
  {Icon:Bot,t:'Robotics',d:'Autonomous robots, AGVs, arms with sensor fusion & control.'},
  {Icon:Globe,t:'Web Applications',d:'Responsive React platforms, dashboards and eCommerce.'},
  {Icon:Smartphone,t:'Android Apps',d:'Cross-platform mobile apps with hardware integration.'},
  {Icon:GraduationCap,t:'School & College Projects',d:'Curated project kits with docs, code and PPT.'},
];
const TESTIMONIALS=[
  {n:'Aarthi R.',role:'B.E. ECE, Chennai',r:5,t:'Got my final-year smart home kit in 2 days. Code, PPT and wiring guide included — I scored 92/100.'},
  {n:'Mohammed Irfan',role:'Maker & freelancer',r:5,t:'Genuine ESP32 boards at the best price. WhatsApp support is instant even at 10pm.'},
  {n:'Priya Nair',role:'School teacher',r:4,t:'Ordered 30 automatic street light kits for our science fair — every single one worked.'},
  {n:'Vikram S.',role:'Startup founder',r:5,t:'Built our IoT prototype with Jagan Hub. Embedded + cloud delivered in 3 weeks.'},
];

export function HomePage(){
  const[featured,setFeatured]=useState<Product[]>([]);const[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const{data}=await supabase.from('products').select('*').eq('is_active',true).eq('is_featured',true).limit(8);setFeatured((data??[])as Product[]);setLoading(false);})()},[]);

  return<>
    <Seo ld={{'@context':'https://schema.org','@type':'Store',name:'Jagan Electronics & Project Hub'}}/>

    {/* HERO */}
    <section className="relative overflow-hidden bg-[#2874f0]">
      <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(900px_500px_at_20%_0%,#60a5fa,transparent)]"/>
      <div className="cx grid items-center gap-10 py-12 text-white md:grid-cols-2 md:py-16">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur"><Sparkles className="h-3.5 w-3.5"/> Trusted by 12,000+ engineers, students & startups</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">Electronics, IoT & Project Solutions under one roof.</h1>
          <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">Shop genuine Arduino, ESP32, Raspberry Pi and 1000+ components. Order complete school & college project kits. Get web, Android, embedded, IoT and robotics built to spec.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/products" className="btn bg-white text-brand-700 hover:bg-white/90">Shop components <ArrowRight className="h-4 w-4"/></Link>
            <Link to="/project-solutions" className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20">Explore projects</Link>
            <a href={waLink('Hi Jagan Electronics, I want a project quote')} target="_blank" rel="noreferrer" className="btn bg-emerald-500 text-white hover:bg-emerald-600"><MessageCircle className="h-4 w-4"/> WhatsApp</a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
            {[{I:Truck,l:'Free shipping ₹999+'},{I:ShieldCheck,l:'6-month warranty'},{I:Clock,l:'Same-day dispatch'},{I:CheckCircle2,l:'Genuine products'}].map(({I,l},i)=><span key={i} className="flex items-center gap-2"><I className="h-4 w-4"/>{l}</span>)}
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{duration:.7,delay:.15}} className="grid grid-cols-2 gap-4">
          {['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&w=600','https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&w=600','https://images.pexels.com/photos/2009295/pexels-photo-2009295.jpeg?auto=compress&w=600','https://images.pexels.com/photos/2207357/pexels-photo-2207357.jpeg?auto=compress&w=600'].map((src,i)=>(
            <motion.div key={i} animate={{y:[0,-8,0]}} transition={{duration:4+i,repeat:Infinity,ease:'easeInOut'}} className="overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
              <img src={src} alt="" loading="lazy" className="h-40 w-full object-cover sm:h-48"/>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* search strip */}
      <div className="cx -mt-2 pb-6">
        <form action="/products" className="surface mx-auto flex max-w-2xl items-center gap-2 p-2 shadow-xl">
          <span className="pl-2 text-[var(--muted)]">🔍</span>
          <input name="q" placeholder="Search Arduino, ESP32, sensors, project kits…" className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"/>
          <button className="btn-primary">Search</button>
        </form>
      </div>
    </section>

    {/* CATEGORIES */}
    <section className="cx py-12">
      <SH title="Shop by category" sub="20+ curated categories" link="/products" ll="All products"/>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
        {CATS.map(({slug,name,Icon},i)=>(
          <motion.div key={slug} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:Math.min(i*.025,.3)}}>
            <Link to={`/products?cat=${slug}`} className="card group flex flex-col items-center gap-2 p-3 text-center hover:border-brand-400">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/40 dark:text-brand-300"><Icon className="h-5 w-5"/></span>
              <span className="text-xs font-semibold">{name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* FEATURED */}
    <section className="cx py-12">
      <SH title="Featured products" sub="Most-loved boards, sensors and kits" link="/products" ll="View all"/>
      {loading?<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({length:8}).map((_,i)=><div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--surface2)] animate-pulse"/>)}</div>:
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">{featured.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>}
    </section>

    {/* PROJECT BANNERS */}
    <section className="cx py-12">
      <SH title="Project solutions" sub="School to industry — we build it"/>
      <div className="grid gap-4 md:grid-cols-3">
        {[{tag:'School',title:'Science fair winners',img:'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&w=800',to:'/project-solutions?type=school'},{tag:'College',title:'Final-year projects',img:'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&w=800',to:'/project-solutions?type=final_year'},{tag:'Industry',title:'Custom IoT & embedded',img:'https://images.pexels.com/photos/2207357/pexels-photo-2207357.jpeg?auto=compress&w=800',to:'/services'}].map(c=>(
          <Link key={c.tag} to={c.to} className="group relative overflow-hidden rounded-2xl">
            <img src={c.img} alt={c.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">{c.tag}</span>
              <h3 className="mt-2 font-display text-xl font-bold">{c.title}</h3>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold">Explore <ArrowRight className="h-4 w-4"/></span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* SERVICES */}
    <section className="cx py-12">
      <SH title="Services & solutions" sub="From boards to full-scale products" link="/services" ll="Book consultation"/>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({Icon,t,d},i)=>(
          <motion.div key={t} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="card p-6">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"><Icon className="h-6 w-6"/></span>
            <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
            <p className="mt-1 text-sm text-[var(--soft)]">{d}</p>
            <Link to="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">Learn more <ArrowRight className="h-4 w-4"/></Link>
          </motion.div>
        ))}
      </div>
    </section>

    {/* POPULAR SEARCHES */}
    <section className="cx py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-[var(--soft)]">Popular:</span>
        {['Arduino UNO','ESP32','DHT22','Servo motor','School kit','IoT project'].map(t=>(
          <Link key={t} to={`/products?q=${encodeURIComponent(t)}`} className="chip hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40 dark:hover:text-brand-300 cursor-pointer transition">{t}</Link>
        ))}
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="cx py-12">
      <SH title="What customers say" sub="Honest reviews from makers, students and founders"/>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map(({n,role,r,t},i)=>(
          <motion.div key={n} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="card p-5">
            <div className="flex">{Array.from({length:r}).map((_,j)=><Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400"/>)}</div>
            <p className="mt-2 text-sm text-[var(--soft)]">"{t}"</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{n[0]}</span>
              <div><div className="text-sm font-semibold">{n}</div><div className="text-xs text-[var(--muted)]">{role}</div></div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="cx py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 to-cyan-700 p-8 text-white sm:p-12">
        <Wrench className="absolute -right-8 -top-8 h-40 w-40 text-white/10"/>
        <div className="relative max-w-2xl">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">Have a project in mind? Let's build it.</h3>
          <p className="mt-2 text-white/80">Tell us your requirement — get a free cost estimate and a working prototype in days.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/services" className="btn bg-white text-brand-700 hover:bg-white/90">Book consultation</Link>
            <Link to="/project-solutions" className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20">Request a project</Link>
          </div>
        </div>
      </div>
    </section>
  </>;
}

function SH({title,sub,link,ll}:{title:string;sub?:string;link?:string;ll?:string}){
  return<div className="mb-6 flex items-end justify-between gap-4">
    <div><h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>{sub&&<p className="mt-1 text-sm text-[var(--soft)]">{sub}</p>}</div>
    {link&&ll&&<Link to={link} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:underline sm:inline-flex">{ll} <ArrowRight className="h-4 w-4"/></Link>}
  </div>;
}
