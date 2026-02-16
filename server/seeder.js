const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const bcrypt = require('bcryptjs');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_db';

async function seed() {
    try {
        console.log('Connecting to:', MONGO_URI);
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });

        console.log('Connection state:', mongoose.connection.readyState);
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection not established (state ' + mongoose.connection.readyState + ')');
        }
        console.log('Connected!');

        const userId = '12303566';
        const existing = await User.findOne({ userId });

        if (existing) {
            console.log('Admin already exists. Checking rooms...');
        } else {
            console.log('Creating Admin...');
            await User.create({
                name: 'Vinay Admin',
                userId: userId,
                email: 'admin@hostel.com',
                password: 'VINAY0802',
                role: 'admin'
            });
            console.log('Admin created successfully!');
        }

        // Seed Rooms
        console.log('Resetting rooms collection...');
        await Room.deleteMany({}); // Clear existing to avoid conflicts

        console.log('Seeding 100 rooms with new format...');
        const rooms = [];

        // Block A: A101-A150
        for (let i = 1; i <= 50; i++) {
            rooms.push({
                roomNumber: `A${100 + i}`,
                block: 'A',
                type: i <= 10 ? 'AC' : 'Non-AC',
                seater: (i % 3) + 1,
                price: i <= 10 ? 5000 : 3000,
                occupants: []
            });
        }

        // Block B: B101-B150
        for (let i = 1; i <= 50; i++) {
            rooms.push({
                roomNumber: `B${100 + i}`,
                block: 'B',
                type: i <= 10 ? 'AC' : 'Non-AC',
                seater: (i % 3) + 1,
                price: i <= 10 ? 5000 : 3000,
                occupants: []
            });
        }

        await Room.insertMany(rooms);
        console.log('100 Rooms (A101-A150, B101-B150) seeded successfully!');

        process.exit(0);
    } catch (err) {
        console.log('--- SEEDING FAILED ---');
        console.log('Error Message:', err.message);
        console.log('Error Code:', err.code);
        if (err.errors) {
            console.log('Validation Errors:', Object.keys(err.errors));
        }
        process.exit(1);
    }
}

seed();
