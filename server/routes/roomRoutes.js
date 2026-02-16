const express = require('express');
const router = express.Router();
const { getRooms, createRoom, allocateRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getRooms);
router.post('/', protect, authorize('admin'), createRoom);
router.post('/allocate', protect, authorize('admin', 'warden'), allocateRoom);

module.exports = router;
