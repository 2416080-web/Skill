import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  GraduationCap,
  CheckCircle2,
  Search,
  Users,
} from 'lucide-react';
import { shortlistApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const Shortlisted = () => {
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [removingId, setRemovingId] = useState(null);

  const fetchShortlist = async () => {
    try {
      setLoading(true);
      const res = await shortlistApi.getShortlist();
      setShortlist(res.data.shortlist || []);
    } catch (err) {
      setToast({ message: 'Failed to load shortlisted candidates.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemove = async (studentId, studentName) => {
    if (!window.confirm(`Remove ${studentName} from your shortlist?`)) return;

    try {
      setRemovingId(studentId);
      await shortlistApi.removeFromShortlist(studentId);
      setToast({ message: `${studentName} removed from shortlist.`, type: 'info' });
      fetchShortlist();
    } catch (err) {
      setToast({ message: 'Failed to remove candidate.', type: 'error' });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shortlisted Candidates</h1>
          <p className="text-xs text-slate-500 mt-1">
            Bookmarked talent pipeline saved for interviews, campus offers, and technical screenings.
          </p>
        </div>

        <Link to="/recruiter/candidates">
          <Button variant="primary" size="md" icon={Search}>
            Find More Candidates
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your candidate shortlist..." />
      ) : shortlist.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No candidates shortlisted yet"
          description="Browse student candidates and click the shortlist bookmark icon to build your talent pool."
          actionLabel="Search Candidates"
          onAction={() => (window.location.href = '/recruiter/candidates')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortlist.map((item) => {
            const student = item.student;
            const verifiedSkills = student.skills
              ? student.skills.filter((s) => s.verificationStatus === 'Verified')
              : [];

            return (
              <Card key={item.shortlistId} hover className="p-6 border-slate-200 flex flex-col justify-between">
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {student.profilePhoto ? (
                        <img
                          src={student.profilePhoto}
                          alt={student.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-base flex items-center justify-center">
                          {student.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <Link
                          to={`/recruiter/candidates/${student.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 text-sm transition-colors"
                        >
                          {student.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <span>{student.college}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(student.id, student.name)}
                      disabled={removingId === student.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove candidate from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Recruiter Notes */}
                  {item.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] text-amber-900">
                      <span className="font-bold">Note: </span>
                      {item.notes}
                    </div>
                  )}

                  {/* Verified Skills */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Verified Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {verifiedSkills.length > 0 ? (
                        verifiedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{s.name}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No verified skills yet</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Projects</span>
                      <span className="font-bold text-slate-800">{student.projectCount || 0}</span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Top Exam Score</span>
                      <span className="font-bold text-indigo-600">
                        {student.highestScore ? `${student.highestScore}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Added {new Date(item.shortlistedAt).toLocaleDateString()}
                  </span>
                  <Link to={`/recruiter/candidates/${student.id}`}>
                    <Button variant="secondary" size="sm" icon={ExternalLink} iconPosition="right">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shortlisted;
