import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, Save, Lock, Check } from 'lucide-react';
import { studentApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const [privacySettings, setPrivacySettings] = useState({
    isPublic: true,
    showEmail: true,
    showPhone: false,
    showGithub: true,
    showLinkedin: true,
    showProjects: true,
    showCertifications: true,
    showAssessmentResults: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getMyProfile();
        if (res.data?.profile?.privacySettings) {
          setPrivacySettings((prev) => ({
            ...prev,
            ...res.data.profile.privacySettings,
          }));
        }
      } catch (err) {
        setToast({ message: 'Failed to load privacy settings.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await studentApi.updateMyProfile({ privacySettings });
      setToast({ message: 'Privacy preferences saved successfully!', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to save settings.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading privacy settings..." />;
  }

  const settingItems = [
    {
      key: 'isPublic',
      label: 'Public Digital Portfolio',
      description: 'Allow recruiters and companies to view your verified portfolio URL.',
      isMaster: true,
    },
    {
      key: 'showEmail',
      label: 'Display Email Address',
      description: 'Show your university/contact email on your public portfolio.',
    },
    {
      key: 'showPhone',
      label: 'Display Phone Number',
      description: 'Make your phone number visible to recruiters.',
    },
    {
      key: 'showGithub',
      label: 'Show GitHub Integration',
      description: 'Display your GitHub repositories, stars, and code commits.',
    },
    {
      key: 'showLinkedin',
      label: 'Show LinkedIn Profile',
      description: 'Provide a direct link to your LinkedIn profile.',
    },
    {
      key: 'showProjects',
      label: 'Display Projects & Repositories',
      description: 'Include your project cards and live demo deployments.',
    },
    {
      key: 'showCertifications',
      label: 'Show Certifications',
      description: 'Display verified certificates from AWS, Coursera, Oracle, etc.',
    },
    {
      key: 'showAssessmentResults',
      label: 'Show Assessment Results & Scores',
      description: 'Display detailed quiz scores on your public portfolio.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Privacy Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Control which personal details, assessments, and projects are visible to recruiters and the public.
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-slate-200 divide-y divide-slate-100">
        {settingItems.map((item) => {
          const isEnabled = privacySettings[item.key];
          return (
            <div
              key={item.key}
              className={`py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0 ${
                item.isMaster ? 'bg-indigo-50/50 p-4 rounded-2xl mb-4 border border-indigo-100' : ''
              }`}
            >
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                  isEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
                aria-label={`Toggle ${item.label}`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}

        <div className="pt-6 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
            onClick={handleSave}
            className="px-8 shadow-md"
          >
            Save Privacy Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
