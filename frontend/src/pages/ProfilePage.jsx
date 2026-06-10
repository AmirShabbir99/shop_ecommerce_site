import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiSave, FiLock, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, orderAPI } from '../services/api';
import { PageLoader } from '../components/common/LoadingSpinner';
import { pageTransition } from '../animations/variants';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [tab,     setTab]     = useState('info');
  const [loading, setLoading] = useState(false);
  const [orders,  setOrders]  = useState([]);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });

  useEffect(() => {
    if (tab === 'orders') {
      orderAPI.getMyOrders().then(r => setOrders(r.data)).catch(() => {});
    }
  }, [tab]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      login({ ...user, ...data });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const changePassword = async () => {
    if (passForm.newPass !== passForm.confirm) return toast.error('Passwords do not match');
    if (passForm.newPass.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.updateProfile({ password: passForm.newPass });
      toast.success('Password changed!');
      setPassForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  const TABS = [
    { id: 'info',     label: 'My Info',   icon: FiUser },
    { id: 'orders',   label: 'Orders',    icon: FiShoppingBag },
    { id: 'security', label: 'Security',  icon: FiLock },
  ];

  return (
    <motion.div {...pageTransition} className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-brand text-white rounded-2xl flex items-center justify-center text-2xl font-bold font-display">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl">{user?.name}</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-1 bg-accent text-brand text-xs font-bold px-2 py-0.5 rounded-full">Admin</span>
            )}
          </div>
        </div>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Sidebar tabs */}
          <div className="md:w-48 shrink-0">
            <nav className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-l-2 ${tab === id ? 'border-brand bg-gray-50 text-brand' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Info Tab */}
            {tab === 'info' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-display text-xl mb-6">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="name" value={form.name} onChange={handleChange} className="input-field pl-9" placeholder="Your name" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-9" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <div className="relative">
                      <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="input-field pl-9" placeholder="+92 300 0000000" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={saveProfile}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    <FiSave size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 font-display text-xl">Order History</div>
                {orders.length === 0 ? (
                  <div className="text-center py-14 text-gray-400">
                    <FiShoppingBag size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No orders yet</p>
                    <Link to="/products" className="btn-primary inline-block mt-4 text-sm">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <div key={order._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-semibold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()} · {order.orderItems.length} item(s)</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-sm">${order.totalPrice.toFixed(2)}</p>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped'   ? 'bg-blue-100 text-blue-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{order.status}</span>
                          <Link to={`/orders/${order._id}`} className="text-xs text-brand hover:underline">View</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Security Tab */}
            {tab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-display text-xl mb-6">Change Password</h2>
                <div className="space-y-4 max-w-sm">
                  {[
                    { key: 'current', label: 'Current Password', placeholder: '••••••••' },
                    { key: 'newPass', label: 'New Password',     placeholder: '••••••••' },
                    { key: 'confirm', label: 'Confirm Password', placeholder: '••••••••' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="label">{f.label}</label>
                      <input
                        type="password"
                        value={passForm[f.key]}
                        onChange={e => setPassForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="input-field"
                      />
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={changePassword}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    <FiLock size={14} /> {loading ? 'Updating...' : 'Update Password'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
