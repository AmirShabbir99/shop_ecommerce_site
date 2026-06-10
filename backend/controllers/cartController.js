const asyncHandler = require('express-async-handler');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Get cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title images price stock');
  res.json(cart || { items: [], total: 0 });
});

// @desc  Add / update item in cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < qty) return res.status(400).json({ message: 'Not enough stock' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) existing.qty = Math.min(existing.qty + qty, product.stock);
  else cart.items.push({ product: productId, title: product.title, image: product.images[0] || '', price: product.price, qty });

  await cart.save();
  res.json(cart);
});

// @desc  Update item qty
// @route PUT /api/cart/:productId
const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  if (qty <= 0) cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  else item.qty = qty;

  await cart.save();
  res.json(cart);
});

// @desc  Remove item
// @route DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

// @desc  Clear cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
