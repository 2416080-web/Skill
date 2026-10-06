import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillproof_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        // If token expired during normal operation
        localStorage.removeItem('skillproof_token');
        localStorage.removeItem('skillproof_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Student endpoints
export const studentApi = {
  getMyProfile: () => api.get('/students/profile'),
  updateMyProfile: (data) => api.put('/students/profile', data),
  getDashboardSummary: () => api.get('/students/dashboard-summary'),
  getPublicProfile: (id) => api.get(`/students/${id}`),
};

// Skills endpoints
export const skillApi = {
  getSkills: (params) => api.get('/skills', { params }),
  addSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

// Projects endpoints
export const projectApi = {
  getProjects: () => api.get('/projects'),
  addProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Certifications endpoints
export const certApi = {
  getCertifications: () => api.get('/certifications'),
  addCertification: (data) => api.post('/certifications', data),
  updateCertification: (id, data) => api.put(`/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/certifications/${id}`),
};

// Achievements endpoints
export const achievementApi = {
  getAchievements: () => api.get('/achievements'),
  addAchievement: (data) => api.post('/achievements', data),
  updateAchievement: (id, data) => api.put(`/achievements/${id}`, data),
  deleteAchievement: (id) => api.delete(`/achievements/${id}`),
};

// Assessment endpoints
export const assessmentApi = {
  getAvailable: () => api.get('/assessments'),
  startAssessment: (skill) => api.post('/assessments/start', { skill }),
  submitAssessment: (data) => api.post('/assessments/submit', data),
  getResults: () => api.get('/assessments/results'),
};

// Recruiter endpoints
export const recruiterApi = {
  getDashboard: () => api.get('/recruiters/dashboard'),
  getCandidates: (params) => api.get('/recruiters/candidates', { params }),
  getCandidateDetails: (id) => api.get(`/recruiters/candidates/${id}`),
};

// Shortlist endpoints
export const shortlistApi = {
  getShortlist: () => api.get('/shortlist'),
  addToShortlist: (studentId, notes) => api.post(`/shortlist/${studentId}`, { notes }),
  removeFromShortlist: (studentId) => api.delete(`/shortlist/${studentId}`),
};

// GitHub endpoints
export const githubApi = {
  getUserData: (username) => api.get(`/github/${username}`),
};

// Seed mock data
export const seedApi = {
  seed: () => api.post('/seed'),
};

export default api;

