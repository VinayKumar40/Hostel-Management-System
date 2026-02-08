const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    settingKey: {
      type: String,
      required: [true, 'Please provide setting key'],
      unique: true,
      trim: true,
    },
    settingValue: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please provide setting value'],
    },
    description: String,
    dataType: {
      type: String,
      enum: ['string', 'number', 'boolean', 'array'],
      default: 'string',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
