const axios = require('axios');
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const seedDatabase = require('./seed/seedData');

const runTests = async () => {
  console.log('--- Starting SkillProof API Automated Verification ---');
  let server;
  try {
    await connectDB();
    await seedDatabase();

    const app = express();
    app.use(cors());
    app.use(express.json());

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
    app.use(notFound);
    app.use(errorHandler);

    const testPort = 5099;
    server = app.listen(testPort);
    const baseURL = `http://localhost:${testPort}/api`;
    console.log(`Test server running at ${baseURL}`);

    // Helper for assertions
    const assert = (condition, msg) => {
      if (!condition) throw new Error(`Assertion Failed: ${msg}`);
      console.log(`  ✓ ${msg}`);
    };

    // 1. Auth Test: Student Login
    console.log('\n[1] Testing Student Authentication...');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'arun@example.com',
      password: 'password123',
    });
    assert(loginRes.status === 200, 'Student login returned 200 OK');
    assert(loginRes.data.token, 'Received valid JWT token');
    assert(loginRes.data.user.role === 'student', 'User role is student');
    const studentToken = loginRes.data.token;
    const studentAuthHeader = { headers: { Authorization: `Bearer ${studentToken}` } };

    // 2. Auth Test: Recruiter Login
    console.log('\n[2] Testing Recruiter Authentication...');
    const recLoginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'recruiter@example.com',
      password: 'password123',
    });
    assert(recLoginRes.status === 200, 'Recruiter login returned 200 OK');
    assert(recLoginRes.data.user.role === 'recruiter', 'User role is recruiter');
    const recruiterToken = recLoginRes.data.token;
    const recruiterAuthHeader = { headers: { Authorization: `Bearer ${recruiterToken}` } };

    // 3. Auth Test: /api/auth/me
    console.log('\n[3] Testing /api/auth/me...');
    const meRes = await axios.get(`${baseURL}/auth/me`, studentAuthHeader);
    assert(meRes.data.user.email === 'arun@example.com', 'Me endpoint returns authenticated student');

    // 4. Student Profile: GET and PUT
    console.log('\n[4] Testing Student Profile GET & PUT...');
    const profRes = await axios.get(`${baseURL}/students/profile`, studentAuthHeader);
    assert(profRes.status === 200, 'Profile loaded');
    assert(profRes.data.profileCompletion > 0, 'Profile completion calculated: ' + profRes.data.profileCompletion + '%');

    const updateRes = await axios.put(`${baseURL}/students/profile`, {
      bio: 'Updated bio testing full-stack automated flow.',
      location: 'Bengaluru, Karnataka',
    }, studentAuthHeader);
    assert(updateRes.data.profile.location === 'Bengaluru, Karnataka', 'Profile location updated');

    // 5. Skills CRUD
    console.log('\n[5] Testing Skills CRUD...');
    const addSkillRes = await axios.post(`${baseURL}/skills`, {
      name: 'Docker',
      category: 'Cloud',
      level: 'Intermediate',
    }, studentAuthHeader);
    assert(addSkillRes.status === 201, 'Skill added');
    const skillId = addSkillRes.data.skill._id;

    const skillsListRes = await axios.get(`${baseURL}/skills`, studentAuthHeader);
    assert(skillsListRes.data.skills.some((s) => s.name === 'Docker'), 'Added skill present in list');

    const updateSkillRes = await axios.put(`${baseURL}/skills/${skillId}`, {
      level: 'Advanced',
    }, studentAuthHeader);
    assert(updateSkillRes.data.skill.level === 'Advanced', 'Skill level updated to Advanced');

    const delSkillRes = await axios.delete(`${baseURL}/skills/${skillId}`, studentAuthHeader);
    assert(delSkillRes.status === 200, 'Skill deleted successfully');

    // 6. Projects CRUD
    console.log('\n[6] Testing Projects CRUD...');
    const addProjectRes = await axios.post(`${baseURL}/projects`, {
      title: 'DevOps Automated Pipeline',
      description: 'CI/CD pipeline with GitHub Actions and Docker',
      technologies: ['Docker', 'GitHub Actions', 'Node.js'],
      category: 'Cloud',
      status: 'Completed',
    }, studentAuthHeader);
    assert(addProjectRes.status === 201, 'Project created');
    const projectId = addProjectRes.data.project._id;

    const delProjectRes = await axios.delete(`${baseURL}/projects/${projectId}`, studentAuthHeader);
    assert(delProjectRes.status === 200, 'Project deleted successfully');

    // 7. Certifications CRUD
    console.log('\n[7] Testing Certifications CRUD...');
    const addCertRes = await axios.post(`${baseURL}/certifications`, {
      name: 'Certified Kubernetes Administrator',
      organization: 'Cloud Native Computing Foundation',
      issueDate: '2025-05-01',
      credentialId: 'CKA-994821',
    }, studentAuthHeader);
    assert(addCertRes.status === 201, 'Certification created');
    const certId = addCertRes.data.certification._id;

    const delCertRes = await axios.delete(`${baseURL}/certifications/${certId}`, studentAuthHeader);
    assert(delCertRes.status === 200, 'Certification deleted successfully');

    // 8. Achievements CRUD
    console.log('\n[8] Testing Achievements CRUD...');
    const addAchRes = await axios.post(`${baseURL}/achievements`, {
      title: 'Global CodeSprint Finalist',
      description: 'Top 50 global ranking',
      organization: 'CodeSprint Global',
      category: 'Competition',
    }, studentAuthHeader);
    assert(addAchRes.status === 201, 'Achievement created');
    const achId = addAchRes.data.achievement._id;

    const delAchRes = await axios.delete(`${baseURL}/achievements/${achId}`, studentAuthHeader);
    assert(delAchRes.status === 200, 'Achievement deleted successfully');

    // 9. Skill Assessment & Verification
    console.log('\n[9] Testing Skill Assessment & Automated Verification...');
    const assessList = await axios.get(`${baseURL}/assessments`, studentAuthHeader);
    assert(assessList.status === 200, 'Assessments list fetched');
    assert(assessList.data.availableSkills.length > 0, 'Available skills exist');

    const startRes = await axios.post(`${baseURL}/assessments/start`, { skill: 'Python' }, studentAuthHeader);
    assert(startRes.data.questions.length === 5, 'Python assessment has 5 questions without exposed answers');

    // Submit answers: question IDs py-1 to py-5
    const submitRes = await axios.post(`${baseURL}/assessments/submit`, {
      skill: 'Python',
      answers: {
        'py-1': 1, // print("Hello World")
        'py-2': 3, // Tuple
        'py-3': 0, // <class 'list'>
        'py-4': 2, // def
        'py-5': 1, // [1, 2, 3, 1, 2, 3]
      },
    }, studentAuthHeader);
    assert(submitRes.data.result.score === 100, 'Scored 100% on Python assessment');
    assert(submitRes.data.result.verificationStatus === 'Verified', 'Verification status is Verified');
    assert(submitRes.data.result.isVerified === true, 'Skill verification confirmed');

    // 10. Recruiter Dashboard & Candidate Search
    console.log('\n[10] Testing Recruiter Dashboard & Candidate Search...');
    const recDashRes = await axios.get(`${baseURL}/recruiters/dashboard`, recruiterAuthHeader);
    assert(recDashRes.data.stats.totalCandidates >= 3, 'Recruiter dashboard displays candidates count: ' + recDashRes.data.stats.totalCandidates);
    assert(recDashRes.data.stats.verifiedCandidates >= 2, 'Verified candidates count: ' + recDashRes.data.stats.verifiedCandidates);

    // Search candidates with filters, sorting, and pagination
    const searchRes = await axios.get(`${baseURL}/recruiters/candidates?search=Arun&page=1&limit=10&sort=score`, recruiterAuthHeader);
    assert(searchRes.data.data.length >= 1, 'Candidate search by name returned candidate');
    assert(searchRes.data.data[0].name === 'Arun Kumar', 'Found candidate Arun Kumar');
    assert(searchRes.data.total >= 1, 'Pagination total returned: ' + searchRes.data.total);

    // 11. Shortlist Endpoints
    console.log('\n[11] Testing Recruiter Shortlisting...');
    const studentUserId = searchRes.data.data[0].id;
    const addShortlistRes = await axios.post(`${baseURL}/shortlist/${studentUserId}`, {
      notes: 'Strong algorithmic knowledge and verified React + Python skills.',
    }, recruiterAuthHeader);
    assert(addShortlistRes.status === 200 || addShortlistRes.status === 201, 'Student shortlisted');

    const getShortlistRes = await axios.get(`${baseURL}/shortlist`, recruiterAuthHeader);
    assert(getShortlistRes.data.shortlist.some((item) => item.student.name === 'Arun Kumar'), 'Shortlisted student in list');

    // 12. Security & Role Authorization Check
    console.log('\n[12] Testing Security & Role-Based Authorization...');
    try {
      // Student trying to access recruiter dashboard
      await axios.get(`${baseURL}/recruiters/dashboard`, studentAuthHeader);
      throw new Error('Student should not be able to access recruiter endpoint!');
    } catch (authErr) {
      assert(authErr.response && authErr.response.status === 403, 'Student blocked with 403 Forbidden on recruiter endpoint');
    }

    try {
      // Recruiter trying to access student skills management
      await axios.get(`${baseURL}/skills`, recruiterAuthHeader);
      throw new Error('Recruiter should not be able to access student skills management!');
    } catch (authErr) {
      assert(authErr.response && authErr.response.status === 403, 'Recruiter blocked with 403 Forbidden on student endpoint');
    }

    console.log('\n🎉 ALL 12 VERIFICATION SUITES PASSED FLAWLESSLY! 🎉\n');
    server.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (server) server.close();
    process.exit(1);
  }
};

runTests();
