const asyncHandler = require('express-async-handler');
const Order   = require('../models/Order');
const Product = require('../models/Product');

// @desc  Create order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, coupon } = req.body;
  if (!orderItems || orderItems.length === 0)
    return res.status(400).json({ message: 'No items in order' });

  // Validate stock and calculate prices
  let itemsPrice = 0;
  const validatedItems = [];
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
    if (product.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
    itemsPrice += product.price * item.qty;
    validatedItems.push({ product: product._id, title: product.title, image: product.images[0] || '', price: product.price, qty: item.qty });
  }

  // Discount logic
  let discount = 0;
  if (coupon === 'LUXORA10') discount = itemsPrice * 0.10;
  if (coupon === 'SAVE20')   discount = itemsPrice * 0.20;

  const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
  const taxPrice      = Number(((itemsPrice - discount) * 0.08).toFixed(2));
  const totalPrice    = Number((itemsPrice - discount + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id, orderItems: validatedItems, shippingAddress,
    paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice,
    coupon: coupon || '', discount,
  });

  // Deduct stock
  for (const item of validatedItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty, sold: item.qty } });
  }

  res.status(201).json(order);
});

// @desc  Get my orders
// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt').populate('orderItems.product', 'title images');
  res.json(orders);
});

// @desc  Get single order
// @route GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'title images');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
});

// @desc  Get all orders (admin)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const total  = await Order.countDocuments(query);
  const orders = await Order.find(query).sort('-createdAt').limit(Number(limit)).skip((page - 1) * limit).populate('user', 'name email');
  res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc  Update order status (admin)
// @route PUT /api/orders/:id
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status || order.status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  if (status === 'processing' && order.paymentMethod !== 'COD') { order.isPaid = true; order.paidAt = Date.now(); }

  const updated = await order.save();
  res.json(updated);
});

// @desc  Admin analytics
// @route GET /api/orders/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const totalRevenue  = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
  const totalOrders   = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const monthlyRevenue = await Order.aggregate([
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);
  res.json({ totalRevenue: totalRevenue[0]?.total || 0, totalOrders, pendingOrders, monthlyRevenue });
});

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getAnalytics };
