import React from 'react';
import { ExternalLink, Calendar, Edit3, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Github } from './SocialIcons';
import Card from './Card';

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  isOwner = false,
}) => {
  const isCompleted = project.status === 'Completed';

  return (
    <Card hover className="flex flex-col justify-between h-full border-slate-200">
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {project.category || 'Web App'}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>{project.status || 'Completed'}</span>
            </span>
          </div>

          {isOwner && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(project)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(project)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mt-3 group-hover:text-indigo-600 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info: Timeline + Links */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {(project.startDate || project.endDate) ? (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {project.startDate} {project.endDate ? `— ${project.endDate}` : '— Present'}
            </span>
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium hover:underline p-1 rounded"
              title="View Source on GitHub"
            >
              <Github className="w-4 h-4" />
              <span>Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium hover:underline p-1 rounded"
              title="View Live Application"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
