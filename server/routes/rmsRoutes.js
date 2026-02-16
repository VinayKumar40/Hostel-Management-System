const express = require('express');
const router = express.Router();
const {
    createRequest,
    getStudentRequests,
    getAllRequests,
    addReply,
    updateStatus
} = require('../controllers/rmsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student', 'admin', 'warden'), createRequest);
router.get('/student', protect, authorize('student'), getStudentRequests);
router.get('/', protect, authorize('admin', 'warden'), getAllRequests);
router.post('/:id/reply', protect, addReply);
router.put('/:id/status', protect, authorize('admin', 'warden'), updateStatus);

module.exports = router;
