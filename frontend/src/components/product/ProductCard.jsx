import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const EMOJI_MAP = {
  Electronics: '🎧', Fashion: '👗', Sports: '⚽', Home: '🏠',
  Beauty: '💄', Books: '📚', Other: '📦',
};

const COLORS = {
  Electronics: 'from-blue-50 to-indigo-50',
  Fashion:     'from-pink-50 to-rose-50',
  Sports:      'from-green-50 to-emerald-50',
  Home:        'from-amber-50 to-yellow-50',
  Beauty:      'from-purple-50 to-fuchsia-50',
  Books:       'from-orange-50 to-red-50',
  Other:       'from-gray-50 to-slate-50',
};

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart({ _id: product._id, title: product.title, price: product.price, image: product.images?.[0] || '', category: product.category }, 1);
    toast.success(`${product.title} added to cart!`);
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer group transition-shadow"
    >
      <Link to={`/products/${product._id}`}>
        {/* Image area */}
        <div className={`relative h-44 bg-gradient-to-br ${COLORS[product.category] || COLORS.Other} flex items-center justify-center overflow-hidden`}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{EMOJI_MAP[product.category] || '📦'}</span>
          )}
          {discount > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-accent2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">-{discount}%</span>
          )}
          {product.featured && !discount && (
            <span className="absolute top-2.5 left-2.5 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Featured</span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Out of Stock</span>
            </div>
          )}
          {/* Wishlist button */}
          <button className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-accent2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm" aria-label="Add to wishlist">
            <FiHeart size={14} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{product.category}</p>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-medium text-sm text-brand leading-snug mb-2 hover:text-gray-600 transition-colors line-clamp-2">{product.title}</h3>
        </Link>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-accent text-xs">{'★'.repeat(Math.round(product.rating || 0))}</div>
            <span className="text-[11px] text-gray-400">({product.numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-brand">${product.price.toFixed(2)}</span>
          {product.oldPrice && <span className="text-xs text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>}
        </div>

        {/* Add to cart */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="w-full bg-brand text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FiShoppingCart size={13} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
