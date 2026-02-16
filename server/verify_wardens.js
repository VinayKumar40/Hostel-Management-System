const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_db';

async function verifyWardens() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Get all wardens with messStatus
        const wardens = await User.find({ role: 'warden' }).select('name userId phone messStatus assignedBlock roomNumber');

        console.log(`Total wardens: ${wardens.length}\n`);

        wardens.forEach(w => {
            console.log(`Warden: ${w.name}`);
            console.log(`  User ID: ${w.userId}`);
            console.log(`  Phone: ${w.phone}`);
            console.log(`  Mess Status: ${w.messStatus}`);
            console.log(`  Assigned Block: ${w.assignedBlock}`);
            console.log(`  Room Number: ${w.roomNumber}`);
            console.log('');
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

verifyWardens();
