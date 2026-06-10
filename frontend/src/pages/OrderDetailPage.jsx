import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiClock, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { PageLoader } from '../components/common/LoadingSpinner';
import { pageTransition } from '../animations/variants';
import toast from 'react-hot-toast';

const STEPS = ['pending','processing','shipped','delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(r => setOrder(r.data))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-16"><PageLoader /></div>;
  if (!order)  return <div className="pt-16 text-center py-20"><h2 className="font-display text-2xl">Order not found</h2><Link to="/orders" className="btn-primary inline-block mt-4">My Orders</Link></div>;

  const currentStep = STEPS.indexOf(order.status);
  const icons = [FiClock, FiPackage, FiTruck, FiCheck];

  return (
    <motion.div {...pageTransition} className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link to="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors mb-6">
          <FiArrowLeft size={14} /> Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-2xl">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border self-start sm:self-auto ${
            order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
            order.status === 'shipped'   ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>

        {/* Tracking steps */}
        {order.status !== 'cancelled' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-sm mb-5">Order Tracking</h2>
            <div className="flex items-start">
              {STEPS.map((step, i) => {
                const Icon = icons[i];
                const done    = i <= currentStep;
                const current = i === currentStep;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-2 text-center min-w-[4rem]">
                      <motion.div
                        initial={false}
                        animate={{ scale: current ? [1, 1.15, 1] : 1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${done ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'} ${current ? 'ring-4 ring-brand/20' : ''}`}
                      >
                        <Icon size={16} />
                      </motion.div>
                      <span className={`text-xs font-medium capitalize ${done ? 'text-brand' : 'text-gray-400'}`}>{step}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mt-5 mx-1 transition-colors duration-500 ${i < currentStep ? 'bg-brand' : 'bg-gray-100'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {order.trackingNumber && (
              <p className="text-xs text-gray-500 mt-4">Tracking #: <span className="font-mono font-semibold text-brand">{order.trackingNumber}</span></p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          {/* Items */}
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 font-semibold text-sm">Items Ordered</div>
            <div className="divide-y divide-gray-100">
              {order.orderItems.map(item => (
                <div key={item._id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 flex-shrink-0">
                    {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-xl" /> : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product}`} className="font-medium text-sm hover:text-gray-600 truncate block">{item.title}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-bold text-sm flex-shrink-0">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info panels */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><FiCreditCard size={14} /> Payment Summary</h3>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between"><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-green-600">Free</span> : `$${order.shippingPrice.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-sm text-brand pt-2 border-t border-gray-100"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                <p className="text-gray-500">Method: <span className="font-semibold text-brand">{order.paymentMethod}</span></p>
                <p className={`mt-1 font-semibold ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>{order.isPaid ? '✓ Paid' : '○ Payment pending'}</p>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><FiMapPin size={14} /> Shipping Address</h3>
              <div className="text-xs text-gray-500 space-y-0.5">
                <p className="font-semibold text-brand">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="pt-1">{order.shippingAddress.phone}</p>}
              </div>
              <p className={`text-xs font-semibold mt-3 ${order.isDelivered ? 'text-green-600' : 'text-amber-600'}`}>
                {order.isDelivered ? `✓ Delivered ${new Date(order.deliveredAt).toLocaleDateString()}` : '○ Not yet delivered'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailPage;
