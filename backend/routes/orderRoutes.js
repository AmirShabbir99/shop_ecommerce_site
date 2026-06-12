// routes/orderRoutes.js
const express = require('express');
const router  = express.Router();
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, getAnalytics } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
//order routes
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/my',        protect, getMyOrders);
router.get('/',          protect, adminOnly, getAllOrders);
router.get('/:id',       protect, getOrder);
router.post('/',         protect, createOrder);
router.put('/:id',       protect, adminOnly, updateOrderStatus);

module.exports = router;
