const RMSRequest = require('../models/RMSRequest');
const Student = require('../models/Student');

const generateRMSId = async () => {
    const count = await RMSRequest.countDocuments();
    return `RMS-${10000 + count + 1}`;
};


const createRequest = async (req, res) => {
    const {
        studentName,
        studentId, // Optional manual entry
        roomNumber,
        block,
        category,
        subcategory,
        description,
        attachments
    } = req.body;

    try {
        let studentObjectId = null;

        // Try to link to an existing student if studentId is provided or if we can match by name/room
        // Ideally, if the system is robust, we might want to lookup by Room + Block. 
        // For now, if a studentId is passed (optional from UI), we use it. 
        // Or if the logged in user is a student (legacy support or if we keep student access), we use that.

        if (req.user && req.user.role === 'student') {
            studentObjectId = req.user._id;
        } else if (studentId) {
            const student = await Student.findOne({ studentId });
            if (student) studentObjectId = student._id;
        }

        const rmsId = await generateRMSId();

        const request = await RMSRequest.create({
            rmsId,
            student: studentObjectId, // Can be null now
            studentName: studentName || (req.user.role === 'student' ? req.user.name : 'Unknown'),
            category,
            subcategory,
            description,
            attachments,
            roomNumber,
            block: block || 'Boys Hostel',
            reportedBy: req.user.role === 'student' ? 'Student' : 'Warden/Office'
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getStudentRequests = async (req, res) => {
    try {
        const requests = await RMSRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await RMSRequest.find({})
            .populate('student', 'name studentId room bedLetter')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addReply = async (req, res) => {
    const { message } = req.body;

    try {
        const request = await RMSRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const reply = {
            senderId: req.user._id,
            senderName: req.user.name,
            senderRole: req.user.role,
            message,
            timestamp: new Date()
        };

        request.replies.push(reply);
        await request.save();

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    const { status, closingRemarks } = req.body;

    try {
        const request = await RMSRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        if (closingRemarks) {
            request.closingRemarks = closingRemarks;
        }

        request.replies.push({
            senderId: req.user._id,
            senderName: req.user.name,
            senderRole: req.user.role,
            message: `Status updated to ${status}${closingRemarks ? `. Remarks: ${closingRemarks}` : ''}`,
            timestamp: new Date()
        });

        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRequest,
    getStudentRequests,
    getAllRequests,
    addReply,
    updateStatus
};
