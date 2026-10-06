const express = require('express');
const router = express.Router();
const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.route('/')
  .get(getSkills)
  .post(addSkill);

router.route('/:id')
  .put(updateSkill)
  .delete(deleteSkill);

module.exports = router;
