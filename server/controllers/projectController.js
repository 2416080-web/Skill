const Project = require('../models/Project');

// @desc    Get all projects for current student
// @route   GET /api/projects
// @access  Private (Student)
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a project
// @route   POST /api/projects
// @access  Private (Student)
const addProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      category,
      startDate,
      endDate,
      status,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Project title and description are required.',
      });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : technologies
      ? technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const project = await Project.create({
      studentId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      technologies: techArray,
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      category: category || 'Web Development',
      startDate: startDate || '',
      endDate: endDate || '',
      status: status || 'Completed',
    });

    res.status(201).json({
      success: true,
      message: 'Project added successfully!',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Student)
const updateProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      category,
      startDate,
      endDate,
      status,
    } = req.body;

    let project = await Project.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized.',
      });
    }

    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (technologies !== undefined) {
      project.technologies = Array.isArray(technologies)
        ? technologies
        : technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (category !== undefined) project.category = category;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (status !== undefined) project.status = status;

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully!',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Student)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
