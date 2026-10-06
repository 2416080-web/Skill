import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles, RefreshCw, CheckCircle2, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { seedApi } from '../services/api';
import Button from '../components/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (user) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (user.role === 'recruiter') {
      navigate('/recruiter/dashboard', { replace: true });
    } else {
      navigate('/student/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      redirectAfterLogin(user);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Demo user quick-fill credentials
  const fillDemoStudent = () => {
    setEmail('arun@example.com');
    setPassword('password123');
    setError('');
  };

  const fillDemoRecruiter = () => {
    setEmail('recruiter@example.com');
    setPassword('password123');
    setError('');
  };

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      setError('');
      await seedApi.seed();
      setSeedSuccess(true);
      fillDemoStudent();
      setTimeout(() => setSeedSuccess(false), 6000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to seed mock data. Please ensure the backend server is running.'
      );
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            SkillProof
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to your SkillProof account to continue
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100">
          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me</span>
              </label>
              <span className="text-slate-400">Forgot password? Contact admin</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-4"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials & Seeding */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Fast Demo Login
              </p>
              <button
                type="button"
                onClick={handleSeedData}
                disabled={seeding}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title="Populate MongoDB with students, skills, projects, and assessments"
              >
                <RefreshCw className={`w-3 h-3 ${seeding ? 'animate-spin' : ''}`} />
                <span>{seeding ? 'Seeding Database...' : 'Load Mock Data'}</span>
              </button>
            </div>

            {seedSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Mock data loaded in MongoDB! Choose a role below.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoStudent}
                className="px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors text-center"
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={fillDemoRecruiter}
                className="px-3 py-2 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors text-center"
              >
                Demo Recruiter
              </button>
            </div>
          </div>

          {/* Registration link */}
          <p className="text-xs text-center text-slate-500 mt-6">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
