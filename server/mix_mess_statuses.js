const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Mess = require('./models/Mess');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function mixMessStatuses() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // 1. Reset all to inactive
        await Student.updateMany({}, { $set: { messStatus: 'inactive' } });
        console.log('Reset all students to inactive.');

        // 2. Get all students and shuffle
        const allStudents = await Student.find({});
        const shuffled = allStudents.sort(() => 0.5 - Math.random());

        // 3. Pick 157 random students
        const activeStudents = shuffled.slice(0, 157);
        const activeIds = activeStudents.map(s => s._id);

        // 4. Update Student status to 'active'
        await Student.updateMany(
            { _id: { $in: activeIds } },
            { $set: { messStatus: 'active' } }
        );
        console.log(`Randomly assigned ${activeIds.length} students to active status.`);

        // 5. Update Mess collection
        const mess = await Mess.findOne({ name: 'Central Hostel Mess' });
        if (mess) {
            mess.students = activeIds;
            await mess.save();
            console.log('Updated Central Hostel Mess with the random sample.');
        }

        console.log('Mixing complete. The USER section will now show a random distribution of active/inactive students.');
        process.exit(0);
    } catch (err) {
        console.error('Mixing failed:', err);
        process.exit(1);
    }
}

mixMessStatuses();
