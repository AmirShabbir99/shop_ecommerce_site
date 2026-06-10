import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { orderAPI, productAPI } from '../../services/api';
import { PageLoader } from '../common/LoadingSpinner';

const COLORS = ['#0A0A0A', '#E8C547', '#FF6B35', '#22a45d', '#3b82f6', '#8b5cf6'];
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AdminAnalytics = () => {
  const [analytics, setAnalytics]  = useState(null);
  const [catData,   setCatData]    = useState([]);
  const [loading,   setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      orderAPI.getAnalytics(),
      productAPI.getAll({ limit: 100 }),
    ]).then(([ana, prods]) => {
      setAnalytics(ana.data);
      // Build category distribution
      const cats = {};
      prods.data.products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
      setCatData(Object.entries(cats).map(([name, value]) => ({ name, value })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const monthlyData = (analytics?.monthlyRevenue || []).map(m => ({
    name:    MONTHS[(m._id.month || 1) - 1],
    Revenue: Math.round(m.revenue),
    Orders:  m.count,
  }));

  // Fake growth data for demo
  const growthData = MONTHS.slice(0, 6).map((m, i) => ({
    name: m,
    Customers: 40 + i * 12 + Math.floor(Math.random() * 15),
    Revenue:   3000 + i * 900 + Math.floor(Math.random() * 500),
  }));

  const kpis = [
    { label: 'Total Revenue',  value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`,  change: '+12.4%', up: true },
    { label: 'Total Orders',   value: (analytics?.totalOrders || 0).toLocaleString(),          change: '+8.1%',  up: true },
    { label: 'Pending Orders', value: (analytics?.pendingOrders || 0).toLocaleString(),         change: '-3.2%',  up: false },
    { label: 'Avg Order Value',value: analytics?.totalOrders ? `$${(analytics.totalRevenue / analytics.totalOrders).toFixed(2)}` : '$0', change: '+2.1%', up: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="font-display text-2xl">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Business performance overview</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, change, up }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
            <p className="font-display text-2xl font-bold mb-1">{value}</p>
            <p className={`text-xs font-semibold flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-500'}`}>
              {up ? <FiTrendingUp size={11} /> : <FiTrendingDown size={11} />} {change} vs last month
            </p>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Orders over time */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData.length ? monthlyData : growthData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0A0A0A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={v => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius: 10, border: '1px solid #f0f0f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="Revenue" stroke="#0A0A0A" strokeWidth={2.5} fill="url(#grad1)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Orders & Customers Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growthData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #f0f0f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Customers" fill="#0A0A0A" radius={[4,4,0,0]} />
              <Bar dataKey="Revenue"   fill="#E8C547" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category breakdown */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Products by Category</h2>
          {catData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {catData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-xs text-gray-400 py-4 text-center">No category data</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Order Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Delivered',  pct: 58, color: 'bg-green-500' },
              { label: 'Shipped',    pct: 20, color: 'bg-indigo-500' },
              { label: 'Processing', pct: 12, color: 'bg-blue-500' },
              { label: 'Pending',    pct: 8,  color: 'bg-yellow-400' },
              { label: 'Cancelled',  pct: 2,  color: 'bg-red-400' },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="font-bold text-brand">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.4 }} className={`h-full rounded-full ${color}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
