import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImages } from '../../utils/api';

const CATEGORIES = ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants', 'Watches', 'Custom Jewellery'];
const EMPTY = { name: '', description: '', price: '', compare_price: '', category: 'Rings', material: '', sku: '', featured: false, in_stock: true, stock_qty: 10, images: [] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => getProducts({ limit: 200 }).then(({ data }) => setProducts(data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = p => {
    setEditing(p.id);
    setForm({ ...p, price: p.price, compare_price: p.compare_price || '', featured: p.featured === 1, in_stock: p.in_stock !== 0 });
    setShowForm(true);
  };

  const handleUpload = async e => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      [...files].forEach(f => fd.append('images', f));
      const { data } = await uploadImages(fd);
      setForm(p => ({ ...p, images: [...(p.images || []), ...data.urls] }));
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), compare_price: form.compare_price ? Number(form.compare_price) : null };
      if (editing) await updateProduct(editing, payload);
      else await createProduct(payload);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id).catch(() => {});
    load();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#002902]">
      {/* Nav */}
      <nav className="bg-[#0c1714] border-b border-[#005b04] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-[#555] hover:text-white text-xs tracking-widest uppercase transition-colors">← Dashboard</Link>
          <div className="h-4 w-px bg-[#007605]" />
          <span className="text-white text-sm font-semibold">Products</span>
        </div>
        <button onClick={openNew} className="btn-gold py-2 px-5 text-xs">+ Add Product</button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-luxury max-w-xs"
          />
        </div>

        {/* Table */}
        <div className="bg-[#003e02] border border-[#005b04] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#005403]">
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[#444] text-[10px] tracking-[2px] uppercase font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-[#005403] hover:bg-[#0c1714] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#003102] flex-shrink-0 overflow-hidden">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full product-placeholder" />}
                      </div>
                      <div>
                        <p className="text-white font-medium leading-tight">{p.name}</p>
                        {p.sku && <p className="text-[#444] text-[10px]">{p.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#666] text-xs">{p.category}</td>
                  <td className="px-5 py-3">
                    <span className="text-[#C9A84C] font-semibold">${p.price.toLocaleString()}</span>
                    {p.compare_price && <span className="text-[#444] text-xs line-through ml-2">${p.compare_price.toLocaleString()}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] tracking-[2px] uppercase px-2 py-0.5 ${p.in_stock ? 'text-[#3fb950] bg-[#3fb950]/10' : 'text-[#f85149] bg-[#f85149]/10'}`}>
                      {p.in_stock ? `${p.stock_qty} in stock` : 'Sold Out'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {p.featured ? <span className="text-[#C9A84C] text-lg">★</span> : <span className="text-[#007605] text-lg">☆</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-[#555] hover:text-[#C9A84C] text-xs tracking-widest uppercase transition-colors">Edit</button>
                      <span className="text-[#007605]">|</span>
                      <button onClick={() => handleDelete(p.id)} className="text-[#555] hover:text-[#f85149] text-xs tracking-widest uppercase transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#444] text-sm">No products found</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-[#0c1714] border border-[#005b04] w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#005b04]">
              <h2 className="font-display text-xl font-bold text-white">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#555] hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[#555] text-xs block mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} required className="input-luxury" placeholder="Diamond Solitaire Ring" />
                </div>
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className="input-luxury">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">Material</label>
                  <input value={form.material} onChange={e => set('material', e.target.value)} className="input-luxury" placeholder="18k White Gold" />
                </div>
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">Price ($) *</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required min="0" step="0.01" className="input-luxury" placeholder="4850" />
                </div>
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">Compare Price ($)</label>
                  <input type="number" value={form.compare_price} onChange={e => set('compare_price', e.target.value)} min="0" step="0.01" className="input-luxury" placeholder="5500" />
                </div>
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">SKU</label>
                  <input value={form.sku} onChange={e => set('sku', e.target.value)} className="input-luxury" placeholder="PAJ-R001" />
                </div>
                <div>
                  <label className="text-[#555] text-xs block mb-1.5">Stock Qty</label>
                  <input type="number" value={form.stock_qty} onChange={e => set('stock_qty', e.target.value)} min="0" className="input-luxury" />
                </div>
                <div className="col-span-2">
                  <label className="text-[#555] text-xs block mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="input-luxury resize-none" />
                </div>
                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-[#C9A84C]" />
                    <span className="text-[#888] text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} className="accent-[#C9A84C]" />
                    <span className="text-[#888] text-sm">In Stock</span>
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="text-[#555] text-xs block mb-1.5">Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleUpload} className="text-[#555] text-xs" />
                  {uploading && <p className="text-[#C9A84C] text-xs mt-1">Uploading...</p>}
                  {form.images?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative w-14 h-14">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                            className="absolute -top-1 -right-1 bg-[#f85149] text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-3 disabled:opacity-50">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold px-6 py-3">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
