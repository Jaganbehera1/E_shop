import{useEffect,useState,useCallback}from'react';
import{createPortal}from'react-dom';
import{X}from'lucide-react';
import{motion,AnimatePresence}from'framer-motion';
export function Modal({open,onClose,title,children,size='md'}:{open:boolean;onClose:()=>void;title?:string;children:React.ReactNode;size?:'sm'|'md'|'lg'}){
  const[m,setM]=useState(false);
  useEffect(()=>setM(true),[]);
  const close=useCallback(onClose,[onClose]);
  useEffect(()=>{if(!open)return;const h=(e:KeyboardEvent)=>e.key==='Escape'&&close();window.addEventListener('keydown',h);document.body.style.overflow='hidden';return()=>{window.removeEventListener('keydown',h);document.body.style.overflow=''}},[open,close]);
  if(!m)return null;
  const mw=size==='sm'?'max-w-md':size==='lg'?'max-w-3xl':'max-w-xl';
  return createPortal(
    <AnimatePresence>{open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close}/>
      <motion.div initial={{scale:.95,y:20}} animate={{scale:1,y:0}} exit={{scale:.95,y:20}} transition={{type:'spring',damping:26,stiffness:320}} className={`surface relative z-10 w-full ${mw} max-h-[88vh] overflow-y-auto p-5`}>
        {title&&<div className="mb-4 flex items-center justify-between"><h3 className="font-display text-lg font-bold">{title}</h3><button onClick={close} className="text-[var(--muted)] hover:text-brand-600"><X className="h-5 w-5"/></button></div>}
        {children}
      </motion.div>
    </motion.div>}</AnimatePresence>,document.body);
}
