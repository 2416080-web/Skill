const express = require('express');
const router = express.Router();
const {
  getShortlistedCandidates,
  addToShortlist,
  removeFromShortlist,
} = require('../controllers/shortlistController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('recruiter'));

router.get('/', getShortlistedCandidates);
router.post('/:studentId', addToShortlist);
router.delete('/:studentId', removeFromShortlist);

module.exports = router;
