const Setting = require('../models/Setting');

// @desc    Get All Settings
// @route   GET /api/settings
// @access  Private
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();

    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    });
  }
};

// @desc    Get Setting by Key
// @route   GET /api/settings/:key
// @access  Private
exports.getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ settingKey: req.params.key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching setting',
      error: error.message,
    });
  }
};

// @desc    Update or Create Setting
// @route   PUT /api/settings/:key
// @access  Private/Admin
exports.updateSetting = async (req, res) => {
  try {
    const { settingValue, description, dataType } = req.body;

    if (!settingValue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide setting value',
      });
    }

    let setting = await Setting.findOne({ settingKey: req.params.key });

    if (!setting) {
      setting = await Setting.create({
        settingKey: req.params.key,
        settingValue,
        description,
        dataType: dataType || 'string',
      });
    } else {
      setting = await Setting.findOneAndUpdate(
        { settingKey: req.params.key },
        { settingValue, description, dataType: dataType || setting.dataType },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Setting updated successfully',
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message,
    });
  }
};

// @desc    Delete Setting
// @route   DELETE /api/settings/:key
// @access  Private/Admin
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOneAndDelete({ settingKey: req.params.key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Setting deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting setting',
      error: error.message,
    });
  }
};
