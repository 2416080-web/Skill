import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ShieldCheck, CheckCircle2, Clock, Trash2, Edit3, X } from 'lucide-react';
import { skillApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import SkillBadge from '../../components/SkillBadge';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Database',
  'AI / ML',
  'Cloud',
  'Cybersecurity',
  'IoT',
  'Data Science',
  'Soft Skills',
  'Other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const Skills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await skillApi.getSkills({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search.trim() || undefined,
      });
      setSkills(res.data.skills || []);
    } catch (err) {
      setToast({ message: 'Failed to load skills.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({ name: '', category: 'Programming', level: 'Intermediate' });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
    setModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      if (editingSkill) {
        await skillApi.updateSkill(editingSkill._id, formData);
        setToast({ message: 'Skill updated successfully!', type: 'success' });
      } else {
        await skillApi.addSkill(formData);
        setToast({ message: 'Skill added to your profile!', type: 'success' });
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Error saving skill.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`Are you sure you want to remove "${skill.name}"?`)) return;
    try {
      await skillApi.deleteSkill(skill._id);
      setToast({ message: 'Skill removed successfully.', type: 'info' });
      fetchSkills();
    } catch (err) {
      setToast({ message: 'Failed to delete skill.', type: 'error' });
    }
  };

  const handleVerifyRedirect = (skill) => {
    navigate('/student/assessment', { state: { targetSkill: skill.name } });
  };

  const verifiedCount = skills.filter((s) => s.verificationStatus === 'Verified').length;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Skills & Competencies</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase your technical and professional skills, and take assessments to earn verified badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" icon={Plus} onClick={openAddModal}>
            Add Skill
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={ShieldCheck}
            onClick={() => navigate('/student/assessment')}
          >
            Take Assessment
          </Button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Skills</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{skills.length}</span>
        </Card>
        <Card className="p-4 border-emerald-100 bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Verified Skills</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{verifiedCount}</span>
        </Card>
        <Card className="p-4 border-indigo-100 bg-indigo-50/20">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Verification Rate</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">
            {skills.length > 0 ? Math.round((verifiedCount / skills.length) * 100) : 0}%
          </span>
        </Card>
      </div>

      {/* Search and Category Filter */}
      <Card className="p-4 border-slate-200 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills by name (e.g. Python, React, SQL)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Skills Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your skills..." />
      ) : skills.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No skills found"
          description="Add your first skill or adjust your search filter to start building your verified profile."
          actionLabel="Add Your First Skill"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillBadge
              key={skill._id}
              skill={skill}
              onEdit={openEditModal}
              onDelete={handleDeleteSkill}
              onVerify={handleVerifyRedirect}
              showActions
            />
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        subtitle={
          editingSkill
            ? 'Update skill category and experience level.'
            : 'Add a new competency to your digital portfolio profile.'
        }
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Python, React, PostgreSQL, Docker"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Proficiency Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingSkill ? 'Update Skill' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Skills;
