"use client";

import { useEffect, useState } from "react";
import BACKEND_URL from "../api/backend";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/leaderboard/`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

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
            Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            Top performers ranked by score
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in">
          {/* Header Row */}
          <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-8 py-6">
            <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm uppercase tracking-wide">
              <div className="col-span-2">Rank</div>
              <div className="col-span-7">Roll Number</div>
              <div className="col-span-3 text-right">Score</div>
            </div>
          </div>

          {/* Leaderboard Rows */}
          <div className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <div className="px-8 py-16 text-center animate-fade-in-up">
                <div className="text-6xl mb-4 animate-bounce-slow">📊</div>
                <p className="text-gray-500 text-xl font-medium">No data available yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to submit!</p>
              </div>
            ) : (
              data.map((u, index) => (
                <div
                  key={u.rank}
                  className={`group px-8 py-6 transition-all duration-300 hover:bg-gradient-to-r ${
                    index < 3 
                      ? 'bg-gradient-to-r from-violet-50/30 to-fuchsia-50/30 hover:from-violet-50 hover:to-fuchsia-50' 
                      : 'hover:from-violet-50/20 hover:to-fuchsia-50/20'
                  } animate-fade-in-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-2">
                      {u.rank <= 3 ? (
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl transform group-hover:scale-110 transition-all duration-300 ${
                              u.rank === 1
                                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-300/50'
                                : u.rank === 2
                                ? 'bg-gradient-to-br from-gray-300 to-slate-400 shadow-gray-300/50'
                                : 'bg-gradient-to-br from-orange-400 to-amber-600 shadow-orange-300/50'
                            }`}
                          >
                            <span className="text-xl">{u.rank}</span>
                          </div>
                          {u.rank === 1 && (
                            <div className="text-3xl animate-bounce-small">🏆</div>
                          )}
                          {u.rank === 2 && (
                            <div className="text-3xl animate-bounce-small animation-delay-200">🥈</div>
                          )}
                          {u.rank === 3 && (
                            <div className="text-3xl animate-bounce-small animation-delay-400">🥉</div>
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm group-hover:shadow-md transition-all duration-300">
                          {u.rank}
                        </div>
                      )}
                    </div>

                    {/* Roll Number */}
                    <div className="col-span-7">
                      <span className={`text-xl font-bold ${
                        index < 3 
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent' 
                          : 'text-gray-800'
                      }`}>
                        {u.rollno}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="col-span-3 text-right">
                      <div className={`inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-lg shadow-lg transform group-hover:scale-105 transition-all duration-300 ${
                        u.rank === 1
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-900 shadow-yellow-200/50'
                          : u.rank === 2
                          ? 'bg-gradient-to-r from-gray-100 to-slate-100 text-slate-900 shadow-gray-200/50'
                          : u.rank === 3
                          ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 shadow-orange-200/50'
                          : 'bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-900 shadow-violet-200/50'
                      }`}>
                        {u.score}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Badge */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
            <span className="text-sm text-gray-600 font-medium">Updated in real-time</span>
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

        @keyframes bounce-small {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
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
          animation-fill-mode: backwards;
        }

        .animate-bounce-small {
          animation: bounce-small 1s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}