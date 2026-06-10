const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB — seeding...');

  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();

  // Users — plain text passwords, the User model's pre-save hook will hash them
  const admin = await User.create({
    name: 'Admin User', email: 'admin@luxora.com',
    password: 'admin123', role: 'admin',
  });
  const customer = await User.create({
    name: 'Ahmed Ali', email: 'ahmed@example.com',
    password: 'customer123', role: 'customer',
  });

  // Products — use create() (not insertMany) so pre-save hooks fire and slugs are generated
  const productDocs = [
    {
      title: 'Wireless Headphones Pro',
      price: 129.99,
      oldPrice: 179.99,
      description: 'Immersive 360° audio with ANC, 40hr battery, premium leather ear cups.',
      category: 'Electronics',
      stock: 47,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      featured: true
    },
    {
      title: 'Running Sneakers X1',
      price: 89.99,
      description: 'Lightweight performance sneakers with responsive cushioning and breathable mesh upper.',
      category: 'Fashion',
      stock: 23,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
      featured: true
    },
    {
      title: 'Smart Watch Pro',
      price: 249.99,
      oldPrice: 299.99,
      description: 'Health & fitness tracking, AMOLED display, 7-day battery life, GPS.',
      category: 'Electronics',
      stock: 12,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      featured: true
    },
    {
      title: 'Yoga Mat Premium',
      price: 45.99,
      description: 'Non-slip 6mm thick eco-friendly TPE yoga mat with alignment lines.',
      category: 'Sports',
      stock: 89,
      images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80']
    },
    {
      title: 'Coffee Maker Deluxe',
      price: 79.99,
      oldPrice: 99.99,
      description: 'Programmable 12-cup drip coffee maker with thermal carafe and built-in grinder.',
      category: 'Home',
      stock: 31,
      images: ['https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80']
    },
    {
      title: 'Urban Backpack',
      price: 59.99,
      description: 'Water-resistant 30L backpack with USB charging port, padded laptop sleeve.',
      category: 'Fashion',
      stock: 55,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80']
    },
    {
      title: 'Bluetooth Speaker',
      price: 49.99,
      oldPrice: 64.99,
      description: '360° surround sound, IPX7 waterproof, 24hr playtime, built-in power bank.',
      category: 'Electronics',
      stock: 67,
      images: ['https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80'],
      featured: true
    },
    {
      title: 'UV400 Sunglasses',
      price: 34.99,
      description: 'Polarized UV400 protection with titanium frame, unisex design.',
      category: 'Fashion',
      stock: 140,
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80']
    },
  ];
  const products = await Promise.all(productDocs.map(p => Product.create(p)));

  // Sample Order
  await Order.create({
    user: customer._id,
    orderItems: [{ product: products[0]._id, title: products[0].title, price: products[0].price, qty: 1, image: products[0].images[0] }],
    shippingAddress: { fullName: 'Ahmed Ali', address: '123 Main St', city: 'Lahore', postalCode: '54000', country: 'Pakistan' },
    paymentMethod: 'COD',
    totalPrice: 129.99,
    status: 'delivered',
  });

  console.log('✅ Seeded: 2 users, 8 products, 1 order');
  console.log('👤 Admin:    admin@luxora.com / admin123');
  console.log('👤 Customer: ahmed@example.com / customer123');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });
