"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [rollNo, setRollNo] = useState("");
  const router = useRouter();

  const login = async () => {
    if (!rollNo) {
      alert("Enter roll number");
      return;
    }

    localStorage.setItem("rollno", rollNo);
    router.push("/upload");
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
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-down">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to access your answer evaluation portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
            <div className="p-8 space-y-6">
              {/* Roll Number Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Roll Number
                </label>
                <input
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-800 placeholder-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none bg-white/50 backdrop-blur-sm text-lg font-medium"
                  placeholder="Enter your roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && login()}
                />
              </div>

              {/* Sign In Button */}
              <button
                onClick={login}
                className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold px-6 py-5 rounded-2xl hover:shadow-2xl focus:ring-4 focus:ring-violet-200 transition-all shadow-xl shadow-violet-300/50 hover:shadow-violet-400/50 transform hover:scale-[1.02] duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center justify-center space-x-2 text-lg">
                  <span>Sign In</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </button>
            </div>

            {/* Info Footer */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-5 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <div className="text-xl">🔒</div>
                <span>Secure student authentication</span>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-gray-600">
              Need help? Contact your administrator
            </p>
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
      `}</style>
    </div>
  );
}