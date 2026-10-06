const Certification = require('../models/Certification');

// @desc    Get all certifications for current student
// @route   GET /api/certifications
// @access  Private (Student)
const getCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: certifications.length,
      certifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a certification
// @route   POST /api/certifications
// @access  Private (Student)
const addCertification = async (req, res, next) => {
  try {
    const {
      name,
      organization,
      issueDate,
      expiryDate,
      credentialId,
      certificateUrl,
    } = req.body;

    if (!name || !organization) {
      return res.status(400).json({
        success: false,
        message: 'Certification name and issuing organization are required.',
      });
    }

    const certification = await Certification.create({
      studentId: req.user._id,
      name: name.trim(),
      organization: organization.trim(),
      issueDate: issueDate || '',
      expiryDate: expiryDate || '',
      credentialId: credentialId || '',
      certificateUrl: certificateUrl || '',
    });

    res.status(201).json({
      success: true,
      message: 'Certification added successfully!',
      certification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a certification
// @route   PUT /api/certifications/:id
// @access  Private (Student)
const updateCertification = async (req, res, next) => {
  try {
    const {
      name,
      organization,
      issueDate,
      expiryDate,
      credentialId,
      certificateUrl,
    } = req.body;

    let certification = await Certification.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found or unauthorized.',
      });
    }

    if (name) certification.name = name.trim();
    if (organization) certification.organization = organization.trim();
    if (issueDate !== undefined) certification.issueDate = issueDate;
    if (expiryDate !== undefined) certification.expiryDate = expiryDate;
    if (credentialId !== undefined) certification.credentialId = credentialId;
    if (certificateUrl !== undefined) certification.certificateUrl = certificateUrl;

    await certification.save();

    res.status(200).json({
      success: true,
      message: 'Certification updated successfully!',
      certification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a certification
// @route   DELETE /api/certifications/:id
// @access  Private (Student)
const deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found or unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certification deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
};
