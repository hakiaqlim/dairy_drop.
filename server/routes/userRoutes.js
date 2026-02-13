const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    authAdmin,
    registerAdmin,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/admin', registerAdmin);
router.post('/login', authUser);
router.post('/admin/login', authAdmin);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
