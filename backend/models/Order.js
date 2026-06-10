const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title:   { type: String, required: true },
  image:   { type: String, default: '' },
  price:   { type: Number, required: true },
  qty:     { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName:   { type: String, required: true },
    address:    { type: String, required: true },
    city:       { type: String, required: true },
    postalCode: { type: String, required: true },
    country:    { type: String, required: true },
    phone:      { type: String, default: '' },
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'JazzCash', 'EasyPaisa', 'Card'],
    default: 'COD',
  },
  paymentResult: {
    id:         String,
    status:     String,
    updateTime: String,
    email:      String,
  },
  itemsPrice:    { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  taxPrice:      { type: Number, required: true, default: 0 },
  totalPrice:    { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid:        { type: Boolean, default: false },
  paidAt:        { type: Date },
  isDelivered:   { type: Boolean, default: false },
  deliveredAt:   { type: Date },
  trackingNumber: { type: String, default: '' },
  notes:         { type: String, default: '' },
  coupon:        { type: String, default: '' },
  discount:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
