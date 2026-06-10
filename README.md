# 🛒 Luxora – Full-Stack E-Commerce Platform

A production-ready, Shopify-style e-commerce application built with React, Node.js, Express, and MongoDB.

---

## 🚀 Tech Stack

| Layer       | Tech                                          |
|-------------|-----------------------------------------------|
| Frontend    | React 18, Tailwind CSS, Framer Motion         |
| Backend     | Node.js, Express.js                           |
| Database    | MongoDB + Mongoose                            |
| Auth        | JWT + Bcrypt + Role-based access              |
| Charts      | Recharts                                      |
| Notifications | React Hot Toast                             |

---

## 📁 Project Structure

```
luxora/
├── backend/
│   ├── config/         # DB connection + seed script
│   ├── controllers/    # Business logic (auth, product, order, user, cart)
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas (User, Product, Order, Cart)
│   ├── routes/         # Express route definitions
│   └── server.js       # Entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── animations/     # Framer Motion variants
        ├── components/
        │   ├── admin/      # Admin panel (Dashboard, Orders, Products, Users, Analytics, Settings)
        │   ├── common/     # Spinner, Skeleton, ProtectedRoute
        │   ├── layout/     # Navbar, Footer
        │   └── product/    # ProductCard
        ├── context/        # AuthContext, CartContext
        ├── pages/          # All customer pages
        ├── services/       # Axios API layer
        └── App.jsx         # Router + layout
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env      # Edit with your MongoDB URI & JWT secret

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/luxora
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Seed Database (optional but recommended)

```bash
cd backend
npm run seed
```

This creates:
- **Admin:** `admin@luxora.com` / `admin123`
- **Customer:** `ahmed@example.com` / `customer123`
- 8 sample products + 1 sample order

### 4. Run the App

```bash
# Terminal 1 – Backend
cd backend
npm run dev      # runs on http://localhost:5000

# Terminal 2 – Frontend
cd frontend
npm start        # runs on http://localhost:3000
```

---

## 🔐 API Endpoints

### Auth
| Method | Route                  | Access    |
|--------|------------------------|-----------|
| POST   | `/api/auth/register`   | Public    |
| POST   | `/api/auth/login`      | Public    |
| GET    | `/api/auth/me`         | Protected |
| PUT    | `/api/auth/me`         | Protected |

### Products
| Method | Route                        | Access    |
|--------|------------------------------|-----------|
| GET    | `/api/products`              | Public    |
| GET    | `/api/products/:id`          | Public    |
| POST   | `/api/products`              | Admin     |
| PUT    | `/api/products/:id`          | Admin     |
| DELETE | `/api/products/:id`          | Admin     |
| POST   | `/api/products/:id/reviews`  | Protected |

### Orders
| Method | Route                  | Access    |
|--------|------------------------|-----------|
| POST   | `/api/orders`          | Protected |
| GET    | `/api/orders/my`       | Protected |
| GET    | `/api/orders`          | Admin     |
| GET    | `/api/orders/:id`      | Protected |
| PUT    | `/api/orders/:id`      | Admin     |
| GET    | `/api/orders/analytics`| Admin     |

### Users
| Method | Route          | Access |
|--------|----------------|--------|
| GET    | `/api/users`   | Admin  |
| PUT    | `/api/users/:id` | Admin |
| DELETE | `/api/users/:id` | Admin |

### Cart
| Method | Route                  | Access    |
|--------|------------------------|-----------|
| GET    | `/api/cart`            | Protected |
| POST   | `/api/cart`            | Protected |
| PUT    | `/api/cart/:productId` | Protected |
| DELETE | `/api/cart/:productId` | Protected |
| DELETE | `/api/cart`            | Protected |

---

## ✨ Features

### Customer Side
- ✅ Browse & search products with filters + sorting
- ✅ Animated product cards with stagger effects
- ✅ Product detail page with image gallery & reviews
- ✅ Cart with quantity control, remove animations, coupon codes
- ✅ Multi-step checkout (address → payment)
- ✅ Payment: COD, JazzCash, EasyPaisa, Card
- ✅ Order tracking with status timeline
- ✅ User profile with password change
- ✅ JWT authentication

### Admin Panel
- ✅ Dashboard with revenue/order stats
- ✅ Interactive Recharts (Area, Bar, Pie charts)
- ✅ Orders management with status updates
- ✅ Product CRUD (add/edit/delete with image upload)
- ✅ User management (activate/deactivate, role toggle)
- ✅ Analytics page with growth metrics
- ✅ Settings panel

### Animations (Framer Motion)
- ✅ Page transitions
- ✅ Hero slide-in animations
- ✅ Product cards whileInView with stagger
- ✅ Cart item add/remove animations
- ✅ Button hover scale + tap scale
- ✅ Modal/drawer spring animations
- ✅ Order tracking step animations
- ✅ Mobile drawer slide-in

---

## 🎨 Design Tokens

| Token    | Value     |
|----------|-----------|
| Brand    | `#0A0A0A` |
| Accent   | `#E8C547` |
| Accent2  | `#FF6B35` |
| BG       | `#FAFAF8` |
| Font     | DM Sans + Playfair Display |
| Radius   | `12px`    |

---

## 📱 Responsive Breakpoints

- Mobile: 1 column grid
- Tablet: 2 column grid
- Desktop: 3–4 column grid
- Admin sidebar: collapses to drawer on mobile

---

## 🧪 Test Accounts (after seeding)

| Role     | Email                   | Password     |
|----------|-------------------------|--------------|
| Admin    | admin@luxora.com        | admin123     |
| Customer | ahmed@example.com       | customer123  |

---

## 📦 Coupon Codes

| Code       | Discount |
|------------|----------|
| `LUXORA10` | 10% off  |
| `SAVE20`   | 20% off  |
