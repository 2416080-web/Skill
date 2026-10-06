const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    organization: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Hackathon', 'Competition', 'Workshop', 'Award', 'Leadership', 'Publication', 'Other'],
      default: 'Award',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Achievement', achievementSchema);
