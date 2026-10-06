import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, ExternalLink, ShieldCheck, CheckCircle2, Copy, Sparkles, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const Portfolio = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const fetchMyPortfolio = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const res = await studentApi.getPublicProfile(user.id);
          setData(res.data);
        }
      } catch (err) {
        setToast({ message: 'Failed to load portfolio preview.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchMyPortfolio();
  }, [user]);

  const publicUrl = user ? `${window.location.origin}/portfolio/${user.id}` : '';

  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      setToast({ message: 'Public portfolio link copied to clipboard!', type: 'success' });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Preparing your digital portfolio..." />;
  }

  const { student, profile, skills = [], projects = [], certifications = [] } = data || {};
  const verifiedCount = skills.filter((s) => s.verificationStatus === 'Verified').length;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Digital Portfolio</h1>
          <p className="text-xs text-slate-500 mt-1">
            Your live verified resume and project evidence ready to share with hiring recruiters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" icon={Copy} onClick={handleCopyLink}>
            Share Portfolio
          </Button>
          <a href={`/portfolio/${user?.id}`} target="_blank" rel="noreferrer">
            <Button variant="outline" size="md" icon={ExternalLink}>
              Open Public View
            </Button>
          </a>
        </div>
      </div>

      {/* Shareable Link Banner */}
      <Card className="p-5 border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800">Your Public Portfolio URL</span>
            <p className="text-xs text-slate-500 font-mono select-all truncate max-w-md">
              {publicUrl}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Copy} onClick={handleCopyLink}>
            Copy Link
          </Button>
          <Link to="/student/settings">
            <Button variant="outline" size="sm" icon={Settings}>
              Privacy Settings
            </Button>
          </Link>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Verified Skills</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{verifiedCount}</span>
        </Card>
        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Projects Showcased</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{projects.length}</span>
        </Card>
        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Certifications</span>
          <span className="text-2xl font-black text-violet-600 mt-1 block">{certifications.length}</span>
        </Card>
      </div>

      {/* Portfolio Preview Card */}
      <Card className="p-8 border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {profile?.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={student?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
                {student?.name ? student.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{student?.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Verified Candidate
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student?.college || 'College'} • {student?.department || 'Department'}
              </p>
            </div>
          </div>

          <Link to="/student/profile">
            <Button variant="outline" size="sm" icon={User}>
              Edit Bio & Links
            </Button>
          </Link>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className="text-xs text-slate-600 mt-4 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Skills preview */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Verified Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s._id}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium border flex items-center gap-1 ${
                  s.verificationStatus === 'Verified'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {s.verificationStatus === 'Verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                <span>{s.name}</span>
                {s.verificationScore > 0 && <span className="text-[10px] opacity-75">({s.verificationScore}%)</span>}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Portfolio;
