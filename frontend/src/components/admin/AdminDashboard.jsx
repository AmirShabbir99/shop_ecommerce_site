import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import {
  FiDollarSign, FiShoppingBag, FiUsers,
  FiBox, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import { orderAPI, productAPI, userAPI } from '../../services/api';
import { PageLoader } from '../common/LoadingSpinner';
import { fadeUp, staggerContainer } from '../../animations/variants';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ icon: Icon, label, value, change, color, delay }) => (
  <motion.div
    variants={fadeUp}
    transition={{ delay }}
    className="bg-white border border-gray-100 rounded-2xl p-5"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
      <Icon size={18} />
    </div>
    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
    <p className="font-display text-2xl font-bold">{value}</p>
    {change && (
      <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
        <FiTrendingUp size={11} /> {change} vs last month
      </p>
    )}
  </motion.div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts,  setTopProducts]  = useState([]);
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderAPI.getAnalytics(),
      orderAPI.getAll({ limit: 6 }),
      productAPI.getAll({ sort: 'popular', limit: 5 }),
      userAPI.getAll({ limit: 1 }),
    ]).then(([ana, orders, prods, users]) => {
      setAnalytics(ana.data);
      setRecentOrders(orders.data.orders);
      setTopProducts(prods.data.products);
      setStats({ users: users.data.total, products: prods.data.total });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const chartData = (analytics?.monthlyRevenue || []).map(m => ({
    name: MONTH_NAMES[(m._id.month || 1) - 1],
    Revenue: Math.round(m.revenue),
    Orders: m.count,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="font-display text-2xl">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7"
      >
        <StatCard icon={FiDollarSign} label="Total Revenue"  value={`$${(analytics?.totalRevenue || 0).toLocaleString()}`} change="+12.4%" color="bg-green-50 text-green-600"  delay={0}    />
        <StatCard icon={FiShoppingBag} label="Total Orders"  value={(analytics?.totalOrders || 0).toLocaleString()}         change="+8.1%"  color="bg-blue-50 text-blue-600"   delay={0.07} />
        <StatCard icon={FiUsers}       label="Customers"     value={stats.users.toLocaleString()}                           change="+5.3%"  color="bg-purple-50 text-purple-600" delay={0.14} />
        <StatCard icon={FiBox}         label="Products"      value={stats.products.toLocaleString()}                        color="bg-amber-50 text-amber-600"  delay={0.21} />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Revenue chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm">Revenue Overview</h2>
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0A0A0A" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={(v, n) => [n === 'Revenue' ? `$${v}` : v, n]} contentStyle={{ borderRadius: '10px', border: '1px solid #f0f0f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="Revenue" stroke="#0A0A0A" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </motion.div>

        {/* Top products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Top Products</h2>
            <Link to="/admin/products" className="text-xs text-accent2 hover:underline flex items-center gap-0.5">View all <FiArrowRight size={11} /></Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                <div className="w-9 h-9 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                  {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400">{p.sold || 0} sold</p>
                </div>
                <p className="text-xs font-bold flex-shrink-0">${p.price.toFixed(2)}</p>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No products yet</p>}
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-sm">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-accent2 hover:underline flex items-center gap-0.5">View all <FiArrowRight size={11} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              {['Order ID','Customer','Items','Total','Status','Date'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link to={`/orders/${o._id}`} className="font-mono font-semibold text-xs text-brand hover:underline">#{o._id.slice(-8).toUpperCase()}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-medium">{o.user?.name || 'N/A'}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{o.orderItems?.length} item(s)</td>
                  <td className="px-5 py-3.5 text-xs font-bold">${o.totalPrice?.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      o.status === 'delivered'  ? 'bg-green-100 text-green-700' :
                      o.status === 'shipped'    ? 'bg-indigo-100 text-indigo-700' :
                      o.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      o.status === 'cancelled'  ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
