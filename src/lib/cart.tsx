import{createContext,useContext,useEffect,useState,useCallback,ReactNode}from'react';
import{supabase}from'./supabase';import{useAuth}from'./auth';
import type{CartLine,Product}from'../types';import{eff}from'./utils';
interface Ctx{lines:CartLine[];loading:boolean;count:number;subtotal:number;
  add:(p:Product,q?:number)=>Promise<void>;update:(id:string,q:number)=>Promise<void>;
  remove:(id:string)=>Promise<void>;clear:()=>Promise<void>}
const C=createContext<Ctx|undefined>(undefined);
const sid=()=>{let s=localStorage.getItem('jeph-sid');if(!s){s=`g-${Math.random().toString(36).slice(2)}`;localStorage.setItem('jeph-sid',s);}return s};
export function CartProvider({children}:{children:ReactNode}){
  const{user}=useAuth();
  const[lines,setLines]=useState<CartLine[]>([]);
  const[loading,setLoading]=useState(true);
  const session=sid();
  const load=useCallback(async()=>{
    setLoading(true);
    let q=supabase.from('cart').select('*,product:products(*)');
    if(user)q=q.eq('user_id',user.id);else q=q.eq('session_id',session).is('user_id',null);
    const{data}=await q.order('created_at',{ascending:false});
    setLines((data??[])as unknown as CartLine[]);setLoading(false);
  },[user,session]);
  useEffect(()=>{load()},[load]);
  useEffect(()=>{
    if(!user)return;
    (async()=>{
      const{data:g}=await supabase.from('cart').select('id,product_id,quantity').eq('session_id',session);
      if(g?.length){
        for(const x of g){
          await supabase.from('cart').upsert({user_id:user.id,product_id:x.product_id,quantity:x.quantity,session_id:null}as any,{onConflict:'user_id,product_id'});
          await supabase.from('cart').delete().eq('id',x.id);
        }
        await load();
      }
    })();
  },[user,session,load]);
  const add=useCallback(async(product:Product,qty=1)=>{
    if(!user)return;
    const p={user_id:user.id,product_id:product.id,quantity:qty,session_id:null as string|null};
    await supabase.from('cart').upsert(p as any,{onConflict:'user_id,product_id'});
    await load();
  },[user,load]);
  const update=useCallback(async(id:string,q:number)=>{if(q<1)return;await supabase.from('cart').update({quantity:q}).eq('id',id);await load();},[load]);
  const remove=useCallback(async(id:string)=>{await supabase.from('cart').delete().eq('id',id);await load();},[load]);
  const clear=useCallback(async()=>{
    if(user)await supabase.from('cart').delete().eq('user_id',user.id);
    else await supabase.from('cart').delete().eq('session_id',session).is('user_id',null);
    setLines([]);
  },[user,session]);
  const count=lines.reduce((n,l)=>n+l.quantity,0);
  const subtotal=lines.reduce((s,l)=>s+eff(l.product)*l.quantity,0);
  return<C.Provider value={{lines,loading,count,subtotal,add,update,remove,clear}}>{children}</C.Provider>;
}
export const useCart=()=>{const c=useContext(C);if(!c)throw Error('no cart');return c};
