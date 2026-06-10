import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiHeart, FiLogOut, FiSettings } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`);
    setSearchOpen(false);
  };

  const navLinks = [
    { to: '/',        label: 'Home' },
    { to: '/products',label: 'Shop' },
    { to: '/products?category=Electronics', label: 'Electronics' },
    { to: '/products?category=Fashion',     label: 'Fashion' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-brand shadow-lg' : 'bg-brand'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="font-display text-2xl text-white font-semibold">
              Lux<span className="text-accent">ora</span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-white/70 hover:text-accent text-sm font-medium tracking-wide uppercase transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)} className="text-white/80 hover:text-accent transition-colors p-1" aria-label="Search">
                <FiSearch size={18} />
              </button>

              {/* Wishlist */}
              {user && (
                <Link to="/wishlist" className="text-white/80 hover:text-accent transition-colors p-1" aria-label="Wishlist">
                  <FiHeart size={18} />
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative text-white/80 hover:text-accent transition-colors p-1" aria-label="Cart">
                <FiShoppingCart size={18} />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-accent text-brand text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              {/* Account dropdown */}
              <div className="relative">
                <button onClick={() => setDropOpen(p => !p)} className="text-white/80 hover:text-accent transition-colors p-1 flex items-center gap-1" aria-label="Account">
                  <FiUser size={18} />
                </button>
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      onMouseLeave={() => setDropOpen(false)}
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Link to="/profile"  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropOpen(false)}><FiSettings size={14} /> Profile</Link>
                          <Link to="/orders"   className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropOpen(false)}><FiShoppingCart size={14} /> My Orders</Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-accent2 font-medium hover:bg-orange-50 transition-colors" onClick={() => setDropOpen(false)}>⚡ Admin Panel</Link>
                          )}
                          <button onClick={() => { logout(); setDropOpen(false); navigate('/'); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                            <FiLogOut size={14} /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login"    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropOpen(false)}>Sign In</Link>
                          <Link to="/register" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropOpen(false)}>Create Account</Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileOpen(p => !p)} className="md:hidden text-white/80 hover:text-accent transition-colors" aria-label="Menu">
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand border-t border-white/10"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className="text-white/80 hover:text-accent py-2 text-sm font-medium">{label}</Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl"
            >
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-5 py-4 rounded-xl text-brand text-lg outline-none shadow-2xl"
                />
                <button type="submit" className="bg-accent text-brand px-6 rounded-xl font-bold text-sm">Search</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
