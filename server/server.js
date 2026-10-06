const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// API Root Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SkillProof Platform API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/certifications', require('./routes/certificationRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/recruiters', require('./routes/recruiterRoutes'));
app.use('/api/shortlist', require('./routes/shortlistRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/api/download', require('./routes/downloadRoutes'));

// Seed Mock Data API Endpoint
app.all('/api/seed', async (req, res, next) => {
  try {
    const seedDatabase = require('./seed/seedData');
    await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Mock data seeded successfully into the connected MongoDB database!',
      connectedHost: require('mongoose').connection.host,
      databaseName: require('mongoose').connection.name,
      demoCredentials: {
        students: [
          { email: 'arun@example.com', password: 'password123', role: 'student', verified: ['Python', 'React', 'SQL', 'JavaScript'] },
          { email: 'priya@example.com', password: 'password123', role: 'student', verified: ['Java', 'Data Structures', 'SQL'] },
          { email: 'rohan@example.com', password: 'password123', role: 'student', verified: ['Python'] },
        ],
        recruiter: { email: 'recruiter@example.com', password: 'password123', role: 'recruiter', company: 'TechNova Solutions' },
      },
    });
  } catch (err) {
    next(err);
  }
});

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Fresh database detected. Seeding sample students and recruiter data...');
      const seedDatabase = require('./seed/seedData');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 SkillProof Server running on port ${PORT}`);
      console.log(`   Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
module.exports = app;
