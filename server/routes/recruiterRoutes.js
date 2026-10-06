const express = require('express');
const router = express.Router();
const {
  getRecruiterDashboard,
  getCandidates,
  getCandidateDetails,
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('recruiter'));

router.get('/dashboard', getRecruiterDashboard);
router.get('/candidates', getCandidates);
router.get('/candidates/:id', getCandidateDetails);

module.exports = router;
