const Hostel = require('../models/Hostel');

// @desc    Create Hostel
// @route   POST /api/hostel
// @access  Private/Admin
exports.createHostel = async (req, res) => {
  try {
    const {
      hostelName,
      address,
      city,
      state,
      pincode,
      totalRooms,
      availableRooms,
      costPerBed,
      description,
      facilities,
    } = req.body;

    // Validation
    if (!hostelName || !address || !city || !state || !pincode || !totalRooms || !costPerBed) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create hostel with createdBy set to current user
    const hostel = await Hostel.create({
      hostelName,
      address,
      city,
      state,
      pincode,
      totalRooms,
      availableRooms: availableRooms || totalRooms,
      costPerBed,
      description,
      facilities: facilities || [],
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      data: hostel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating hostel',
      error: error.message,
    });
  }
};

// @desc    Get All Hostels
// @route   GET /api/hostel
// @access  Private
exports.getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: hostels.length,
      data: hostels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hostels',
      error: error.message,
    });
  }
};

// @desc    Get Single Hostel
// @route   GET /api/hostel/:id
// @access  Private
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('createdBy', 'name email');

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hostel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hostel',
      error: error.message,
    });
  }
};

// @desc    Update Hostel
// @route   PUT /api/hostel/:id
// @access  Private/Admin
exports.updateHostel = async (req, res) => {
  try {
    let hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found',
      });
    }

    // Check if user is admin or created the hostel
    if (req.user.role !== 'admin' && hostel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hostel',
      });
    }

    hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Hostel updated successfully',
      data: hostel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hostel',
      error: error.message,
    });
  }
};

// @desc    Delete Hostel
// @route   DELETE /api/hostel/:id
// @access  Private/Admin
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found',
      });
    }

    // Check if user is admin or created the hostel
    if (req.user.role !== 'admin' && hostel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hostel',
      });
    }

    await Hostel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hostel deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hostel',
      error: error.message,
    });
  }
};
