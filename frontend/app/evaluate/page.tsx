"use client";

import { useEffect, useState } from "react";
import api from "../api/axios";

type Result = {
  rollno: string;
  question_id: number;
  language: string;
  similarity_score: number;
  awarded_marks: number;
  max_marks: number;
  result: string;
};

export default function EvaluatePage() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const evaluateAnswer = async () => {
      try {
        const rollno = localStorage.getItem("rollno");
        const question_id = localStorage.getItem("question_id");
        const answer_text = localStorage.getItem("answer_text");

        const debugData = { rollno, question_id, answer_text };
        console.log("DEBUG STORAGE:", debugData);
        setDebug(debugData);

        if (!rollno) throw new Error("Roll number missing");
        if (!question_id) throw new Error("Question ID missing");
        if (!answer_text) throw new Error("Answer text missing");

        const res = await api.post("/evaluate/", {
          rollno,
          question_id: Number(question_id),
          answer_text,
        });

        console.log("API RESPONSE:", res.data);
        setResult(res.data);
        localStorage.removeItem("answer_text");
      } catch (err: any) {
        console.error("EVALUATE ERROR:", err);
        setError(
          err?.response?.data?.detail ||
          err.message ||
          "Evaluation failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    evaluateAnswer();
  }, []);

  const getScoreGradient = (score: number) => {
    if (score >= 0.75) return "from-emerald-500 to-green-600";
    if (score >= 0.5) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-600";
  };

  const getResultStyle = (res: string) => {
    if (res === "Correct") return "bg-emerald-100/80 text-emerald-700 border border-emerald-200";
    if (res === "Partially Correct") return "bg-amber-100/80 text-amber-700 border border-amber-200";
    return "bg-red-100/80 text-red-700 border border-red-200";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── Animated blob background (matches UploadPage) ── */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-2xl w-full">

          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-down">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Evaluation Result
            </h1>
            <p className="text-gray-600 text-lg">
              Here's how your answer performed
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">

            {/* ── LOADING ── */}
            {loading && (
              <div className="p-16 text-center">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 border-r-fuchsia-500 animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-gray-600">
                  Evaluating your answer…
                </p>
                <p className="text-sm text-gray-400 mt-1">This may take a moment</p>
              </div>
            )}

            {/* ── ERROR ── */}
            {!loading && error && (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center text-4xl">
                  ✕
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Evaluation Failed
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left text-sm text-gray-700 mb-6">
                  <p className="font-semibold mb-2 text-gray-800">Debug Info</p>
                  <pre className="whitespace-pre-wrap break-all text-gray-600">
                    {JSON.stringify(debug, null, 2)}
                  </pre>
                </div>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold px-6 py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-300/50 focus:ring-4 focus:ring-violet-200 transition-all transform hover:scale-[1.02] duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative text-lg">Go Back</span>
                </button>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {!loading && result && (
              <>
                {/* Score banner */}
                <div className="bg-gradient-to-r from-violet-50 via-fuchsia-50 to-pink-50 px-8 pt-10 pb-8 text-center border-b border-white/40">
                  <div
                    className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br shadow-2xl ${getScoreGradient(
                      result.similarity_score
                    )}`}
                    style={{ boxShadow: "0 8px 32px rgba(139,92,246,0.35)" }}
                  >
                    {(result.similarity_score * 100).toFixed(0)}%
                  </div>
                  <p className="mt-4 text-base font-semibold text-gray-500 tracking-wide uppercase text-sm">
                    Similarity Score
                  </p>
                </div>

                {/* Details */}
                <div className="p-8 space-y-5">

                  {/* Roll no + Language */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-violet-50/80 rounded-2xl border border-violet-100">
                      <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
                        Roll Number
                      </p>
                      <p className="text-xl font-bold text-violet-700">
                        {result.rollno}
                      </p>
                    </div>
                    <div className="p-5 bg-fuchsia-50/80 rounded-2xl border border-fuchsia-100">
                      <p className="text-xs font-semibold text-fuchsia-400 uppercase tracking-wider mb-1">
                        Language
                      </p>
                      <p className="text-xl font-bold text-fuchsia-700">
                        {result.language}
                      </p>
                    </div>
                  </div>

                  {/* Marks */}
                  <div className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100 text-center">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Marks Awarded
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                      {result.awarded_marks}
                      <span className="text-2xl text-gray-400 font-medium">
                        {" "}/ {result.max_marks}
                      </span>
                    </p>
                  </div>

                  {/* Result badge */}
                  <div
                    className={`p-5 rounded-2xl text-center font-bold text-lg ${getResultStyle(
                      result.result
                    )}`}
                  >
                    {result.result === "Correct" && "✅ "}
                    {result.result === "Partially Correct" && "⚠️ "}
                    {result.result === "Incorrect" && "❌ "}
                    {result.result}
                  </div>

                  {/* Info strip */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl px-5 py-4 border border-violet-100 flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Your answer was automatically evaluated based on semantic
                      similarity. Review the score and try again if needed.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-1">
                    <button
                      onClick={() => window.history.back()}
                      className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                    >
                      Try Again
                    </button>

                    <button
                      onClick={() => (window.location.href = "/")}
                      className="flex-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-300/50 focus:ring-4 focus:ring-violet-200 transition-all transform hover:scale-[1.02] duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative">Home</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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
        .animate-blob             { animation: blob 7s infinite; }
        .animation-delay-2000     { animation-delay: 2s; }
        .animation-delay-4000     { animation-delay: 4s; }
        .animate-fade-in-down     { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in          { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
}