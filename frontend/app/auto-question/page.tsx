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
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Question Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create intelligent questions from any context
          </p>
        </div>

        <div className="space-y-8">
          {/* ================= CONTEXT CARD ================= */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border">

            {/* Context Input */}
            <label className="text-lg font-semibold text-gray-800">
              Enter Your Context
            </label>

            <textarea
              className="w-full border-2 border-gray-200 rounded-2xl p-5 mt-3 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300"
              rows={6}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Enter your topic or passage..."
            />

            {/* Difficulty Selector */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select Difficulty
              </p>
              <div className="grid grid-cols-3 gap-4">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-4 px-6 rounded-2xl font-semibold capitalize transition-all duration-300 ${
                      difficulty === level
                        ? "bg-violet-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Number of Questions
              </label>

              <input
                type="range"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full"
              />

              <p className="text-center mt-2 font-semibold text-violet-600">
                {numQuestions} Questions
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQuestions}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Questions"}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* ================= GENERATED QUESTIONS ================= */}
          {questions.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Generated Questions
              </h2>

              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedQuestion(q)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      selectedQuestion === q
                        ? "bg-violet-50 border-2 border-violet-400"
                        : "bg-gray-50 border-2 border-gray-200"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-500 text-white font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium">
                        {q.question}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= ANSWER SECTION ================= */}
          {selectedQuestion && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Answer
              </h2>

              <textarea
                className="w-full border-2 border-gray-200 rounded-2xl p-6 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300"
                rows={10}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your detailed answer here..."
              />

              <p className="text-sm text-gray-500 mt-3">
                {answerText.length} characters
              </p>

              <button
                onClick={submitAnswer}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Submit for Evaluation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
