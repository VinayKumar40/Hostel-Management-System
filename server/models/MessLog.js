const mongoose = require('mongoose');

const messLogSchema = new mongoose.Schema({
    action: {
        type: String, // 'ENROLL', 'UNENROLL'
        required: true
    },
    studentName: String,
    studentId: String,
    performedBy: String, // Name of the warden/admin
    details: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('MessLog', messLogSchema);
