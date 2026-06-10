import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { pageTransition } from '../animations/variants';

const AuthPage = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/';

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    if (!isLogin && !form.name)        return toast.error('Name is required');
    setLoading(true);
    try {
      const { data } = isLogin
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.register(form);
      login(data);
      toast.success(isLogin ? `Welcome back, ${data.name}! 👋` : `Account created! Welcome, ${data.name}! 🎉`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <motion.div {...pageTransition} className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-brand px-8 pt-10 pb-8 text-white text-center">
            <div className="font-display text-3xl mb-1">Lux<span className="text-accent">ora</span></div>
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <h1 className="font-display text-xl mt-3">{isLogin ? 'Welcome back' : 'Create account'}</h1>
                <p className="text-white/55 text-sm mt-1">{isLogin ? 'Sign in to your account' : 'Join thousands of shoppers'}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <FiUser size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ahmed Ali"
                      className="input-field pl-9"
                      autoComplete="name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label mb-0">Password</label>
                {isLogin && <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-brand transition-colors">Forgot password?</Link>}
              </div>
              <div className="relative">
                <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-9 pr-10"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <p className="text-xs text-gray-400">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-brand hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-brand hover:underline">Privacy Policy</a>.
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-3 rounded-xl font-bold text-sm transition-colors hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              {[{ icon: '🔵', label: 'Google' }, { icon: '⚫', label: 'Apple' }].map(s => (
                <button key={s.label} type="button" onClick={() => toast('Social login coming soon!')} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </form>

          {/* Switch */}
          <div className="text-center pb-6 text-sm text-gray-500">
            {isLogin ? (
              <p>Don't have an account?{' '}<Link to="/register" className="text-brand font-semibold hover:underline">Create one</Link></p>
            ) : (
              <p>Already have an account?{' '}<Link to="/login" className="text-brand font-semibold hover:underline">Sign in</Link></p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
