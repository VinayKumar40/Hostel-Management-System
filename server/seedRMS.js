const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RMSRequest = require('./models/RMSRequest');
const Student = require('./models/Student');

dotenv.config();

const realisticEntries = [
    {
        rmsId: 'el/Feb-26/01784',
        category: 'Electricity',
        subcategory: 'Lighting Issue',
        description: 'The tube light in my room stopped working since last night. Even after switching it on multiple times, it does not glow. Kindly arrange replacement.',
        status: 'Pending',
        createdAt: new Date('2026-02-02T10:00:00')
    },
    {
        rmsId: 'ws/Feb-26/01896',
        category: 'Water Supply',
        subcategory: 'Plumbing Issue',
        description: 'Water pressure in the washroom is very low during morning hours, making it difficult to use. Technician visited but issue still persists.',
        status: 'In Progress',
        createdAt: new Date('2026-02-05T08:30:00')
    },
    {
        rmsId: 'mt/Feb-26/05232',
        category: 'Electricity',
        subcategory: 'Geyser Repair',
        description: 'The geyser is not providing hot water even after being turned on for an hour. Please repair or replace it.',
        status: 'Resolved',
        closingRemarks: 'Geyser heating coil replaced and functioning properly now.',
        createdAt: new Date('2026-02-01T14:15:00'),
        updatedAt: new Date('2026-02-02T16:00:00')
    },
    {
        rmsId: 'dc/Feb-26/00431',
        category: 'Common Area Maintenance', // Matching category enum: 'Common Area Maintenance' for Wi-Fi? Or maybe Electricity/Other. 
        // Enum: 'Room Issues', 'Washroom', 'Electricity', 'Water Supply', 'Cleanliness', 'Safety', 'Staff Behavior', 'Food (Non-Mess)', 'Common Area Maintenance'
        // User used "Wi-Fi Connectivity" subcategory. I'll use 'Common Area Maintenance' category.
        subcategory: 'Wi-Fi connection issues',
        description: 'Hostel 5G Wi-Fi network is not visible on my device and internet speed is also very slow.',
        status: 'Resolved',
        closingRemarks: 'Issue resolved after router reset and configuration update, confirmed with student over call.',
        createdAt: new Date('2026-02-08T11:00:00'),
        updatedAt: new Date('2026-02-09T09:45:00')
    },
    {
        rmsId: 'cl/Feb-26/01944',
        category: 'Cleanliness',
        subcategory: 'Washroom cleaning required',
        description: 'Common washroom on the floor was not cleaned for two days and has foul smell.',
        status: 'Resolved',
        closingRemarks: 'Cleaning staff instructed and daily cleaning schedule restored.',
        createdAt: new Date('2026-02-10T07:00:00'),
        updatedAt: new Date('2026-02-11T12:00:00')
    }
];

const seedRMS = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing RMS for clean state (optional, but keep it for now as per user requested)
        // await RMSRequest.deleteMany({});

        const student = await Student.findOne();
        if (!student) {
            console.log('No students found to link RMS to!');
            process.exit();
        }

        const entriesToInsert = realisticEntries.map(entry => ({
            ...entry,
            student: student._id,
            roomNumber: student.roomNumber || '302',
            block: student.assignedBlock || 'BH-1'
        }));

        await RMSRequest.insertMany(entriesToInsert);
        console.log('Successfully seeded 5 realistic RMS entries');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding RMS:', error);
        process.exit(1);
    }
};

seedRMS();
