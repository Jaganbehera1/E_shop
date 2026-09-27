import{createContext,useContext,useState,useCallback,ReactNode}from'react';
interface T{id:number;type:'success'|'error'|'info';msg:string}
const Ctx=createContext<{toast:(m:string,t?:T['type'])=>void}|undefined>(undefined);
let n=0;
export function ToastProvider({children}:{children:ReactNode}){
  const[list,setList]=useState<T[]>([]);
  const toast=useCallback((msg:string,type:T['type']='success')=>{
    const id=++n;
    setList(l=>[...l,{id,type,msg}]);
    setTimeout(()=>setList(l=>l.filter(x=>x.id!==id)),2800);
  },[]);
  return<Ctx.Provider value={{toast}}>{children}
    <div className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      {list.map(t=>(
        <div key={t.id} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg ${t.type==='error'?'bg-rose-600':t.type==='info'?'bg-slate-700':'bg-brand-600'}`}>
          {t.msg}
        </div>
      ))}
    </div>
  </Ctx.Provider>;
}
export const useToast=()=>{const c=useContext(Ctx);if(!c)throw Error('no toast');return c};
