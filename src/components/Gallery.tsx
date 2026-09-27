import{useEffect,useState}from'react';
import{motion}from'framer-motion';
export function Gallery({images,alt}:{images:string[];alt:string}){
  const[a,setA]=useState(0);
  useEffect(()=>setA(0),[images]);
  const list=images?.length?images:['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&w=800'];
  return<div className="flex flex-col gap-3">
    <motion.div key={a} initial={{opacity:.5,scale:.98}} animate={{opacity:1,scale:1}} transition={{duration:.2}} className="aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface2)]">
      <img src={list[a]} alt={alt} className="h-full w-full object-cover"/>
    </motion.div>
    {list.length>1&&<div className="grid grid-cols-4 gap-2">
      {list.map((img,i)=><button key={i} onClick={()=>setA(i)} className={`aspect-square overflow-hidden rounded-lg border-2 transition ${i===a?'border-brand-500':'border-transparent hover:border-brand-300'}`}>
        <img src={img} alt="" loading="lazy" className="h-full w-full object-cover"/>
      </button>)}
    </div>}
  </div>;
}
