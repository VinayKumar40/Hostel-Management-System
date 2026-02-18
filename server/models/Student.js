const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: { // Unique ID
        type: String,
        required: true,
        unique: true
    },
    email: { // Optional, for contact
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: 'password' // Default password, should be changed
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    messStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    messType: { // e.g. Veg, Non-Veg
        type: String,
        default: 'Veg'
    },
    balance: { // For shop/mess dues
        type: Number,
        default: 0
    },
    bedLetter: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        default: 'A'
    },
    // Personal & Address
    city: String,
    state: String,
    address: String,
    // Family
    motherName: String,
    fatherName: String,
    parentPhone: String,
    // Academic
    course: {
        type: String,
        enum: ['B.Tech', 'MBA', 'B.Sc', 'BBA', 'B.Des', 'LL.B', 'M.Tech'],
        default: 'B.Tech'
    },
    branch: String, // e.g., Computer Science
    year: {
        type: Number,
        default: 1
    },
    // Records & Finance
    disciplinaryRecord: [{
        caseType: { type: String, enum: ['MINOR', 'MAJOR'] },
        description: String,
        date: { type: Date, default: Date.now }
    }],
    feesPaid: {
        type: Boolean,
        default: false
    },
    dayLeaveBalance: {
        type: Number,
        default: 75
    },
    nightLeaveBalance: {
        type: Number,
        default: 60
    },
    role: {
        type: String,
        default: 'student',
        immutable: true
    }
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password
studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
