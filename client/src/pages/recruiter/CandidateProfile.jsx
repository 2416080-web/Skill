import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Globe,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FolderGit2,
  Award,
  Trophy,
  ExternalLink,
  ChevronLeft,
  FileCheck2,
} from 'lucide-react';
import { Github, Linkedin } from '../../components/SocialIcons';
import { recruiterApi, shortlistApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shortlistNotes, setShortlistNotes] = useState('');
  const [shortlisting, setShortlisting] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const res = await recruiterApi.getCandidateDetails(id);
        setData(res.data);
        setIsShortlisted(res.data.candidate?.isShortlisted || false);
        setShortlistNotes(res.data.candidate?.shortlistNotes || '');
      } catch (err) {
        setToast({ message: 'Failed to load candidate profile.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleToggleShortlist = async () => {
    try {
      setShortlisting(true);
      if (!isShortlisted) {
        await shortlistApi.addToShortlist(id, shortlistNotes || 'High potential candidate');
        setIsShortlisted(true);
        setToast({ message: 'Candidate added to shortlist!', type: 'success' });
      } else {
        await shortlistApi.removeFromShortlist(id);
        setIsShortlisted(false);
        setToast({ message: 'Candidate removed from shortlist.', type: 'info' });
      }
    } catch (err) {
      setToast({ message: 'Failed to update shortlist.', type: 'error' });
    } finally {
      setShortlisting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading candidate dossier..." />;
  }

  if (!data || !data.candidate) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Candidate not found.</p>
        <Link to="/recruiter/candidates" className="text-xs text-indigo-600 font-bold mt-2 inline-block">
          ← Return to Candidate Search
        </Link>
      </div>
    );
  }

  const { candidate, skills = [], projects = [], certifications = [], achievements = [], assessments = [], githubData } = data;
  const verifiedSkills = skills.filter((s) => s.verificationStatus === 'Verified');

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

      {/* Back button */}
      <div>
        <Link
          to="/recruiter/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Candidate Search</span>
        </Link>
      </div>

      {/* Candidate Dossier Header */}
      <Card className="p-8 border-slate-200 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="relative">
              {candidate.profilePhoto ? (
                <img
                  src={candidate.profilePhoto}
                  alt={candidate.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-2xl border-2 border-indigo-200">
                  {candidate.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              {verifiedSkills.length > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{candidate.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {verifiedSkills.length} Verified Skills
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  {candidate.college}
                </span>
                <span>•</span>
                <span>{candidate.department}</span>
                {candidate.year && (
                  <>
                    <span>•</span>
                    <span>{candidate.year}</span>
                  </>
                )}
                {candidate.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {candidate.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Shortlist Action */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant={isShortlisted ? 'danger' : 'primary'}
              size="md"
              icon={Bookmark}
              loading={shortlisting}
              onClick={handleToggleShortlist}
              className="w-full md:w-auto"
            >
              {isShortlisted ? 'Remove from Shortlist' : 'Shortlist Candidate'}
            </Button>
          </div>
        </div>

        {/* Bio & Career Objective */}
        {candidate.bio && (
          <p className="text-xs text-slate-600 mt-5 leading-relaxed max-w-3xl">
            {candidate.bio}
          </p>
        )}

        {candidate.careerObjective && (
          <div className="mt-3 p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 leading-relaxed max-w-3xl">
            <span className="font-bold">Career Objective: </span>
            {candidate.careerObjective}
          </div>
        )}

        {/* Contact Links (Respecting privacy settings) */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          {candidate.email && (
            <a
              href={`mailto:${candidate.email}`}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{candidate.email}</span>
            </a>
          )}
          {candidate.phone && (
            <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Phone className="w-3.5 h-3.5" />
              <span>{candidate.phone}</span>
            </span>
          )}
          {candidate.github && (
            <a
              href={candidate.github.startsWith('http') ? candidate.github : `https://github.com/${candidate.github}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {candidate.linkedin && (
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      </Card>

      {/* Skills & Verified Badges */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Technical Skills & Verification Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((skill) => {
            const isVer = skill.verificationStatus === 'Verified';
            return (
              <div
                key={skill._id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isVer ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-800 text-xs block">{skill.name}</span>
                  <span className="text-[11px] text-slate-400">{skill.level} • {skill.category}</span>
                </div>
                {isVer ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified ({skill.verificationScore}%)
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Not Verified</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment Scores */}
      {assessments.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <span>Platform Assessment Records</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assessments.map((a) => (
              <Card key={a._id} className="p-4 border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">{a.skill} Skill Exam</span>
                  <span className="text-[11px] text-slate-400">
                    {a.correctAnswers} of {a.totalQuestions} questions correct
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-indigo-600 block">{a.score}%</span>
                  <span className="text-[10px] font-bold text-emerald-600">{a.verificationStatus}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Integration Repositories */}
      {githubData && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Github className="w-5 h-5 text-slate-800" />
            <span>GitHub Repositories & Evidence</span>
          </h2>

          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-semibold text-slate-600">
              <span>{githubData.publicRepos} Public Repositories</span>
              <span>{githubData.followers} Followers</span>
            </div>

            {githubData.topRepos && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {githubData.topRepos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 transition-colors block group"
                  >
                    <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 flex items-center gap-1">
                      <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                      {repo.name}
                    </span>
                    {repo.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                      {repo.language && <span>{repo.language}</span>}
                      <span>★ {repo.stars}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            <span>Projects & Implementations</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <Card key={proj._id} className="p-6 border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {proj.category || 'Web App'}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">{proj.status}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{proj.description}</p>

                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.technologies.map((t, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-3 text-xs">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Certifications and Achievements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-violet-600" />
              <span>Certifications</span>
            </h2>
            <div className="space-y-3">
              {certifications.map((c) => (
                <Card key={c._id} className="p-4 border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
                  <span className="text-[11px] font-semibold text-indigo-600 mt-0.5 block">{c.organization}</span>
                  {c.certificateUrl && (
                    <a
                      href={c.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 hover:underline mt-2 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Achievements & Awards</span>
            </h2>
            <div className="space-y-3">
              {achievements.map((a) => (
                <Card key={a._id} className="p-4 border-slate-200">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {a.category}
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs mt-1.5">{a.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{a.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
