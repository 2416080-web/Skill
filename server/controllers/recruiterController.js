const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const Assessment = require('../models/Assessment');
const Shortlist = require('../models/Shortlist');
const { calculateProfileCompletion } = require('./studentController');
const { fetchGithubData } = require('../services/githubService');

// @desc    Get recruiter dashboard statistics
// @route   GET /api/recruiters/dashboard
// @access  Private (Recruiter)
const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    // Total candidates
    const totalCandidates = await User.countDocuments({ role: 'student' });

    // Students with at least 1 verified skill
    const verifiedStudentIds = await Skill.distinct('studentId', { verificationStatus: 'Verified' });
    const verifiedCandidatesCount = verifiedStudentIds.length;

    // Shortlisted count
    const shortlistedCount = await Shortlist.countDocuments({ recruiterId });

    // Skill distribution
    const skillDistribution = await Skill.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 }, verifiedCount: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'Verified'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Recent candidate students
    const recentStudents = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(6);

    const candidateCards = await Promise.all(
      recentStudents.map(async (student) => {
        const [profile, skills, projects, isShortlisted] = await Promise.all([
          StudentProfile.findOne({ userId: student._id }),
          Skill.find({ studentId: student._id }),
          Project.find({ studentId: student._id }).limit(3),
          Shortlist.exists({ recruiterId, studentId: student._id }),
        ]);

        const verifiedSkills = skills.filter((s) => s.verificationStatus === 'Verified');
        const completion = await calculateProfileCompletion(student._id, profile, student);

        // Highest assessment score
        const topAssessment = await Assessment.findOne({ studentId: student._id }).sort({ score: -1 });

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          college: student.college || (profile ? profile.college : ''),
          department: student.department || (profile ? profile.department : ''),
          year: student.year || (profile ? profile.graduationYear : ''),
          bio: profile ? profile.bio : '',
          profilePhoto: profile ? profile.profilePhoto : '',
          skills: skills.map((s) => ({ name: s.name, level: s.level, status: s.verificationStatus, score: s.verificationScore })),
          verifiedSkillsCount: verifiedSkills.length,
          projectCount: projects.length,
          highestScore: topAssessment ? topAssessment.score : 0,
          profileCompletion: completion,
          isShortlisted: !!isShortlisted,
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalCandidates,
        verifiedCandidates: verifiedCandidatesCount,
        shortlistedCandidates: shortlistedCount,
        skillDistribution,
      },
      recentCandidates: candidateCards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search, filter, sort, and paginate candidates
// @route   GET /api/recruiters/candidates
// @access  Private (Recruiter)
const getCandidates = async (req, res, next) => {
  try {
    const {
      search,
      skill,
      level,
      verification,
      college,
      department,
      minScore,
      sort = 'completion',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const recruiterId = req.user ? req.user._id : null;

    // 1. Build initial Student User Query
    let userQuery = { role: 'student' };

    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      userQuery.$or = [
        { name: searchRegex },
        { college: searchRegex },
        { department: searchRegex },
      ];
    }

    if (college && college !== 'All') {
      userQuery.college = { $regex: college, $options: 'i' };
    }

    if (department && department !== 'All') {
      userQuery.department = { $regex: department, $options: 'i' };
    }

    // 2. Skill-based filtering
    let matchingStudentIds = null;
    if (skill || level || (verification && verification !== 'All')) {
      const skillFilter = {};
      if (skill && skill !== 'All') {
        skillFilter.name = { $regex: skill, $options: 'i' };
      }
      if (level && level !== 'All') {
        skillFilter.level = level;
      }
      if (verification && verification !== 'All') {
        skillFilter.verificationStatus = verification;
      }

      matchingStudentIds = await Skill.distinct('studentId', skillFilter);
    }

    if (matchingStudentIds !== null) {
      if (userQuery._id) {
        userQuery._id = { $in: matchingStudentIds.filter((id) => userQuery._id.$in.includes(id)) };
      } else {
        userQuery._id = { $in: matchingStudentIds };
      }
    }

    // 3. Score-based filtering
    if (minScore && Number(minScore) > 0) {
      const qualifyingStudentIds = await Assessment.distinct('studentId', { score: { $gte: Number(minScore) } });
      if (userQuery._id) {
        userQuery._id = { $in: qualifyingStudentIds.filter((id) => userQuery._id.$in.includes(id.toString())) };
      } else {
        userQuery._id = { $in: qualifyingStudentIds };
      }
    }

    // Fetch all candidates matching query
    const allMatchingStudents = await User.find(userQuery).select('-password');

    // Enrich candidates with profile, skills, projects, assessment scores, and completion
    const enrichedCandidates = await Promise.all(
      allMatchingStudents.map(async (student) => {
        const [profile, skills, projects, topAssessment, isShortlisted] = await Promise.all([
          StudentProfile.findOne({ userId: student._id }),
          Skill.find({ studentId: student._id }),
          Project.find({ studentId: student._id }),
          Assessment.findOne({ studentId: student._id }).sort({ score: -1 }),
          recruiterId ? Shortlist.exists({ recruiterId, studentId: student._id }) : false,
        ]);

        const verifiedSkills = skills.filter((s) => s.verificationStatus === 'Verified');
        const completion = await calculateProfileCompletion(student._id, profile, student);

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          college: student.college || (profile ? profile.college : ''),
          department: student.department || (profile ? profile.department : ''),
          year: student.year || (profile ? profile.graduationYear : ''),
          bio: profile ? profile.bio : '',
          location: profile ? profile.location : '',
          profilePhoto: profile ? profile.profilePhoto : '',
          skills: skills.map((s) => ({
            _id: s._id,
            name: s.name,
            level: s.level,
            category: s.category,
            verificationStatus: s.verificationStatus,
            verificationScore: s.verificationScore,
          })),
          verifiedSkillsCount: verifiedSkills.length,
          projectCount: projects.length,
          highestScore: topAssessment ? topAssessment.score : 0,
          profileCompletion: completion,
          isShortlisted: !!isShortlisted,
          createdAt: student.createdAt,
        };
      })
    );

    // 4. In-memory Sorting
    enrichedCandidates.sort((a, b) => {
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sort === 'score') {
        return b.highestScore - a.highestScore;
      }
      if (sort === 'verifiedSkills') {
        return b.verifiedSkillsCount - a.verifiedSkillsCount;
      }
      // default: profile completion
      return b.profileCompletion - a.profileCompletion;
    });

    // 5. Pagination
    const total = enrichedCandidates.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedData = enrichedCandidates.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      data: paginatedData,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed candidate profile for recruiter
// @route   GET /api/recruiters/candidates/:id
// @access  Private (Recruiter)
const getCandidateDetails = async (req, res, next) => {
  try {
    const studentUser = await User.findById(req.params.id).select('-password');
    if (!studentUser || studentUser.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found.',
      });
    }

    const recruiterId = req.user._id;

    const [profile, skills, projects, certifications, achievements, assessments, shortlistRecord] =
      await Promise.all([
        StudentProfile.findOne({ userId: studentUser._id }),
        Skill.find({ studentId: studentUser._id }).sort({ verificationStatus: -1, createdAt: -1 }),
        Project.find({ studentId: studentUser._id }).sort({ createdAt: -1 }),
        Certification.find({ studentId: studentUser._id }).sort({ createdAt: -1 }),
        Achievement.find({ studentId: studentUser._id }).sort({ createdAt: -1 }),
        Assessment.find({ studentId: studentUser._id }).sort({ completedAt: -1 }),
        Shortlist.findOne({ recruiterId, studentId: studentUser._id }),
      ]);

    const completion = await calculateProfileCompletion(studentUser._id, profile, studentUser);

    // Optional GitHub data
    let githubData = null;
    if (profile && profile.github) {
      const ghResult = await fetchGithubData(profile.github);
      if (ghResult.success) {
        githubData = ghResult.data;
      }
    }

    res.status(200).json({
      success: true,
      candidate: {
        id: studentUser._id,
        name: studentUser.name,
        email: studentUser.email,
        college: studentUser.college || (profile ? profile.college : ''),
        department: studentUser.department || (profile ? profile.department : ''),
        year: studentUser.year || (profile ? profile.graduationYear : ''),
        profilePhoto: profile ? profile.profilePhoto : '',
        bio: profile ? profile.bio : '',
        phone: profile ? profile.phone : '',
        location: profile ? profile.location : '',
        degree: profile ? profile.degree : '',
        careerObjective: profile ? profile.careerObjective : '',
        github: profile ? profile.github : '',
        linkedin: profile ? profile.linkedin : '',
        portfolio: profile ? profile.portfolio : '',
        profileCompletion: completion,
        isShortlisted: !!shortlistRecord,
        shortlistNotes: shortlistRecord ? shortlistRecord.notes : '',
      },
      skills,
      projects,
      certifications,
      achievements,
      assessments,
      githubData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecruiterDashboard,
  getCandidates,
  getCandidateDetails,
};
