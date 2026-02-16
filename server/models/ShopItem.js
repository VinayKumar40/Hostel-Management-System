const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    threshold: {
        type: Number,
        required: true,
        default: 10
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Packed Snacks',
            'Ready-to-Eat',
            'Ice Creams',
            'Beverages',
            'Dairy Products',
            'Daily-Use Essentials',
            'Stationery',
            'Chocolates'
        ]
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    isIndianBrand: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ShopItem', shopItemSchema);
