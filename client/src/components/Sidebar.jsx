import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CheckCircle,
  FileCheck2,
  FolderGit2,
  Award,
  Trophy,
  Sparkles,
  Settings,
  LogOut,
  Users,
  Bookmark,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'My Skills', path: '/student/skills', icon: CheckCircle },
    { name: 'Assessments', path: '/student/assessment', icon: FileCheck2 },
    { name: 'Projects', path: '/student/projects', icon: FolderGit2 },
    { name: 'Certifications', path: '/student/certifications', icon: Award },
    { name: 'Achievements', path: '/student/achievements', icon: Trophy },
    { name: 'Portfolio', path: '/student/portfolio', icon: Sparkles },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const recruiterLinks = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Find Candidates', path: '/recruiter/candidates', icon: Users },
    { name: 'Shortlisted', path: '/recruiter/shortlisted', icon: Bookmark },
    { name: 'Settings', path: '/recruiter/settings', icon: Settings },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1">
          {/* Mobile close header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User role header pill */}
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[11px] font-medium text-indigo-600 capitalize">
                {user?.role} Workspace
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 shadow-xs border border-indigo-100 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section with Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
