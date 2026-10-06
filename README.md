# SKILLPROOF
### Student Skill Verification & Digital Portfolio Platform

> **"Prove Your Skills. Showcase Your Potential."**  
> SkillProof helps students build verified digital portfolios backed by real assessments, projects, certifications, and GitHub evidence, while empowering recruiters to discover and evaluate candidates through objective, tested competency metrics.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Architecture](#4-project-architecture)
5. [Folder Structure](#5-folder-structure)
6. [MongoDB Atlas Setup](#6-mongodb-atlas-setup)
7. [Environment Variable Setup](#7-environment-variable-setup)
8. [Backend Installation](#8-backend-installation)
9. [Frontend Installation](#9-frontend-installation)
10. [How to Run](#10-how-to-run)
11. [API Endpoints Documentation](#11-api-endpoints-documentation)
12. [Database Models](#12-database-models)
13. [Authentication Flow](#13-authentication-flow)
14. [Student Flow](#14-student-flow)
15. [Recruiter Flow](#15-recruiter-flow)
16. [Demo Credentials](#16-demo-credentials)
17. [Troubleshooting Guide](#17-troubleshooting-guide)
18. [Future Enhancements](#18-future-enhancements)

---

## 1. Project Overview

**SkillProof** is a production-grade full-stack web application designed to bridge the trust gap between ambitious college students and modern recruiters. Rather than relying on self-declared resume bullets, SkillProof verifies skills through:
- **Interactive skill assessments** with dynamic scoring, timers, and automatic verification status.
- **Evidence-backed showcases** including live demo links, GitHub repositories, and verifiable credentials.
- **Granular privacy controls** allowing students to choose what information is public or recruiter-visible.
- **Powerful recruiter discovery** with multi-parameter filtering (by tested skills, scores, college, department), sortable results, and one-click shortlisting.

The entire UI is built with a **clean, modern light-theme SaaS aesthetic**: soft indigo/violet accents, white cards, subtle borders, rounded corners, and responsive layouts.

---

## 2. Features

### For Students
- **Role-Based Authentication**: Secure registration and JWT-based session management.
- **Dynamic Profile Completion**: Real-time completion progress tracking across personal, academic, skill, and project sections.
- **Skills Management**: Categorized across 10 disciplines (Programming, Web Dev, AI/ML, Cloud, Database, IoT, etc.) with proficiency levels (Beginner to Expert).
- **Interactive MCQ Skill Assessments**: Timed assessments (Python, React, JavaScript, SQL, Java, Data Structures) with instant evaluation. Scoring $\ge 70\%$ automatically marks the skill with a **Verified** badge.
- **Projects Showcase**: Document projects with tech stacks, descriptions, live demo links, and GitHub repositories.
- **Certifications & Achievements**: Keep verifiable records of professional certifications, hackathon awards, and campus leadership.
- **GitHub Integration**: Display GitHub profile details and public repository summaries.
- **Public Portfolio**: Generate a shareable public URL (`/portfolio/:studentId`) with a one-click copyable link and privacy enforcement.
- **Privacy Controls**: Individually toggle the visibility of email, phone, GitHub, LinkedIn, projects, certifications, and assessment scores.

### For Recruiters
- **Recruiter Dashboard**: At-a-glance analytics on candidate numbers, verified skill distributions, and quick candidate previews.
- **Candidate Discovery & Search**: Server-side search by name, skill, college, and department.
- **Multi-Factor Filtering**: Filter candidates by tested skill, proficiency level, verification status, and minimum assessment score.
- **Sort & Pagination**: Sort by profile completion, highest assessment score, number of verified skills, or alphabetical name, with 10 candidates per page.
- **Candidate Profile Review**: Comprehensive read-only view of a candidate’s verified skills, projects, certifications, and assessment breakdown.
- **Shortlist System**: Add candidates to a shortlist with custom notes and manage the recruitment pipeline.

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js 19 with Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 (Light theme, soft indigo/violet palette)
- **Icons**: Lucide React + custom SVG brand icons
- **HTTP Client**: Axios with automatic JWT interceptors
- **UX Delights**: Canvas Confetti for passed skill assessments

### Backend
- **Runtime**: Node.js & Express.js
- **Architecture**: RESTful API architecture with modular routers and controllers
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing (10 salt rounds)
- **Database ODM**: Mongoose 8
- **Configuration**: dotenv, CORS
- **Seamless Local Support**: Automatic MongoMemoryServer fallback for zero-configuration testing if remote Atlas URI is omitted.

### Database
- **Primary**: MongoDB Atlas (Cloud)
- **Local / Dev**: Local MongoDB instance or in-memory MongoDB

---

## 4. Project Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React.js Frontend                    │
│     (Vite • React Router • Tailwind CSS • Axios)      │
└──────────────────────────┬─────────────────────────────┘
                           │  HTTP / JSON (REST APIs)
                           │  Authorization: Bearer <JWT>
                           ▼
┌────────────────────────────────────────────────────────┐
│               Node.js + Express Backend                │
│  - JWT Middleware (protect, authorize)                 │
│  - Error Handling & Input Validation                   │
│  - Controllers: Auth, Student, Recruiter, Skills, etc. │
└──────────────────────────┬─────────────────────────────┘
                           │  Mongoose ODM
                           ▼
┌────────────────────────────────────────────────────────┐
│                 MongoDB Atlas Cluster                  │
│  (Collections: users, studentprofiles, skills,         │
│   projects, certifications, assessments, shortlists)   │
└────────────────────────────────────────────────────────┘
```

---

## 5. Folder Structure

```
skillproof/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AchievementCard.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── CertificationCard.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SkillBadge.jsx
│   │   │   ├── SocialIcons.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── VerificationBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PublicPortfolio.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Skills.jsx
│   │   │   │   ├── Assessments.jsx
│   │   │   │   ├── Projects.jsx
│   │   │   │   ├── Certifications.jsx
│   │   │   │   ├── Achievements.jsx
│   │   │   │   ├── Portfolio.jsx
│   │   │   │   └── Settings.jsx
│   │   │   └── recruiter/
│   │   │       ├── RecruiterDashboard.jsx
│   │   │       ├── Candidates.jsx
│   │   │       ├── CandidateProfile.jsx
│   │   │       ├── Shortlisted.jsx
│   │   │       └── Settings.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── skillController.js
│   │   ├── projectController.js
│   │   ├── certificationController.js
│   │   ├── achievementController.js
│   │   ├── assessmentController.js
│   │   ├── recruiterController.js
│   │   └── shortlistController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── Skill.js
│   │   ├── Project.js
│   │   ├── Certification.js
│   │   ├── Achievement.js
│   │   ├── Assessment.js
│   │   └── Shortlist.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── certificationRoutes.js
│   │   ├── achievementRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── recruiterRoutes.js
│   │   ├── shortlistRoutes.js
│   │   └── githubRoutes.js
│   ├── seed/
│   │   └── seedData.js
│   ├── services/
│   │   ├── assessmentQuestions.js
│   │   └── githubService.js
│   ├── test-api.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## 6. MongoDB Atlas Setup

1. **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. **Create a Free Cluster**: Choose the M0 Shared Tier (Free).
3. **Set Up Database Access**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Choose **Password** authentication and create a username and strong password.
   - Assign the role `Read and write to any database`.
4. **Configure Network Access**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Choose `Allow Access From Anywhere` (`0.0.0.0/0`) for development.
5. **Get Connection String**:
   - In **Database Deployments**, click **Connect**.
   - Select **Drivers (Node.js)**.
   - Copy the URI, which looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/skillproof?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your created database credentials.

---

## 7. Environment Variable Setup

### Server Configuration
In the `server/` directory, create or edit `.env` (refer to `server/.env.example`):

```env
# MongoDB Atlas Connection String
# Leave empty or set your MongoDB Atlas URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/skillproof?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=skillproof_production_style_jwt_secret_2026_safe

# Server Port
PORT=5000

# Client Origin for CORS
CLIENT_ORIGIN=http://localhost:5173

# Optional: GitHub Personal Access Token (prevents rate limiting)
GITHUB_TOKEN=
```

> **Note**: If `MONGODB_URI` is not set or the cluster is temporarily unreachable, the backend automatically initializes an in-memory MongoDB instance (`mongodb-memory-server`) so you can run, evaluate, and test the entire platform without any local configuration friction.

### Client Configuration (Optional)
The client connects to `http://localhost:5000/api` by default. To customize:
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 8. Backend Installation

```bash
cd server
npm install
```

To run the automated verification suite to test all endpoints:
```bash
npm test
```

---

## 9. Frontend Installation

```bash
cd client
npm install
```

To verify the production build:
```bash
npm run build
```

---

## 10. How to Run

### Option A: Run Backend and Frontend in Separate Terminals

**Terminal 1 (Backend)**:
```bash
cd server
npm start
```
*Backend runs at: `http://localhost:5000`*

**Terminal 2 (Frontend)**:
```bash
cd client
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

### Option B: Seed Data Manually (Optional)
The server automatically detects a fresh database and seeds realistic demo data on first start. You can also re-seed anytime with:
```bash
cd server
npm run seed
```

---

## 11. API Endpoints Documentation

All protected endpoints require the header:  
`Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Purpose | Access | Request Body | Response (Success) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student or recruiter | Public | `{ name, email, password, confirmPassword, role, college, department, year, company, jobTitle }` | `{ success: true, token, user }` | `201` |
| `POST` | `/api/auth/login` | Log in user | Public | `{ email, password }` | `{ success: true, token, user }` | `200` |
| `GET` | `/api/auth/me` | Fetch active user session | Private | None | `{ success: true, user }` | `200` |
| `GET` | `/api/students/profile` | Get current student profile | Student | None | `{ success: true, profile, user, profileCompletion }` | `200` |
| `PUT` | `/api/students/profile` | Update profile / privacy settings | Student | `{ bio, phone, location, degree, github, linkedin, portfolio, privacySettings }` | `{ success: true, profile, profileCompletion }` | `200` |
| `GET` | `/api/students/dashboard-summary` | Overview metrics for student dashboard | Student | None | `{ success: true, stats, recentSkills, recentProjects, ... }` | `200` |
| `GET` | `/api/students/:id` | Public portfolio profile (respects privacy) | Public | None | `{ success: true, student, profile, skills, projects, ... }` | `200` |
| `GET` | `/api/skills` | List skills for logged in student | Student | Query: `?category=Programming&search=Python` | `{ success: true, count, skills }` | `200` |
| `POST` | `/api/skills` | Add new skill | Student | `{ name, category, level }` | `{ success: true, skill }` | `201` |
| `PUT` | `/api/skills/:id` | Update skill level/category | Student | `{ level, category }` | `{ success: true, skill }` | `200` |
| `DELETE`| `/api/skills/:id` | Delete a skill | Student | None | `{ success: true, message }` | `200` |
| `GET` | `/api/projects` | List student projects | Student | None | `{ success: true, count, projects }` | `200` |
| `POST` | `/api/projects` | Add project with tech stack & links | Student | `{ title, description, technologies, githubUrl, liveUrl, category, status }` | `{ success: true, project }` | `201` |
| `PUT` | `/api/projects/:id` | Update project | Student | `{ title, description, technologies, ... }` | `{ success: true, project }` | `200` |
| `DELETE`| `/api/projects/:id` | Delete project | Student | None | `{ success: true, message }` | `200` |
| `GET` | `/api/certifications` | List student certifications | Student | None | `{ success: true, certifications }` | `200` |
| `POST` | `/api/certifications` | Add certification credential | Student | `{ name, organization, issueDate, expiryDate, credentialId, certificateUrl }` | `{ success: true, certification }` | `201` |
| `DELETE`| `/api/certifications/:id` | Delete certification | Student | None | `{ success: true, message }` | `200` |
| `GET` | `/api/achievements` | List student achievements | Student | None | `{ success: true, achievements }` | `200` |
| `POST` | `/api/achievements` | Add hackathon/award/workshop | Student | `{ title, description, organization, date, url, category }` | `{ success: true, achievement }` | `201` |
| `DELETE`| `/api/achievements/:id` | Delete achievement | Student | None | `{ success: true, message }` | `200` |
| `GET` | `/api/assessments` | Get available skill tests & attempts | Student | None | `{ success: true, availableSkills, recentAttempts }` | `200` |
| `POST` | `/api/assessments/start` | Start timed test for a skill | Student | `{ skill: "Python" }` | `{ success: true, skill, durationMinutes, totalQuestions, questions }` | `200` |
| `POST` | `/api/assessments/submit` | Submit test answers & verify skill | Student | `{ skill: "Python", answers: { "py-1": 1, ... } }` | `{ success: true, result: { score, isVerified, verificationStatus } }` | `200` |
| `GET` | `/api/assessments/results` | List all past assessment scores | Student | None | `{ success: true, count, results }` | `200` |
| `GET` | `/api/recruiters/dashboard` | Recruiter statistics & previews | Recruiter | None | `{ success: true, stats, recentCandidates }` | `200` |
| `GET` | `/api/recruiters/candidates` | Search, filter, sort & paginate candidates | Recruiter | Query: `?search=...&skill=...&verification=Verified&page=1&limit=10&sort=score` | `{ success: true, data, page, limit, total, totalPages }` | `200` |
| `GET` | `/api/recruiters/candidates/:id` | Full candidate profile review | Recruiter | None | `{ success: true, candidate, skills, projects, certifications, assessments }` | `200` |
| `GET` | `/api/shortlist` | Get recruiter's shortlisted candidates | Recruiter | None | `{ success: true, count, shortlist }` | `200` |
| `POST` | `/api/shortlist/:studentId` | Add candidate to shortlist | Recruiter | `{ notes: "Scheduled for tech interview" }` | `{ success: true, entry }` | `201` |
| `DELETE`| `/api/shortlist/:studentId` | Remove candidate from shortlist | Recruiter | None | `{ success: true, message }` | `200` |
| `GET` | `/api/github/:username` | Fetch GitHub avatar, bio & top repos | Public | None | `{ success: true, data: { username, publicRepos, topRepos } }` | `200` |

---

## 12. Database Models

### User (`User.js`)
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `password` (String, required, hashed with bcrypt)
- `role` (String, enum: `['student', 'recruiter']`, default: `'student'`)
- `college` (String, student specific)
- `department` (String, student specific)
- `year` (String, student specific)
- `company` (String, recruiter specific)
- `jobTitle` (String, recruiter specific)
- `createdAt` & `updatedAt` (Timestamps)

### StudentProfile (`StudentProfile.js`)
- `userId` (ObjectId ref User, unique)
- `bio`, `phone`, `location`, `college`, `degree`, `department`, `graduationYear`, `careerObjective`, `profilePhoto`, `github`, `linkedin`, `portfolio`
- `privacySettings`:
  - `isPublic` (Boolean, default: true)
  - `showEmail` (Boolean, default: true)
  - `showPhone` (Boolean, default: false)
  - `showGithub` (Boolean, default: true)
  - `showLinkedin` (Boolean, default: true)
  - `showProjects` (Boolean, default: true)
  - `showCertifications` (Boolean, default: true)
  - `showAssessmentResults` (Boolean, default: true)

### Skill (`Skill.js`)
- `studentId` (ObjectId ref User)
- `name` (String, required)
- `category` (String, enum: Programming, Web Development, Database, AI / ML, Cloud, Cybersecurity, IoT, Data Science, Soft Skills, Other)
- `level` (String, enum: Beginner, Intermediate, Advanced, Expert)
- `verificationStatus` (String, enum: Not Verified, In Progress, Verified)
- `verificationScore` (Number, 0-100)
- `verifiedAt` (Date)
- Compound index: `{ studentId: 1, name: 1 }` (unique)

### Project (`Project.js`)
- `studentId` (ObjectId ref User)
- `title`, `description`, `technologies` (Array of Strings)
- `githubUrl`, `liveUrl`, `category`, `startDate`, `endDate`
- `status` (String, enum: In Progress, Completed)

### Certification (`Certification.js`)
- `studentId` (ObjectId ref User)
- `name`, `organization`, `issueDate`, `expiryDate`, `credentialId`, `certificateUrl`

### Achievement (`Achievement.js`)
- `studentId` (ObjectId ref User)
- `title`, `description`, `organization`, `date`, `url`
- `category` (String, enum: Hackathon, Competition, Workshop, Award, Leadership, Publication, Other)

### Assessment (`Assessment.js`)
- `studentId` (ObjectId ref User)
- `skill` (String)
- `questions` (Array of question objects with questionText, selectedAnswer, correctAnswer, isCorrect, explanation)
- `score` (Number, 0-100)
- `totalQuestions` (Number)
- `correctAnswers` (Number)
- `verificationStatus` (String: Verified / Not Verified)
- `completedAt` (Date)

### Shortlist (`Shortlist.js`)
- `recruiterId` (ObjectId ref User)
- `studentId` (ObjectId ref User)
- `notes` (String)
- Compound index: `{ recruiterId: 1, studentId: 1 }` (unique)

---

## 13. Authentication Flow

1. User visits `/register` and selects either **Student** or **Recruiter**.
2. Frontend submits role-specific fields to `POST /api/auth/register`.
3. Backend validates required inputs, checks for duplicate emails, salts and hashes the password with `bcryptjs`, and saves the document. If the user is a student, an initial `StudentProfile` record is automatically created.
4. Backend generates a JWT containing `{ id, role }` signed with `JWT_SECRET` (7-day expiry).
5. Frontend stores the token in `localStorage` under `skillproof_token`.
6. Axios request interceptor attaches `Authorization: Bearer <token>` on all subsequent requests.
7. Role-based redirect sends the student to `/student/dashboard` or recruiter to `/recruiter/dashboard`.
8. On page refresh, `AuthContext` calls `/api/auth/me` to rehydrate state seamlessly.

---

## 14. Student Flow

```
Landing Page ➔ Register/Login (Student)
  ➔ /student/dashboard
  ➔ /student/profile (Fill Academic, Bio, Career Objective, Socials)
  ➔ /student/skills (Add skills across 10 categories)
  ➔ /student/assessment (Select skill ➔ 10-minute MCQ test ➔ Instant evaluation)
     ├── If Score >= 70%: Skill marked as Verified with visual badge
     └── If Score < 70%: Skill marked as In Progress with option to re-test
  ➔ /student/projects (Add completed or in-progress projects with GitHub/Demo links)
  ➔ /student/certifications (Add credentials and verification links)
  ➔ /student/achievements (Document Hackathons, Awards, Leadership)
  ➔ /student/portfolio (Preview and click 'Share Portfolio' for public link)
  ➔ /student/settings (Configure privacy toggles)
```

---

## 15. Recruiter Flow

```
Landing Page ➔ Register/Login (Recruiter)
  ➔ /recruiter/dashboard (Overview stats, talent distribution, quick recommendations)
  ➔ /recruiter/candidates (Search candidates by name, college, department)
     ├── Filter by Skill, Skill Level, Verification Status, Minimum Score
     ├── Sort by Completion, Score, Verified Skills Count, or Name
     └── 10 Candidates per page with server-side pagination
  ➔ Click "View Profile" ➔ /recruiter/candidates/:id
     ├── Review student's verified skills, projects, certifications, assessments
     └── Click "Shortlist Candidate" with optional custom interview notes
  ➔ /recruiter/shortlisted (Manage active pipeline, view notes, remove candidates)
```

---

## 16. Demo Credentials

The database comes pre-seeded with realistic fictional data. You can log in directly using:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student 1** | `arun@example.com` | `password123` | Arun Kumar — ABC Engineering College (Verified: Python, React, SQL, JavaScript) |
| **Student 2** | `priya@example.com` | `password123` | Priya Sharma — National Institute of Technology (Verified: Java, Data Structures, SQL) |
| **Student 3** | `rohan@example.com` | `password123` | Rohan Patel — Global Institute of Technology (Verified: Python) |
| **Recruiter** | `recruiter@example.com` | `password123` | Recruiter Demo — Senior Talent Acquisition Lead, TechNova Solutions |

> **Pro Tip**: The Login page features convenient one-click "Student Demo" and "Recruiter Demo" quick-fill buttons for instant testing.

---

## 17. Troubleshooting Guide

### 1. Port 5000 Already in Use
If port 5000 is occupied by another service on your machine:
- Set `PORT=5001` in `server/.env`.
- In `client/.env`, set `VITE_API_URL=http://localhost:5001/api`.

### 2. MongoDB Atlas Connection Timeout
- Ensure your IP address is whitelisted in MongoDB Atlas under **Network Access** (`0.0.0.0/0`).
- Check that your username and password do not contain unencoded special characters.
- If remote connection fails, the server will automatically fall back to the embedded in-memory MongoDB server so you can continue testing without interruption.

### 3. CORS Errors
- Verify that `CLIENT_ORIGIN=http://localhost:5173` is present in `server/.env`.
- `server.js` is pre-configured to accept requests from `http://localhost:5173` and `http://127.0.0.1:5173`.

### 4. GitHub API Rate Limits
- The GitHub integration works without a token for light usage.
- If you encounter rate-limiting errors (`403`), add a personal access token to `GITHUB_TOKEN` in `server/.env`.

---

## 18. Future Enhancements

- **Proctored Assessments**: Camera and tab-switching monitoring during skill assessments.
- **GitHub Automated Webhooks**: Sync repository commits and star milestones dynamically.
- **Automated Resume PDF Generator**: Export verified digital portfolios into ATS-friendly PDF formats.
- **Recruiter Messaging**: Direct in-app messaging between recruiters and candidates.
- **Badge Minting / Verifiable Credentials**: Issue cryptographic, tamper-proof W3C Verifiable Credentials on public registries.

---

### License
MIT License. Built for collegiate demonstration and real-world deployment.
