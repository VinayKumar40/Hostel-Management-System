const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_db';

async function fixWardenName() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Update warden name from "Adel Muhmaad" to "Adel Muhammed"
        const result = await User.updateOne(
            { userId: 'WARDEN002' },
            { $set: { name: 'Adel Muhammed' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} warden name(s)`);

        // Verify the update
        const warden = await User.findOne({ userId: 'WARDEN002' }).select('name userId');
        console.log(`\nWarden after update: ${warden.name} (${warden.userId})`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixWardenName();
