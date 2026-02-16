const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['AC', 'Non-AC'],
        required: true,
        default: 'Non-AC'
    },
    seater: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    block: {
        type: String,
        enum: ['A', 'B'],
        required: true
    },
    occupants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
