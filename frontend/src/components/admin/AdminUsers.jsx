import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import { userAPI } from '../../services/api';
import { PageLoader } from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [search,   setSearch]   = useState('');
  const [updating, setUpdating] = useState(null);
  const { user: me } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const { data } = await userAPI.getAll(params);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages || 1);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (user) => {
    if (user._id === me._id) return toast.error("Can't deactivate yourself");
    setUpdating(user._id);
    try {
      await userAPI.update(user._id, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const toggleAdmin = async (user) => {
    if (user._id === me._id) return toast.error("Can't change your own role");
    setUpdating(user._id);
    try {
      const newRole = user.role === 'admin' ? 'customer' : 'admin';
      await userAPI.update(user._id, { role: newRole });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
      toast.success(`Role changed to ${newRole}`);
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="font-display text-2xl">Users</h1>
        <p className="text-gray-500 text-sm mt-0.5">{total} registered users</p>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="input-field pl-9" />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? <div className="py-16"><PageLoader /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 bg-gray-50/60">
                {['User','Email','Role','Status','Joined','Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${u.role === 'admin' ? 'bg-accent text-brand' : 'bg-brand text-white'}`}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-xs">{u.name}</p>
                          {u._id === me._id && <p className="text-[10px] text-accent2 font-semibold">You</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-accent/20 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role === 'admin' ? '⚡ Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleAdmin(u)}
                          disabled={updating === u._id || u._id === me._id}
                          title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          className="p-1.5 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-400 hover:text-yellow-700 transition-colors text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FiShield size={13} />
                        </button>
                        <button
                          onClick={() => toggleActive(u)}
                          disabled={updating === u._id || u._id === me._id}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 border border-gray-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${u.isActive ? 'hover:bg-red-50 hover:border-red-400 hover:text-red-600 text-gray-400' : 'hover:bg-green-50 hover:border-green-400 hover:text-green-600 text-gray-400'}`}
                        >
                          {u.isActive ? <FiUserX size={13} /> : <FiUserCheck size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-brand text-white' : 'border border-gray-200 hover:border-brand text-gray-600'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
