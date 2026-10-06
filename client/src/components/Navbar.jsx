import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, LogOut, Menu, X, ChevronDown, Sparkles, Briefcase, GraduationCap, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = user?.role === 'recruiter' ? '/recruiter/dashboard' : '/student/dashboard';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Sidebar toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden focus:outline-none"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  SkillProof
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest text-indigo-500 ml-2 px-1.5 py-0.5 bg-indigo-50 rounded">
                  Verified Talent
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation (when logged out) */}
          {!isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
              <a href="#students" className="hover:text-indigo-600 transition-colors">For Students</a>
              <a href="#recruiters" className="hover:text-indigo-600 transition-colors">For Recruiters</a>
              <a href="#verification" className="hover:text-indigo-600 transition-colors">Verification</a>
              <a href="#why-skillproof" className="hover:text-indigo-600 transition-colors">Why SkillProof</a>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link
                to={dashboardPath}
                className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
              {user?.role === 'student' ? (
                <>
                  <Link
                    to="/student/skills"
                    className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Skills
                  </Link>
                  <Link
                    to="/student/assessment"
                    className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Assessments
                  </Link>
                  <Link
                    to="/student/portfolio"
                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    My Portfolio
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/recruiter/candidates"
                    className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Find Candidates
                  </Link>
                  <Link
                    to="/recruiter/shortlisted"
                    className="text-slate-600 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Shortlisted
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right Action buttons / User Menu */}
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5000/api/download"
              download="skillproof.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors shadow-xs"
              title="Download Complete Project (.ZIP)"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{user?.name}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] capitalize px-1.5 py-0.2 rounded font-semibold bg-violet-100 text-violet-700">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 z-50 animate-scale-up">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to={dashboardPath}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>

                        {user?.role === 'student' && (
                          <>
                            <Link
                              to="/student/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>Edit Profile</span>
                            </Link>
                            <Link
                              to="/student/portfolio"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                            >
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span>View Portfolio</span>
                            </Link>
                            <Link
                              to="/student/settings"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                            >
                              <GraduationCap className="w-4 h-4" />
                              <span>Privacy Settings</span>
                            </Link>
                          </>
                        )}

                        {user?.role === 'recruiter' && (
                          <>
                            <Link
                              to="/recruiter/candidates"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                            >
                              <Briefcase className="w-4 h-4" />
                              <span>Discover Candidates</span>
                            </Link>
                            <Link
                              to="/recruiter/shortlisted"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Shortlisted Pool</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
