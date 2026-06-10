import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/common/LoadingSpinner';
import { fadeUp, staggerContainer, pageTransition } from '../animations/variants';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: 'bg-blue-50',   hover: 'hover:bg-blue-100' },
  { name: 'Fashion',     icon: '👗', color: 'bg-pink-50',   hover: 'hover:bg-pink-100' },
  { name: 'Sports',      icon: '⚽', color: 'bg-green-50',  hover: 'hover:bg-green-100' },
  { name: 'Home',        icon: '🏠', color: 'bg-amber-50',  hover: 'hover:bg-amber-100' },
];

const FEATURES = [
  { icon: FiTruck,    title: 'Free Shipping',    desc: 'Orders over $100' },
  { icon: FiShield,   title: 'Secure Payment',   desc: '100% protected' },
  { icon: FiRefreshCw,title: 'Easy Returns',     desc: '30-day policy' },
  { icon: FiStar,     title: 'Top Quality',      desc: 'Curated products' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.',   role: 'Verified Buyer', text: 'Luxora completely changed how I shop. The quality is unmatched and delivery is always on time.', rating: 5 },
  { name: 'Ahmed R.',   role: 'Verified Buyer', text: 'The product selection is incredible. Got my order in 2 days! Will definitely shop again.', rating: 5 },
  { name: 'Emma L.',    role: 'Verified Buyer', text: 'Customer service is fantastic. Had a small issue and it was resolved immediately. 10/10!', rating: 5 },
];

const HomePage = () => {
  const [featured,    setFeatured]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [testimonial, setTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getAll({ featured: true, limit: 8 })
      .then(r => setFeatured(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
    const t = setInterval(() => setTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div {...pageTransition} className="pt-16">
      {/* Hero */}
      <section className="bg-brand text-white min-h-[520px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-block bg-accent text-brand text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
                New Collection 2025
              </motion.span>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-display text-5xl md:text-6xl leading-tight mb-5">
                Discover <em className="text-accent not-italic">Premium</em> Products
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
                Curated selections from top brands worldwide. Fast delivery, easy returns, and prices you'll love.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex gap-4 flex-wrap">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/products')} className="bg-accent text-brand px-7 py-3 rounded-lg font-bold text-sm flex items-center gap-2">
                  Shop Now <FiArrowRight />
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="border border-white/30 text-white px-7 py-3 rounded-lg font-medium text-sm hover:bg-white/10 transition-colors">
                  Explore Collections
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden md:flex gap-4 justify-end">
              {[{icon:'🎧',label:'Audio',from:'$29'},{icon:'⌚',label:'Watches',from:'$99'},{icon:'👟',label:'Sneakers',from:'$49'}].map((c, i) => (
                <motion.div key={c.label} whileHover={{ y: -8 }} transition={{ duration: 0.2 }} className="bg-white/6 border border-white/12 rounded-2xl p-5 text-center w-28" style={{ marginTop: i === 1 ? '2rem' : 0 }}>
                  <div className="text-4xl mb-2">{c.icon}</div>
                  <p className="text-xs text-white/60">{c.label}</p>
                  <p className="text-sm font-bold text-accent mt-0.5">{c.from}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 py-5 px-4 border-r border-gray-100 last:border-0">
                <div className="w-9 h-9 bg-brand/5 rounded-lg flex items-center justify-center"><Icon size={16} className="text-brand" /></div>
                <div><p className="text-xs font-bold">{title}</p><p className="text-[11px] text-gray-500">{desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="font-display text-3xl">Shop by Category</h2>
            <Link to="/products" className="text-accent2 text-sm font-medium hover:underline flex items-center gap-1">View all <FiArrowRight size={14}/></Link>
          </div>
          <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(({ name, icon, color, hover }) => (
              <motion.div key={name} variants={fadeUp} whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(`/products?category=${name}`)} className={`${color} ${hover} rounded-2xl p-6 text-center cursor-pointer transition-colors border border-transparent hover:border-gray-200`}>
                <div className="text-4xl mb-2">{icon}</div>
                <p className="font-semibold text-sm">{name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="font-display text-3xl">Featured Products</h2>
            <Link to="/products" className="text-accent2 text-sm font-medium hover:underline flex items-center gap-1">See all <FiArrowRight size={14}/></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />) : featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-brand">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-white mb-2">What Customers Say</h2>
          <p className="text-white/50 text-sm mb-10">Trusted by thousands of shoppers</p>
          <motion.div key={testimonial} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="bg-white/6 rounded-2xl p-8 border border-white/10">
            <div className="text-accent text-lg mb-4">{'★'.repeat(TESTIMONIALS[testimonial].rating)}</div>
            <p className="text-white/80 text-base leading-relaxed mb-5 italic">"{TESTIMONIALS[testimonial].text}"</p>
            <div>
              <p className="font-semibold text-white text-sm">{TESTIMONIALS[testimonial].name}</p>
              <p className="text-white/40 text-xs mt-0.5">{TESTIMONIALS[testimonial].role}</p>
            </div>
          </motion.div>
          <div className="flex justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonial(i)} className={`w-2 h-2 rounded-full transition-all ${i === testimonial ? 'bg-accent w-6' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl mb-2">Stay in the Loop</h2>
          <p className="text-gray-500 text-sm mb-6">Subscribe for exclusive deals and new arrivals.</p>
          <form className="flex gap-2" onSubmit={e => { e.preventDefault(); }}>
            <input type="email" placeholder="your@email.com" className="flex-1 input-field" />
            <motion.button whileTap={{ scale: 0.95 }} type="submit" className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap hover:bg-gray-800 transition-colors">
              Subscribe
            </motion.button>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
