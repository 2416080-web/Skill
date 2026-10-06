import React from 'react';
import { FolderPlus } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FolderPlus,
  title = 'No items found',
  description = 'Get started by adding your first item.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
