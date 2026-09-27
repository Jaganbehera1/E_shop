import{Link}from'react-router-dom';import{Heart,ArrowRight}from'lucide-react';
import{useWishlist}from'../lib/wishlist';import{useAuth}from'../lib/auth';
import{supabase}from'../lib/supabase';import{useEffect,useState}from'react';
import{ProductCard}from'../components/ProductCard';import{Seo}from'../lib/seo';import type{Product}from'../types';
export function WishlistPage(){
  const{ids}=useWishlist();const{user}=useAuth();const[products,setProducts]=useState<Product[]>([]);const[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const idList=[...ids];if(!idList.length){setProducts([]);setLoading(false);return}const{data}=await supabase.from('products').select('*').in('id',idList).eq('is_active',true);setProducts((data??[])as Product[]);setLoading(false);})()},[ids]);
  return<div className="cx py-8">
    <Seo title="Wishlist" path="/wishlist"/>
    <div className="mb-6 flex items-end justify-between"><div><h1 className="font-display text-2xl font-bold">My Wishlist</h1><p className="text-sm text-[var(--soft)]">{products.length} saved item{products.length!==1?'s':''}</p></div><Link to="/products" className="btn-ghost">Browse more <ArrowRight className="h-4 w-4"/></Link></div>
    {loading?<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({length:4}).map((_,i)=><div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--surface2)] animate-pulse"/>)}</div>:
     products.length===0?<div className="surface p-12 text-center"><Heart className="mx-auto h-12 w-12 text-[var(--muted)]"/><h3 className="mt-3 font-display text-xl font-bold">No saved items</h3><p className="mt-1 text-sm text-[var(--soft)]">Tap the heart on any product to save it.</p><Link to="/products" className="btn-primary mt-5">Discover products</Link></div>:
     <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{products.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>}
  </div>;
}
