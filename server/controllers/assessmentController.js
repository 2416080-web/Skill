const Assessment = require('../models/Assessment');
const Skill = require('../models/Skill');
const questionsBank = require('../services/assessmentQuestions');

const VERIFICATION_THRESHOLD = 70; // 70% required to verify skill

// @desc    Get available assessment skills and student progress
// @route   GET /api/assessments
// @access  Private (Student)
const getAvailableAssessments = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const availableSkills = Object.keys(questionsBank);

    // Get previous assessments by this student
    const studentAssessments = await Assessment.find({ studentId }).sort({ completedAt: -1 });
    const studentSkills = await Skill.find({ studentId });

    const skillsOverview = availableSkills.map((skillName) => {
      const attempts = studentAssessments.filter((a) => a.skill.toLowerCase() === skillName.toLowerCase());
      const bestAttempt = attempts.reduce((max, a) => (a.score > max ? a.score : max), 0);
      const studentSkill = studentSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());

      return {
        name: skillName,
        totalQuestions: questionsBank[skillName].length,
        attemptsCount: attempts.length,
        bestScore: attempts.length > 0 ? bestAttempt : null,
        isVerified: studentSkill ? studentSkill.verificationStatus === 'Verified' : false,
        verificationStatus: studentSkill ? studentSkill.verificationStatus : 'Not Added',
        skillId: studentSkill ? studentSkill._id : null,
      };
    });

    res.status(200).json({
      success: true,
      availableSkills: skillsOverview,
      recentAttempts: studentAssessments.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start an assessment session for a skill
// @route   POST /api/assessments/start
// @access  Private (Student)
const startAssessment = async (req, res, next) => {
  try {
    const { skill } = req.body;

    if (!skill || !questionsBank[skill]) {
      return res.status(400).json({
        success: false,
        message: `Assessment for skill '${skill}' is not available. Available skills: ${Object.keys(questionsBank).join(', ')}`,
      });
    }

    // Return questions WITHOUT the correctAnswer or explanation to prevent cheating
    const rawQuestions = questionsBank[skill];
    const clientQuestions = rawQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      skill,
      durationMinutes: 10,
      totalQuestions: clientQuestions.length,
      passingScore: VERIFICATION_THRESHOLD,
      questions: clientQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assessment answers and evaluate verification
// @route   POST /api/assessments/submit
// @access  Private (Student)
const submitAssessment = async (req, res, next) => {
  try {
    const { skill, answers } = req.body; // answers: { [questionId]: selectedOptionIndex }

    if (!skill || !questionsBank[skill]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill specified for assessment submission.',
      });
    }

    const questionSet = questionsBank[skill];
    let correctCount = 0;

    const breakdown = questionSet.map((q) => {
      const selected = answers ? answers[q.id] : undefined;
      const isCorrect = selected !== undefined && selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionText: q.question,
        options: q.options,
        selectedAnswer: selected !== undefined ? selected : -1,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / questionSet.length) * 100);
    const isVerified = score >= VERIFICATION_THRESHOLD;
    const verificationStatus = isVerified ? 'Verified' : 'Not Verified';

    // Save assessment record
    const assessment = await Assessment.create({
      studentId: req.user._id,
      skill,
      questions: breakdown,
      score,
      totalQuestions: questionSet.length,
      correctAnswers: correctCount,
      verificationStatus,
    });

    // Update or create skill in student profile
    let skillDoc = await Skill.findOne({
      studentId: req.user._id,
      name: { $regex: new RegExp(`^${skill}$`, 'i') },
    });

    if (skillDoc) {
      if (isVerified) {
        skillDoc.verificationStatus = 'Verified';
        skillDoc.verificationScore = Math.max(skillDoc.verificationScore || 0, score);
        skillDoc.verifiedAt = new Date();
      } else if (skillDoc.verificationStatus !== 'Verified') {
        skillDoc.verificationStatus = 'In Progress';
        skillDoc.verificationScore = Math.max(skillDoc.verificationScore || 0, score);
      }
      await skillDoc.save();
    } else {
      // Automatically add skill if not yet in profile
      skillDoc = await Skill.create({
        studentId: req.user._id,
        name: skill,
        category: skill === 'SQL' ? 'Database' : skill === 'Data Structures' ? 'Programming' : 'Programming',
        level: score >= 90 ? 'Expert' : score >= 70 ? 'Advanced' : 'Intermediate',
        verificationStatus: isVerified ? 'Verified' : 'In Progress',
        verificationScore: score,
        verifiedAt: isVerified ? new Date() : undefined,
      });
    }

    res.status(200).json({
      success: true,
      message: isVerified
        ? `Congratulations! You scored ${score}% and verified your ${skill} skill!`
        : `Assessment completed. You scored ${score}%. Minimum ${VERIFICATION_THRESHOLD}% required for verification.`,
      result: {
        id: assessment._id,
        skill,
        score,
        correctAnswers: correctCount,
        totalQuestions: questionSet.length,
        verificationStatus,
        isVerified,
        breakdown,
        updatedSkill: skillDoc,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all completed assessments by student
// @route   GET /api/assessments/results
// @access  Private (Student)
const getAssessmentResults = async (req, res, next) => {
  try {
    const results = await Assessment.find({ studentId: req.user._id }).sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableAssessments,
  startAssessment,
  submitAssessment,
  getAssessmentResults,
};
