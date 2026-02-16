const express = require('express');
const router = express.Router();
const { getMessDetails, updateMessMenu, enrollStudent, unenrollStudent } = require('../controllers/messController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getMessDetails);
router.put('/:id', protect, authorize('admin', 'warden'), updateMessMenu);
router.post('/enroll', protect, enrollStudent);
router.post('/unenroll', protect, unenrollStudent);

module.exports = router;
