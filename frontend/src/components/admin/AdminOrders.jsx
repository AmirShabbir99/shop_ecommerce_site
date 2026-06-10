import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronDown, FiEye, FiEdit2 } from 'react-icons/fi';
import { orderAPI } from '../../services/api';
import { PageLoader } from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUSES = ['pending','processing','shipped','delivered','cancelled'];

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [filter,   setFilter]   = useState('');
  const [updating, setUpdating] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filter) params.status = filter;
      const { data } = await orderAPI.getAll(params);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await orderAPI.updateStatus(orderId, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success(`Order updated to "${status}"`);
      setEditModal(null);
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="font-display text-2xl">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => { setFilter(''); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!filter ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand'}`}>All</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === s ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand'}`}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? <div className="py-16"><PageLoader /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                {['Order ID','Customer','Items','Total','Payment','Status','Date','Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <Link to={`/orders/${o._id}`} className="font-mono text-xs font-semibold text-brand hover:underline">#{o._id.slice(-8).toUpperCase()}</Link>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <p className="font-medium">{o.user?.name || 'Guest'}</p>
                      <p className="text-gray-400">{o.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{o.orderItems?.length}</td>
                    <td className="px-5 py-4 text-xs font-bold">${o.totalPrice?.toFixed(2)}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{o.paymentMethod}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/orders/${o._id}`} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-brand" title="View">
                          <FiEye size={13} />
                        </Link>
                        <button onClick={() => setEditModal(o)} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-brand" title="Edit status">
                          <FiEdit2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-brand text-white' : 'border border-gray-200 hover:border-brand text-gray-600'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display text-lg mb-1">Update Order Status</h3>
            <p className="text-xs text-gray-500 mb-5">Order #{editModal._id.slice(-8).toUpperCase()}</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(s => (
                <button key={s} onClick={() => updateStatus(editModal._id, s)} disabled={updating === editModal._id} className={`px-3 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all border-2 ${editModal.status === s ? 'border-brand bg-brand text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'} disabled:opacity-50`}>
                  {s}
                </button>
              ))}
            </div>
            <button onClick={() => setEditModal(null)} className="w-full mt-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
