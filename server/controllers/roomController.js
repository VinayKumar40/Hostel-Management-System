const Room = require('../models/Room');
const Student = require('../models/Student');

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({}).populate('occupants', 'name studentId');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRoom = async (req, res) => {
    const { roomNumber, type, seater, price } = req.body;
    try {
        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) {
            return res.status(400).json({ message: 'Room already exists' });
        }
        const room = await Room.create({ roomNumber, type, seater, price });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const allocateRoom = async (req, res) => {
    const { roomId, studentId } = req.body;
    try {
        const room = await Room.findById(roomId);
        const student = await Student.findById(studentId);

        if (!room || !student) {
            return res.status(404).json({ message: 'Room or Student not found' });
        }

        if (room.occupants.length >= room.seater) {
            return res.status(400).json({ message: 'Room is full' });
        }

        // Add to room
        room.occupants.push(student._id);
        await room.save();

        // Update student
        student.room = room._id;
        await student.save();

        res.json({ message: 'Room allocated successfully', room });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRooms,
    createRoom,
    allocateRoom
};
