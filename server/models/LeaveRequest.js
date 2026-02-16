const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    term: {
        type: String,
        required: true,
        default: 'Term-II (January-May)'
    },
    leaveType: {
        type: String,
        enum: ['Day Leave', 'Night Leave'],
        required: true
    },
    visitPlace: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    recommendingAuthority: {
        type: String,
        default: 'Pending'
    },
    sanctioningAuthority: {
        type: String,
        default: 'Pending'
    },
    checkOutTime: {
        type: Date
    },
    checkInTime: {
        type: Date
    },
    actualReturnDate: {
        type: Date
    },
    leaveExtendedDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
