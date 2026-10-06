import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    },
    info: {
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md">
      <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${config.bg} backdrop-blur-sm`}>
        {config.icon}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-current/60 hover:text-current transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
