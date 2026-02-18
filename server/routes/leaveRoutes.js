const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getStudentLeaves,
    getAllLeaves,
    updateLeaveStatus,
    recordGateEntry,
    createWardenLeave,
    getRecentGateActivity
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, applyLeave);
router.get('/student', protect, getStudentLeaves);
router.get('/', protect, authorize('admin', 'warden'), getAllLeaves);
router.put('/:id/status', protect, authorize('admin', 'warden'), updateLeaveStatus);
router.put('/:id/gate', protect, authorize('admin', 'warden'), recordGateEntry);
router.post('/warden-create', protect, authorize('admin', 'warden'), createWardenLeave);
router.get('/activity', protect, authorize('admin', 'warden'), getRecentGateActivity);

module.exports = router;
