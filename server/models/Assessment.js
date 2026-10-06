const mongoose = require('mongoose');

const questionResultSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  selectedAnswer: { type: Number, required: true },
  correctAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String, default: '' },
});

const assessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [questionResultSchema],
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Not Verified'],
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
