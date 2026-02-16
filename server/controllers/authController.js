const User = require('../models/User');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const loginUser = async (req, res) => {
    const { userId, password } = req.body;

    try {
        // Find in User (Admin/Warden)
        let user = await User.findOne({ userId });
        let isStudent = false;

        if (!user) {
            // Find in Student
            user = await Student.findOne({ studentId: userId });
            isStudent = true;
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                userId: isStudent ? user.studentId : user.userId,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid User ID or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    const user = req.user;

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            userId: user.userId || user.studentId,
            role: user.role,
            room: user.room,
            bedLetter: user.bedLetter,
            dayLeaveBalance: user.dayLeaveBalance,
            nightLeaveBalance: user.nightLeaveBalance,
            phone: user.phone
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    loginUser,
    getUserProfile
};
