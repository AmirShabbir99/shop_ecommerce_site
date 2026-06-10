import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});
console.log("api :",api)
// Attach token on every request
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('luxora_user');
  console.log("USER :",user)
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('luxora_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// --- Auth ---
export const authAPI = {
  register:      (data)   => api.post('/auth/register', data),
  login:         (data)   => api.post('/auth/login', data),
  getMe:         ()       => api.get('/auth/me'),
  updateProfile: (data)   => api.put('/auth/me', data),
  addAddress:    (data)   => api.post('/auth/address', data),
};

// --- Products ---
export const productAPI = {
  getAll:        (params) => api.get('/products', { params }),
  getOne:        (id)     => api.get(`/products/${id}`),
  create:        (data)   => api.post('/products', data),
  update:        (id, data) => api.put(`/products/${id}`, data),
  remove:        (id)     => api.delete(`/products/${id}`),
  addReview:     (id, data) => api.post(`/products/${id}/reviews`, data),
  getCategories: ()       => api.get('/products/categories'),
};

// --- Orders ---
export const orderAPI = {
  create:        (data)   => api.post('/orders', data),
  getMyOrders:   ()       => api.get('/orders/my'),
  getOne:        (id)     => api.get(`/orders/${id}`),
  getAll:        (params) => api.get('/orders', { params }),
  updateStatus:  (id, data) => api.put(`/orders/${id}`, data),
  getAnalytics:  ()       => api.get('/orders/analytics'),
};

// --- Users (Admin) ---
export const userAPI = {
  getAll:        (params) => api.get('/users', { params }),
  getOne:        (id)     => api.get(`/users/${id}`),
  update:        (id, data) => api.put(`/users/${id}`, data),
  remove:        (id)     => api.delete(`/users/${id}`),
  toggleWishlist:(pid)    => api.post(`/users/wishlist/${pid}`),
};

export default api;
