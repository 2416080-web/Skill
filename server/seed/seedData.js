const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const Assessment = require('../models/Assessment');
const Shortlist = require('../models/Shortlist');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Clearing existing database collections...');

    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({}),
      Certification.deleteMany({}),
      Achievement.deleteMany({}),
      Assessment.deleteMany({}),
      Shortlist.deleteMany({}),
    ]);

    console.log('Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Create Student 1: Arun Kumar
    const arun = await User.create({
      name: 'Arun Kumar',
      email: 'arun@example.com',
      password: passwordHash,
      role: 'student',
      college: 'ABC Engineering College',
      department: 'Computer Science and Engineering',
      year: '4th Year',
    });

    await StudentProfile.create({
      userId: arun._id,
      bio: 'Passionate Full-Stack Developer and Open Source enthusiast with a strong foundation in modern web architectures and algorithmic problem solving.',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      college: 'ABC Engineering College',
      degree: 'B.Tech in Computer Science',
      department: 'Computer Science and Engineering',
      graduationYear: '2026',
      careerObjective: 'Seeking an impactful software engineering role where I can build scalable systems, contribute to cloud-native applications, and collaborate with talented engineering teams.',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      github: 'arunkumar-dev',
      linkedin: 'https://linkedin.com/in/arunkumar-example',
      portfolio: 'https://arunkumar.dev',
      privacySettings: {
        isPublic: true,
        showEmail: true,
        showPhone: true,
        showGithub: true,
        showLinkedin: true,
        showProjects: true,
        showCertifications: true,
        showAssessmentResults: true,
      },
    });

    // Arun's Skills
    const arunSkills = await Skill.create([
      {
        studentId: arun._id,
        name: 'Python',
        category: 'Programming',
        level: 'Advanced',
        verificationStatus: 'Verified',
        verificationScore: 90,
        verifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: arun._id,
        name: 'React',
        category: 'Web Development',
        level: 'Expert',
        verificationStatus: 'Verified',
        verificationScore: 95,
        verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: arun._id,
        name: 'SQL',
        category: 'Database',
        level: 'Advanced',
        verificationStatus: 'Verified',
        verificationScore: 85,
        verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: arun._id,
        name: 'JavaScript',
        category: 'Programming',
        level: 'Advanced',
        verificationStatus: 'Verified',
        verificationScore: 88,
        verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: arun._id,
        name: 'Cloud Computing',
        category: 'Cloud',
        level: 'Intermediate',
        verificationStatus: 'In Progress',
        verificationScore: 60,
      },
    ]);

    // Arun's Projects
    await Project.create([
      {
        studentId: arun._id,
        title: 'AI Travel Planner',
        description: 'An intelligent itinerary generator that tailors personalized vacations using machine learning recommendations, interactive maps, and budget tracking.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'OpenAI API', 'Tailwind CSS'],
        githubUrl: 'https://github.com/example/ai-travel-planner',
        liveUrl: 'https://ai-travel-planner.example.app',
        category: 'Web Development',
        startDate: '2025-08-01',
        endDate: '2025-11-15',
        status: 'Completed',
      },
      {
        studentId: arun._id,
        title: 'Student Management System',
        description: 'A comprehensive campus portal managing attendance, grade tracking, automated PDF transcripts, and faculty-student collaboration tools.',
        technologies: ['React', 'Express', 'MongoDB', 'JWT', 'REST API'],
        githubUrl: 'https://github.com/example/student-management-system',
        liveUrl: 'https://sms-portal.example.app',
        category: 'Web Development',
        startDate: '2025-01-10',
        endDate: '2025-05-20',
        status: 'Completed',
      },
      {
        studentId: arun._id,
        title: 'Realtime Code Collaboration Canvas',
        description: 'WebSocket-powered multi-user code editor with instant syntax highlighting, collaborative cursors, and execution environment.',
        technologies: ['JavaScript', 'WebSocket', 'Node.js', 'Monaco Editor'],
        githubUrl: 'https://github.com/example/collab-code',
        liveUrl: 'https://collabcode.example.app',
        category: 'Web Development',
        startDate: '2025-12-01',
        endDate: '',
        status: 'In Progress',
      },
    ]);

    // Arun's Certifications
    await Certification.create([
      {
        studentId: arun._id,
        name: 'AWS Certified Cloud Practitioner',
        organization: 'Amazon Web Services',
        issueDate: '2025-06-15',
        expiryDate: '2028-06-15',
        credentialId: 'AWS-CCP-84729103',
        certificateUrl: 'https://aws.amazon.com/verification',
      },
      {
        studentId: arun._id,
        name: 'Meta Front-End Developer Professional Certificate',
        organization: 'Meta / Coursera',
        issueDate: '2025-03-10',
        expiryDate: '',
        credentialId: 'META-FED-559281',
        certificateUrl: 'https://coursera.org/verify/professional-cert/example',
      },
    ]);

    // Arun's Achievements
    await Achievement.create([
      {
        studentId: arun._id,
        title: 'Smart India Hackathon 2025 - 1st Runner Up',
        description: 'Built a resilient civic complaint resolution platform with geo-tagging and automated department routing among 500+ competing collegiate teams.',
        organization: 'Ministry of Education & AICTE',
        date: '2025-09-22',
        url: 'https://sih.gov.in',
        category: 'Hackathon',
      },
      {
        studentId: arun._id,
        title: 'Lead Organizer - Campus Tech Summit',
        description: 'Organized an annual developer conference attended by over 1,200 engineering students, conducting hands-on open-source workshops.',
        organization: 'ABC College Developer Club',
        date: '2025-11-05',
        url: '',
        category: 'Leadership',
      },
    ]);

    // Arun's Assessments
    await Assessment.create([
      {
        studentId: arun._id,
        skill: 'Python',
        score: 90,
        totalQuestions: 5,
        correctAnswers: 5,
        verificationStatus: 'Verified',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        questions: [
          { questionText: 'What is the correct syntax to output "Hello World" in Python?', options: ['echo', 'print("Hello World")', 'p()', 'System.out.println'], selectedAnswer: 1, correctAnswer: 1, isCorrect: true, explanation: 'In Python, print() is the built-in function.' },
          { questionText: 'Which data type is immutable?', options: ['List', 'Dictionary', 'Set', 'Tuple'], selectedAnswer: 3, correctAnswer: 3, isCorrect: true, explanation: 'Tuples are immutable.' },
        ],
      },
      {
        studentId: arun._id,
        skill: 'React',
        score: 95,
        totalQuestions: 5,
        correctAnswers: 5,
        verificationStatus: 'Verified',
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        questions: [
          { questionText: 'Which hook manages state in functional components?', options: ['useEffect', 'useMemo', 'useState', 'useRef'], selectedAnswer: 2, correctAnswer: 2, isCorrect: true, explanation: 'useState is standard hook.' },
        ],
      },
      {
        studentId: arun._id,
        skill: 'SQL',
        score: 85,
        totalQuestions: 5,
        correctAnswers: 4,
        verificationStatus: 'Verified',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        questions: [],
      },
    ]);

    // 2. Create Student 2: Priya Sharma
    const priya = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: passwordHash,
      role: 'student',
      college: 'National Institute of Technology',
      department: 'Information Technology',
      year: '3rd Year',
    });

    await StudentProfile.create({
      userId: priya._id,
      bio: 'Systems engineer with deep interest in backend distributed services, high-throughput microservices, and database tuning.',
      phone: '+91 91234 56789',
      location: 'Hyderabad, India',
      college: 'National Institute of Technology',
      degree: 'B.Tech in Information Technology',
      department: 'Information Technology',
      graduationYear: '2027',
      careerObjective: 'Looking for a Backend or Distributed Systems Engineering internship to apply data structures and cloud concepts in high-scale environments.',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      github: 'priyasharma-code',
      linkedin: 'https://linkedin.com/in/priya-sharma-example',
      portfolio: 'https://priyasharma.io',
      privacySettings: {
        isPublic: true,
        showEmail: true,
        showPhone: false,
        showGithub: true,
        showLinkedin: true,
        showProjects: true,
        showCertifications: true,
        showAssessmentResults: true,
      },
    });

    await Skill.create([
      {
        studentId: priya._id,
        name: 'Java',
        category: 'Programming',
        level: 'Expert',
        verificationStatus: 'Verified',
        verificationScore: 92,
        verifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: priya._id,
        name: 'Data Structures',
        category: 'Programming',
        level: 'Advanced',
        verificationStatus: 'Verified',
        verificationScore: 84,
        verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: priya._id,
        name: 'SQL',
        category: 'Database',
        level: 'Intermediate',
        verificationStatus: 'Verified',
        verificationScore: 80,
        verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ]);

    await Project.create([
      {
        studentId: priya._id,
        title: 'Distributed In-Memory Key-Value Store',
        description: 'A multi-threaded key-value store with replication, Raft consensus protocol, and RESTful API endpoints.',
        technologies: ['Java', 'Spring Boot', 'Docker', 'REST API'],
        githubUrl: 'https://github.com/example/distributed-kv',
        liveUrl: '',
        category: 'Database',
        startDate: '2025-06-01',
        endDate: '2025-10-30',
        status: 'Completed',
      },
    ]);

    await Certification.create([
      {
        studentId: priya._id,
        name: 'Oracle Certified Professional: Java SE 17 Developer',
        organization: 'Oracle',
        issueDate: '2025-04-12',
        expiryDate: '',
        credentialId: 'OCP-JAVA-894721',
        certificateUrl: 'https://catalog-education.oracle.com',
      },
    ]);

    await Achievement.create([
      {
        studentId: priya._id,
        title: 'ACM ICPC Regional Finalist',
        description: 'Ranked in top 15 teams across regional competitive programming rounds solving algorithmic challenges under strict time bounds.',
        organization: 'ACM ICPC',
        date: '2025-12-14',
        url: '',
        category: 'Competition',
      },
    ]);

    await Assessment.create([
      {
        studentId: priya._id,
        skill: 'Java',
        score: 92,
        totalQuestions: 5,
        correctAnswers: 5,
        verificationStatus: 'Verified',
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        questions: [],
      },
      {
        studentId: priya._id,
        skill: 'Data Structures',
        score: 84,
        totalQuestions: 5,
        correctAnswers: 4,
        verificationStatus: 'Verified',
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        questions: [],
      },
    ]);

    // 3. Create Student 3: Rohan Patel
    const rohan = await User.create({
      name: 'Rohan Patel',
      email: 'rohan@example.com',
      password: passwordHash,
      role: 'student',
      college: 'Global Institute of Technology',
      department: 'Data Science & Artificial Intelligence',
      year: '4th Year',
    });

    await StudentProfile.create({
      userId: rohan._id,
      bio: 'Machine Learning researcher and data engineer interested in computer vision, PyTorch pipelines, and generative models.',
      phone: '+91 99887 76655',
      location: 'Pune, India',
      college: 'Global Institute of Technology',
      degree: 'B.Tech in Artificial Intelligence',
      department: 'Data Science & Artificial Intelligence',
      graduationYear: '2026',
      careerObjective: 'Aiming to work as an AI / ML Engineer on multimodal models and production inference optimization.',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      github: 'rohanpatel-ai',
      linkedin: 'https://linkedin.com/in/rohan-patel-example',
      portfolio: 'https://rohanpatel.ml',
      privacySettings: {
        isPublic: true,
        showEmail: true,
        showPhone: true,
        showGithub: true,
        showLinkedin: true,
        showProjects: true,
        showCertifications: true,
        showAssessmentResults: true,
      },
    });

    await Skill.create([
      {
        studentId: rohan._id,
        name: 'Python',
        category: 'AI / ML',
        level: 'Expert',
        verificationStatus: 'Verified',
        verificationScore: 95,
        verifiedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: rohan._id,
        name: 'Data Structures',
        category: 'Programming',
        level: 'Intermediate',
        verificationStatus: 'In Progress',
        verificationScore: 65,
      },
    ]);

    await Project.create([
      {
        studentId: rohan._id,
        title: 'Deep Retina: Medical Imaging Classifier',
        description: 'Trained ResNet-50 on retinal scans to detect early-stage diabetic retinopathy with 94.2% validation accuracy.',
        technologies: ['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'Docker'],
        githubUrl: 'https://github.com/example/deep-retina',
        liveUrl: '',
        category: 'AI / ML',
        startDate: '2025-07-01',
        endDate: '2025-11-20',
        status: 'Completed',
      },
    ]);

    await Assessment.create([
      {
        studentId: rohan._id,
        skill: 'Python',
        score: 95,
        totalQuestions: 5,
        correctAnswers: 5,
        verificationStatus: 'Verified',
        completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        questions: [],
      },
    ]);

    // 4. Create Recruiter: TechNova Solutions
    const recruiter = await User.create({
      name: 'Recruiter Demo',
      email: 'recruiter@example.com',
      password: passwordHash,
      role: 'recruiter',
      company: 'TechNova Solutions',
      jobTitle: 'Senior Talent Acquisition Lead',
    });

    // Recruiter shortlists Arun Kumar
    await Shortlist.create({
      recruiterId: recruiter._id,
      studentId: arun._id,
      notes: 'Exceptional full-stack portfolio with verified React, Python, and SQL skills. Scheduled for interview.',
    });

    console.log('✓ Database seeded successfully!');
    console.log('==================================================');
    console.log('DEMO CREDENTIALS:');
    console.log('Student 1:   arun@example.com      / password123 (Verified: Python, React, SQL, JS)');
    console.log('Student 2:   priya@example.com     / password123 (Verified: Java, Data Structures, SQL)');
    console.log('Student 3:   rohan@example.com     / password123 (Verified: Python)');
    console.log('Recruiter:   recruiter@example.com / password123 (Company: TechNova Solutions)');
    console.log('==================================================');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
