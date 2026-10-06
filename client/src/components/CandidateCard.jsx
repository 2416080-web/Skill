import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle2, Award, FolderGit2, GraduationCap, ChevronRight } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const CandidateCard = ({
  candidate,
  onToggleShortlist,
  isShortlisted = false,
  shortlistLoading = false,
}) => {
  const verifiedSkills = candidate.skills ? candidate.skills.filter((s) => s.verificationStatus === 'Verified' || s.status === 'Verified') : [];
  const candidateId = candidate.id || candidate._id;

  return (
    <Card hover className="flex flex-col justify-between border-slate-200">
      <div>
        {/* Top Header: Avatar + Name + Shortlist Toggle */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {candidate.profilePhoto ? (
                <img
                  src={candidate.profilePhoto}
                  alt={candidate.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {candidate.name ? candidate.name.slice(0, 2).toUpperCase() : 'ST'}
                </div>
              )}
              {verifiedSkills.length > 0 && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm"
                  title={`${verifiedSkills.length} Verified Skills`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <Link
                to={`/recruiter/candidates/${candidateId}`}
                className="font-bold text-slate-900 hover:text-indigo-600 text-base transition-colors line-clamp-1"
              >
                {candidate.name}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="line-clamp-1">{candidate.college || 'Engineering College'}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {candidate.department} {candidate.year ? `• ${candidate.year}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggleShortlist && onToggleShortlist(candidateId, !isShortlisted)}
            disabled={shortlistLoading}
            className={`p-2 rounded-xl transition-all ${
              isShortlisted
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
            title={isShortlisted ? 'Remove from shortlist' : 'Shortlist candidate'}
          >
            <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bio preview if available */}
        {candidate.bio && (
          <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {candidate.bio}
          </p>
        )}

        {/* Skill Badges Preview */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Top Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.slice(0, 4).map((s, idx) => {
                const isSkillVerified = s.verificationStatus === 'Verified' || s.status === 'Verified';
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium border ${
                      isSkillVerified
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSkillVerified && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    <span>{s.name}</span>
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
            {candidate.skills && candidate.skills.length > 4 && (
              <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium">
                +{candidate.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <div className="p-1.5 bg-slate-50/80 rounded-xl">
            <span className="text-[10px] text-slate-400 font-medium block">Verified</span>
            <span className="text-xs font-bold text-emerald-600">{candidate.verifiedSkillsCount || verifiedSkills.length}</span>
          </div>
          <div className="p-1.5 bg-slate-50/80 rounded-xl">
            <span className="text-[10px] text-slate-400 font-medium block">Projects</span>
            <span className="text-xs font-bold text-indigo-600">{candidate.projectCount || 0}</span>
          </div>
          <div className="p-1.5 bg-slate-50/80 rounded-xl">
            <span className="text-[10px] text-slate-400 font-medium block">Top Score</span>
            <span className="text-xs font-bold text-violet-600">
              {candidate.highestScore ? `${candidate.highestScore}%` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500 font-medium">Profile Completion</span>
            <span className="font-bold text-indigo-600">{candidate.profileCompletion || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${candidate.profileCompletion || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          {candidate.location || 'India'}
        </span>
        <Link to={`/recruiter/candidates/${candidateId}`}>
          <Button variant="secondary" size="sm" icon={ChevronRight} iconPosition="right">
            Review Candidate
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default CandidateCard;
