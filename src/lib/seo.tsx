import{Helmet}from'react-helmet-async';
export function Seo({title,description,path,image,type='website',ld}:{title?:string;description?:string;path?:string;image?:string;type?:string;ld?:object}){
  const t=title?`${title} | Jagan Electronics & Project Hub`:'Jagan Electronics & Project Hub';
  const d=description||'Electronics components, Arduino, ESP32, Raspberry Pi, IoT, Robotics, School & College Project Kits.';
  const img=image||'https://images.pexels.com/photos/2168055/pexels-photo-2168055.jpeg?auto=compress&w=1200';
  return<Helmet>
    <title>{t}</title><meta name="description" content={d}/>
    {path&&<link rel="canonical" href={path}/>}
    <meta property="og:type" content={type}/><meta property="og:title" content={t}/>
    <meta property="og:description" content={d}/><meta property="og:image" content={img}/>
    <meta name="twitter:card" content="summary_large_image"/>
    {ld&&<script type="application/ld+json">{JSON.stringify(ld)}</script>}
  </Helmet>;
}
