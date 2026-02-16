const express = require('express');
const router = express.Router();
const { getWardens, createWarden, getStudents, createStudent, deleteStudent, shiftStudent } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Warden routes - Admin only
router.get('/wardens', protect, authorize('admin'), getWardens);
router.post('/wardens', protect, authorize('admin'), createWarden);

// Student routes - Admin and Warden
router.get('/students/search', protect, authorize('admin', 'warden'), require('../controllers/userController').searchStudents);
router.get('/students', protect, authorize('admin', 'warden'), getStudents);
router.post('/students', protect, authorize('admin', 'warden'), createStudent);
router.delete('/students/:id', protect, authorize('admin'), deleteStudent);
router.put('/students/:id/shift', protect, authorize('admin', 'warden'), shiftStudent);

module.exports = router;
