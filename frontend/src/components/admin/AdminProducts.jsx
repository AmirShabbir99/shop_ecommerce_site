import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { productAPI } from '../../services/api';
import { PageLoader, ProductSkeleton } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics','Fashion','Sports','Home','Beauty','Books','Other'];

const EMPTY_FORM = { title: '', price: '', oldPrice: '', description: '', category: 'Electronics', stock: '', brand: '', featured: false, images: [] };

const ProductFormModal = ({ product, onClose, onSave }) => {
  const [form,    setForm]    = useState(product ? { ...product, price: product.price.toString(), oldPrice: product.oldPrice?.toString() || '', stock: product.stock.toString() } : EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [imgUrl,  setImgUrl]  = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const addImage = () => {
    if (imgUrl.trim()) { setForm(p => ({ ...p, images: [...p.images, imgUrl.trim()] })); setImgUrl(''); }
  };

  const removeImage = i => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.price || !form.description || !form.stock) return toast.error('Fill all required fields');
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : null, stock: Number(form.stock) };
      if (product) await productAPI.update(product._id, payload);
      else          await productAPI.create(payload);
      toast.success(product ? 'Product updated!' : 'Product created!');
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6">
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-display text-lg">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Product name" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Price * ($)</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="label">Old Price ($)</label>
              <input name="oldPrice" type="number" step="0.01" value={form.oldPrice} onChange={handleChange} className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input-field" placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} className="input-field" placeholder="Brand name" />
            </div>
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Product description..." />
          </div>
          <div>
            <label className="label">Image URLs</label>
            <div className="flex gap-2 mb-2">
              <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} className="input-field flex-1" placeholder="https://..." />
              <button type="button" onClick={addImage} className="px-3 py-2 bg-brand text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">Add</button>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/64?text=?'; }} />
                    <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><FiX size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-brand" />
            <span className="text-sm font-medium text-gray-700">Feature this product on homepage</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null); // null | 'add' | product
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await productAPI.remove(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-display text-2xl">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} products in inventory</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setModal('add')} className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
          <FiPlus size={16} /> Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="input-field pl-9"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FiBox size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <motion.div key={p._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden group">
              <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {p.images?.[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <span className="text-4xl">📦</span>}
                {!p.isActive && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"><span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Inactive</span></div>}
              </div>
              <div className="p-3">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{p.category}</p>
                <p className="font-medium text-xs leading-tight mb-1.5 line-clamp-2">{p.title}</p>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm">${p.price.toFixed(2)}</p>
                  <p className={`text-xs font-medium ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModal(p)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:border-brand hover:text-brand transition-colors">
                    <FiEdit2 size={11} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-gray-200 rounded-lg text-xs font-medium hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50">
                    <FiTrash2 size={11} /> {deleting === p._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-brand text-white' : 'border border-gray-200 hover:border-brand text-gray-600'}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ProductFormModal
            product={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); fetchProducts(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
