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
        {
          context,
          difficulty,
          num_questions: numQuestions,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Questions:", response.data.questions);
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

    const rollno = localStorage.getItem("rollno");

    if (!rollno) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const qid =
      selectedQuestion.question_id ||
      selectedQuestion.id;

    if (!qid) {
      console.error("❌ Invalid question:", selectedQuestion);
      alert("Please reselect question");
      return;
    }

    localStorage.setItem("question_id", qid.toString());
    localStorage.setItem("answer_text", answerText);

    console.log("✅ Stored:", {
      rollno,
      question_id: qid,
      answer_text: answerText,
    });

    router.push("/evaluate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-violet-700">
            Question Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Generate questions and evaluate answers
          </p>
        </div>

        {/* CONTEXT CARD */}
        <div className="bg-white p-6 rounded-2xl shadow">

          {/* Context */}
          <textarea
            className="w-full border p-4 rounded-lg"
            rows={5}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter context..."
          />

          {/* Difficulty */}
          <div className="mt-4 flex gap-3">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-2 rounded-lg ${
                  difficulty === level
                    ? "bg-violet-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Num Questions */}
          <input
            type="number"
            value={numQuestions}
            min={1}
            max={20}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="mt-4 border p-2 rounded-lg w-full"
          />

          {/* Generate */}
          <button
            onClick={generateQuestions}
            className="w-full mt-4 bg-violet-600 text-white py-3 rounded-lg"
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>

          {error && (
            <p className="text-red-500 mt-3">{error}</p>
          )}
        </div>

        {/* QUESTIONS */}
        {questions.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Select a Question
            </h2>

            {questions.map((q, i) => (
              <div
                key={i}
                onClick={() => setSelectedQuestion(q)}
                className={`p-4 mb-3 rounded-lg cursor-pointer border ${
                  selectedQuestion === q
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200"
                }`}
              >
                {q.question}
              </div>
            ))}
          </div>
        )}

        {/* ANSWER */}
        {selectedQuestion && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-3">
              Your Answer
            </h2>

            <textarea
              className="w-full border p-4 rounded-lg"
              rows={6}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Write your answer..."
            />

            <button
              onClick={submitAnswer}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}