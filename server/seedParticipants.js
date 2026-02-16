const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Room = require('./models/Room');
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

        // 2. Create Wardens
        const wardens = [
            {
                name: 'Vinay Kumar',
                userId: 'WARDEN001',
                email: 'vinay.warden@hostel.com',
                phone: '9783512896',
                password: 'password', // Default
                role: 'warden',
                assignedBlock: 'A',
                roomNumber: 'A101',
                messStatus: 'active'
            },
            {
                name: 'Adel Muhammed',
                userId: 'WARDEN002',
                email: 'adel.warden@hostel.com',
                phone: '8848259876',
                password: 'password', // Default
                role: 'warden',
                assignedBlock: 'B',
                roomNumber: 'B101',
                messStatus: 'active'
            }
        ];
        await User.insertMany(wardens);
        console.log('2 Wardens created');

        // 3. Load Student Data
        const studentData = JSON.parse(fs.readFileSync('students_data.json', 'utf-8'));

        // 4. Fetch Available Rooms (Excluding 10 for emergency)
        // Let's reserve 5 AC and 5 Non-AC per block?
        // Actually, user said 10 rooms total (5 AC, 5 Non-AC).
        // Let's identify them.
        const allRooms = await Room.find().sort({ roomNumber: 1 });

        // Define emergency rooms (simple strategy: last 5 AC and last 5 Non-AC)
        const acRooms = allRooms.filter(r => r.type === 'AC');
        const nonAcRooms = allRooms.filter(r => r.type === 'Non-AC');

        const emergencyRooms = [
            ...acRooms.slice(-5),
            ...nonAcRooms.slice(-5)
        ];
        const emergencyIds = emergencyRooms.map(r => r._id.toString());

        const availableRooms = allRooms.filter(r => !emergencyIds.includes(r._id.toString()));
        console.log(`Total Rooms: ${allRooms.length}, Emergency: ${emergencyRooms.length}, Available: ${availableRooms.length}`);

        // 5. Create and Allocate Students
        const studentsToCreate = [];
        let roomIdx = 0;

        const cities = ['Jaipur', 'Delhi', 'Mumbai', 'Pune', 'Ahmedabad', 'Chandigarh'];
        const states = ['Rajasthan', 'Delhi', 'Maharashtra', 'Maharashtra', 'Gujarat', 'Punjab'];
        const courses = ['B.Tech', 'MBA', 'B.Sc', 'BBA', 'B.Des', 'LL.B', 'M.Tech'];
        const branches = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Information Technology'];

        for (let i = 0; i < studentData.length; i++) {
            const currentRoom = availableRooms[roomIdx];
            if (!currentRoom) break;

            // Determine Bed Letter (A, B, C...)
            const bedLetters = ['A', 'B', 'C', 'D'];
            const currentBed = bedLetters[currentRoom.occupants.length];

            // Random academic info (only used if MISSING in JSON)
            const randIdx = Math.floor(Math.random() * cities.length);
            const course = studentData[i].course || courses[Math.floor(Math.random() * courses.length)];
            const branch = studentData[i].branch || branches[Math.floor(Math.random() * branches.length)];
            const year = studentData[i].year || (Math.floor(Math.random() * 4) + 1);
            const city = studentData[i].city || cities[randIdx];

            const fatherNames = ['Suresh', 'Ramesh', 'Rajesh', 'Vijay', 'Anil', 'Ashok', 'Sunil', 'Mahendra', 'Vinod', 'Sanjay', 'Prakash', 'Omprakash'];
            const motherNames = ['Sunita', 'Neena', 'Kavita', 'Rekha', 'Meena', 'Suman', 'Anita', 'Pushpa', 'Shanti', 'Lakshmi', 'Geeta', 'Babita'];
            const surname = studentData[i].name.split(' ').slice(-1)[0] || 'Sharma';

            const student = new Student({
                ...studentData[i],
                password: 'password', // Default
                room: currentRoom._id,
                bedLetter: currentBed,
                email: `${studentData[i].name.toLowerCase().replace(/ /g, '.')}.${studentData[i].studentId}@student.com`,
                // Profile fields (Provided data wins via spread, fallback values used if missing)
                city: city,
                state: states[randIdx],
                address: `House No. ${Math.floor(Math.random() * 500)}, Street ${Math.floor(Math.random() * 50)}, Sector ${Math.floor(Math.random() * 15)}`,
                motherName: `${motherNames[Math.floor(Math.random() * motherNames.length)]} ${surname}`,
                fatherName: `${fatherNames[Math.floor(Math.random() * fatherNames.length)]} ${surname}`,
                parentPhone: `9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
                course: course,
                branch: branch,
                year: year,
                feesPaid: Math.random() > 0.3, // 70% paid
                disciplinaryRecord: Math.random() > 0.8 ? [{
                    caseType: Math.random() > 0.5 ? 'MINOR' : 'MAJOR',
                    description: 'Observed participating in a heated argument in the mess area.',
                    date: new Date()
                }] : []
            });

            studentsToCreate.push(student);
            currentRoom.occupants.push(student._id);

            // If room still has space, we do stay, else move to next
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
