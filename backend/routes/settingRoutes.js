const express = require('express');
const {
  getAllSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
} = require('../controllers/settingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all settings
router.get('/', getAllSettings);

// Get, update, delete by key (update/delete admin only)
router.get('/:key', getSettingByKey);
router.put('/:key', roleMiddleware(['admin']), updateSetting);
router.delete('/:key', roleMiddleware(['admin']), deleteSetting);

module.exports = router;
