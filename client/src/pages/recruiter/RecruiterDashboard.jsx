import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Bookmark,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recruiterApi, shortlistApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CandidateCard from '../../components/CandidateCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [shortlistActionLoading, setShortlistActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await recruiterApi.getDashboard();
      setData(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load recruiter metrics.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleShortlist = async (studentId, willShortlist) => {
    try {
      setShortlistActionLoading(true);
      if (willShortlist) {
        await shortlistApi.addToShortlist(studentId, 'Shortlisted from Dashboard');
        setToast({ message: 'Candidate added to shortlist!', type: 'success' });
      } else {
        await shortlistApi.removeFromShortlist(studentId);
        setToast({ message: 'Candidate removed from shortlist.', type: 'info' });
      }
      fetchDashboard();
    } catch (err) {
      setToast({ message: 'Failed to update shortlist.', type: 'error' });
    } finally {
      setShortlistActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading recruiter talent dashboard..." />;
  }

  const stats = data?.stats || {};
  const recentCandidates = data?.recentCandidates || [];
  const skillDist = stats.skillDistribution || [];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Recruiter Portal • {user?.company || 'Enterprise'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Recruiter'}!
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
            {user?.jobTitle || 'Talent Acquisition'} • Discover verified students with validated code evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/recruiter/candidates">
            <Button
              variant="secondary"
              size="md"
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-white shadow-md font-bold"
              icon={Search}
            >
              Search All Candidates
            </Button>
          </Link>
          <Link to="/recruiter/shortlisted">
            <Button
              variant="ghost"
              size="md"
              className="text-white hover:bg-white/10 border border-white/30"
              icon={Bookmark}
            >
              View Shortlist ({stats.shortlistedCandidates || 0})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-5 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Candidates
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 mt-2 block tracking-tight">
            {stats.totalCandidates || 0}
          </span>
          <p className="text-xs text-slate-400 mt-1">Registered student talent</p>
        </Card>

        <Card hover className="p-5 border-emerald-100 bg-emerald-50/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Verified Candidates
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-700 mt-2 block tracking-tight">
            {stats.verifiedCandidates || 0}
          </span>
          <p className="text-xs text-slate-400 mt-1">With 1+ passed assessment</p>
        </Card>

        <Card hover className="p-5 border-amber-100 bg-amber-50/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Shortlisted
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-700 mt-2 block tracking-tight">
            {stats.shortlistedCandidates || 0}
          </span>
          <p className="text-xs text-slate-400 mt-1">Bookmarked in your pipeline</p>
        </Card>

        <Card hover className="p-5 border-indigo-100 bg-indigo-50/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Verification Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-indigo-700 mt-2 block tracking-tight">
            {stats.totalCandidates > 0
              ? Math.round((stats.verifiedCandidates / stats.totalCandidates) * 100)
              : 0}
            %
          </span>
          <p className="text-xs text-slate-400 mt-1">Verified competency ratio</p>
        </Card>
      </div>

      {/* Skill Distribution Bar */}
      {skillDist.length > 0 && (
        <Card className="p-6 border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-400 mb-4">
            Most In-Demand Skills in Candidate Pool
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {skillDist.map((item) => (
              <Link
                key={item._id}
                to={`/recruiter/candidates?skill=${encodeURIComponent(item._id)}`}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 transition-colors flex items-center gap-2"
              >
                <span className="font-bold text-slate-800 text-xs">{item._id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {item.verifiedCount} verified
                </span>
                <span className="text-[11px] text-slate-400">({item.count})</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Main Section: Discover Talent */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Discover Talent</h2>
            <p className="text-xs text-slate-500">
              Recently joined students with verified skill proofs and repository links
            </p>
          </div>
          <Link to="/recruiter/candidates" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
            View All Candidates ({stats.totalCandidates || 0}) →
          </Link>
        </div>

        {recentCandidates.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center bg-white rounded-2xl border border-slate-200">
            No student candidates found in database.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isShortlisted={candidate.isShortlisted}
                shortlistLoading={shortlistActionLoading}
                onToggleShortlist={handleToggleShortlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
