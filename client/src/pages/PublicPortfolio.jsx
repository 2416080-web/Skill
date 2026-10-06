import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Share2,
  Globe,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FolderGit2,
  Award,
  Trophy,
  ExternalLink,
  Calendar,
  Lock,
} from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { studentApi, githubApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import Navbar from '../components/Navbar';

const PublicPortfolio = () => {
  const { studentId } = useParams();
  const [data, setData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getPublicProfile(studentId);
        setData(res.data);

        // Fetch github public repos if handle is present and allowed
        if (res.data?.profile?.github) {
          try {
            const ghRes = await githubApi.getUserData(res.data.profile.github);
            if (ghRes.data?.data) {
              setGithubData(ghRes.data.data);
            }
          } catch (ghErr) {
            console.log('GitHub fetch skipped or unavailable:', ghErr.message);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load public portfolio profile.');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchPortfolio();
    }
  }, [studentId]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setToast({ message: 'Portfolio link copied to clipboard!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner message="Loading verified digital portfolio..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Portfolio Not Available</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
          {error || 'This student profile could not be found or has been configured as private.'}
        </p>
        <Link to="/">
          <Button variant="primary">Return to Home</Button>
        </Link>
      </div>
    );
  }

  const { student, profile, skills = [], projects = [], certifications = [], achievements = [], assessments = [] } = data;
  const verifiedSkills = skills.filter((s) => s.verificationStatus === 'Verified');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Toast */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}

      {/* Top Banner & Hero Profile */}
      <div className="bg-white border-b border-slate-200/80 pt-8 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {profile?.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={student.name}
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg shadow-indigo-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-indigo-100 border-4 border-white">
                    {student.name ? student.name.slice(0, 2).toUpperCase() : 'ST'}
                  </div>
                )}
                {verifiedSkills.length > 0 && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm"
                    title="Verified Candidate"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {student.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Portfolio
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    {student.college || profile?.college || 'College'}
                  </span>
                  <span>•</span>
                  <span>{student.department || profile?.department}</span>
                  {student.year && (
                    <>
                      <span>•</span>
                      <span>{student.year}</span>
                    </>
                  )}
                  {profile?.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {profile.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Share Portfolio Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                icon={Share2}
                onClick={handleShare}
                className="w-full sm:w-auto shadow-md"
              >
                Share Portfolio
              </Button>
            </div>
          </div>

          {/* Bio & Career Objective */}
          {profile?.bio && (
            <p className="text-sm text-slate-600 mt-6 leading-relaxed max-w-3xl">
              {profile.bio}
            </p>
          )}

          {profile?.careerObjective && (
            <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 leading-relaxed max-w-3xl">
              <span className="font-bold">Career Objective: </span>
              {profile.careerObjective}
            </div>
          )}

          {/* Social / Contact Links Row */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-100 text-xs font-semibold">
            {profile?.github && (
              <a
                href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}

            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}

            {profile?.portfolio && (
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}

            {student.email && (
              <a
                href={`mailto:${student.email}`}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200"
              >
                <Mail className="w-4 h-4" />
                <span>{student.email}</span>
              </a>
            )}

            {profile?.phone && (
              <span className="flex items-center gap-1.5 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200">
                <Phone className="w-4 h-4" />
                <span>{profile.phone}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 flex-1 w-full">
        {/* Verified Skills Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Skills & Verified Competencies</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {verifiedSkills.length} Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((s) => {
              const isVer = s.verificationStatus === 'Verified';
              return (
                <div
                  key={s._id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    isVer
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.level} • {s.category}</span>
                  </div>
                  {isVer ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {s.verificationScore}%
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Not Verified</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GitHub Evidence Section (if available) */}
        {githubData && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Github className="w-5 h-5 text-slate-800" />
              <span>GitHub Activity & Repositories</span>
            </h2>

            <Card className="p-6 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {githubData.avatarUrl && (
                    <img src={githubData.avatarUrl} alt="GH Avatar" className="w-10 h-10 rounded-full" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{githubData.name || githubData.username}</h3>
                    <p className="text-xs text-slate-500">@{githubData.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span>{githubData.publicRepos} Public Repos</span>
                  <span>{githubData.followers} Followers</span>
                </div>
              </div>

              {githubData.topRepos && githubData.topRepos.length > 0 && (
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

        {/* Projects Section */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <FolderGit2 className="w-5 h-5 text-indigo-600" />
              <span>Featured Projects</span>
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

                    {proj.technologies && proj.technologies.length > 0 && (
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

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-violet-600" />
              <span>Certifications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {certifications.map((c) => (
                <Card key={c._id} className="p-4 border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
                  <span className="text-[11px] font-semibold text-indigo-600 mt-0.5 block">{c.organization}</span>
                  {c.issueDate && (
                    <span className="text-[10px] text-slate-400 mt-1 block">Issued: {c.issueDate}</span>
                  )}
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

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Honors & Achievements</span>
            </h2>

            <div className="space-y-3">
              {achievements.map((a) => (
                <div key={a._id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-xs">{a.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {a.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{a.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {a.organization} {a.date ? `• ${a.date}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Results Section */}
        {assessments.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Verified Assessment Records</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assessments.map((ass) => (
                <Card key={ass._id} className="p-4 border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">{ass.skill} Assessment</span>
                    <span className="text-[11px] text-slate-400">
                      {ass.correctAnswers} of {ass.totalQuestions} questions correct
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-indigo-600 block">{ass.score}%</span>
                    <span className="text-[10px] font-bold text-emerald-600">{ass.verificationStatus}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>Verified on SkillProof Platform • Digital Evidence and Competency Portfolio</p>
      </footer>
    </div>
  );
};

export default PublicPortfolio;
