import{createContext,useContext,useEffect,useState,useCallback,ReactNode}from'react';
import type{Session,User}from'@supabase/supabase-js';
import{supabase}from'./supabase';
import type{Profile}from'../types';
interface A{session:Session|null;user:User|null;profile:Profile|null;loading:boolean;isAdmin:boolean;
  signIn:(e:string,p:string)=>Promise<{error:string|null}>;
  signUp:(e:string,p:string,n?:string,ph?:string)=>Promise<{error:string|null}>;
  signOut:()=>Promise<void>;refresh:()=>Promise<void>}
const Ctx=createContext<A|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){
  const[session,setSession]=useState<Session|null>(null);
  const[profile,setProfile]=useState<Profile|null>(null);
  const[loading,setLoading]=useState(true);
  const loadP=useCallback(async(id:string)=>{
    const{data}=await supabase.from('profiles').select('*').eq('id',id).maybeSingle();
    setProfile(data as Profile|null);
  },[]);
  const refresh=useCallback(async()=>{
    const{data}=await supabase.auth.getSession();
    setSession(data.session);
    if(data.session?.user)await loadP(data.session.user.id);else setProfile(null);
  },[loadP]);
  useEffect(()=>{
    let m=true;
    (async()=>{
      const{data}=await supabase.auth.getSession();
      if(!m)return;
      setSession(data.session);
      if(data.session?.user)await loadP(data.session.user.id);
      setLoading(false);
    })();
    const{data:sub}=supabase.auth.onAuthStateChange((_,sess)=>{
      setSession(sess);
      if(sess?.user)(async()=>await loadP(sess.user.id))();
      else setProfile(null);
    });
    return()=>{m=false;sub.subscription.unsubscribe()};
  },[loadP]);
  const signIn=useCallback(async(email:string,password:string)=>{
    const{error}=await supabase.auth.signInWithPassword({email,password});
    return{error:error?.message??null};
  },[]);
  const signUp=useCallback(async(email:string,password:string,full_name?:string,phone?:string)=>{
    const{data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name,phone}}});
    if(error)return{error:error.message};
    if(data.user)await loadP(data.user.id);
    return{error:null};
  },[loadP]);
  const signOut=useCallback(async()=>{await supabase.auth.signOut();setSession(null);setProfile(null);},[]);
  return<Ctx.Provider value={{session,user:session?.user??null,profile,loading,isAdmin:profile?.role==='admin',signIn,signUp,signOut,refresh}}>{children}</Ctx.Provider>;
}
export const useAuth=()=>{const c=useContext(Ctx);if(!c)throw new Error('no auth');return c};
