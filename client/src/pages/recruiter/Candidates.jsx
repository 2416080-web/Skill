import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Users,
} from 'lucide-react';
import { recruiterApi, shortlistApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CandidateCard from '../../components/CandidateCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const POPULAR_SKILLS = ['All', 'Python', 'React', 'SQL', 'JavaScript', 'Java', 'Data Structures'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const VERIFICATIONS = ['All', 'Verified', 'Not Verified'];
const SORTS = [
  { value: 'completion', label: 'Profile Completion' },
  { value: 'score', label: 'Highest Assessment Score' },
  { value: 'verifiedSkills', label: 'Verified Skills Count' },
  { value: 'name', label: 'Name (A to Z)' },
];

const Candidates = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All');
  const [verification, setVerification] = useState(searchParams.get('verification') || 'All');
  const [minScore, setMinScore] = useState(searchParams.get('minScore') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'completion');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Data state
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [shortlistLoading, setShortlistLoading] = useState(false);

  // Fetch Candidates from Backend
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        skill: selectedSkill !== 'All' ? selectedSkill : undefined,
        level: selectedLevel !== 'All' ? selectedLevel : undefined,
        verification: verification !== 'All' ? verification : undefined,
        minScore: minScore ? Number(minScore) : undefined,
        sort,
        page,
        limit: 10,
      };

      const res = await recruiterApi.getCandidates(params);
      setCandidates(res.data.data || []);
      setPagination({
        total: res.data.total || 0,
        totalPages: res.data.totalPages || 1,
        limit: res.data.limit || 10,
      });
    } catch (err) {
      setToast({ message: 'Failed to load candidates.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [selectedSkill, selectedLevel, verification, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCandidates();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSkill('All');
    setSelectedLevel('All');
    setVerification('All');
    setMinScore('');
    setSort('completion');
    setPage(1);
  };

  const handleToggleShortlist = async (studentId, willShortlist) => {
    try {
      setShortlistLoading(true);
      if (willShortlist) {
        await shortlistApi.addToShortlist(studentId, 'Shortlisted from candidate search');
        setToast({ message: 'Candidate added to shortlist!', type: 'success' });
      } else {
        await shortlistApi.removeFromShortlist(studentId);
        setToast({ message: 'Candidate removed from shortlist.', type: 'info' });
      }
      fetchCandidates();
    } catch (err) {
      setToast({ message: 'Failed to update candidate shortlist.', type: 'error' });
    } finally {
      setShortlistLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Search & Discovery</h1>
        <p className="text-xs text-slate-500 mt-1">
          Filter verified student talent by skills, assessment performance, and collegiate department.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <Card className="p-5 border-slate-200 space-y-4">
        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, college, or major department..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
          {(search || selectedSkill !== 'All' || selectedLevel !== 'All' || verification !== 'All' || minScore) && (
            <Button type="button" variant="ghost" size="sm" onClick={handleResetFilters} icon={X}>
              Reset
            </Button>
          )}
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Skill Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => { setSelectedSkill(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              {POPULAR_SKILLS.map((sk) => (
                <option key={sk} value={sk}>{sk}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Proficiency
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => { setSelectedLevel(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Verification Status
            </label>
            <select
              value={verification}
              onChange={(e) => { setVerification(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              {VERIFICATIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Min Assessment Score */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Min Assessment Score
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => { setMinScore(e.target.value); setPage(1); }}
              placeholder="e.g. 70"
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            />
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{candidates.length}</strong> of{' '}
          <strong className="text-slate-800">{pagination.total}</strong> qualified candidates
        </span>
        <span>Page {page} of {pagination.totalPages}</span>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <LoadingSpinner message="Searching candidate database..." />
      ) : candidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates match your criteria"
          description="Try broadening your skill filter, reducing the minimum assessment score, or clearing the search keyword."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              isShortlisted={cand.isShortlisted}
              shortlistLoading={shortlistLoading}
              onToggleShortlist={handleToggleShortlist}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            icon={ChevronLeft}
          >
            Previous
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                page === p
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {p}
            </button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            icon={ChevronRight}
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Candidates;
