const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// @desc    Download the complete SkillProof project zip archive
// @route   GET /api/download
// @access  Public
router.get('/', (req, res) => {
  const possiblePaths = [
    path.resolve(__dirname, '../skillproof.zip'),
    path.resolve(__dirname, '../../skillproof.zip'),
    path.resolve('C:/Users/LENOVO/Downloads/skillproof.zip'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="skillproof.zip"');
      return res.download(p, 'skillproof.zip');
    }
  }

  res.status(404).json({
    success: false,
    message: 'Project archive file not found.',
  });
});

module.exports = router;
