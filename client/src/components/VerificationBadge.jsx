import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const VerificationBadge = ({ status = 'Not Verified', score, size = 'md' }) => {
  const isVerified = status === 'Verified';
  const isInProgress = status === 'In Progress';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  if (isVerified) {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm ${sizeClasses[size]}`}
        title={`Verified Skill with Score ${score || 'Pass'}%`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Verified {score ? `(${score}%)` : ''}</span>
      </span>
    );
  }

  if (isInProgress) {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses[size]}`}
        title="Assessment in progress or retake available"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>In Progress {score ? `(${score}%)` : ''}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses[size]}`}
    >
      <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>Not Verified</span>
    </span>
  );
};

export default VerificationBadge;
