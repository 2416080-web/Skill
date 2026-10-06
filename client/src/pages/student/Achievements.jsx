import React, { useState, useEffect } from 'react';
import { Plus, Trophy } from 'lucide-react';
import { achievementApi } from '../../services/api';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import AchievementCard from '../../components/AchievementCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const CATEGORIES = [
  'Hackathon',
  'Competition',
  'Workshop',
  'Award',
  'Leadership',
  'Publication',
  'Other',
];

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization: '',
    date: '',
    url: '',
    category: 'Hackathon',
  });

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await achievementApi.getAchievements();
      setAchievements(res.data.achievements || []);
    } catch (err) {
      setToast({ message: 'Failed to load achievements.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openAddModal = () => {
    setEditingAch(null);
    setFormData({
      title: '',
      description: '',
      organization: '',
      date: '',
      url: '',
      category: 'Hackathon',
    });
    setModalOpen(true);
  };

  const openEditModal = (ach) => {
    setEditingAch(ach);
    setFormData({
      title: ach.title,
      description: ach.description,
      organization: ach.organization || '',
      date: ach.date || '',
      url: ach.url || '',
      category: ach.category || 'Hackathon',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      setSubmitting(true);
      if (editingAch) {
        await achievementApi.updateAchievement(editingAch._id, formData);
        setToast({ message: 'Achievement updated!', type: 'success' });
      } else {
        await achievementApi.addAchievement(formData);
        setToast({ message: 'Achievement added!', type: 'success' });
      }
      setModalOpen(false);
      fetchAchievements();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Error saving achievement.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ach) => {
    if (!window.confirm(`Delete achievement "${ach.title}"?`)) return;
    try {
      await achievementApi.deleteAchievement(ach._id);
      setToast({ message: 'Achievement removed.', type: 'info' });
      fetchAchievements();
    } catch (err) {
      setToast({ message: 'Failed to delete achievement.', type: 'error' });
    }
  };

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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Honors & Achievements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Highlight hackathon podiums, competitive programming ranks, leadership, and conference publications.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={openAddModal}>
          Add Achievement
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner message="Loading achievements..." />
      ) : achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements added yet"
          description="Document your competitions, hackathons, and awards to stand out to hiring managers."
          actionLabel="Add First Achievement"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <AchievementCard
              key={ach._id}
              achievement={ach}
              isOwner
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Achievement Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAch ? 'Edit Achievement' : 'Add Achievement'}
        subtitle="Record your competitive, leadership, or academic recognition."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Achievement Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Smart India Hackathon - 1st Runner Up"
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
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Briefly state your role, project built, or problem solved..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Organizing Body / Institute
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. ACM, IEEE, Microsoft"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date / Year
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Sept 2025"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Proof Link / Official URL (Optional)
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingAch ? 'Update Achievement' : 'Save Achievement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Achievements;
