"use client";

import { useEffect, useState } from "react";
import api from "../api/axios";

type Result = {
  rollno: string;
  question_id: number;
  language: string;
  similarity_score: number;
};

export default function EvaluatePage() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const evaluateAnswer = async () => {
      try {
        const rollno = localStorage.getItem("rollno");
        const question_id = localStorage.getItem("question_id");
        const answer_text = localStorage.getItem("answer_text");

        if (!rollno || !question_id || !answer_text) {
          setError("Missing evaluation data. Please submit your answer again.");
          setLoading(false);
          return;
        }

        const res = await api.post("/evaluate", {
          rollno,
          question_id: Number(question_id),
          answer_text,
        });

        setResult(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail ||
            "Evaluation failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    evaluateAnswer();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 0.75) return "from-emerald-500 to-green-600";
    if (score >= 0.5) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.75) return "from-emerald-50 to-green-50";
    if (score >= 0.5) return "from-amber-50 to-orange-50";
    return "from-red-50 to-rose-50";
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Evaluation Result
          </h1>
          <p className="text-gray-600 text-lg">
            Your answer has been analyzed
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
          {/* Loading State */}
          {loading && (
            <div className="px-8 py-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full mb-6 animate-pulse-slow">
                <svg className="animate-spin h-12 w-12 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-2xl text-gray-800 font-semibold mb-2">Evaluating your answer...</p>
              <p className="text-gray-500">This may take a few moments</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="px-8 py-16 text-center animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 animate-shake">
                <div className="text-6xl">✕</div>
              </div>
              <p className="text-2xl text-red-600 font-bold mb-2">Evaluation Failed</p>
              <p className="text-gray-600 text-lg">{error}</p>
            </div>
          )}

          {/* Success State */}
          {!loading && result && (
            <>
              {/* Score Display */}
              <div className={`bg-gradient-to-r ${getScoreBgColor(result.similarity_score)} px-8 py-12 text-center border-b border-gray-100 animate-fade-in-up`}>
                <div className="flex justify-center mb-6">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(result.similarity_score)} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 animate-scale-in`}>
                    <span className="text-white text-5xl font-bold">
                      {(result.similarity_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-lg font-semibold">Similarity Score</p>
              </div>

              {/* Details Section */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Roll Number Card */}
                  <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-violet-200 hover:border-violet-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Roll Number</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      {result.rollno}
                    </p>
                  </div>

                  {/* Language Card */}
                  <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Language</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent capitalize">
                      {result.language}
                    </p>
                  </div>
                </div>

                {/* Feedback Card */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <p className="font-bold text-gray-800 text-xl mb-4">System Feedback</p>
                  <div className={`p-6 rounded-xl bg-gradient-to-r ${getScoreBgColor(result.similarity_score)} border-l-4 ${
                    result.similarity_score >= 0.75 
                      ? 'border-emerald-500' 
                      : result.similarity_score >= 0.5 
                      ? 'border-amber-500' 
                      : 'border-red-500'
                  }`}>
                    <p className="text-gray-800 text-lg leading-relaxed font-medium">
                      {result.similarity_score >= 0.75
                        ? "Excellent conceptual understanding."
                        : result.similarity_score >= 0.5
                        ? "Good answer, but missing some key points."
                        : "Answer needs significant improvement."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <button
                    onClick={() => window.history.back()}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-slate-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative">Try Another Question</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative">Back to Home</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-4 border-t border-gray-100">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <span>Evaluated using semantic analysis</span>
                </div>
              </div>
            </>
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

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}