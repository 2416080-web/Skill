import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicPortfolio from './pages/PublicPortfolio';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import Profile from './pages/student/Profile';
import Skills from './pages/student/Skills';
import Assessments from './pages/student/Assessments';
import Projects from './pages/student/Projects';
import Certifications from './pages/student/Certifications';
import Achievements from './pages/student/Achievements';
import Portfolio from './pages/student/Portfolio';
import Settings from './pages/student/Settings';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import Candidates from './pages/recruiter/Candidates';
import CandidateProfile from './pages/recruiter/CandidateProfile';
import Shortlisted from './pages/recruiter/Shortlisted';
import RecruiterSettings from './pages/recruiter/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portfolio/:studentId" element={<PublicPortfolio />} />

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="skills" element={<Skills />} />
            <Route path="assessment" element={<Assessments />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Recruiter Protected Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/:id" element={<CandidateProfile />} />
            <Route path="shortlisted" element={<Shortlisted />} />
            <Route path="settings" element={<RecruiterSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
