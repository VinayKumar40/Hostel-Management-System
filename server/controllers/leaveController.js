const LeaveRequest = require('../models/LeaveRequest');
const Student = require('../models/Student');

const applyLeave = async (req, res) => {
    const { term, leaveType, visitPlace, reason, startDate, endDate } = req.body;

    try {
        const student = await Student.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate balance
        if (leaveType === 'Day Leave' && student.dayLeaveBalance <= 0) {
            return res.status(400).json({ message: 'Insufficient Day Leave balance' });
        }
        if (leaveType === 'Night Leave' && student.nightLeaveBalance <= 0) {
            return res.status(400).json({ message: 'Insufficient Night Leave balance' });
        }

        const leave = await LeaveRequest.create({
            student: req.user._id,
            term,
            leaveType,
            visitPlace,
            reason,
            startDate,
            endDate
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStudentLeaves = async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllLeaves = async (req, res) => {
    console.log('GET /api/leaves - Fetching all leaves');
    try {
        const leaves = await LeaveRequest.find({}).populate('student', 'name studentId room bedLetter').sort({ createdAt: -1 });
        console.log(`Found ${leaves.length} leaves`);
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateLeaveStatus = async (req, res) => {
    const { status, remarks } = req.body;

    try {
        const leave = await LeaveRequest.findById(req.params.id).populate('student');
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        if (status === 'Approved') {
            const student = await Student.findById(leave.student?._id);
            if (student) {
                if (leave.leaveType === 'Day Leave') {
                    student.dayLeaveBalance = (student.dayLeaveBalance || 75) - 1;
                } else {
                    student.nightLeaveBalance = (student.nightLeaveBalance || 60) - 1;
                }
                await student.save();
            }

            leave.recommendingAuthority = req.user.name;
            leave.sanctioningAuthority = req.user.name;
        }

        leave.status = status;
        if (remarks) leave.reason = leave.reason + ' (Remarks: ' + remarks + ')';
        await leave.save();

        res.json(leave);
    } catch (error) {
        console.error('Update Leave Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const createWardenLeave = async (req, res) => {
    const { studentId, leaveType, visitPlace, reason, startDate, endDate } = req.body;

    try {
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found in registry' });
        }

        const leave = await LeaveRequest.create({
            student: student._id,
            leaveType,
            visitPlace,
            reason: reason + ' (Applied at Warden Office)',
            startDate,
            endDate,
            status: 'Approved', // Auto-approved if warden creates it
            recommendingAuthority: req.user.name,
            sanctioningAuthority: req.user.name
        });

        // Deduct balance
        if (leaveType === 'Day Leave') {
            student.dayLeaveBalance = (student.dayLeaveBalance || 75) - 1;
        } else {
            student.nightLeaveBalance = (student.nightLeaveBalance || 60) - 1;
        }
        await student.save();

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const recordGateEntry = async (req, res) => {
    const { type } = req.body; // 'check-out' or 'check-in'

    try {
        const leave = await LeaveRequest.findById(req.params.id).populate('student');
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        if (type === 'check-out') {
            leave.checkOutTime = new Date();
        } else if (type === 'check-in') {
            leave.checkInTime = new Date();
            leave.actualReturnDate = new Date();
        }

        await leave.save();
        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecentGateActivity = async (req, res) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const activity = await LeaveRequest.find({
            $or: [
                { checkOutTime: { $gte: twentyFourHoursAgo } },
                { checkInTime: { $gte: twentyFourHoursAgo } }
            ]
        })
            .populate('student', 'name studentId room bedLetter')
            .sort({ updatedAt: -1 });

        res.json(activity);
    } catch (error) {
        console.error('Recent Activity Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyLeave,
    getStudentLeaves,
    getAllLeaves,
    updateLeaveStatus,
    recordGateEntry,
    createWardenLeave,
    getRecentGateActivity
};
