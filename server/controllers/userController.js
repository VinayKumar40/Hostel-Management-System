const User = require('../models/User');
const Student = require('../models/Student');

const getWardens = async (req, res) => {
    try {
        const wardens = await User.find({ role: 'warden' }).select('-password');
        res.json(wardens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createWarden = async (req, res) => {
    const { name, userId, email, password } = req.body;
    try {
        const userExists = await User.findOne({ userId });
        if (userExists) {
            return res.status(400).json({ message: 'User ID already exists' });
        }
        const warden = await User.create({ name, userId, email, password, role: 'warden' });
        res.status(201).json(warden);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).populate('room', 'roomNumber');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Room = require('../models/Room');

const createStudent = async (req, res) => {
    const { name, studentId, email, phone, room, bedLetter, city, state, address, motherName, fatherName, parentPhone, course, branch, year, feesPaid } = req.body;
    try {
        const studentExists = await Student.findOne({ studentId });
        if (studentExists) {
            return res.status(400).json({ message: 'Student ID already exists' });
        }

        const student = await Student.create({
            name, studentId, email, phone, room, bedLetter, city, state, address, motherName, fatherName, parentPhone, course, branch, year, feesPaid, role: 'student'
        });

        // Update Room occupants
        if (room) {
            await Room.findByIdAndUpdate(room, { $push: { occupants: student._id } });
        }

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Remove from room occupants
        if (student.room) {
            await Room.findByIdAndUpdate(student.room, { $pull: { occupants: student._id } });
        }

        await student.deleteOne();
        res.json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const shiftStudent = async (req, res) => {
    const { newRoomId, bedLetter, reason, feePaid } = req.body;
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (!feePaid) {
            return res.status(400).json({ message: 'Shifting fee (1000 INR) must be paid first.' });
        }

        // pull from old room
        if (student.room) {
            await Room.findByIdAndUpdate(student.room, { $pull: { occupants: student._id } });
        }

        // push to new room
        student.room = newRoomId;
        student.bedLetter = bedLetter;
        await student.save();

        await Room.findByIdAndUpdate(newRoomId, { $push: { occupants: student._id } });

        res.json({ message: `Student shifted to ${bedLetter} successfully`, student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchStudents = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.json([]);
        }

        const students = await Student.find({
            name: { $regex: '^' + query, $options: 'i' }
        })
            .populate('room', 'roomNumber')
            .limit(10)
            .select('name room bedLetter block');

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWardens,
    createWarden,
    getStudents,
    createStudent,
    deleteStudent,
    shiftStudent,
    searchStudents
};
