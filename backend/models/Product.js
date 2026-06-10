const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  oldPrice:    { type: Number, default: null },
  images:      [{ type: String }],
  category:    { type: String, required: true, enum: ['Electronics', 'Fashion', 'Sports', 'Home', 'Beauty', 'Books', 'Other'] },
  brand:       { type: String, default: '' },
  stock:       { type: Number, required: true, default: 0 },
  sold:        { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  tags:        [{ type: String }],
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Update rating on review change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.rating = 0; this.numReviews = 0; return; }
  this.numReviews = this.reviews.length;
  this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
