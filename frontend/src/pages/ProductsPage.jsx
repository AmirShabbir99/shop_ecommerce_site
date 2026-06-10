import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/common/LoadingSpinner';
import { pageTransition } from '../animations/variants';

const CATEGORIES = ['Electronics', 'Fashion', 'Sports', 'Home', 'Beauty', 'Books', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest',  label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'low',     label: 'Price: Low → High' },
  { value: 'high',    label: 'Price: High → Low' },
  { value: 'rating',  label: 'Top Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [pages,      setPages]      = useState(1);
  const [mobileFilter, setMobileFilter] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search:   searchParams.get('search')   || '',
    sort:     searchParams.get('sort')     || 'newest',
    minPrice: '',
    maxPrice: '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch { } finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(p => ({ ...p, [key]: value }));
    setPage(1);
    const sp = new URLSearchParams(searchParams);
    value ? sp.set(key, value) : sp.delete(key);
    setSearchParams(sp);
  };

  const clearFilters = () => {
    setFilters({ category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '' });
    setSearchParams({});
    setPage(1);
  };

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'sort').length;

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Category</h3>
        <div className="space-y-1">
          <button onClick={() => updateFilter('category', '')} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-brand text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}>
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => updateFilter('category', cat)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat ? 'bg-brand text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="input-field" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="input-field" />
        </div>
      </div>

      {activeFilters > 0 && (
        <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
          <FiX size={12} /> Clear all filters ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <motion.div {...pageTransition} className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl">
              {filters.category || filters.search ? (filters.category || `"${filters.search}"`) : 'All Products'}
            </h1>
            {!loading && <p className="text-gray-500 text-sm mt-1">{total} products found</p>}
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button onClick={() => setMobileFilter(true)} className="md:hidden flex items-center gap-2 btn-outline text-sm">
              <FiFilter size={14} /> Filters {activeFilters > 0 && <span className="bg-brand text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeFilters}</span>}
            </button>
            {/* Sort */}
            <div className="relative">
              <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="input-field pr-8 appearance-none cursor-pointer text-sm">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <FiChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {filters.search && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                Showing results for <strong className="text-brand">"{filters.search}"</strong>
                <button onClick={() => updateFilter('search', '')} className="text-red-400 hover:text-red-600"><FiX size={14} /></button>
              </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading
                ? Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : products.length === 0
                  ? <div className="col-span-full text-center py-20"><p className="text-5xl mb-4">😔</p><h3 className="font-display text-xl mb-2">No products found</h3><p className="text-gray-500 text-sm">Try adjusting your filters</p><button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button></div>
                  : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
              }
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-brand text-white' : 'border border-gray-200 hover:border-brand text-gray-700'}`}>{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilter && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="flex-1 bg-black/50" onClick={() => setMobileFilter(false)} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="w-72 bg-white h-full overflow-y-auto p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display text-xl">Filters</h2>
              <button onClick={() => setMobileFilter(false)}><FiX size={20} /></button>
            </div>
            <Sidebar />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsPage;
