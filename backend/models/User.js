const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String,  trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar:    { type: String, default: '' },
  phone:     { type: String, default: '' },
  addresses: [{
    label:      String,
    address:    String,
    city:       String,
    postalCode: String,
    country:    String,
    isDefault:  { type: Boolean, default: false },
  }],
  wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  const result = await bcrypt.compare(entered, this.password);
  console.log("COMPARE RESULT:", result);
  return result;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
