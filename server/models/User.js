const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'recruiter'],
      required: [true, 'Role must be specified'],
      default: 'student',
    },
    // Student specific fields
    college: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    // Recruiter specific fields
    company: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
