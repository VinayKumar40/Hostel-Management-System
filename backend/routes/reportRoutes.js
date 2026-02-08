const express = require('express');
const {
  createReport,
  getAllReports,
  getReportById,
  deleteReport,
  getDashboardStats,
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Dashboard statistics (admin only)
router.get('/dashboard/stats', roleMiddleware(['admin']), getDashboardStats);

// CRUD operations (admin only)
router.post('/', roleMiddleware(['admin']), createReport);
router.get('/', roleMiddleware(['admin']), getAllReports);
router.get('/:id', roleMiddleware(['admin']), getReportById);
router.delete('/:id', roleMiddleware(['admin']), deleteReport);

module.exports = router;
