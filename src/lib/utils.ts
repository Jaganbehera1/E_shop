export const fmt=(v:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v);
export const pct=(p:number,d?:number|null)=>(!d||d<=0||d>=p)?0:Math.round(((p-d)/p)*100);
export const waLink=(msg:string)=>`https://wa.me/+917978966065?text=${encodeURIComponent(msg)}`;
export const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
export const ago=(iso:string)=>{
  const d=(Date.now()-new Date(iso).getTime())/1000;
  if(d<60)return'just now';if(d<3600)return`${Math.floor(d/60)}m ago`;
  if(d<86400)return`${Math.floor(d/3600)}h ago`;if(d<604800)return`${Math.floor(d/86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
};
export const eff=(p:{price:number;discount_price:number|null})=>p.discount_price&&p.discount_price>0?p.discount_price:p.price;
export const cx=(...xs:(string|false|null|undefined)[])=>xs.filter(Boolean).join(' ');
