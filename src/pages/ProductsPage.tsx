import{useEffect,useMemo,useState}from'react';
import{useSearchParams}from'react-router-dom';
import{motion}from'framer-motion';
import{Filter,X}from'lucide-react';
import{supabase}from'../lib/supabase';
import type{Product,Category}from'../types';
import{ProductCard}from'../components/ProductCard';
import{Seo}from'../lib/seo';
import{fmt}from'../lib/utils';

const SORTS=[{k:'popular',l:'Popularity'},{k:'price_asc',l:'Price: Low→High'},{k:'price_desc',l:'Price: High→Low'},{k:'newest',l:'Newest'},{k:'rating',l:'Top rated'}];

export function ProductsPage(){
  const[params,setParams]=useSearchParams();
  const q=params.get('q')||'';const cat=params.get('cat')||'';
  const[products,setProducts]=useState<Product[]>([]);const[cats,setCats]=useState<Category[]>([]);
  const[loading,setLoading]=useState(true);const[sort,setSort]=useState('popular');
  const[maxP,setMaxP]=useState(10000);const[price,setPrice]=useState(10000);
  const[showF,setShowF]=useState(false);

  useEffect(()=>{(async()=>{
    const[p,c]=await Promise.all([supabase.from('products').select('*').eq('is_active',true),supabase.from('categories').select('*').eq('is_active',true).order('sort_order')]);
    setProducts((p.data??[])as Product[]);setCats((c.data??[])as Category[]);
    const m=Math.max(100,...((p.data??[]).map((x:any)=>x.price)));const mp=Math.ceil(m/100)*100;
    setMaxP(mp);setPrice(mp);setLoading(false);
  })()},[]);

  const filtered=useMemo(()=>{
    let list=[...products];
    if(q){const ql=q.toLowerCase();list=list.filter(p=>p.name.toLowerCase().includes(ql)||p.sku.toLowerCase().includes(ql)||(p.short_description??'').toLowerCase().includes(ql));}
    if(cat){const id=cats.find(c=>c.slug===cat)?.id;if(id)list=list.filter(p=>p.category_id===id);}
    list=list.filter(p=>p.price<=price);
    switch(sort){
      case'price_asc':list.sort((a,b)=>a.price-b.price);break;
      case'price_desc':list.sort((a,b)=>b.price-a.price);break;
      case'rating':list.sort((a,b)=>b.rating_avg-a.rating_avg);break;
      case'newest':list.sort((a,b)=>+new Date(b.created_at)-+new Date(a.created_at));break;
      default:list.sort((a,b)=>b.rating_count-a.rating_count);
    }
    return list;
  },[products,q,cat,sort,price,cats]);

  const activeCat=cats.find(c=>c.slug===cat);

  return<div className="cx py-8">
    <Seo title={activeCat?activeCat.name:q?`Search: "${q}"` :'All Products'} description="Shop electronics components, sensors, motors, displays, project kits and more." path="/products"/>
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{activeCat?activeCat.name:q?`Results for "${q}"` :'All Products'}</h1>
      <p className="text-sm text-[var(--soft)]">{filtered.length} product{filtered.length!==1?'s':''} found</p>
    </div>
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className={`${showF?'block':'hidden'} lg:block`}>
        <div className="surface sticky top-24 p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Filters</h3><button className="lg:hidden" onClick={()=>setShowF(false)}><X className="h-5 w-5"/></button></div>
          <div className="mb-5">
            <h4 className="label">Category</h4>
            <div className="flex flex-col gap-1.5">
              <button onClick={()=>{const n=new URLSearchParams(params);n.delete('cat');setParams(n)}} className={`text-left text-sm ${!cat?'font-semibold text-brand-600':'text-[var(--soft)] hover:text-brand-600'}`}>All categories</button>
              {cats.map(c=><button key={c.id} onClick={()=>{const n=new URLSearchParams(params);n.set('cat',c.slug);setParams(n)}} className={`text-left text-sm ${cat===c.slug?'font-semibold text-brand-600':'text-[var(--soft)] hover:text-brand-600'}`}>{c.name}</button>)}
            </div>
          </div>
          <div>
            <h4 className="label">Max price: {fmt(price)}</h4>
            <input type="range" min={100} max={maxP} step={100} value={price} onChange={e=>setPrice(Number(e.target.value))} className="w-full accent-brand-600"/>
          </div>
        </div>
      </aside>
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <button className="btn-ghost lg:hidden" onClick={()=>setShowF(true)}><Filter className="h-4 w-4"/> Filters</button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-[var(--soft)]">Sort:</span>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="input !w-auto !py-1.5">{SORTS.map(s=><option key={s.k} value={s.k}>{s.l}</option>)}</select>
          </div>
        </div>
        {loading?<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{Array.from({length:9}).map((_,i)=><div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--surface2)] animate-pulse"/>)}</div>:
         filtered.length===0?<div className="surface p-12 text-center"><p className="font-semibold">No products found</p><p className="mt-1 text-sm text-[var(--soft)]">Try a different keyword or remove filters.</p></div>:
         <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">{filtered.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</motion.div>}
      </div>
    </div>
  </div>;
}
