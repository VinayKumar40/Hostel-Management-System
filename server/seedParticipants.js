const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Room = require('./models/Room');
const Mess = require('./models/Mess'); // Added Mess model
const fs = require('fs');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_db';

async function seedParticipants() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Clear existing Students and User (except Admin)
        await Student.deleteMany({});
        // Keep the main admin (12303566)
        await User.deleteMany({ userId: { $nin: ['12303566'] } });

        // Clear all room occupants
        await Room.updateMany({}, { occupants: [] });

        // 2. Create Warden (Adel)
        // Vinay is already created as Admin in seeder.js
        console.log('Creating Warden (Adel)...');
        const adel = await User.create({
            name: 'Adel Muhammed',
            userId: 'WARDEN002',
            email: 'adel.warden@hostel.com',
            phone: '8848259876',
            password: 'ADEL002',
            role: 'warden',
            assignedBlock: 'Boys Hostel',
            roomNumber: '1B',
            messStatus: 'active'
        });
        console.log('Warden (Adel) created successfully!');

        // Update Vinay Admin just in case he lost his room during participants reset
        await User.updateOne({ userId: '12303566' }, { $set: { roomNumber: '1A', messStatus: 'active' } });
        const vinay = await User.findOne({ userId: '12303566' });

        // 3. Load Student Data
        const studentData = JSON.parse(fs.readFileSync('students_data.json', 'utf-8'));

        // 4. Fetch Available Rooms (Excluding 10 for emergency)
        const allRooms = await Room.find().sort({ roomNumber: 1 });
        const acRooms = allRooms.filter(r => r.type === 'AC');
        const nonAcRooms = allRooms.filter(r => r.type === 'Non-AC');
        const emergencyRooms = [...acRooms.slice(-5), ...nonAcRooms.slice(-5)];
        const emergencyIds = emergencyRooms.map(r => r._id.toString());
        const availableRooms = allRooms.filter(r => !emergencyIds.includes(r._id.toString()));

        // 5. Create and Allocate Students
        const studentsToCreate = [];
        const messIds = [];
        let roomIdx = 0;
        let messEnrollmentCount = 0;
        const totalToEnroll = 157; // Enroll exactly 157 students

        const cities = ['Jaipur', 'Delhi', 'Mumbai', 'Pune', 'Ahmedabad', 'Chandigarh'];
        const states = ['Rajasthan', 'Delhi', 'Maharashtra', 'Maharashtra', 'Gujarat', 'Punjab'];
        const courses = ['B.Tech', 'MBA', 'B.Sc', 'BBA', 'B.Des', 'LL.B', 'M.Tech'];
        const branches = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Information Technology'];

        for (let i = 0; i < studentData.length; i++) {
            const currentRoom = availableRooms[roomIdx];
            if (!currentRoom) break;

            const bedLetters = ['A', 'B', 'C', 'D'];
            const currentBed = bedLetters[currentRoom.occupants.length];
            const randIdx = Math.floor(Math.random() * cities.length);
            const course = studentData[i].course || courses[Math.floor(Math.random() * courses.length)];
            const branch = studentData[i].branch || branches[Math.floor(Math.random() * branches.length)];
            const year = studentData[i].year || (Math.floor(Math.random() * 4) + 1);
            const city = studentData[i].city || cities[randIdx];
            const fatherNames = ['Suresh', 'Ramesh', 'Rajesh', 'Vijay', 'Anil', 'Ashok', 'Sunil', 'Mahendra', 'Vinod', 'Sanjay', 'Prakash', 'Omprakash'];
            const motherNames = ['Sunita', 'Neena', 'Kavita', 'Rekha', 'Meena', 'Suman', 'Anita', 'Pushpa', 'Shanti', 'Lakshmi', 'Geeta', 'Babita'];
            const surname = studentData[i].name.split(' ').slice(-1)[0] || 'Sharma';

            // Enroll exactly 157 students (manual spread)
            let messStatus = 'inactive';
            if (messEnrollmentCount < totalToEnroll) {
                messStatus = 'active';
                messEnrollmentCount++;
            }

            const student = new Student({
                ...studentData[i],
                password: 'password',
                room: currentRoom._id,
                bedLetter: currentBed,
                messStatus: messStatus, // Manual enrollment logic applied
                email: `${studentData[i].name.toLowerCase().replace(/ /g, '.')}.${studentData[i].studentId}@student.com`,
                city: city,
                state: states[randIdx],
                address: `House No. ${Math.floor(Math.random() * 500)}, Street ${Math.floor(Math.random() * 50)}, Sector ${Math.floor(Math.random() * 15)}`,
                motherName: `${motherNames[Math.floor(Math.random() * motherNames.length)]} ${surname}`,
                fatherName: `${fatherNames[Math.floor(Math.random() * fatherNames.length)]} ${surname}`,
                parentPhone: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
                course: course,
                branch: branch,
                year: year,
                feesPaid: Math.random() > 0.3,
                disciplinaryRecord: []
            });

            if (messStatus === 'active') {
                messIds.push(student._id);
            }

            studentsToCreate.push(student);
            currentRoom.occupants.push(student._id);
            if (currentRoom.occupants.length >= currentRoom.seater) {
                roomIdx++;
            }
        }

        // Save Students
        await Student.insertMany(studentsToCreate);
        console.log(`${studentsToCreate.length} Students seeded`);

        // Update Rooms with occupants
        for (const room of availableRooms) {
            await Room.findByIdAndUpdate(room._id, { occupants: room.occupants });
        }
        console.log('Rooms updated with occupants');

        // Sync Mess Collection
        if (vinay) messIds.push(vinay._id);
        if (adel) messIds.push(adel._id);

        await Mess.findOneAndUpdate(
            { name: 'Central Hostel Mess' },
            { $set: { students: messIds } },
            { upsert: true }
        );
        console.log(`Mess synchronization complete. ${messIds.length} subscribers added.`);

        console.log('Seeding Complete!');
        process.exit(0);
    } catch (err) {
        if (err.name === 'ValidationError') {
            for (field in err.errors) {
                console.error(`Validation Error on ${field}: ${err.errors[field].message}`);
            }
        } else if (err.code === 11000) {
            console.error('Duplicate Key Error:', err.keyValue);
        } else {
            console.error('General Error:', err);
        }
        process.exit(1);
    }
}

seedParticipants();
