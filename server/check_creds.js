const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas');
        const admin = await User.findOne({ userId: '12303566' });
        if (admin) {
            console.log('Admin Found:', admin.name);
            console.log('Role:', admin.role);
            console.log('Email:', admin.email);
            // Don't log hash, just confirm it exists
            console.log('Password hash present:', !!admin.password);
        } else {
            console.log('Admin NOT found in database.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();
