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

  const rollno = "BD139";

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
        {
          context,
          difficulty,
          num_questions: numQuestions,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setQuestions(response.data.questions);
    } catch (err) {
      console.error(err);
      setError("Failed to generate questions");
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

    localStorage.setItem("rollno", rollno);
    localStorage.setItem(
      "question_id",
      selectedQuestion.question_id?.toString() || ""
    );
    localStorage.setItem("answer_text", answerText);

    router.push("/evaluate");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Question Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create intelligent questions from any context
          </p>
        </div>

        <div className="space-y-8">
          {/* ================= CONTEXT CARD ================= */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
            <div className="p-8">
              {/* Context Input */}
              <label className="text-lg font-semibold text-gray-800 block mb-3">
                Enter Your Context
              </label>

              <textarea
                className="w-full border-2 border-gray-200 rounded-2xl p-5 bg-white/60 backdrop-blur-sm focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300 resize-none"
                rows={6}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter your topic or passage here... The more detailed your context, the better the questions will be."
              />

              {/* Difficulty Selector */}
              <div className="mt-8">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Select Difficulty Level
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {["easy", "medium", "hard"].map((level, index) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`group py-4 px-6 rounded-2xl font-bold capitalize transition-all duration-300 transform hover:scale-[1.02] animate-fade-in ${
                        difficulty === level
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                          : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-gray-200 hover:border-violet-300"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {level === "easy" && "🟢"}
                      {level === "medium" && "🟡"}
                      {level === "hard" && "🔴"}
                      <span className="ml-2">{level}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide block mb-4">
                  Number of Questions
                </label>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200">
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-violet-200 to-fuchsia-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  />

                  <div className="flex justify-between mt-3 text-xs text-gray-500 font-medium">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                  </div>

                  <div className="text-center mt-4">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-2xl font-bold shadow-lg">
                      {numQuestions}
                    </span>
                    <p className="mt-2 text-sm text-gray-600 font-medium">Questions</p>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateQuestions}
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      ✨ Generate Questions
                    </>
                  )}
                </span>
              </button>

              {error && (
                <div className="mt-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">⚠️</div>
                    <p className="text-red-700 font-semibold">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= GENERATED QUESTIONS ================= */}
          {questions.length > 0 && (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-sm font-bold">
                    {questions.length}
                  </span>
                  Generated Questions
                </h2>
                <p className="text-gray-600 mt-2">Select a question to answer</p>
              </div>

              <div className="p-8 space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedQuestion(q)}
                    className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] animate-fade-in ${
                      selectedQuestion === q
                        ? "bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-400 shadow-lg"
                        : "bg-white/60 backdrop-blur-sm border-2 border-gray-200 hover:border-violet-300 hover:shadow-md"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg transition-all duration-300 ${
                        selectedQuestion === q
                          ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg"
                          : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 group-hover:from-violet-200 group-hover:to-fuchsia-200"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium leading-relaxed transition-colors duration-300 ${
                          selectedQuestion === q ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {q.question}
                        </p>
                        {selectedQuestion === q && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-violet-600 font-semibold animate-fade-in">
                            <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></div>
                            Selected - Write your answer below
                          </div>
                        )}
                      </div>
                      {selectedQuestion === q && (
                        <div className="flex-shrink-0 text-2xl animate-scale-in">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= ANSWER SECTION ================= */}
          {selectedQuestion && (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">✍️</span>
                  Your Answer
                </h2>
                <p className="text-gray-600 mt-2">Provide a detailed response to the selected question</p>
              </div>

              <div className="p-8">
                <textarea
                  className="w-full border-2 border-gray-200 rounded-2xl p-6 bg-white/60 backdrop-blur-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 resize-none font-medium text-gray-800"
                  rows={10}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your detailed answer here... Be thorough and explain your reasoning."
                />

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500 font-medium">
                    {answerText.length} characters
                  </p>
                  {answerText.length > 0 && (
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {answerText.length < 50 ? (
                        <span className="text-amber-600">💭 Consider adding more detail</span>
                      ) : answerText.length < 100 ? (
                        <span className="text-blue-600">📝 Good start, keep going!</span>
                      ) : (
                        <span className="text-emerald-600">✨ Excellent detail!</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={!answerText.trim()}
                  className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    🚀 Submit for Evaluation
                  </span>
                </button>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-4 border-t border-gray-100">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <span>Your answer will be evaluated using semantic analysis</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
          animation-fill-mode: backwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        /* Custom range input styling */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #d946ef);
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(124, 58, 237, 0.4);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #d946ef);
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: none;
          transition: all 0.3s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(124, 58, 237, 0.4);
        }
      `}</style>
    </div>
  );
}