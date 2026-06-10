import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiMinus, FiPlus, FiShare2, FiArrowLeft } from 'react-icons/fi';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import { PageLoader } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { pageTransition } from '../animations/variants';

const EMOJI_MAP = { Electronics:'🎧', Fashion:'👗', Sports:'⚽', Home:'🏠', Beauty:'💄', Books:'📚', Other:'📦' };

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product,   setProduct]   = useState(null);
  const [related,   setRelated]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [qty,       setQty]       = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab,       setTab]       = useState('desc');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    productAPI.getOne(id)
      .then(async r => {
        setProduct(r.data);
        setActiveImg(0);
        const rel = await productAPI.getAll({ category: r.data.category, limit: 4 });
        setRelated(rel.data.products.filter(p => p._id !== id));
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart({ _id: product._id, title: product.title, price: product.price, image: product.images?.[0] || '', category: product.category }, qty);
    toast.success(`Added ${qty} × ${product.title} to cart!`);
  };

  if (loading) return <div className="pt-16"><PageLoader /></div>;
  if (!product) return <div className="pt-16 text-center py-20"><h2 className="font-display text-2xl">Product not found</h2><Link to="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link></div>;

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <motion.div {...pageTransition} className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-brand transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-brand font-medium truncate max-w-xs">{product.title}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-14">
          {/* Gallery */}
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-[380px] flex items-center justify-center overflow-hidden border border-gray-100">
              {product.images?.[activeImg] ? (
                <img src={product.images[activeImg]} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-8xl">{EMOJI_MAP[product.category] || '📦'}</span>
              )}
              {discount > 0 && <span className="absolute top-4 left-4 bg-accent2 text-white text-xs font-bold px-3 py-1 rounded-full">-{discount}%</span>}
            </motion.div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-brand' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{product.category}</p>
            <h1 className="font-display text-3xl leading-snug mb-3">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-accent">{Array(5).fill(0).map((_, i) => <FiStar key={i} size={14} fill={i < Math.round(product.rating) ? '#E8C547' : 'none'} />)}</div>
              <span className="text-sm text-gray-500">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.oldPrice && <span className="text-lg text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>}
              {discount > 0 && <span className="text-accent2 text-sm font-bold">You save ${(product.oldPrice - product.price).toFixed(2)}</span>}
            </div>

            {/* Stock */}
            <p className={`text-sm font-medium mb-5 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
              {product.stock > 10 ? `✓ In Stock (${product.stock} available)` : product.stock > 0 ? `⚠ Low Stock — only ${product.stock} left!` : '✗ Out of Stock'}
            </p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Qty</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors"><FiMinus size={14} /></button>
                  <span className="px-4 py-2 text-sm font-bold min-w-[2.5rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors"><FiPlus size={14} /></button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleAdd} disabled={product.stock === 0} className="flex-1 bg-brand text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <FiShoppingCart size={16} /> Add to Cart
              </motion.button>
              <button className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:border-accent2 hover:text-accent2 transition-colors" aria-label="Wishlist"><FiHeart size={18} /></button>
              <button className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors" aria-label="Share"><FiShare2 size={18} /></button>
            </div>

            {/* Meta */}
            <div className="text-xs text-gray-400 space-y-1 border-t border-gray-100 pt-4">
              <p>Brand: <span className="text-brand font-medium">{product.brand || 'Luxora Exclusive'}</span></p>
              <p>Category: <Link to={`/products?category=${product.category}`} className="text-accent2 hover:underline">{product.category}</Link></p>
              {product.tags?.length > 0 && <p>Tags: {product.tags.join(', ')}</p>}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mb-14">
          <div className="flex gap-0 border-b border-gray-200 mb-6">
            {['desc','reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-brand'}`}>
                {t === 'desc' ? 'Description' : `Reviews (${product.numReviews})`}
              </button>
            ))}
          </div>
          {tab === 'desc' ? (
            <p className="text-gray-600 leading-relaxed max-w-2xl">{product.description}</p>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {product.reviews?.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
              ) : (
                product.reviews?.map((r, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-xs font-bold">{r.name[0]}</div>
                      <div><p className="text-sm font-semibold">{r.name}</p><div className="text-accent text-xs">{'★'.repeat(r.rating)}</div></div>
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
