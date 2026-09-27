import{useEffect,useState}from'react';import{Link,useParams}from'react-router-dom';
import{ArrowLeft,MessageCircle,Calendar,User}from'lucide-react';
import{Seo}from'../lib/seo';import{supabase}from'../lib/supabase';
import type{Blog}from'../types';import{ago,waLink}from'../lib/utils';
export function BlogDetailPage(){
  const{slug}=useParams();const[blog,setBlog]=useState<Blog|null>(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const{data}=await supabase.from('blogs').select('*').eq('slug',slug).eq('published',true).maybeSingle();setBlog(data as Blog|null);setLoading(false)})()},[slug]);
  if(loading)return<div className="cx py-20 text-center text-[var(--muted)]">Loading…</div>;
  if(!blog)return<div className="cx py-20 text-center">Article not found. <Link to="/blog" className="text-brand-600">Back to blog</Link></div>;
  const ld={'@context':'https://schema.org','@type':'Article',headline:blog.title,description:blog.excerpt,image:blog.cover_image,author:{'@type':'Person',name:blog.author??'Jagan Team'},datePublished:blog.published_at};
  return<article className="cx py-10">
    <Seo title={blog.meta_title??blog.title} description={blog.meta_description??blog.excerpt??undefined} path={`/blog/${blog.slug}`} image={blog.cover_image??undefined} type="article" ld={ld}/>
    <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"><ArrowLeft className="h-4 w-4"/> All articles</Link>
    <div className="mx-auto mt-4 max-w-3xl">
      <div className="flex flex-wrap gap-2">{(blog.tags??[]).map(t=><span key={t} className="chip">{t}</span>)}</div>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{blog.title}</h1>
      <div className="mt-3 flex items-center gap-4 text-sm text-[var(--muted)]">
        {blog.author&&<span className="flex items-center gap-1"><User className="h-4 w-4"/>{blog.author}</span>}
        {blog.published_at&&<span className="flex items-center gap-1"><Calendar className="h-4 w-4"/>{ago(blog.published_at)}</span>}
      </div>
      {blog.cover_image&&<img src={blog.cover_image} alt={blog.title} className="mt-6 aspect-video w-full rounded-2xl object-cover"/>}
      <div className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--soft)]">{blog.content}</div>
      <div className="mt-10 surface p-5">
        <h3 className="font-display font-bold">Need parts for this project?</h3>
        <p className="mt-1 text-sm text-[var(--soft)]">Get components shipped to your door, or let us build it for you.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link to="/products" className="btn-primary">Shop components</Link>
          <Link to="/project-solutions" className="btn-ghost">Order this project</Link>
          <a href={waLink(`I read "${blog.title}" and want help`)} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4"/> Ask on WhatsApp</a>
        </div>
      </div>
    </div>
  </article>;
}
