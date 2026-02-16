const ShopItem = require('../models/ShopItem');
const Sale = require('../models/Sale');

const getShopItems = async (req, res) => {
    try {
        const items = await ShopItem.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addShopItem = async (req, res) => {
    const { itemName, price, quantity, threshold, category, isVeg, isIndianBrand } = req.body;
    try {
        const item = await ShopItem.create({
            itemName, price, quantity, threshold, category, isVeg, isIndianBrand
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const recordSale = async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        const item = await ShopItem.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (item.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        item.quantity -= quantity;
        await item.save();

        const sale = await Sale.create({
            item: item._id,
            itemName: item.itemName,
            category: item.category,
            quantity,
            totalAmount: quantity * item.price,
            soldBy: req.user.name
        });

        res.status(201).json({ sale, updatedItem: item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSalesInsights = async (req, res) => {
    const { range } = req.query; // 'day', 'week', 'month' or default
    let startDate = new Date();

    if (range === 'day') {
        startDate.setHours(0, 0, 0, 0);
    } else if (range === 'week') {
        startDate.setDate(startDate.getDate() - 7);
    } else if (range === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
    } else {
        startDate = new Date(0); // All time
    }

    try {
        const insights = await Sale.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$category',
                    totalSales: { $sum: '$totalAmount' },
                    itemCount: { $sum: '$quantity' }
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        const itemMovement = await Sale.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$itemName',
                    totalQuantity: { $sum: '$quantity' },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
        ]);

        // Daily breakdown for graph
        const dailyTrends = await Sale.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    sales: { $sum: "$quantity" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({ insights, itemMovement, dailyTrends });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStock = async (req, res) => {
    const { quantity, threshold, price } = req.body;
    try {
        const item = await ShopItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        if (quantity !== undefined) item.quantity = quantity;
        if (threshold !== undefined) item.threshold = threshold;
        if (price !== undefined) item.price = price;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteShopItem = async (req, res) => {
    try {
        const item = await ShopItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getShopItems,
    addShopItem,
    recordSale,
    getSalesInsights,
    updateStock,
    deleteShopItem
};
