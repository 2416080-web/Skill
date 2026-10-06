const express = require('express');
const router = express.Router();
const {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.route('/')
  .get(getAchievements)
  .post(addAchievement);

router.route('/:id')
  .put(updateAchievement)
  .delete(deleteAchievement);

module.exports = router;
