const express = require('express');
const router = express.Router();
const {
  getAvailableAssessments,
  startAssessment,
  submitAssessment,
  getAssessmentResults,
} = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/', getAvailableAssessments);
router.post('/start', startAssessment);
router.post('/submit', submitAssessment);
router.post('/:id/submit', submitAssessment);
router.get('/results', getAssessmentResults);

module.exports = router;
