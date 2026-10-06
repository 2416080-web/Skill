const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getStudentById,
  getDashboardSummary,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student private routes
router.get('/profile', protect, authorize('student'), getMyProfile);
router.put('/profile', protect, authorize('student'), updateMyProfile);
router.get('/dashboard-summary', protect, authorize('student'), getDashboardSummary);

// Public portfolio / recruiter view
router.get('/:id', getStudentById);

module.exports = router;
