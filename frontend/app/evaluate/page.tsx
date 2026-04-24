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

        // 🔍 DEBUG STORAGE
        const debugData = { rollno, question_id, answer_text };
        console.log("DEBUG STORAGE:", debugData);
        setDebug(debugData);

        // 🚨 VALIDATION WITH CLEAR ERROR
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

        // ✅ OPTIONAL: clear storage after success
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 px-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="p-12 text-center">
            <div className="animate-spin h-12 w-12 mx-auto border-4 border-violet-500 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600">Evaluating your answer...</p>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="p-12 text-center">
            <div className="text-6xl text-red-500 mb-4">✕</div>

            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Evaluation Failed
            </h2>

            <p className="text-gray-600 mb-4">{error}</p>

            {/* 🔍 DEBUG PANEL */}
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm text-gray-700">
              <p className="font-semibold mb-2">Debug Info:</p>
              <pre>{JSON.stringify(debug, null, 2)}</pre>
            </div>

            <button
              onClick={() => window.location.href = "/"}
              className="mt-6 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition"
            >
              Go Back
            </button>
          </div>
        )}

        {/* ================= SUCCESS ================= */}
        {!loading && result && (
          <>
            {/* SCORE */}
            <div
              className={`bg-gradient-to-r ${getScoreBgColor(
                result.similarity_score
              )} p-10 text-center`}
            >
              <div
                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br ${getScoreColor(
                  result.similarity_score
                )}`}
              >
                {(result.similarity_score * 100).toFixed(0)}%
              </div>

              <p className="mt-4 text-lg font-semibold text-gray-700">
                Similarity Score
              </p>
            </div>

            {/* DETAILS */}
            <div className="p-8 space-y-6">

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-violet-50 rounded-xl">
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className="text-xl font-bold text-violet-700">
                    {result.rollno}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="text-xl font-bold text-blue-700">
                    {result.language}
                  </p>
                </div>
              </div>

              {/* MARKS */}
              <div className="p-6 bg-gray-50 rounded-xl text-center">
                <p className="text-lg text-gray-600">Marks Awarded</p>
                <p className="text-3xl font-bold text-gray-800">
                  {result.awarded_marks} / {result.max_marks}
                </p>
              </div>

              {/* RESULT */}
              <div
                className={`p-6 rounded-xl text-center font-bold text-lg ${
                  result.result === "Correct"
                    ? "bg-green-100 text-green-700"
                    : result.result === "Partially Correct"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.result}
              </div>

              {/* ACTION */}
              <div className="flex gap-4">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-xl"
                >
                  Try Again
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex-1 py-3 bg-violet-600 text-white rounded-xl"
                >
                  Home
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}