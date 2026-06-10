const express = require('express');
const router  = express.Router();
const { getUsers, getUser, updateUser, deleteUser, toggleWishlist } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',                        protect, adminOnly, getUsers);
router.get('/:id',                     protect, adminOnly, getUser);
router.put('/:id',                     protect, adminOnly, updateUser);
router.delete('/:id',                  protect, adminOnly, deleteUser);
router.post('/wishlist/:productId',    protect, toggleWishlist);

module.exports = router;
