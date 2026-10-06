const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const Assessment = require('../models/Assessment');

// Helper to compute student profile completion percentage
const calculateProfileCompletion = async (userId, profile, user) => {
  let score = 0;
  let total = 100;

  // 1. Basic Info (20%)
  if (user && user.name && user.email) score += 10;
  if (profile && profile.bio && profile.bio.trim().length > 10) score += 10;

  // 2. Academic Info (20%)
  if ((user && user.college) || (profile && profile.college)) score += 10;
  if ((user && user.department) || (profile && profile.department)) score += 5;
  if (profile && (profile.degree || profile.graduationYear || (user && user.year))) score += 5;

  // 3. Socials & Career Objective (15%)
  if (profile && (profile.github || profile.linkedin || profile.portfolio)) score += 10;
  if (profile && profile.careerObjective && profile.careerObjective.trim().length > 10) score += 5;

  // 4. Skills (15%)
  const skillCount = await Skill.countDocuments({ studentId: userId });
  if (skillCount >= 3) score += 15;
  else if (skillCount > 0) score += 8;

  // 5. Projects (15%)
  const projectCount = await Project.countDocuments({ studentId: userId });
  if (projectCount >= 2) score += 15;
  else if (projectCount === 1) score += 8;

  // 6. Certifications & Achievements (10%)
  const certCount = await Certification.countDocuments({ studentId: userId });
  const achCount = await Achievement.countDocuments({ studentId: userId });
  if (certCount > 0 || achCount > 0) score += 10;

  // 7. Verified Skills / Assessments (10%)
  const verifiedCount = await Skill.countDocuments({ studentId: userId, verificationStatus: 'Verified' });
  if (verifiedCount > 0) score += 10;

  return Math.min(100, Math.round(score));
};

// @desc    Get current student's full profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await StudentProfile.create({
        userId: req.user._id,
        college: req.user.college || '',
        department: req.user.department || '',
        graduationYear: req.user.year || '',
      });
    }

    const completion = await calculateProfileCompletion(req.user._id, profile, req.user);

    res.status(200).json({
      success: true,
      profile,
      user: req.user,
      profileCompletion: completion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student's profile & settings
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateMyProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      department,
      year,
      bio,
      phone,
      location,
      degree,
      graduationYear,
      careerObjective,
      profilePhoto,
      github,
      linkedin,
      portfolio,
      privacySettings,
    } = req.body;

    // Update User model fields if provided
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (college) userUpdates.college = college;
    if (department) userUpdates.department = department;
    if (year) userUpdates.year = year;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    // Update Profile
    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    if (bio !== undefined) profile.bio = bio;
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (college !== undefined) profile.college = college;
    if (degree !== undefined) profile.degree = degree;
    if (department !== undefined) profile.department = department;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (careerObjective !== undefined) profile.careerObjective = careerObjective;
    if (profilePhoto !== undefined) profile.profilePhoto = profilePhoto;
    if (github !== undefined) profile.github = github;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (portfolio !== undefined) profile.portfolio = portfolio;

    if (privacySettings) {
      profile.privacySettings = {
        ...profile.privacySettings,
        ...privacySettings,
      };
    }

    await profile.save();

    const updatedUser = await User.findById(req.user._id).select('-password');
    const completion = await calculateProfileCompletion(req.user._id, profile, updatedUser);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      profile,
      user: updatedUser,
      profileCompletion: completion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student profile by ID (Public or Recruiter view respecting privacy)
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res, next) => {
  try {
    const studentUser = await User.findById(req.params.id).select('-password');
    if (!studentUser || studentUser.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const profile = await StudentProfile.findOne({ userId: studentUser._id });
    const privacy = profile ? profile.privacySettings : { isPublic: true };

    // Check if profile is private
    if (privacy && privacy.isPublic === false) {
      // If requested by another normal visitor and it's set to private
      return res.status(403).json({
        success: false,
        message: 'This student has set their portfolio profile to private.',
      });
    }

    // Fetch related records
    const skills = await Skill.find({ studentId: studentUser._id }).sort({ verificationStatus: -1, createdAt: -1 });
    const projects = privacy && privacy.showProjects === false ? [] : await Project.find({ studentId: studentUser._id }).sort({ createdAt: -1 });
    const certifications = privacy && privacy.showCertifications === false ? [] : await Certification.find({ studentId: studentUser._id }).sort({ createdAt: -1 });
    const achievements = await Achievement.find({ studentId: studentUser._id }).sort({ createdAt: -1 });
    const assessments = privacy && privacy.showAssessmentResults === false ? [] : await Assessment.find({ studentId: studentUser._id }).sort({ completedAt: -1 });

    const completion = await calculateProfileCompletion(studentUser._id, profile, studentUser);

    // Filter fields based on privacy
    const filteredUser = {
      _id: studentUser._id,
      name: studentUser.name,
      college: studentUser.college || (profile ? profile.college : ''),
      department: studentUser.department || (profile ? profile.department : ''),
      year: studentUser.year || (profile ? profile.graduationYear : ''),
      email: privacy && privacy.showEmail === false ? null : studentUser.email,
    };

    const filteredProfile = profile ? {
      bio: profile.bio,
      location: profile.location,
      degree: profile.degree,
      careerObjective: profile.careerObjective,
      profilePhoto: profile.profilePhoto,
      phone: privacy && privacy.showPhone ? profile.phone : null,
      github: privacy && privacy.showGithub ? profile.github : null,
      linkedin: privacy && privacy.showLinkedin ? profile.linkedin : null,
      portfolio: profile.portfolio,
      privacySettings: profile.privacySettings,
    } : {};

    res.status(200).json({
      success: true,
      student: filteredUser,
      profile: filteredProfile,
      skills,
      projects,
      certifications,
      achievements,
      assessments,
      profileCompletion: completion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student dashboard overview data
// @route   GET /api/students/dashboard-summary
// @access  Private (Student)
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [profile, skills, projects, certifications, achievements, assessments] = await Promise.all([
      StudentProfile.findOne({ userId }),
      Skill.find({ studentId: userId }),
      Project.find({ studentId: userId }).sort({ createdAt: -1 }).limit(5),
      Certification.find({ studentId: userId }).sort({ createdAt: -1 }).limit(5),
      Achievement.find({ studentId: userId }).sort({ createdAt: -1 }).limit(5),
      Assessment.find({ studentId: userId }).sort({ completedAt: -1 }).limit(5),
    ]);

    const totalSkills = skills.length;
    const verifiedSkills = skills.filter((s) => s.verificationStatus === 'Verified').length;
    const totalProjects = await Project.countDocuments({ studentId: userId });
    const totalCertifications = await Certification.countDocuments({ studentId: userId });

    const totalAssessments = await Assessment.countDocuments({ studentId: userId });
    let averageScore = 0;
    if (totalAssessments > 0) {
      const allAssessments = await Assessment.find({ studentId: userId });
      const sum = allAssessments.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = Math.round(sum / allAssessments.length);
    }

    const completion = await calculateProfileCompletion(userId, profile, req.user);

    res.status(200).json({
      success: true,
      stats: {
        profileCompletion: completion,
        totalSkills,
        verifiedSkills,
        totalProjects,
        totalCertifications,
        totalAssessments,
        averageScore,
      },
      recentSkills: skills.slice(0, 6),
      recentProjects: projects,
      recentCertifications: certifications,
      recentAchievements: achievements,
      recentAssessments: assessments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getStudentById,
  getDashboardSummary,
  calculateProfileCompletion,
};
