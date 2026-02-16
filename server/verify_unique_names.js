const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_db';

async function verifyUniqueNames() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Get all students
        const students = await Student.find().select('name studentId phone').sort({ name: 1 });

        console.log(`Total students in database: ${students.length}`);

        // Check for unique names
        const nameSet = new Set(students.map(s => s.name));
        console.log(`Unique names: ${nameSet.size}`);
        console.log(`All unique? ${nameSet.size === students.length ? '✅ YES' : '❌ NO'}\n`);

        // Show first 20 students
        console.log('First 20 students:');
        students.slice(0, 20).forEach((s, idx) => {
            console.log(`${idx + 1}. ${s.name} (ID: ${s.studentId})`);
        });

        // Check for any duplicates
        const nameCounts = {};
        students.forEach(s => {
            nameCounts[s.name] = (nameCounts[s.name] || 0) + 1;
        });

        const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1);
        if (duplicates.length > 0) {
            console.log('\n❌ DUPLICATES FOUND:');
            duplicates.forEach(([name, count]) => {
                console.log(`  ${name}: ${count} times`);
            });
        } else {
            console.log('\n✅ No duplicates found! All student names are unique.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

verifyUniqueNames();
