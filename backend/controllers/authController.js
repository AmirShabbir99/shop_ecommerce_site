const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

// @desc  Register user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please fill all fields' });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    token: generateToken(user._id),
  });
});

// @desc  Login user
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email });
  console.log("user ::",user)
  console.log("password ::",password)
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  if (!user.isActive)
    return res.status(403).json({ message: 'Account has been deactivated' });

  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    avatar: user.avatar, token: generateToken(user._id),
  });
});

// @desc  Get current user profile
// @routes GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title price images');
  res.json(user);
});
// @route PUT /api/auth/me
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, phone, password } = req.body;
  if (name)  user.name  = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (password) user.password = password;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, token: generateToken(updated._id) });
});

// @desc  Add address
// @route POST /api/auth/address
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.json(user.addresses);
});

module.exports = { register, login, getMe, updateProfile, addAddress };
