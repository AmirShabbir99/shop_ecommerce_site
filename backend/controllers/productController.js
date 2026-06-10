const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Get all products (with filter/sort/paginate)
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, page = 1, limit = 12, minPrice, maxPrice, featured } = req.query;
  const query = { isActive: true };

  if (category)          query.category = category;
  if (featured === 'true') query.featured = true;
  if (search)            query.$text = { $search: search };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = { newest: '-createdAt', oldest: 'createdAt', low: 'price', high: '-price', rating: '-rating', popular: '-sold' };
  const sortBy = sortMap[sort] || '-createdAt';

  const total    = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortBy).limit(Number(limit)).skip((page - 1) * limit);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @desc  Get single product
// @route GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product removed' });
});

// @desc  Add review
// @route POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (already) return res.status(400).json({ message: 'You already reviewed this product' });

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.updateRating();
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// @desc  Get categories list
// @route GET /api/products/categories
const getCategories = asyncHandler(async (req, res) => {
  const cats = await Product.distinct('category', { isActive: true });
  res.json(cats);
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, getCategories };
