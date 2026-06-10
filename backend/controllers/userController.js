const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc  Get all users (admin)
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
  const total = await User.countDocuments(query);
  const users = await User.find(query).sort('-createdAt').limit(Number(limit)).skip((page - 1) * limit);
  res.json({ users, total });
});

// @desc  Get single user (admin)
// @route GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// @desc  Update user role / status (admin)
// @route PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { role, isActive } = req.body;
  if (role !== undefined)     user.role     = role;
  if (isActive !== undefined) user.isActive = isActive;
  const updated = await user.save();
  res.json(updated);
});

// @desc  Delete user (admin)
// @route DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deactivated' });
});

// @desc  Toggle wishlist item
// @route POST /api/users/wishlist/:productId
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid  = req.params.productId;
  const idx  = user.wishlist.indexOf(pid);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else          user.wishlist.push(pid);
  await user.save();
  res.json({ wishlist: user.wishlist });
});

module.exports = { getUsers, getUser, updateUser, deleteUser, toggleWishlist };
