import{createContext,useContext,useEffect,useState,ReactNode}from'react';
type T='light'|'dark';
const Ctx=createContext<{theme:T;toggle:()=>void}|undefined>(undefined);
export function ThemeProvider({children}:{children:ReactNode}){
  const[theme,setTheme]=useState<T>(()=>(localStorage.getItem('jeph-theme')||( window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))as T);
  useEffect(()=>{document.documentElement.classList.toggle('dark',theme==='dark');localStorage.setItem('jeph-theme',theme);},[theme]);
  return<Ctx.Provider value={{theme,toggle:()=>setTheme(t=>t==='dark'?'light':'dark')}}>{children}</Ctx.Provider>;
}
export const useTheme=()=>{const c=useContext(Ctx);if(!c)throw Error('no theme');return c};
