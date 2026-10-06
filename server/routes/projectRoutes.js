const express = require('express');
const router = express.Router();
const {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.route('/')
  .get(getProjects)
  .post(addProject);

router.route('/:id')
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
