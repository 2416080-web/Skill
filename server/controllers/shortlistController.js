const Shortlist = require('../models/Shortlist');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Assessment = require('../models/Assessment');
const { calculateProfileCompletion } = require('./studentController');

// @desc    Get all shortlisted candidates for the logged in recruiter
// @route   GET /api/shortlist
// @access  Private (Recruiter)
const getShortlistedCandidates = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;
    const shortlistEntries = await Shortlist.find({ recruiterId }).sort({ createdAt: -1 });

    const enrichedShortlist = await Promise.all(
      shortlistEntries.map(async (entry) => {
        const student = await User.findById(entry.studentId).select('-password');
        if (!student) return null;

        const [profile, skills, projects, topAssessment] = await Promise.all([
          StudentProfile.findOne({ userId: student._id }),
          Skill.find({ studentId: student._id }),
          Project.find({ studentId: student._id }),
          Assessment.findOne({ studentId: student._id }).sort({ score: -1 }),
        ]);

        const verifiedSkills = skills.filter((s) => s.verificationStatus === 'Verified');
        const completion = await calculateProfileCompletion(student._id, profile, student);

        return {
          shortlistId: entry._id,
          shortlistedAt: entry.createdAt,
          notes: entry.notes,
          student: {
            id: student._id,
            name: student.name,
            email: student.email,
            college: student.college || (profile ? profile.college : ''),
            department: student.department || (profile ? profile.department : ''),
            year: student.year || (profile ? profile.graduationYear : ''),
            profilePhoto: profile ? profile.profilePhoto : '',
            skills: skills.map((s) => ({
              name: s.name,
              level: s.level,
              verificationStatus: s.verificationStatus,
              verificationScore: s.verificationScore,
            })),
            verifiedSkillsCount: verifiedSkills.length,
            projectCount: projects.length,
            highestScore: topAssessment ? topAssessment.score : 0,
            profileCompletion: completion,
          },
        };
      })
    );

    const validEntries = enrichedShortlist.filter(Boolean);

    res.status(200).json({
      success: true,
      count: validEntries.length,
      shortlist: validEntries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a student to recruiter shortlist
// @route   POST /api/shortlist/:studentId
// @access  Private (Recruiter)
const addToShortlist = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;
    const { studentId } = req.params;
    const { notes = '' } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student candidate not found.',
      });
    }

    const existing = await Shortlist.findOne({ recruiterId, studentId });
    if (existing) {
      existing.notes = notes;
      await existing.save();
      return res.status(200).json({
        success: true,
        message: 'Shortlist entry updated.',
        entry: existing,
      });
    }

    const entry = await Shortlist.create({
      recruiterId,
      studentId,
      notes,
    });

    res.status(201).json({
      success: true,
      message: `${student.name} has been added to your shortlist!`,
      entry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a student from recruiter shortlist
// @route   DELETE /api/shortlist/:studentId
// @access  Private (Recruiter)
const removeFromShortlist = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;
    const { studentId } = req.params;

    const deleted = await Shortlist.findOneAndDelete({ recruiterId, studentId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Student was not in your shortlist.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidate removed from your shortlist.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShortlistedCandidates,
  addToShortlist,
  removeFromShortlist,
};
