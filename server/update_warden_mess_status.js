const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_db';

async function updateWardenMessStatus() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Update all wardens to have active mess status
        const result = await User.updateMany(
            { role: 'warden' },
            { $set: { messStatus: 'active' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} warden(s) with active mess status`);

        // Verify the update
        const wardens = await User.find({ role: 'warden' }).select('name userId messStatus');
        console.log('\nWardens after update:');
        wardens.forEach(w => {
            console.log(`  - ${w.name} (${w.userId}): ${w.messStatus}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

updateWardenMessStatus();
