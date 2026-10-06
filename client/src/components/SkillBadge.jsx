import React from 'react';
import VerificationBadge from './VerificationBadge';

const categoryColors = {
  Programming: 'bg-blue-50 text-blue-700 border-blue-200',
  'Web Development': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Database: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'AI / ML': 'bg-purple-50 text-purple-700 border-purple-200',
  Cloud: 'bg-sky-50 text-sky-700 border-sky-200',
  Cybersecurity: 'bg-rose-50 text-rose-700 border-rose-200',
  IoT: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Data Science': 'bg-teal-50 text-teal-700 border-teal-200',
  'Soft Skills': 'bg-amber-50 text-amber-700 border-amber-200',
  Other: 'bg-slate-50 text-slate-700 border-slate-200',
};

const SkillBadge = ({
  skill,
  onEdit,
  onDelete,
  onVerify,
  showActions = false,
}) => {
  const catStyle = categoryColors[skill.category] || categoryColors.Other;

  return (
    <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
          {skill.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800 text-sm truncate">{skill.name}</h4>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${catStyle} font-medium`}>
              {skill.category}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 font-medium">Level: {skill.level}</span>
            <span className="text-slate-300">•</span>
            <VerificationBadge status={skill.verificationStatus} score={skill.verificationScore} size="sm" />
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {skill.verificationStatus !== 'Verified' && onVerify && (
            <button
              onClick={() => onVerify(skill)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              Verify
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(skill)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit Skill"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(skill)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Skill"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillBadge;
