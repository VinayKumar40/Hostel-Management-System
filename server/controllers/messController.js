const Mess = require('../models/Mess');
const Student = require('../models/Student');
const MessLog = require('../models/MessLog');

const getMessDetails = async (req, res) => {
    try {
        const mess = await Mess.find({}).populate('students', 'name studentId email phone course branch');
        res.json(mess);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMessMenu = async (req, res) => {
    const { menu, weeklyMenu, timings, description } = req.body;
    try {
        const mess = await Mess.findById(req.params.id);
        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }
        if (description) mess.description = description;
        if (timings) mess.timings = timings;
        if (weeklyMenu) mess.weeklyMenu = weeklyMenu;

        await mess.save();
        res.json(mess);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const enrollStudent = async (req, res) => {
    const { studentId, feePaid } = req.body;

    if (parseInt(feePaid) !== 36000) {
        return res.status(400).json({ message: 'Mess enrollment requires a verified fee payment of ₹36,000.' });
    }

    try {
        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const mess = await Mess.findOne({ name: 'Central Hostel Mess' });
        if (!mess) return res.status(404).json({ message: 'Mess system not initialized' });

        if (mess.students.some(id => id.toString() === student._id.toString())) {
            return res.status(400).json({ message: 'Student is already enrolled in the mess.' });
        }

        mess.students.push(student._id);
        await mess.save();

        student.messStatus = 'active';
        await student.save();

        await MessLog.create({
            action: 'ENROLL',
            studentName: student.name,
            studentId: student.studentId,
            performedBy: req.user.name,
            details: `Enrolled by ${req.user.name} with verified fee ₹${feePaid}`
        });

        res.json({ message: `Successfully enrolled ${student.name} into the mess system.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unenrollStudent = async (req, res) => {
    const { studentId } = req.body;
    try {
        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const mess = await Mess.findOne({ name: 'Central Hostel Mess' });
        if (!mess) return res.status(404).json({ message: 'Mess system not initialized' });

        mess.students = mess.students.filter(id => id.toString() !== student._id.toString());
        await mess.save();

        student.messStatus = 'inactive';
        await student.save();

        await MessLog.create({
            action: 'UNENROLL',
            studentName: student.name,
            studentId: student.studentId,
            performedBy: req.user.name,
            details: 'Removed from mess list by ' + req.user.name + ' (hostel stay unaffected)'
        });

        res.json({ message: `Successfully removed ${student.name} from the mess system.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessDetails,
    updateMessMenu,
    enrollStudent,
    unenrollStudent
};
