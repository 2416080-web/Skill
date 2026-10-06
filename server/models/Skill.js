const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Programming',
        'Web Development',
        'Database',
        'AI / ML',
        'Cloud',
        'Cybersecurity',
        'IoT',
        'Data Science',
        'Soft Skills',
        'Other',
      ],
      default: 'Programming',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    verificationStatus: {
      type: String,
      enum: ['Not Verified', 'In Progress', 'Verified'],
      default: 'Not Verified',
    },
    verificationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate skill names for the same student
skillSchema.index({ studentId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
