import React, { useState } from 'react';
import { Briefcase, Building2, Mail, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Toast from '../../components/Toast';

const RecruiterSettings = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState({ message: '', type: 'success' });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recruiter Profile & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your recruiting organization credentials and talent discovery configurations.
        </p>
      </div>

      <Card className="p-8 border-slate-200 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RC'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.jobTitle} • {user?.company}</p>
            <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
              Verified Enterprise Recruiter
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                disabled
                value={user?.company || ''}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Title
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                disabled
                value={user?.jobTitle || ''}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Account verified by SkillProof Enterprise Trust Engine.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setToast({ message: 'Settings are up to date.', type: 'info' })}
          >
            Refresh Status
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RecruiterSettings;
