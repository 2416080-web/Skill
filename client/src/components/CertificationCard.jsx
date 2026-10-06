import React from 'react';
import { Award, ExternalLink, Calendar, KeyRound, Edit3, Trash2 } from 'lucide-react';
import Card from './Card';

const CertificationCard = ({
  certification,
  onEdit,
  onDelete,
  isOwner = false,
}) => {
  return (
    <Card hover className="flex flex-col justify-between border-slate-200">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-snug">
                {certification.name}
              </h3>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">
                {certification.organization}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(certification)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Certification"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(certification)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Credential ID */}
        {certification.credentialId && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-[11px] truncate">
              ID: {certification.credentialId}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {certification.issueDate ? `Issued: ${certification.issueDate}` : 'Issued'}
            {certification.expiryDate ? ` • Exp: ${certification.expiryDate}` : ''}
          </span>
        </div>

        {certification.certificateUrl && (
          <a
            href={certification.certificateUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
          >
            <span>Verify</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </Card>
  );
};

export default CertificationCard;
