const Skill = require('../models/Skill');

// @desc    Get all skills for logged-in student
// @route   GET /api/skills
// @access  Private (Student)
const getSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { studentId: req.user._id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(query).sort({ verificationStatus: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new skill
// @route   POST /api/skills
// @access  Private (Student)
const addSkill = async (req, res, next) => {
  try {
    const { name, category, level } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required.',
      });
    }

    // Check if skill already exists for this student
    const existing = await Skill.findOne({
      studentId: req.user._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Skill "${name}" is already in your profile.`,
      });
    }

    const skill = await Skill.create({
      studentId: req.user._id,
      name: name.trim(),
      category: category || 'Programming',
      level: level || 'Intermediate',
      verificationStatus: 'Not Verified',
      verificationScore: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Skill added successfully!',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private (Student)
const updateSkill = async (req, res, next) => {
  try {
    const { name, category, level } = req.body;

    let skill = await Skill.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found or unauthorized.',
      });
    }

    if (name) skill.name = name.trim();
    if (category) skill.category = category;
    if (level) skill.level = level;

    await skill.save();

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully!',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private (Student)
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found or unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};
