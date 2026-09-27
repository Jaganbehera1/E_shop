import { useEffect, useRef, useState } from 'react';
import { Plus, Search, Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product, Category } from '../../types';
import { fmt, slug as slugify } from '../../lib/utils';
import { useToast } from '../../lib/toast';
import { Modal } from '../../components/Modal';

const BUCKET = 'product-images';

const EMPTY = {
  name: '', slug: '', sku: '', description: '', short_description: '',
  price: 0, discount_price: 0, stock_qty: 0,
  images: [] as string[],
  specifications: {} as Record<string, string>,
  category_id: '', is_featured: false, is_active: true,
  _img: '', _sk: '', _sv: '',
};

export function AdminProducts() {
  const { toast } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [f, setF] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setItems((p.data ?? []) as Product[]);
    setCats((c.data ?? []) as Category[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => { setEditing(null); setF(EMPTY); setOpen(true); };
  const startEdit = (p: Product) => {
    setEditing(p);
    setF({ ...EMPTY, ...p as any, images: p.images ?? [], specifications: p.specifications ?? {}, description: p.description ?? '', short_description: p.short_description ?? '', discount_price: p.discount_price ?? 0, category_id: p.category_id ?? '', _img: '', _sk: '', _sv: '' });
    setOpen(true);
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
      if (error) { toast(`Upload failed: ${error.message}`, 'error'); continue; }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setF(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    setUploading(false);
    if (urls.length) toast(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: f.name, slug: f.slug || slugify(f.name), sku: f.sku,
      description: f.description, short_description: f.short_description || null,
      price: Number(f.price),
      discount_price: f.discount_price ? Number(f.discount_price) : null,
      stock_qty: Number(f.stock_qty), images: f.images, specifications: f.specifications,
      category_id: f.category_id || null, is_featured: f.is_featured, is_active: f.is_active,
    };
    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload);
    if (error) { toast(error.message, 'error'); return; }
    toast(editing ? 'Product updated' : 'Product created');
    setOpen(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast(error.message, 'error'); else { toast('Product deleted'); load(); }
  };

  const removeImage = (i: number) => setF(prev => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }));
  const addUrlImage = () => f._img.trim() && setF(prev => ({ ...prev, images: [...prev.images, prev._img.trim()], _img: '' }));
  const addSpec = () => f._sk.trim() && setF(prev => ({ ...prev, specifications: { ...prev.specifications, [prev._sk.trim()]: prev._sv.trim() }, _sk: '', _sv: '' }));

  const filtered = q
    ? items.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))
    : items;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-[var(--soft)]">Manage your product inventory and images.</p>
        </div>
        <button onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4" /> New Product</button>
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or SKU…" className="input pl-9" />
      </div>

      <div className="surface mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface2)] text-left text-xs uppercase tracking-wide text-[var(--soft)]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover border border-[var(--border)]" />
                      : <div className="h-10 w-10 rounded-lg bg-[var(--surface2)] flex items-center justify-center"><ImageIcon className="h-4 w-4 text-[var(--muted)]" /></div>
                    }
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      {p.is_featured && <span className="text-xs text-amber-500 font-medium">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--muted)] font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3 font-bold">
                  {fmt(p.discount_price ?? p.price)}
                  {p.discount_price && <span className="ml-1 text-xs text-[var(--muted)] line-through">{fmt(p.price)}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${p.stock_qty <= 0 ? 'text-rose-500' : p.stock_qty < 5 ? 'text-amber-500' : ''}`}>{p.stock_qty}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${p.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-[var(--surface2)] text-[var(--muted)]'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => startEdit(p)} className="mr-3 text-brand-600 hover:underline text-sm font-semibold">Edit</button>
                  <button onClick={() => del(p.id)} className="text-rose-500 hover:underline text-sm font-semibold">Delete</button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--muted)]">No products found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Product' : 'New Product'} size="lg">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {/* Basic info */}
          <div className="sm:col-span-2">
            <label className="label">Product Name *</label>
            <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required className="input" placeholder="e.g. Arduino Uno R3" />
          </div>
          <div>
            <label className="label">Slug (auto-generated)</label>
            <input value={f.slug} onChange={e => setF({ ...f, slug: e.target.value })} className="input" placeholder="auto" />
          </div>
          <div>
            <label className="label">SKU *</label>
            <input value={f.sku} onChange={e => setF({ ...f, sku: e.target.value })} required className="input" placeholder="e.g. ARD-UNO-R3" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Short Description</label>
            <input value={f.short_description} onChange={e => setF({ ...f, short_description: e.target.value })} className="input" placeholder="One-line summary" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Full Description</label>
            <textarea rows={4} value={f.description} onChange={e => setF({ ...f, description: e.target.value })} className="input resize-none" placeholder="Detailed product description…" />
          </div>

          {/* Pricing */}
          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" min="0" step="0.01" value={f.price} onChange={e => setF({ ...f, price: Number(e.target.value) })} className="input" />
          </div>
          <div>
            <label className="label">Discount Price (₹ — 0 = none)</label>
            <input type="number" min="0" step="0.01" value={f.discount_price} onChange={e => setF({ ...f, discount_price: Number(e.target.value) })} className="input" />
          </div>
          <div>
            <label className="label">Stock Quantity</label>
            <input type="number" min="0" value={f.stock_qty} onChange={e => setF({ ...f, stock_qty: Number(e.target.value) })} className="input" />
          </div>
          <div>
            <label className="label">Category</label>
            <select value={f.category_id} onChange={e => setF({ ...f, category_id: e.target.value })} className="input">
              <option value="">— None —</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Image upload */}
          <div className="sm:col-span-2">
            <label className="label">Product Images</label>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => e.target.files?.length && uploadFiles(e.target.files)} />
            <div
              className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] p-6 text-center transition hover:border-brand-500 hover:bg-brand-50/5"
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); e.dataTransfer.files?.length && uploadFiles(e.dataTransfer.files); }}
            >
              {uploading
                ? <><div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" /><span className="text-sm text-[var(--muted)]">Uploading…</span></>
                : <><Upload className="h-6 w-6 text-[var(--muted)]" /><span className="text-sm font-semibold text-brand-600">Click or drag photos here</span><span className="text-xs text-[var(--muted)]">JPEG, PNG, WebP — max 5 MB each</span></>
              }
            </div>

            {/* URL fallback */}
            <div className="mt-2 flex gap-2">
              <input value={f._img} onChange={e => setF({ ...f, _img: e.target.value })} placeholder="Or paste an image URL…" className="input text-sm" />
              <button type="button" onClick={addUrlImage} className="btn-ghost text-sm">Add URL</button>
            </div>

            {/* Previews */}
            {f.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {f.images.map((url, i) => (
                  <div key={i} className="relative group h-20 w-20 rounded-lg overflow-hidden border border-[var(--border)]">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition">
                      <X className="h-5 w-5 text-white" />
                    </button>
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-brand-600/80 text-white text-[10px] text-center py-0.5">Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="sm:col-span-2">
            <label className="label">Specifications</label>
            <div className="flex gap-2">
              <input value={f._sk} onChange={e => setF({ ...f, _sk: e.target.value })} placeholder="Key (e.g. Voltage)" className="input" />
              <input value={f._sv} onChange={e => setF({ ...f, _sv: e.target.value })} placeholder="Value (e.g. 5V)" className="input" />
              <button type="button" onClick={addSpec} className="btn-ghost">Add</button>
            </div>
            {Object.entries(f.specifications).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {Object.entries(f.specifications).map(([k, v]) => (
                  <span key={k} className="chip text-xs flex items-center gap-1">
                    <b>{k}:</b> {v}
                    <button type="button" onClick={() => { const s = { ...f.specifications }; delete s[k]; setF({ ...f, specifications: s }); }}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Flags */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={f.is_featured} onChange={e => setF({ ...f, is_featured: e.target.checked })} className="accent-brand-600" />
            Mark as Featured
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={f.is_active} onChange={e => setF({ ...f, is_active: e.target.checked })} className="accent-brand-600" />
            Active (visible to customers)
          </label>

          <div className="flex gap-2 pt-2 sm:col-span-2">
            <button type="submit" className="btn-primary" disabled={uploading}>
              {editing ? 'Save Changes' : 'Create Product'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
