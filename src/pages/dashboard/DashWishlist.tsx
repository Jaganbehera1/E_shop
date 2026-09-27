import{Link}from'react-router-dom';import{useEffect,useState}from'react';
import{useWishlist}from'../../lib/wishlist';import{supabase}from'../../lib/supabase';
import{ProductCard}from'../../components/ProductCard';import{Heart}from'lucide-react';import type{Product}from'../../types';
export function DashWishlist(){
  const{ids}=useWishlist();const[products,setProducts]=useState<Product[]>([]);
  useEffect(()=>{(async()=>{const l=[...ids];if(!l.length){setProducts([]);return}const{data}=await supabase.from('products').select('*').in('id',l);setProducts((data??[])as Product[])})()},[ids]);
  return<div><h1 className="font-display text-2xl font-bold">My wishlist</h1>
    {products.length===0?<div className="surface mt-4 p-10 text-center"><Heart className="mx-auto h-12 w-12 text-[var(--muted)]"/><p className="mt-3 font-semibold">Empty wishlist</p><Link to="/products" className="btn-primary mt-3">Browse</Link></div>:
    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{products.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>}
  </div>;
}
