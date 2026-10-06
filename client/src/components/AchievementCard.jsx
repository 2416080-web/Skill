import React from 'react';
import { Trophy, ExternalLink, Calendar, Building2, Edit3, Trash2 } from 'lucide-react';
import Card from './Card';

const categoryPills = {
  Hackathon: 'bg-purple-50 text-purple-700 border-purple-200',
  Competition: 'bg-amber-50 text-amber-700 border-amber-200',
  Workshop: 'bg-blue-50 text-blue-700 border-blue-200',
  Award: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Leadership: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Publication: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Other: 'bg-slate-50 text-slate-700 border-slate-200',
};

const AchievementCard = ({
  achievement,
  onEdit,
  onDelete,
  isOwner = false,
}) => {
  const pillStyle = categoryPills[achievement.category] || categoryPills.Other;

  return (
    <Card hover className="flex flex-col justify-between border-slate-200">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillStyle}`}>
                {achievement.category || 'Achievement'}
              </span>
              <h3 className="font-bold text-slate-800 text-sm mt-1 leading-snug">
                {achievement.title}
              </h3>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(achievement)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Achievement"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(achievement)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Achievement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
          {achievement.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          {achievement.organization && (
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <Building2 className="w-3 h-3 shrink-0" />
              {achievement.organization}
            </span>
          )}
          {achievement.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              {achievement.date}
            </span>
          )}
        </div>

        {achievement.url && (
          <a
            href={achievement.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
          >
            <span>Details</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </Card>
  );
};

export default AchievementCard;
