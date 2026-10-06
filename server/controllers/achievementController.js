const Achievement = require('../models/Achievement');

// @desc    Get all achievements for current student
// @route   GET /api/achievements
// @access  Private (Student)
const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add an achievement
// @route   POST /api/achievements
// @access  Private (Student)
const addAchievement = async (req, res, next) => {
  try {
    const { title, description, organization, date, url, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Achievement title and description are required.',
      });
    }

    const achievement = await Achievement.create({
      studentId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      organization: organization ? organization.trim() : '',
      date: date || '',
      url: url || '',
      category: category || 'Award',
    });

    res.status(201).json({
      success: true,
      message: 'Achievement recorded successfully!',
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an achievement
// @route   PUT /api/achievements/:id
// @access  Private (Student)
const updateAchievement = async (req, res, next) => {
  try {
    const { title, description, organization, date, url, category } = req.body;

    let achievement = await Achievement.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found or unauthorized.',
      });
    }

    if (title) achievement.title = title.trim();
    if (description) achievement.description = description.trim();
    if (organization !== undefined) achievement.organization = organization.trim();
    if (date !== undefined) achievement.date = date;
    if (url !== undefined) achievement.url = url;
    if (category !== undefined) achievement.category = category;

    await achievement.save();

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully!',
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Student)
const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found or unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};
