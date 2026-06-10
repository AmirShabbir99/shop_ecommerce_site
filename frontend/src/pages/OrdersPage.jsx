import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiEye, FiTruck, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { PageLoader } from '../components/common/LoadingSpinner';
import { pageTransition, fadeUp, staggerContainer } from '../animations/variants';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    icon: FiClock,   color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  processing: { label: 'Processing', icon: FiPackage, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  shipped:    { label: 'Shipped',    icon: FiTruck,   color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  delivered:  { label: 'Delivered',  icon: FiCheck,   color: 'text-green-600 bg-green-50 border-green-200' },
  cancelled:  { label: 'Cancelled',  icon: FiX,       color: 'text-red-600 bg-red-50 border-red-200' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
};

const OrdersPage = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-16"><PageLoader /></div>;

  return (
    <motion.div {...pageTransition} className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="font-display text-2xl mb-2">No orders yet</h2>
            <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer(0.07)} initial="hidden" animate="visible" className="space-y-4">
            {orders.map(order => (
              <motion.div key={order._id} variants={fadeUp} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div><p className="font-bold text-brand text-sm">#{order._id.slice(-8).toUpperCase()}</p><p className="mt-0.5">Placed {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                    <div><p className="text-gray-400">Total</p><p className="font-bold text-brand text-sm">${order.totalPrice.toFixed(2)}</p></div>
                    <div><p className="text-gray-400">Payment</p><p className="font-medium text-brand">{order.paymentMethod}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <Link to={`/orders/${order._id}`} className="flex items-center gap-1.5 text-xs font-medium text-brand hover:text-gray-600 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
                      <FiEye size={12} /> View
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 py-4">
                  <div className="flex flex-wrap gap-3">
                    {order.orderItems.map(item => (
                      <div key={item._id} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2 text-xs">
                        <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-base">
                          {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : '📦'}
                        </div>
                        <div>
                          <p className="font-medium text-brand truncate max-w-[140px]">{item.title}</p>
                          <p className="text-gray-400">×{item.qty} — ${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking bar */}
                {order.status !== 'cancelled' && (
                  <div className="px-5 pb-4">
                    <div className="flex items-center gap-0">
                      {['pending','processing','shipped','delivered'].map((s, i) => {
                        const steps = ['pending','processing','shipped','delivered'];
                        const currentIdx = steps.indexOf(order.status);
                        const done  = i <= currentIdx;
                        const Ic = STATUS_CONFIG[s].icon;
                        return (
                          <React.Fragment key={s}>
                            <div className={`flex flex-col items-center gap-1 ${done ? 'text-brand' : 'text-gray-300'}`}>
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${done ? 'bg-brand text-white' : 'bg-gray-100'}`}>
                                <Ic size={12} />
                              </div>
                              <span className="text-[10px] font-medium hidden sm:block capitalize">{s}</span>
                            </div>
                            {i < 3 && <div className={`flex-1 h-0.5 mx-1 transition-colors ${i < currentIdx ? 'bg-brand' : 'bg-gray-100'}`} />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OrdersPage;
