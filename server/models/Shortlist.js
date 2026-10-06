const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate shortlisting by the same recruiter
shortlistSchema.index({ recruiterId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
