import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Award,
  Sparkles,
  BarChart2,
  Plus,
  ArrowRight,
  User,
  Clock,
  ExternalLink,
  GraduationCap,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerificationBadge from '../../components/VerificationBadge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getDashboardSummary();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner message="Loading your student dashboard..." />
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Verified Student Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
            {user?.college || 'Engineering College'} • {user?.department || 'Department of Engineering'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/student/assessment">
            <Button
              variant="secondary"
              size="md"
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-white shadow-md font-bold"
              icon={ShieldCheck}
            >
              Take Assessment
            </Button>
          </Link>
          <Link to="/student/portfolio">
            <Button
              variant="ghost"
              size="md"
              className="text-white hover:bg-white/10 border border-white/30"
              icon={ExternalLink}
            >
              View Public Portfolio
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion Card */}
      <Card className="p-6 border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">Profile Completion</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {stats.profileCompletion || 0}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add your verified skills, projects, and certifications to increase profile visibility to recruiters.
            </p>
          </div>
          <Link to="/student/profile">
            <Button variant="outline" size="sm" icon={User}>
              Complete Profile
            </Button>
          </Link>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full mt-4 overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${stats.profileCompletion || 0}%` }}
          />
        </div>
      </Card>

      {/* 6 Key Dashboard Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Profile Score',
            value: `${stats.profileCompletion || 0}%`,
            sub: 'Completion rate',
            icon: User,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
          },
          {
            label: 'Total Skills',
            value: stats.totalSkills || 0,
            sub: 'Added skills',
            icon: BarChart2,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
          },
          {
            label: 'Verified Skills',
            value: stats.verifiedSkills || 0,
            sub: 'Passed quizzes',
            icon: CheckCircle2,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          },
          {
            label: 'Projects',
            value: stats.totalProjects || 0,
            sub: 'Code evidence',
            icon: FolderGit2,
            color: 'text-violet-600 bg-violet-50 border-violet-100',
          },
          {
            label: 'Certificates',
            value: stats.totalCertifications || 0,
            sub: 'Credentials',
            icon: Award,
            color: 'text-amber-600 bg-amber-50 border-amber-100',
          },
          {
            label: 'Avg Assessment',
            value: stats.averageScore ? `${stats.averageScore}%` : 'N/A',
            sub: 'Exam score',
            icon: ShieldCheck,
            color: 'text-pink-600 bg-pink-50 border-pink-100',
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} hover className="p-4 border-slate-200/90 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{card.sub}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <Card className="p-6 border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-400 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/student/profile">
            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 transition-all text-center flex flex-col items-center gap-2 group">
              <User className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Edit Profile</span>
            </button>
          </Link>

          <Link to="/student/skills">
            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 transition-all text-center flex flex-col items-center gap-2 group">
              <Plus className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Add Skill</span>
            </button>
          </Link>

          <Link to="/student/projects">
            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 transition-all text-center flex flex-col items-center gap-2 group">
              <FolderGit2 className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Add Project</span>
            </button>
          </Link>

          <Link to="/student/certifications">
            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 transition-all text-center flex flex-col items-center gap-2 group">
              <Award className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Add Certificate</span>
            </button>
          </Link>

          <Link to="/student/assessment">
            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 transition-all text-center flex flex-col items-center gap-2 group">
              <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Take Assessment</span>
            </button>
          </Link>

          <Link to="/student/portfolio">
            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/80 transition-all text-center flex flex-col items-center gap-2 group">
              <Sparkles className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">View Portfolio</span>
            </button>
          </Link>
        </div>
      </Card>

      {/* Two Column Layout: Skills & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills Verification Summary */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Skill Verification Summary</h3>
              <p className="text-xs text-slate-500">Verified status across your listed competencies</p>
            </div>
            <Link to="/student/skills" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              Manage All →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentSkills && data.recentSkills.length > 0 ? (
              data.recentSkills.map((skill) => (
                <div
                  key={skill._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-xs">{skill.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({skill.level})</span>
                    </div>
                  </div>
                  <VerificationBadge status={skill.verificationStatus} score={skill.verificationScore} size="sm" />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No skills added yet.</p>
            )}
          </div>
        </Card>

        {/* Recent Projects */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Recent Projects</h3>
              <p className="text-xs text-slate-500">Your latest repository and live software work</p>
            </div>
            <Link to="/student/projects" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentProjects && data.recentProjects.length > 0 ? (
              data.recentProjects.map((proj) => (
                <div
                  key={proj._id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{proj.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies && proj.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {proj.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No projects added yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Achievements and Assessments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements Section */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Key Achievements</h3>
              <p className="text-xs text-slate-500">Hackathons, awards, and collegiate leadership</p>
            </div>
            <Link to="/student/achievements" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAchievements && data.recentAchievements.length > 0 ? (
              data.recentAchievements.map((ach) => (
                <div key={ach._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{ach.title}</h4>
                    <p className="text-[11px] text-slate-500">{ach.organization} {ach.date ? `• ${ach.date}` : ''}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No achievements added yet.</p>
            )}
          </div>
        </Card>

        {/* Assessment Performance Section */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Recent Assessments</h3>
              <p className="text-xs text-slate-500">Official platform verification tests taken</p>
            </div>
            <Link to="/student/assessment" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              Take Quiz →
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAssessments && data.recentAssessments.length > 0 ? (
              data.recentAssessments.map((a) => (
                <div key={a._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{a.skill} Assessment</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {a.correctAnswers} of {a.totalQuestions} questions correct
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-600 block">{a.score}%</span>
                    <span className={`text-[10px] font-semibold ${a.verificationStatus === 'Verified' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {a.verificationStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No assessments completed yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
