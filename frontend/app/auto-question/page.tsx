"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BACKEND_URL from "@/app/api/backend";

export default function AutoQuestionPage() {
  const router = useRouter();

  const [context, setContext] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(3);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= GENERATE QUESTIONS =================
  const generateQuestions = async () => {
    if (!context.trim()) {
      alert("Please enter context");
      return;
    }
    if (numQuestions < 1 || numQuestions > 20) {
      alert("Number of questions must be between 1 and 20");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setQuestions([]);
      setSelectedQuestion(null);
      setAnswerText("");

      const response = await axios.post(
        `${BACKEND_URL}/question/auto`,
        { context, difficulty, num_questions: numQuestions },
        { headers: { "Content-Type": "application/json" } }
      );

      setQuestions(response.data.questions);
    } catch (err) {
      console.error(err);
      setError("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT ANSWER =================
  const submitAnswer = () => {
    if (!selectedQuestion || !answerText.trim()) {
      alert("Select a question and write an answer");
      return;
    }

    const rollno = localStorage.getItem("rollno");
    if (!rollno) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const qid = selectedQuestion.question_id || selectedQuestion.id;
    if (!qid) {
      console.error("❌ Invalid question:", selectedQuestion);
      alert("Please reselect question");
      return;
    }

    localStorage.setItem("question_id", qid.toString());
    localStorage.setItem("answer_text", answerText);
    router.push("/evaluate");
  };

  const difficultyConfig: Record<string, { active: string; ring: string; label: string }> = {
    easy:   { active: "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200", ring: "ring-2 ring-emerald-300", label: "🟢 Easy" },
    medium: { active: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200",   ring: "ring-2 ring-amber-300",   label: "🟡 Medium" },
    hard:   { active: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200",         ring: "ring-2 ring-red-300",     label: "🔴 Hard" },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── Animated blob background ── */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="text-center animate-fade-in-down">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Question Generator
            </h1>
            <p className="text-gray-600 text-lg">
              Generate questions and evaluate answers automatically
            </p>
          </div>

          {/* ── CONTEXT CARD ── */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
            <div className="p-8 space-y-6">

              {/* Context textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Context
                </label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white/50 backdrop-blur-sm text-base resize-none"
                  rows={5}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Enter the context or topic for question generation..."
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <div className="flex gap-3">
                  {(["easy", "medium", "hard"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 capitalize ${
                        difficulty === level
                          ? difficultyConfig[level].active
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {difficultyConfig[level].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of questions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={numQuestions}
                  min={1}
                  max={20}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white/50 backdrop-blur-sm text-lg font-medium"
                />
              </div>

              {/* Generate button */}
              <button
                onClick={generateQuestions}
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold px-6 py-5 rounded-2xl hover:shadow-2xl focus:ring-4 focus:ring-violet-200 transition-all shadow-xl shadow-violet-300/50 hover:shadow-violet-400/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center justify-center space-x-2 text-lg">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating…</span>
                    </>
                  ) : (
                    <span>✨ Generate Questions</span>
                  )}
                </span>
              </button>

              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-600 font-medium text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Info footer */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-5 border-t border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="text-2xl flex-shrink-0">💡</div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Provide detailed context for better quality questions. You can generate up to 20 questions at a time.
                </p>
              </div>
            </div>
          </div>

          {/* ── QUESTIONS CARD ── */}
          {questions.length > 0 && (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-6">
                  Select a Question
                </h2>

                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedQuestion(q)}
                      className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-200 flex gap-4 items-start group ${
                        selectedQuestion === q
                          ? "border-violet-400 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-md shadow-violet-100"
                          : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/40"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        selectedQuestion === q
                          ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-violet-100 group-hover:text-violet-600"
                      }`}>
                        {i + 1}
                      </div>
                      <p className={`text-base leading-relaxed transition-colors ${
                        selectedQuestion === q ? "text-violet-800 font-medium" : "text-gray-700"
                      }`}>
                        {q.question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ANSWER CARD ── */}
          {selectedQuestion && (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    Your Answer
                  </h2>
                  <div className="p-4 bg-violet-50/80 rounded-2xl border border-violet-100 mb-5">
                    <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">Selected Question</p>
                    <p className="text-gray-700 font-medium">{selectedQuestion.question}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Write your answer below
                  </label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white/50 backdrop-blur-sm text-base resize-none"
                    rows={6}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Write your answer here…"
                  />
                </div>

                <button
                  onClick={submitAnswer}
                  className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold px-6 py-5 rounded-2xl hover:shadow-2xl focus:ring-4 focus:ring-violet-200 transition-all shadow-xl shadow-violet-300/50 hover:shadow-violet-400/50 transform hover:scale-[1.02] duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative text-lg">Submit Answer →</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -50px) scale(1.1); }
          66%       { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-blob          { animation: blob 7s infinite; }
        .animation-delay-2000  { animation-delay: 2s; }
        .animation-delay-4000  { animation-delay: 4s; }
        .animate-fade-in-down  { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in       { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
}