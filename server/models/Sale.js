const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopItem',
        required: true
    },
    itemName: String, // Denormalized for reports
    category: String, // Denormalized for reports
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    soldBy: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
