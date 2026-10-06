const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

// Generate JWT Helper
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'skillproof_super_secret_jwt_key_2026_dev',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user (Student or Recruiter)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role = 'student',
      college,
      department,
      year,
      company,
      jobTitle,
    } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Role-specific validation
    if (role === 'student') {
      if (!college || !department) {
        return res.status(400).json({
          success: false,
          message: 'College and department are required for student registration.',
        });
      }
    } else if (role === 'recruiter') {
      if (!company || !jobTitle) {
        return res.status(400).json({
          success: false,
          message: 'Company and job title are required for recruiter registration.',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be student or recruiter.',
      });
    }

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      college: role === 'student' ? college : undefined,
      department: role === 'student' ? department : undefined,
      year: role === 'student' ? year : undefined,
      company: role === 'recruiter' ? company : undefined,
      jobTitle: role === 'recruiter' ? jobTitle : undefined,
    });

    // 5. If student, create initial profile document
    if (role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        college: college || '',
        department: department || '',
        graduationYear: year || '',
      });
    }

    // 6. Generate token and return user data
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        department: user.department,
        year: user.year,
        company: user.company,
        jobTitle: user.jobTitle,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Check user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        department: user.department,
        year: user.year,
        company: user.company,
        jobTitle: user.jobTitle,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        department: user.department,
        year: user.year,
        company: user.company,
        jobTitle: user.jobTitle,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
