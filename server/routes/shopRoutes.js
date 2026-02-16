const express = require('express');
const router = express.Router();
const { getShopItems, addShopItem, updateStock, recordSale, getSalesInsights, deleteShopItem } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getShopItems);
router.get('/insights', protect, authorize('admin', 'warden'), getSalesInsights);
router.post('/', protect, authorize('admin', 'warden'), addShopItem);
router.post('/sale', protect, authorize('admin', 'warden'), recordSale);
router.put('/:id', protect, authorize('admin', 'warden'), updateStock);
router.delete('/:id', protect, authorize('admin', 'warden'), deleteShopItem);

module.exports = router;
