import{useEffect,useState}from'react';
import{Link,useNavigate,useParams}from'react-router-dom';
import{ShoppingCart,Heart,Truck,ShieldCheck,RefreshCw,Check}from'lucide-react';
import{supabase}from'../lib/supabase';
import type{Product,Review}from'../types';
import{Gallery}from'../components/Gallery';
import{RelatedProducts}from'../components/RelatedProducts';
import{Seo}from'../lib/seo';
import{useCart}from'../lib/cart';
import{useWishlist}from'../lib/wishlist';
import{useAuth}from'../lib/auth';
import{useToast}from'../lib/toast';
import{fmt,pct,eff}from'../lib/utils';

export function ProductDetailPage(){
  const{slug}=useParams();const nav=useNavigate();
  const{add}=useCart();const{toggle,has}=useWishlist();
  const{user}=useAuth();const{toast}=useToast();
  const[product,setProduct]=useState<Product|null>(null);
  const[reviews,setReviews]=useState<Review[]>([]);
  const[loading,setLoading]=useState(true);
  const[qty,setQty]=useState(1);
  const[tab,setTab]=useState<'desc'|'specs'|'reviews'>('desc');
  const[rating,setRating]=useState(5);const[rtitle,setRtitle]=useState('');const[rbody,setRbody]=useState('');

  useEffect(()=>{(async()=>{
    setLoading(true);
    const{data}=await supabase.from('products').select('*').eq('slug',slug).maybeSingle();
    setProduct(data as Product|null);
    if(data){
      const{data:r}=await supabase.from('reviews').select('*').eq('product_id',(data as Product).id).order('created_at',{ascending:false});
      setReviews((r??[])as Review[]);
    }
    setLoading(false);
  })()},[slug]);

  if(loading)return<div className="cx py-20 text-center text-[var(--muted)]">Loading product…</div>;
  if(!product)return<div className="cx py-20 text-center"><h1 className="font-display text-2xl font-bold">Product not found</h1><Link to="/products" className="mt-4 inline-block font-semibold text-brand-600">← All products</Link></div>;

  const price=eff(product);const off=pct(product.price,product.discount_price);const liked=has(product.id);

  const onAdd=async(buyNow=false)=>{
    if(!user){toast('Please login to add items to cart','error');nav('/auth?next=/products');return}
    await add(product,qty);toast(`${product.name} added to cart`);if(buyNow)nav('/checkout')
  };

  const submitReview=async()=>{
    if(!user){toast('Sign in to review','error');return}
    const{error}=await supabase.from('reviews').insert({product_id:product.id,user_id:user.id,rating,title:rtitle,body:rbody,approved:false});
    if(error)toast(error.message,'error');else toast('Review submitted — pending approval');
  };

  const ld={'@context':'https://schema.org','@type':'Product',name:product.name,sku:product.sku,image:product.images,offers:{'@type':'Offer',price,priceCurrency:'INR',availability:product.stock_qty>0?'InStock':'OutOfStock'}};

  return<div className="cx py-8">
    <Seo title={product.name} description={product.short_description??undefined} path={`/products/${product.slug}`} image={product.images?.[0]} type="product" ld={ld}/>
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-[var(--muted)]">
      <Link to="/" className="hover:text-brand-600">Home</Link> /
      <Link to="/products" className="hover:text-brand-600">Products</Link> /
      <span>{product.name}</span>
    </nav>

    <div className="grid gap-8 lg:grid-cols-2">
      <Gallery images={product.images} alt={product.name}/>
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm"><span className="text-amber-400">★</span><span className="font-semibold">{product.rating_avg||'New'}</span>{product.rating_count>0&&<span className="text-[var(--muted)]">({product.rating_count})</span>}</div>
          <span className="chip">SKU: {product.sku}</span>
        </div>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{fmt(price)}</span>
          {off>0&&<><span className="text-lg text-[var(--muted)] line-through">{fmt(product.price)}</span><span className="badge">-{off}%</span></>}
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">Inclusive of all taxes · Free shipping above ₹999</p>
        {product.short_description&&<p className="mt-3 text-sm text-[var(--soft)]">{product.short_description}</p>}
        <div className="mt-3">{product.stock_qty>0?<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600"><Check className="h-4 w-4"/> In stock ({product.stock_qty})</span>:<span className="text-sm font-semibold text-rose-500">Out of stock</span>}</div>

        <div className="mt-5 flex items-center gap-3">
          <div className="inline-flex items-center rounded-xl border border-[var(--border)]">
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-3 py-2 text-lg">−</button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button onClick={()=>setQty(q=>q+1)} className="px-3 py-2 text-lg">+</button>
          </div>
          <button onClick={()=>onAdd(false)} disabled={product.stock_qty<=0} className="btn-ghost"><ShoppingCart className="h-4 w-4"/> Add to cart</button>
          <button onClick={()=>onAdd(true)} disabled={product.stock_qty<=0} className="btn-primary">Buy now</button>
          <button onClick={()=>toggle(product)} className={`btn-ghost !p-2.5 ${liked?'text-rose-500':''}`}><Heart className="h-4 w-4" fill={liked?'currentColor':'none'}/></button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[{I:Truck,l:'Fast dispatch'},{I:ShieldCheck,l:'6-month warranty'},{I:RefreshCw,l:'7-day returns'}].map(({I,l},i)=>(
            <div key={i} className="surface p-3"><I className="mx-auto h-5 w-5 text-brand-600"/><div className="mt-1 text-xs font-medium text-[var(--soft)]">{l}</div></div>
          ))}
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div className="mt-12">
      <div className="flex gap-2 border-b border-[var(--border)]">
        {([['desc','Description'],['specs','Specifications'],['reviews',`Reviews (${reviews.length})`]] as const).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${tab===k?'border-brand-600 text-brand-600':'border-transparent text-[var(--soft)] hover:text-brand-600'}`}>{l}</button>
        ))}
      </div>
      <div className="py-6">
        {tab==='desc'&&<p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[var(--soft)]">{product.description}</p>}
        {tab==='specs'&&<div className="max-w-2xl overflow-hidden rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm"><tbody>
            {Object.entries(product.specifications??{}).map(([k,v])=>(
              <tr key={k} className="odd:bg-[var(--surface2)]">
                <td className="w-1/3 px-4 py-2.5 font-semibold capitalize text-[var(--soft)]">{k.replace(/_/g,' ')}</td>
                <td className="px-4 py-2.5">{v}</td>
              </tr>
            ))}
            <tr className="odd:bg-[var(--surface2)]"><td className="px-4 py-2.5 font-semibold text-[var(--soft)]">SKU</td><td className="px-4 py-2.5">{product.sku}</td></tr>
          </tbody></table>
        </div>}
        {tab==='reviews'&&<div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {reviews.length===0?<p className="text-sm text-[var(--soft)]">No reviews yet. Be the first!</p>:reviews.map(r=>(
              <div key={r.id} className="surface p-4">
                <div className="flex items-center justify-between">
                  <div className="flex">{Array.from({length:r.rating}).map((_,j)=><span key={j} className="text-amber-400">★</span>)}</div>
                  <span className="text-xs text-[var(--muted)]">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                {r.title&&<p className="mt-2 font-semibold">{r.title}</p>}
                {r.body&&<p className="mt-1 text-sm text-[var(--soft)]">{r.body}</p>}
              </div>
            ))}
          </div>
          <div className="surface p-5">
            <h4 className="font-display font-bold">Write a review</h4>
            {!user&&<p className="mt-2 text-xs text-[var(--muted)]">Sign in to submit a review.</p>}
            <div className="mt-3">
              <label className="label">Rating</label>
              <div className="flex gap-1">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} className={`text-2xl ${n<=rating?'text-amber-400':'text-slate-300 dark:text-slate-600'}`}>★</button>)}</div>
            </div>
            <div className="mt-3"><label className="label">Title</label><input value={rtitle} onChange={e=>setRtitle(e.target.value)} className="input"/></div>
            <div className="mt-3"><label className="label">Review</label><textarea value={rbody} onChange={e=>setRbody(e.target.value)} rows={4} className="input"/></div>
            <button onClick={submitReview} disabled={!user} className="btn-primary mt-4 w-full">Submit review</button>
          </div>
        </div>}
      </div>
    </div>
    <RelatedProducts product={product}/>
  </div>;
}
