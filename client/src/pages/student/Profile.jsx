import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Globe, Target, Camera, Save, CheckCircle2 } from 'lucide-react';
import { Github, Linkedin } from '../../components/SocialIcons';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [completion, setCompletion] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePhoto: '',
    bio: '',
    phone: '',
    location: '',
    college: '',
    department: '',
    degree: '',
    graduationYear: '',
    careerObjective: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getMyProfile();
        const prof = res.data.profile || {};
        const u = res.data.user || {};

        setFormData({
          name: u.name || '',
          email: u.email || '',
          profilePhoto: prof.profilePhoto || '',
          bio: prof.bio || '',
          phone: prof.phone || '',
          location: prof.location || '',
          college: prof.college || u.college || '',
          department: prof.department || u.department || '',
          degree: prof.degree || '',
          graduationYear: prof.graduationYear || u.year || '',
          careerObjective: prof.careerObjective || '',
          github: prof.github || '',
          linkedin: prof.linkedin || '',
          portfolio: prof.portfolio || '',
        });

        setCompletion(res.data.profileCompletion || 0);
      } catch (err) {
        setToast({ message: 'Failed to load profile data.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await studentApi.updateMyProfile(formData);
      updateUser(res.data.user);
      setCompletion(res.data.profileCompletion || 0);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading student profile..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Header & Completion Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your personal, academic, and professional details for recruiter evaluation.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Profile Strength
            </span>
            <span className="text-base font-black text-indigo-600">{completion}% Complete</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-indigo-500 font-bold text-xs text-indigo-700">
            {completion}%
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Card */}
        <Card className="p-6 sm:p-8 border-slate-200">
          <h3 className="font-bold text-slate-800 text-base mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <span>Personal Information</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-slate-100">
            <div className="relative">
              {formData.profilePhoto ? (
                <img
                  src={formData.profilePhoto}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-2xl border-2 border-indigo-200">
                  {formData.name ? formData.name.slice(0, 2).toUpperCase() : 'ST'}
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Profile Photo URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Camera className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Paste a direct image URL for your profile avatar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief summary about your passions, tech interests, and collegiate journey..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>
        </Card>

        {/* Academic Details Card */}
        <Card className="p-6 sm:p-8 border-slate-200">
          <h3 className="font-bold text-slate-800 text-base mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Academic Background</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College / University *
              </label>
              <input
                type="text"
                name="college"
                required
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. ABC Engineering College"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Degree Program
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech in Computer Science"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department / Major *
              </label>
              <input
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Graduation Year
              </label>
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2026 or 4th Year"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>
        </Card>

        {/* Professional & Social Links Card */}
        <Card className="p-6 sm:p-8 border-slate-200">
          <h3 className="font-bold text-slate-800 text-base mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>Professional Profile & Online Evidence</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Career Objective
              </label>
              <textarea
                name="careerObjective"
                rows={2}
                value={formData.careerObjective}
                onChange={handleChange}
                placeholder="State your immediate internship or graduate role aspirations..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GitHub Username / URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="e.g. octocat or github.com/user"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Personal Portfolio URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.dev"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
            className="px-8 shadow-md"
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
