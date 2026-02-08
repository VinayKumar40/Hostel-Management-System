const express = require('express');
const {
  createHostel,
  getAllHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
} = require('../controllers/hostelController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.post('/', roleMiddleware(['admin']), createHostel);
router.get('/', getAllHostels);
router.get('/:id', getHostelById);
router.put('/:id', roleMiddleware(['admin']), updateHostel);
router.delete('/:id', roleMiddleware(['admin']), deleteHostel);

module.exports = router;
