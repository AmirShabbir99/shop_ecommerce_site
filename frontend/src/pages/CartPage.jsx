import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { pageTransition } from '../animations/variants';
import toast from 'react-hot-toast';

const COUPON_CODES = { LUXORA10: 10, SAVE20: 20 };

const CartPage = () => {
  const { items, removeItem, updateQty, clearCart, subtotal, tax, shipping, total } = useCart();
  const [coupon,    setCoupon]    = useState('');
  const [discount,  setDiscount]  = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const navigate = useNavigate();

  const applyCoupon = () => {
    const pct = COUPON_CODES[coupon.toUpperCase()];
    if (pct) {
      setDiscount(subtotal * pct / 100);
      setCouponMsg(`✓ ${pct}% discount applied!`);
      toast.success(`Coupon applied! ${pct}% off`);
    } else {
      setDiscount(0);
      setCouponMsg('✗ Invalid coupon code');
    }
  };

  const finalTotal = total - discount;

  if (items.length === 0) return (
    <motion.div {...pageTransition} className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-7xl mb-5">🛒</motion.div>
        <h2 className="font-display text-3xl mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/products')} className="btn-primary px-8 py-3">
          Start Shopping
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <motion.div {...pageTransition} className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl">Shopping Cart</h1>
          <button onClick={() => { clearCart(); toast.success('Cart cleared'); }} className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
            <FiTrash2 size={13} /> Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100">
                    {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl" /> : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item._id}`} className="font-medium text-sm hover:text-gray-600 transition-colors truncate block">{item.title}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"><FiMinus size={12} /></button>
                      <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"><FiPlus size={12} /></button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm">${(item.price * item.qty).toFixed(2)}</p>
                    <button onClick={() => { removeItem(item._id); toast('Item removed'); }} className="text-gray-300 hover:text-red-500 transition-colors mt-2">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-xl mb-5">Order Summary</h2>

              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex justify-between text-gray-600"><span>Subtotal ({items.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3 mt-3"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
              </div>

              {/* Coupon */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="Coupon code"
                      className="input-field pl-8 text-xs"
                    />
                  </div>
                  <button onClick={applyCoupon} className="bg-brand text-white px-3 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">Apply</button>
                </div>
                {couponMsg && <p className={`text-xs mt-1.5 ${couponMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{couponMsg}</p>}
                <p className="text-[11px] text-gray-400 mt-1">Try: LUXORA10, SAVE20</p>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/checkout')} className="w-full bg-brand text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                <FiShoppingBag size={16} /> Proceed to Checkout
              </motion.button>

              <Link to="/products" className="block text-center text-xs text-gray-400 hover:text-brand transition-colors mt-3">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
