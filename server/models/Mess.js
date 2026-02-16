const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Central Hostel Mess'
    },
    description: {
        type: String,
        default: 'Unified hostel dining facility providing North & South Indian cuisines.'
    },
    timings: {
        breakfast: { type: String, default: '7:30 AM – 9:30 AM' },
        lunch: { type: String, default: '11:30 AM – 2:30 PM' },
        tea: { type: String, default: '4:45 PM – 5:45 PM' },
        dinner: { type: String, default: '7:30 PM – 9:30 PM' }
    },
    weeklyMenu: {
        type: Map,
        of: {
            breakfast: {
                north: String,
                south: String
            },
            lunch: {
                north: String,
                south: String
            },
            tea: {
                menu: String
            },
            dinner: {
                north: String,
                south: String
            }
        }
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Mess', messSchema);
