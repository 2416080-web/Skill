import React, { useState, useEffect } from 'react';
import { Plus, Award } from 'lucide-react';
import { certApi } from '../../services/api';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import CertificationCard from '../../components/CertificationCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    certificateUrl: '',
  });

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const res = await certApi.getCertifications();
      setCertifications(res.data.certifications || []);
    } catch (err) {
      setToast({ message: 'Failed to load certifications.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      organization: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      certificateUrl: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name,
      organization: cert.organization,
      issueDate: cert.issueDate || '',
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      certificateUrl: cert.certificateUrl || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.organization.trim()) return;

    try {
      setSubmitting(true);
      if (editingCert) {
        await certApi.updateCertification(editingCert._id, formData);
        setToast({ message: 'Certification updated!', type: 'success' });
      } else {
        await certApi.addCertification(formData);
        setToast({ message: 'Certification added to portfolio!', type: 'success' });
      }
      setModalOpen(false);
      fetchCertifications();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Error saving certification.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete certification "${cert.name}"?`)) return;
    try {
      await certApi.deleteCertification(cert._id);
      setToast({ message: 'Certification removed.', type: 'info' });
      fetchCertifications();
    } catch (err) {
      setToast({ message: 'Failed to delete certification.', type: 'error' });
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verified Certifications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Display external credentials from AWS, Google Cloud, Meta, Oracle, Coursera, etc.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={openAddModal}>
          Add Certificate
        </Button>
      </div>

      {/* Certifications Grid */}
      {loading ? (
        <LoadingSpinner message="Loading certifications..." />
      ) : certifications.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications added yet"
          description="Industry certifications prove your knowledge to prospective recruiters."
          actionLabel="Add Certification"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <CertificationCard
              key={cert._id}
              certification={cert}
              isOwner
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Certification Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCert ? 'Edit Certification' : 'Add Certification'}
        subtitle="Provide credential details and verification links."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Certification Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Issuing Organization *
            </label>
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g. Amazon Web Services, Oracle, Meta"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Date
              </label>
              <input
                type="text"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                placeholder="e.g. June 2025"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expiry Date (Optional)
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                placeholder="e.g. June 2028 or Lifetime"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Credential ID (Optional)
            </label>
            <input
              type="text"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              placeholder="e.g. AWS-SAA-9284729"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Certificate URL / Verification Link
            </label>
            <input
              type="url"
              value={formData.certificateUrl}
              onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
              placeholder="https://credly.com/badges/..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingCert ? 'Update Certificate' : 'Save Certificate'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Certifications;
