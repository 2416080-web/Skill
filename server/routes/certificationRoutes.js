const express = require('express');
const router = express.Router();
const {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} = require('../controllers/certificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.route('/')
  .get(getCertifications)
  .post(addCertification);

router.route('/:id')
  .put(updateCertification)
  .delete(deleteCertification);

module.exports = router;
