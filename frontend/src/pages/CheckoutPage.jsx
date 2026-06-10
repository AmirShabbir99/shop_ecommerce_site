import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiLock } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { pageTransition } from '../animations/variants';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'COD',        label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
  { id: 'JazzCash',   label: 'JazzCash',          icon: '📱', desc: 'Mobile wallet' },
  { id: 'EasyPaisa',  label: 'EasyPaisa',         icon: '💚', desc: 'Mobile wallet' },
  { id: 'Card',       label: 'Credit/Debit Card',  icon: '💳', desc: 'Visa, Mastercard' },
];

const CheckoutPage = () => {
  const { items, subtotal, tax, shipping, total, clearCart } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [placing,  setPlacing]  = useState(false);
  const [step,     setStep]     = useState(1); // 1: address, 2: payment
  const [payment,  setPayment]  = useState('COD');
  const [form, setForm] = useState({
    fullName:   user?.name  || '',
    email:      user?.email || '',
    phone:      '',
    address:    '',
    city:       'Lahore',
    postalCode: '',
    country:    'Pakistan',
  });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validateStep1 = () => {
    if (!form.fullName || !form.email || !form.address || !form.city || !form.country)
      return toast.error('Please fill all required fields');
    setStep(2);
  };

  const placeOrder = async () => {
    if (items.length === 0) return toast.error('Your cart is empty');
    setPlacing(true);
    try {
      const orderItems = items.map(i => ({ product: i._id, qty: i.qty }));
      const shippingAddress = { fullName: form.fullName, address: form.address, city: form.city, postalCode: form.postalCode, country: form.country, phone: form.phone };
      const { data } = await orderAPI.create({ orderItems, shippingAddress, paymentMethod: payment });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  if (items.length === 0) return (
    <div className="pt-16 text-center py-20">
      <p className="text-5xl mb-4">🛒</p>
      <h2 className="font-display text-2xl mb-2">Your cart is empty</h2>
      <Link to="/products" className="btn-primary inline-block mt-3">Shop Now</Link>
    </div>
  );

  return (
    <motion.div {...pageTransition} className="pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl mb-8">Checkout</h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['Shipping Address', 'Payment'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${step > i + 1 ? 'text-green-600' : step === i + 1 ? 'text-brand' : 'text-gray-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-green-600 text-white' : step === i + 1 ? 'bg-brand text-white' : 'bg-gray-200'}`}>
                  {step > i + 1 ? <FiCheck size={12} /> : i + 1}
                </span>
                {s}
              </div>
              {i < 1 && <div className={`flex-1 h-px max-w-[4rem] ${step > 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-display text-xl mb-5">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'fullName',   label: 'Full Name *',   placeholder: 'Ahmed Ali' },
                    { name: 'email',      label: 'Email *',       placeholder: 'you@example.com', type: 'email' },
                    { name: 'phone',      label: 'Phone',         placeholder: '+92 300 0000000', type: 'tel' },
                    { name: 'address',    label: 'Street Address *', placeholder: 'House 12, Street 5', span: true },
                    { name: 'city',       label: 'City *',        placeholder: 'Lahore' },
                    { name: 'postalCode', label: 'Postal Code',   placeholder: '54000' },
                  ].map(({ name, label, placeholder, type = 'text', span }) => (
                    <div key={name} className={span ? 'sm:col-span-2' : ''}>
                      <label className="label">{label}</label>
                      <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder} className="input-field" />
                    </div>
                  ))}
                  <div>
                    <label className="label">Country *</label>
                    <select name="country" value={form.country} onChange={handleChange} className="input-field">
                      {['Pakistan','United Arab Emirates','United Kingdom','United States','Canada'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={validateStep1} className="btn-primary w-full py-3 mt-6 text-sm font-bold">
                  Continue to Payment →
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl">Payment Method</h2>
                  <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-brand transition-colors">← Edit address</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {PAYMENT_METHODS.map(pm => (
                    <motion.button key={pm.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setPayment(pm.id)} className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${payment === pm.id ? 'border-brand bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="text-2xl">{pm.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{pm.label}</p>
                        <p className="text-xs text-gray-400">{pm.desc}</p>
                      </div>
                      {payment === pm.id && <FiCheck size={14} className="ml-auto text-brand" />}
                    </motion.button>
                  ))}
                </div>

                {payment === 'Card' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
                    <div><label className="label">Card Number</label><input className="input-field" placeholder="1234 5678 9012 3456" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="label">Expiry</label><input className="input-field" placeholder="MM/YY" /></div>
                      <div><label className="label">CVV</label><input className="input-field" placeholder="123" /></div>
                    </div>
                  </motion.div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={placeOrder} disabled={placing} className="w-full bg-brand text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-60">
                  {placing ? 'Placing Order...' : (
                    <><FiLock size={16} /> Place Order — ${total.toFixed(2)}</>
                  )}
                </motion.button>
                <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1"><FiLock size={11} /> Secure, encrypted checkout</p>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 h-fit sticky top-24">
            <h2 className="font-display text-lg mb-4">Order ({items.length} items)</h2>
            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-3 text-xs">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                    {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-gray-400">×{item.qty}</p>
                  </div>
                  <p className="font-bold flex-shrink-0">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-500">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-sm text-brand border-t border-gray-100 pt-2 mt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
