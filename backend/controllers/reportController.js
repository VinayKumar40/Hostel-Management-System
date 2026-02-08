const Report = require('../models/Report');
const Hostel = require('../models/Hostel');

// @desc    Create Report
// @route   POST /api/reports
// @access  Private/Admin
exports.createReport = async (req, res) => {
  try {
    const { reportType, title, description, hostelId, data } = req.body;

    if (!reportType || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide report type and title',
      });
    }

    const report = await Report.create({
      reportType,
      title,
      description,
      hostelId,
      data,
      generatedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message,
    });
  }
};

// @desc    Get All Reports
// @route   GET /api/reports
// @access  Private/Admin
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'name email')
      .populate('hostelId', 'hostelName');

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

// @desc    Get Report by ID
// @route   GET /api/reports/:id
// @access  Private/Admin
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email')
      .populate('hostelId', 'hostelName');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message,
    });
  }
};

// @desc    Delete Report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
      error: error.message,
    });
  }
};

// @desc    Get Dashboard Statistics
// @route   GET /api/reports/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalHostels = await Hostel.countDocuments();
    const totalRooms = await Hostel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalRooms' } } },
    ]);
    const totalAvailableRooms = await Hostel.aggregate([
      { $group: { _id: null, total: { $sum: '$availableRooms' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalHostels,
        totalRooms: totalRooms[0]?.total || 0,
        totalAvailableRooms: totalAvailableRooms[0]?.total || 0,
        occupancyRate: totalRooms[0]?.total
          ? (
              ((totalRooms[0].total - (totalAvailableRooms[0]?.total || 0)) /
                totalRooms[0].total) *
              100
            ).toFixed(2)
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
