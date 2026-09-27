import{useEffect,useState}from'react';import{Link,useNavigate}from'react-router-dom';
import{supabase}from'../lib/supabase';import type{Product}from'../types';import{ProductCard}from'./ProductCard';
export function RelatedProducts({product}:{product:Product}){
  const[r,setR]=useState<Product[]>([]);
  useEffect(()=>{if(!product.category_id)return;(async()=>{const{data}=await supabase.from('products').select('*').eq('category_id',product.category_id!).neq('id',product.id).eq('is_active',true).limit(4);setR((data??[])as Product[]);})();},[product]);
  if(!r.length)return null;
  return<section className="cx mt-16">
    <div className="mb-5 flex items-center justify-between">
      <h2 className="font-display text-2xl font-bold">Related products</h2>
      <Link to="/products" className="text-sm font-semibold text-brand-600 hover:underline">View all →</Link>
    </div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{r.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>
  </section>;
}
