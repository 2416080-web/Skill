const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    college: {
      type: String,
      default: '',
      trim: true,
    },
    degree: {
      type: String,
      default: '',
      trim: true,
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    graduationYear: {
      type: String,
      default: '',
      trim: true,
    },
    careerObjective: {
      type: String,
      default: '',
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: '',
      trim: true,
    },
    github: {
      type: String,
      default: '',
      trim: true,
    },
    linkedin: {
      type: String,
      default: '',
      trim: true,
    },
    portfolio: {
      type: String,
      default: '',
      trim: true,
    },
    privacySettings: {
      isPublic: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: true },
      showPhone: { type: Boolean, default: false },
      showGithub: { type: Boolean, default: true },
      showLinkedin: { type: Boolean, default: true },
      showProjects: { type: Boolean, default: true },
      showCertifications: { type: Boolean, default: true },
      showAssessmentResults: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
