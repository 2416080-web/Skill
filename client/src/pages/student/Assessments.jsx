import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { assessmentApi } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';

const Assessments = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Overview state
  const [availableSkills, setAvailableSkills] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null); // { skill, questions, totalQuestions, passingScore }
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [submitting, setSubmitting] = useState(false);

  // Result state
  const [quizResult, setQuizResult] = useState(null);

  // Fetch overview
  const loadAssessments = async () => {
    try {
      setLoading(true);
      const res = await assessmentApi.getAvailable();
      setAvailableSkills(res.data.availableSkills || []);
      setRecentAttempts(res.data.recentAttempts || []);
    } catch (err) {
      setToast({ message: 'Failed to load assessments.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!activeQuiz || quizResult) return;

    if (timeLeft <= 0) {
      handleSubmitAssessment();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, quizResult, timeLeft]);

  // Start Assessment
  const handleStart = async (skillName) => {
    try {
      setLoading(true);
      const res = await assessmentApi.startAssessment(skillName);
      setActiveQuiz(res.data);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTimeLeft(600);
      setQuizResult(null);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Could not start assessment.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit Assessment
  const handleSubmitAssessment = async () => {
    if (!activeQuiz) return;

    try {
      setSubmitting(true);
      const res = await assessmentApi.submitAssessment({
        skill: activeQuiz.skill,
        answers: userAnswers,
      });

      const result = res.data.result;
      setQuizResult(result);

      if (result.isVerified) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      loadAssessments();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to submit assessment.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !activeQuiz) {
    return <LoadingSpinner message="Loading assessment center..." />;
  }

  // 1. RESULT VIEW
  if (quizResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6">
        <Card className={`p-8 text-center border-2 ${quizResult.isVerified ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'}`}>
          <div className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-sm bg-white border border-slate-100">
            {quizResult.isVerified ? (
              <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
            ) : (
              <RotateCcw className="w-8 h-8 text-slate-400" />
            )}
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assessment Result</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            {quizResult.skill} Skill Assessment
          </h2>

          <div className="mt-6 flex items-center justify-center gap-6">
            <div>
              <span className="text-4xl font-black text-slate-900">{quizResult.score}%</span>
              <p className="text-xs text-slate-500 mt-0.5">Final Score</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="text-2xl font-black text-indigo-600">
                {quizResult.correctAnswers} / {quizResult.totalQuestions}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Correct Answers</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  quizResult.isVerified
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {quizResult.verificationStatus}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Verification</p>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-md mx-auto mt-6 leading-relaxed">
            {quizResult.isVerified
              ? 'Congratulations! Your performance satisfied the verification standard (≥ 70%). Your skill has been marked as Verified in your digital portfolio.'
              : 'You scored below the 70% verification threshold. Review the explanations below and feel free to retake the test anytime.'}
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setActiveQuiz(null);
                setQuizResult(null);
              }}
            >
              Back to Assessments
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/student/skills')}
            >
              View My Skills
            </Button>
          </div>
        </Card>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Question Breakdown & Explanations</h3>
          {quizResult.breakdown.map((item, idx) => (
            <Card key={idx} className="p-5 border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-slate-400">Q{idx + 1}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.isCorrect
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {item.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-2">{item.questionText}</h4>

              <div className="space-y-1.5 mt-3">
                {item.options.map((opt, optIdx) => {
                  const isUserSelection = item.selectedAnswer === optIdx;
                  const isRightAnswer = item.correctAnswer === optIdx;

                  let optClass = 'bg-slate-50 text-slate-700 border-slate-200';
                  if (isRightAnswer) optClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
                  else if (isUserSelection && !item.isCorrect) optClass = 'bg-rose-50 text-rose-800 border-rose-300';

                  return (
                    <div key={optIdx} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optClass}`}>
                      <span>{opt}</span>
                      {isRightAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {item.explanation && (
                <div className="mt-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                  <span className="font-bold">Explanation: </span>
                  {item.explanation}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUIZ VIEW
  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIndex];
    const isAnswered = userAnswers[question.id] !== undefined;
    const isLastQuestion = currentQuestionIndex === activeQuiz.questions.length - 1;

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6">
        {/* Top Sticky Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam:</span>
            <span className="font-bold text-slate-900 text-sm">{activeQuiz.skill}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                  setActiveQuiz(null);
                }
              }}
              className="text-xs text-slate-400 hover:text-rose-600 font-medium"
            >
              Quit Exam
            </button>
          </div>
        </div>

        {/* Question Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </span>
            <span>
              {Object.keys(userAnswers).length} of {activeQuiz.questions.length} Answered
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Current Question Card */}
        <Card className="p-6 sm:p-8 border-slate-200">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Multiple Choice Question
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2 mb-6 leading-relaxed">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const isSelected = userAnswers[question.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setUserAnswers({ ...userAnswers, [question.id]: idx })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
            <Button
              variant="outline"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              icon={ArrowLeft}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                variant="primary"
                loading={submitting}
                onClick={handleSubmitAssessment}
                className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                icon={ArrowRight}
                iconPosition="right"
              >
                Next Question
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // 3. OVERVIEW VIEW
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Skill Verification Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete standardized skill quizzes to verify competencies and earn digital badges visible to recruiters.
          </p>
        </div>
      </div>

      {/* Verification Standard Banner */}
      <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3.5">
        <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            Verification Threshold: 70% Pass Mark
          </h4>
          <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">
            Assessments contain multiple-choice questions curated to evaluate fundamental and applied knowledge. Scores of 70% or higher instantly verify the skill on your public digital portfolio.
          </p>
        </div>
      </div>

      {/* Available Assessments Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-4">Available Skill Assessments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableSkills.map((item) => (
            <Card key={item.name} hover className="p-6 border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black text-base flex items-center justify-center border border-indigo-100">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  {item.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified ({item.bestScore}%)
                    </span>
                  ) : item.bestScore ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                      Best: {item.bestScore}%
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                      Not Attempted
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 mt-3">{item.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {item.totalQuestions} Questions • 10 Minutes • 70% to Pass
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {item.attemptsCount} {item.attemptsCount === 1 ? 'Attempt' : 'Attempts'}
                </span>
                <Button
                  variant={item.isVerified ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleStart(item.name)}
                >
                  {item.isVerified ? 'Retake Quiz' : 'Start Exam'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Attempts Table */}
      {recentAttempts.length > 0 && (
        <Card className="p-6 border-slate-200">
          <h3 className="font-bold text-slate-800 text-base mb-4">Past Assessment Attempts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Skill Exam</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Correct</th>
                  <th className="pb-3">Verification</th>
                  <th className="pb-3">Date Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {recentAttempts.map((att) => (
                  <tr key={att._id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-800">{att.skill}</td>
                    <td className="py-3 font-bold text-indigo-600">{att.score}%</td>
                    <td className="py-3">
                      {att.correctAnswers} / {att.totalQuestions}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          att.verificationStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {att.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(att.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Assessments;
