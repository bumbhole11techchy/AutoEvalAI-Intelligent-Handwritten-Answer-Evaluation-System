"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [rollNo, setRollNo] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Hide scrollbar when component mounts
    document.body.style.overflow = "hidden";
    
    // Restore scrollbar when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const login = async () => {
    if (!rollNo) {
      alert("Enter roll number");
      return;
    }

    localStorage.setItem("rollno", rollNo);
    router.push("/upload");
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Base Gradient with Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-950 to-fuchsia-950 animate-gradient-xy"></div>
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.15),transparent_50%)]"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_2px,transparent_2px),linear-gradient(90deg,rgba(139,92,246,0.03)_2px,transparent_2px)] bg-[size:100px_100px] animate-grid-flow"></div>
        
        {/* Large Glowing Orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float-slow"></div>
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float-slow animation-delay-3000"></div>
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-float-slow animation-delay-5000"></div>
        
        {/* Medium Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-bounce-slow animation-delay-2000"></div>
        
        {/* Particle Effects */}
        <div className="absolute top-[10%] left-[15%] w-2 h-2 bg-purple-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-[20%] right-[20%] w-2 h-2 bg-pink-400 rounded-full animate-twinkle animation-delay-1000"></div>
        <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-violet-400 rounded-full animate-twinkle animation-delay-2000"></div>
        <div className="absolute top-[80%] right-[60%] w-2 h-2 bg-fuchsia-400 rounded-full animate-twinkle animation-delay-3000"></div>
        <div className="absolute top-[40%] left-[85%] w-1.5 h-1.5 bg-purple-300 rounded-full animate-twinkle animation-delay-4000"></div>
        <div className="absolute top-[70%] left-[25%] w-1.5 h-1.5 bg-pink-300 rounded-full animate-twinkle animation-delay-1500"></div>
        
        {/* Shooting Stars */}
        <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-white rounded-full animate-shooting-star"></div>
        <div className="absolute top-[35%] right-[15%] w-1 h-1 bg-purple-200 rounded-full animate-shooting-star animation-delay-4000"></div>
        <div className="absolute top-[65%] left-[60%] w-1 h-1 bg-pink-200 rounded-full animate-shooting-star animation-delay-7000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4 pt-8 pb-12 overflow-y-auto">
        {/* Logo Section */}
        <div className="text-center mb-6 animate-fade-in-down">
          {/* Logo Icon */}
          <div className="inline-flex items-center mt-20 justify-center mb-5 animate-float-gentle">
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse-glow"></div>
              
              {/* Icon Container */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-fuchsia-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-white/10 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                {/* Inner Shine */}
                <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-[1.25rem]"></div>
                
                {/* Icon */}
                <svg className="w-10 h-20 text-white drop-shadow-2xl relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                
                {/* Sparkle */}
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4">
                  <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="relative w-4 h-4 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full shadow-lg shadow-yellow-300/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Brand Name */}
          <div className="flex flex-col items-center space-y-3 mb-5">
            <div className="flex items-center space-x-3">
              <h1 className="text-7xl font-black bg-gradient-to-r from-purple-200 via-pink-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-2xl tracking-tight animate-text-shimmer">
                ऑटो<span className="bg-gradient-to-r from-pink-200 via-fuchsia-200 to-purple-200 bg-clip-text text-transparent">Eval</span>
              </h1>
              <span className="text-base font-bold text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-400/30 backdrop-blur-sm shadow-lg shadow-purple-500/20">
                AI
              </span>
            </div>
            <p className="text-purple-200/80 text-lg font-medium tracking-wide">
              Intelligent Assessment Platform
            </p>
          </div>

          {/* Welcome Text */}
          <div className="space-y-2">
           
            <p className="text-purple-200/70 text-base font-light">
              Sign in to access your answer evaluation portal
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-lg animate-fade-in-up">
          <div className="relative group">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            
            {/* Card */}
            <div className="relative bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden">
              {/* Card Header Decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
              
              {/* Card Body */}
              <div className="p-10 space-y-7">
                {/* Roll Number Input */}
                <div>
                  <label className="block text-base font-semibold text-purple-100/90 mb-4 tracking-wide flex items-center space-x-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Roll Number</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-slate-800/60 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-6 py-5 text-white placeholder-purple-300/30 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/20 transition-all outline-none text-lg font-medium shadow-inner hover:border-purple-400/40"
                      placeholder="Enter your roll number"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && login()}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={login}
                  className="w-full relative bg-gradient-to-r from-purple-600 via-pink-500 to-fuchsia-600 text-white font-bold px-8 py-6 rounded-2xl transition-all shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-[1.02] hover:-translate-y-1 duration-300 overflow-hidden group"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Button Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <span className="relative flex items-center justify-center space-x-3 text-xl tracking-wide">
                    <span>Sign In</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-3 pt-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-full">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm text-purple-200/60 font-medium">Secure student authentication</span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-purple-200/50 text-sm font-light">
              Need help? <span className="text-purple-300 hover:text-purple-200 cursor-pointer transition-colors">Contact your administrator</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <p className="text-purple-300/30 text-xs tracking-wider font-light">
            produced by GSHX
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 0%;
            background-size: 400% 400%;
          }
          50% {
            background-position: 100% 100%;
            background-size: 200% 200%;
          }
        }

        @keyframes grid-flow {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(100px, 100px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-50px, 50px) scale(0.9);
          }
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.05);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes shooting-star {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-400px, 400px) scale(1);
            opacity: 0;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
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

        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
        }

        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 8s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-shooting-star {
          animation: shooting-star 3s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 8s linear infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-5000 {
          animation-delay: 5s;
        }

        .animation-delay-7000 {
          animation-delay: 7s;
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s backwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
          animation-fill-mode: backwards;
        }
      `}</style>
    </div>
  );
}