const express = require('express');
const router = express.Router();
const { fetchGithubData } = require('../services/githubService');

router.get('/:username', async (req, res) => {
  try {
    const result = await fetchGithubData(req.params.username);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
