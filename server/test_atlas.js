const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;

async function test() {
    console.log('Testing connection to:', uri.split('@')[1]); // Log without credentials
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Successfully connected!');
        console.log('Connection readyState:', mongoose.connection.readyState);

        // Try a raw command
        const admin = mongoose.connection.db.admin();
        const info = await admin.serverStatus();
        console.log('Server status version:', info.version);

        process.exit(0);
    } catch (err) {
        console.error('Test failed!');
        console.error('Error Code:', err.code);
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        process.exit(1);
    }
}

test();
