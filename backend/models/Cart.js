const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title:   String,
  image:   String,
  price:   Number,
  qty:     { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

cartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
