import React, { useState, useEffect } from 'react';
import { Plus, FolderGit2, Search, ExternalLink } from 'lucide-react';
import { projectApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ProjectCard from '../../components/ProjectCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    category: 'Web Development',
    startDate: '',
    endDate: '',
    status: 'Completed',
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getProjects();
      setProjects(res.data.projects || []);
    } catch (err) {
      setToast({ message: 'Failed to load projects.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      category: 'Web Development',
      startDate: '',
      endDate: '',
      status: 'Completed',
    });
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      description: proj.description,
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies.join(', ')
        : proj.technologies || '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      category: proj.category || 'Web Development',
      startDate: proj.startDate || '',
      endDate: proj.endDate || '',
      status: proj.status || 'Completed',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      setSubmitting(true);
      if (editingProject) {
        await projectApi.updateProject(editingProject._id, formData);
        setToast({ message: 'Project updated successfully!', type: 'success' });
      } else {
        await projectApi.addProject(formData);
        setToast({ message: 'Project added to portfolio!', type: 'success' });
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Error saving project.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (proj) => {
    if (!window.confirm(`Delete project "${proj.title}"?`)) return;
    try {
      await projectApi.deleteProject(proj._id);
      setToast({ message: 'Project removed.', type: 'info' });
      fetchProjects();
    } catch (err) {
      setToast({ message: 'Failed to delete project.', type: 'error' });
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Project Evidence</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase real-world applications, GitHub repositories, and live demo deployments.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={openAddModal}>
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner message="Loading your projects..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects added yet"
          description="Projects give recruiters concrete evidence of your practical engineering skills."
          actionLabel="Add Your First Project"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard
              key={proj._id}
              project={proj}
              isOwner
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add Project'}
        subtitle="Provide technical and repository details to highlight your engineering capabilities."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI Travel Planner"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
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
              placeholder="Explain the problem solved, architectural choices, and main features..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Technologies (Comma separated)
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/user/repo"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Live Demo / Deployment URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://my-app.vercel.app"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Cloud / DevOps">Cloud / DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Database">Database</option>
                <option value="IoT / Embedded">IoT / Embedded</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Completion Date / Month
              </label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="e.g. Nov 2025"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
