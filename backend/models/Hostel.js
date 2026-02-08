const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema(
  {
    hostelName: {
      type: String,
      required: [true, 'Please provide hostel name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
    },
    totalRooms: {
      type: Number,
      required: [true, 'Please provide total rooms'],
      min: 1,
    },
    availableRooms: {
      type: Number,
      required: [true, 'Please provide available rooms'],
      min: 0,
    },
    costPerBed: {
      type: Number,
      required: [true, 'Please provide cost per bed'],
      min: 0,
    },
    description: String,
    facilities: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hostel', hostelSchema);
