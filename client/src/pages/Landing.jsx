import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Search,
  FolderGit2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Users,
  Code2,
  Lock,
  Zap,
  BarChart3,
  Bookmark,
  Download,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Generation Student Skill Verification Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Prove Your Skills.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
              Showcase Your Potential.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillProof helps students build verified digital portfolios and helps recruiters discover skilled talent with backed evidence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto text-base px-8 py-3.5">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-3.5">
                Sign In
              </Button>
            </Link>
            <a
              href="http://localhost:5000/api/download"
              download="skillproof.zip"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 font-semibold text-sm transition-all shadow-xs"
              title="Download Full Project Archive"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Download Project (.ZIP)</span>
            </a>
          </div>

          {/* Quick Dual Role Entry Points */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:border-indigo-300 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">For Students</span>
                <h3 className="font-bold text-slate-800 text-base mt-0.5">Build a Verified Profile</h3>
                <p className="text-xs text-slate-500 mt-1">Take assessments, link GitHub projects, and share your public portfolio.</p>
                <Link to="/register" state={{ role: 'student' }} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-3">
                  <span>Student Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-violet-100 shadow-sm hover:border-violet-300 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">For Recruiters</span>
                <h3 className="font-bold text-slate-800 text-base mt-0.5">Discover Vetted Talent</h3>
                <p className="text-xs text-slate-500 mt-1">Filter candidates by tested skills, assessment scores, and college department.</p>
                <Link to="/register" state={{ role: 'recruiter' }} className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 mt-3">
                  <span>Recruiter Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How SkillProof Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Seamless Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">How SkillProof Works</h2>
            <p className="text-sm text-slate-500 mt-2">A transparent 4-step framework bridging student competencies and recruiter hiring pipelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Create Profile',
                desc: 'Add college, academic credentials, bio, GitHub repositories, and certifications.',
                icon: GraduationCap,
              },
              {
                step: '02',
                title: 'Take Assessments',
                desc: 'Test your practical skills in Python, React, SQL, Java, and Data Structures.',
                icon: CheckCircle2,
              },
              {
                step: '03',
                title: 'Earn Verified Badges',
                desc: 'Score 70%+ to unlock verified badges visible to recruiters and on your shareable URL.',
                icon: Award,
              },
              {
                step: '04',
                title: 'Recruiter Discovery',
                desc: 'Top recruiters filter, review your code evidence, and shortlist you for interviews.',
                icon: Search,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
                  <span className="text-3xl font-black text-indigo-200">{item.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center my-3 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Features */}
      <section id="students" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Student Capabilities</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Turn Your Academic Projects Into Concrete Career Proof
              </h2>
              <p className="text-slate-600 mt-4 leading-relaxed text-sm">
                Say goodbye to unverified PDF resumes. SkillProof empowers you to build an interactive, tamper-proof portfolio backed by verifiable multiple-choice skill assessments and real repository evidence.
              </p>

              <div className="space-y-4 mt-8">
                {[
                  { title: 'Interactive Assessments', desc: 'Verify skills with timed quizzes and real-time score calculation.' },
                  { title: 'Curated Project Showcase', desc: 'Display live demos, GitHub repositories, and tech stacks.' },
                  { title: 'Granular Privacy Controls', desc: 'You decide whether your email, phone, and assessments are public.' },
                  { title: 'Instant Portfolio Link', desc: 'Share your public profile URL with recruiters with a single click.' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{feat.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button variant="primary">Create Student Profile</Button>
                </Link>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                    AK
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Arun Kumar</h4>
                    <p className="text-xs text-slate-500">Computer Science • ABC Engineering College</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Candidate
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Verified Skill Proof</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Python (90%)
                  </span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> React (95%)
                  </span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SQL (85%)
                  </span>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Profile Completion</span>
                  <span className="text-indigo-600">92%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Features */}
      <section id="recruiters" className="py-16 md:py-24 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Recruiter Tools</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Hire Confidently With Verified Proof, Not Resume Buzzwords
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Cut screening time by 75% with objective assessment scores, live repository links, and custom shortlisting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 border border-violet-100">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Multi-Criteria Filtering</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Filter candidates by skill name, skill level, verification threshold, college name, and department in real time.
              </p>
            </Card>

            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Transparent Scoring</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Inspect question-by-question assessment performances and verification timestamps before scheduling an interview.
              </p>
            </Card>

            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Dedicated Shortlist Pool</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Bookmark top prospective hires, attach internal recruiter notes, and maintain your private hiring pipeline.
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/register" state={{ role: 'recruiter' }}>
              <Button size="lg" variant="primary">Register as Recruiter</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Skill Verification & Digital Portfolio Section */}
      <section id="verification" className="py-16 md:py-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Uncompromised Standard</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 max-w-2xl mx-auto">
            Why Verified Profiles Beat Static Resumes
          </h2>
          <p className="text-indigo-200 text-sm max-w-xl mx-auto mt-3">
            SkillProof bridges the gap between college curricula and high-growth tech hiring by establishing objective, evidence-based portfolio standards.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { title: 'Verified Skills', desc: 'Multiple-choice challenges validate conceptual and practical command.' },
              { title: 'Code Evidence', desc: 'Direct links to public GitHub repositories and active deployments.' },
              { title: 'Verified Credentials', desc: 'Industry certifications and hackathon awards in one location.' },
              { title: 'Privacy Guaranteed', desc: 'Students retain complete ownership over what recruiters see.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="font-bold text-base text-white">{item.title}</h4>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SkillProof? */}
      <section id="why-skillproof" className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Built for Modern Campus Hiring</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            Whether preparing for campus placements or recruiting for engineering teams, SkillProof brings certainty to talent discovery.
          </p>

          <div className="mt-10 p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-900">Ready to build your verified portfolio?</h3>
              <p className="text-xs text-slate-500 mt-1">Join thousands of students and recruiters already using SkillProof today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/register">
                <Button size="md" variant="primary">Create Account</Button>
              </Link>
              <Link to="/login">
                <Button size="md" variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">SkillProof</span>
              <span className="text-slate-500 text-[11px] ml-2">© 2026 SkillProof Platform. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#students" className="hover:text-white transition-colors">Students</a>
              <a href="#recruiters" className="hover:text-white transition-colors">Recruiters</a>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
