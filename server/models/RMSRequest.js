const mongoose = require('mongoose');

const rmsRequestSchema = new mongoose.Schema({
    rmsId: {
        type: String,
        required: true,
        unique: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: false
    },
    studentName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'Room Issues',
            'Washroom',
            'Electricity',
            'Water Supply',
            'Cleanliness',
            'Safety',
            'Staff Behavior',
            'Food (Non-Mess)',
            'Common Area Maintenance'
        ],
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    closingRemarks: String,
    replies: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        senderName: String,
        senderRole: {
            type: String,
            enum: ['admin', 'warden', 'student']
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [String], // Array of URLs
    roomNumber: String,
    block: String,
    reportedBy: {
        type: String,
        default: 'Warden/Office'
    }
}, { timestamps: true });

module.exports = mongoose.model('RMSRequest', rmsRequestSchema);
