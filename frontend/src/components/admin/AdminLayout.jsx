import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiShoppingBag, FiBox, FiUsers,
  FiBarChart2, FiSettings, FiArrowLeft, FiMenu, FiX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin',          label: 'Dashboard',  icon: FiGrid,        exact: true },
  { to: '/admin/orders',   label: 'Orders',     icon: FiShoppingBag },
  { to: '/admin/products', label: 'Products',   icon: FiBox },
  { to: '/admin/users',    label: 'Users',      icon: FiUsers },
  { to: '/admin/analytics',label: 'Analytics',  icon: FiBarChart2 },
];

const AdminLayout = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const NavLinks = ({ onClick }) => (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? location.pathname === to : location.pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active
                ? 'bg-accent/15 text-accent border-r-2 border-accent'
                : 'text-white/55 hover:text-white hover:bg-white/6'
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        );
      })}
      <div className="h-px bg-white/10 my-2" />
      <Link to="/admin/settings" onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/6 transition-all">
        <FiSettings size={16} /> Settings
      </Link>
      <Link to="/" onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/55 hover:text-white hover:bg-white/6 transition-all">
        <FiArrowLeft size={16} /> Back to Store
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-brand flex-col shrink-0 fixed top-0 left-0 h-full z-30">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="font-display text-xl text-white">Lux<span className="text-accent">ora</span></div>
          <div className="text-[11px] text-white/35 mt-0.5 font-medium uppercase tracking-widest">Admin Panel</div>
        </div>
        <div className="py-4 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent text-brand rounded-lg flex items-center justify-center text-xs font-bold">{user.name[0]}</div>
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[110px]">{user.name}</p>
              <p className="text-[10px] text-white/40">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-brand flex items-center justify-between px-4 h-14">
        <div className="font-display text-lg text-white">Lux<span className="text-accent">ora</span> <span className="text-xs text-white/40 font-sans">Admin</span></div>
        <button onClick={() => setSidebarOpen(true)} className="text-white"><FiMenu size={22} /></button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="md:hidden fixed top-0 left-0 w-60 h-full bg-brand z-50 flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="font-display text-xl text-white">Lux<span className="text-accent">ora</span></div>
                <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white"><FiX size={20} /></button>
              </div>
              <div className="py-4 flex-1 overflow-y-auto"><NavLinks onClick={() => setSidebarOpen(false)} /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
