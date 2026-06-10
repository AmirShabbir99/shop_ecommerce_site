import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';

// Route guards
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Customer Pages
import HomePage         from './pages/HomePage';
import ProductsPage     from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage         from './pages/CartPage';
import CheckoutPage     from './pages/CheckoutPage';
import OrdersPage       from './pages/OrdersPage';
import OrderDetailPage  from './pages/OrderDetailPage';
import AuthPage         from './pages/AuthPage';
import ProfilePage      from './pages/ProfilePage';

// Admin
import AdminLayout    from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminOrders    from './components/admin/AdminOrders';
import AdminProducts  from './components/admin/AdminProducts';
import AdminUsers     from './components/admin/AdminUsers';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminSettings  from './components/admin/AdminSettings';

// Store layout wrapper (with Navbar + Footer)
const StoreLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '10px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' },
              success: { style: { background: '#0A0A0A', color: '#fff' } },
              error:   { style: { background: '#ef4444', color: '#fff' } },
            }}
          />

          <Routes>
            {/* ── Customer store routes ── */}
            <Route path="/" element={
              <StoreLayout>
                <HomePage />
              </StoreLayout>
            } />

            <Route path="/products" element={
              <StoreLayout>
                <ProductsPage />
              </StoreLayout>
            } />

            <Route path="/products/:id" element={
              <StoreLayout>
                <ProductDetailPage />
              </StoreLayout>
            } />

            <Route path="/cart" element={
              <StoreLayout>
                <CartPage />
              </StoreLayout>
            } />

            <Route path="/checkout" element={
              <StoreLayout>
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              </StoreLayout>
            } />

            <Route path="/orders" element={
              <StoreLayout>
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              </StoreLayout>
            } />

            <Route path="/orders/:id" element={
              <StoreLayout>
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              </StoreLayout>
            } />

            <Route path="/profile" element={
              <StoreLayout>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </StoreLayout>
            } />

            {/* ── Auth routes ── */}
            <Route path="/login"    element={<AuthPage mode="login"    />} />
            <Route path="/register" element={<AuthPage mode="register" />} />

            {/* ── Admin routes (nested, own layout) ── */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index                  element={<AdminDashboard />} />
              <Route path="orders"          element={<AdminOrders />} />
              <Route path="products"        element={<AdminProducts />} />
              <Route path="users"           element={<AdminUsers />} />
              <Route path="analytics"       element={<AdminAnalytics />} />
              <Route path="settings"        element={<AdminSettings />} />
            </Route>

            {/* ── Fallback ── */}
            <Route path="*" element={
              <StoreLayout>
                <div className="pt-16 flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="font-display text-8xl font-bold text-gray-200">404</h1>
                    <p className="font-display text-2xl mt-4 mb-2">Page not found</p>
                    <p className="text-gray-500 text-sm mb-6">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary inline-block">Go Home</a>
                  </div>
                </div>
              </StoreLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
