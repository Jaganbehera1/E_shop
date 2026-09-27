import{createContext,useContext,useEffect,useState,useCallback,ReactNode}from'react';
import{supabase}from'./supabase';import{useAuth}from'./auth';import type{Product}from'../types';
interface W{ids:Set<string>;toggle:(p:Product)=>Promise<void>;has:(id:string)=>boolean}
const C=createContext<W|undefined>(undefined);
export function WishlistProvider({children}:{children:ReactNode}){
  const{user}=useAuth();
  const[ids,setIds]=useState<Set<string>>(()=>new Set(JSON.parse(localStorage.getItem('jeph-wl')||'[]')));
  const load=useCallback(async()=>{
    if(!user)return;
    const{data}=await supabase.from('wishlist').select('product_id').eq('user_id',user.id);
    setIds(new Set((data??[]).map((d:any)=>d.product_id)));
  },[user]);
  useEffect(()=>{if(user)load();},[user,load]);
  const toggle=useCallback(async(p:Product)=>{
    if(user){
      if(ids.has(p.id))await supabase.from('wishlist').delete().eq('user_id',user.id).eq('product_id',p.id);
      else await supabase.from('wishlist').insert({user_id:user.id,product_id:p.id});
      await load();
    }else{
      const n=new Set(ids);
      if(n.has(p.id))n.delete(p.id);else n.add(p.id);
      setIds(n);localStorage.setItem('jeph-wl',JSON.stringify([...n]));
    }
  },[user,ids,load]);
  const has=useCallback((id:string)=>ids.has(id),[ids]);
  return<C.Provider value={{ids,toggle,has}}>{children}</C.Provider>;
}
export const useWishlist=()=>{const c=useContext(C);if(!c)throw Error('no wishlist');return c};
