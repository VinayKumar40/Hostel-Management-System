const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get('/', roleMiddleware(['admin']), getAllUsers);

// Get current user profile
router.get('/profile/me', getCurrentUserProfile);

// Get user by ID, update, delete
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', roleMiddleware(['admin']), deleteUser);

module.exports = router;
