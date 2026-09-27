import{useEffect,useState}from'react';import{Link}from'react-router-dom';
import{Calendar,User}from'lucide-react';import{motion}from'framer-motion';
import{supabase}from'../lib/supabase';import type{Blog}from'../types';
import{Seo}from'../lib/seo';import{ago}from'../lib/utils';
export function BlogListPage(){
  const[blogs,setBlogs]=useState<Blog[]>([]);const[loading,setLoading]=useState(true);const[tag,setTag]=useState('');
  useEffect(()=>{(async()=>{const{data}=await supabase.from('blogs').select('*').eq('published',true).order('published_at',{ascending:false});setBlogs((data??[])as Blog[]);setLoading(false)})()},[]);
  const tags=Array.from(new Set(blogs.flatMap(b=>b.tags??[])));
  const filtered=tag?blogs.filter(b=>(b.tags??[]).includes(tag)):blogs;
  return<div className="cx py-10">
    <Seo title="Blog & Tutorials" description="Electronics tutorials for Arduino, ESP32, Raspberry Pi plus school & college project guides." path="/blog"/>
    <h1 className="font-display text-3xl font-bold">Blog & tutorials</h1>
    <p className="mt-1 text-[var(--soft)]">Hands-on guides for makers, students and engineers.</p>
    <div className="mt-5 flex flex-wrap gap-2">
      <button onClick={()=>setTag('')} className={`chip transition ${!tag?'!bg-brand-600 !text-white':''}`}>All</button>
      {tags.map(t=><button key={t} onClick={()=>setTag(t)} className={`chip transition ${tag===t?'!bg-brand-600 !text-white':''}`}>{t}</button>)}
    </div>
    {loading?<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-72 rounded-2xl bg-[var(--surface2)] animate-pulse"/>)}</div>:
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((b,i)=>(
        <motion.article key={b.id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="card group overflow-hidden">
          <Link to={`/blog/${b.slug}`} className="block aspect-video overflow-hidden">
            {b.cover_image&&<img src={b.cover_image} alt={b.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>}
          </Link>
          <div className="p-4">
            {b.category&&<span className="chip mb-2">{b.category}</span>}
            <h2 className="font-display font-bold leading-tight"><Link to={`/blog/${b.slug}`} className="hover:text-brand-600">{b.title}</Link></h2>
            {b.excerpt&&<p className="mt-1 line-clamp-2 text-sm text-[var(--soft)]">{b.excerpt}</p>}
            <div className="mt-3 flex items-center gap-3 text-xs text-[var(--muted)]">
              {b.author&&<span className="flex items-center gap-1"><User className="h-3 w-3"/>{b.author}</span>}
              {b.published_at&&<span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{ago(b.published_at)}</span>}
            </div>
          </div>
        </motion.article>
      ))}
    </div>}
  </div>;
}
