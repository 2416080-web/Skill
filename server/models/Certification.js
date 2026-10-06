const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
    },
    expiryDate: {
      type: String,
      default: '',
    },
    credentialId: {
      type: String,
      default: '',
      trim: true,
    },
    certificateUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certification', certificationSchema);
