"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../api/axios";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [questionId, setQuestionId] = useState("1");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const upload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const rollno = localStorage.getItem("rollno");
    if (!rollno) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        `/upload/?question_id=${questionId}&rollno=${rollno}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("rollno", rollno);
      localStorage.setItem("question_id", questionId);
      localStorage.setItem("answer_text", res.data.extracted_text);

      router.push("/evaluate");

    } catch (error) {
      console.error(error);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
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
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-down">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Upload Your Answer
            </h1>
            <p className="text-gray-600 text-lg">
              Submit your work for automated evaluation
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
            <div className="p-8 space-y-6">
              {/* Question ID Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Question ID
                </label>
                <input
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white/50 backdrop-blur-sm text-lg font-medium"
                  value={questionId}
                  onChange={(e) => setQuestionId(e.target.value)}
                  placeholder="Enter question ID"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Answer File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex items-center justify-center w-full border-2 border-dashed rounded-2xl px-6 py-12 cursor-pointer transition-all duration-300 group ${
                      file
                        ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-fuchsia-50'
                        : 'border-gray-300 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50/30 hover:to-fuchsia-50/30'
                    }`}
                  >
                    <div className="text-center">
                      {file ? (
                        <>
                          <div className="text-6xl mb-4 animate-bounce-small">📄</div>
                          <p className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            📎
                          </div>
                          <p className="text-lg text-gray-700 mb-2">
                            <span className="font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                              Click to upload
                            </span>
                            {' '}or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">PNG, JPG, JPEG or PDF (MAX. 10MB)</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={upload}
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
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Upload Answer</span>
                  )}
                </span>
              </button>
            </div>

            {/* Info Footer */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-5 border-t border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="text-2xl flex-shrink-0">💡</div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your answer will be automatically evaluated. Make sure the file is clear and readable.
                </p>
              </div>
            </div>
          </div>
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

        @keyframes bounce-small {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
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
        }

        .animate-bounce-small {
          animation: bounce-small 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}