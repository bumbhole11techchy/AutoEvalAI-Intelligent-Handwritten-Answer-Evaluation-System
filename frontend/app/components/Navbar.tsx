"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  const navItems = [
    { name: "Home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Upload", href: "/upload", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
    { name: "Auto Question", href: "/auto-question", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { name: "Evaluate", href: "/evaluate", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Leaderboard", href: "/leaderboard", icon: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 shadow-2xl border-b border-purple-400/30 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {/* Animated background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              
              {/* Outer ring */}
              <div className="relative w-14 h-14 bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl flex items-center justify-center shadow-xl border border-purple-400/20 group-hover:border-purple-400/40 transition-all duration-300">
                {/* Inner gradient background */}
                <div className="absolute inset-1 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl opacity-90"></div>
                
                {/* Icon container */}
                <div className="relative z-10">
                  {/* Brain/AI Circuit Icon */}
                  <svg className="w-7 h-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  
                  {/* Sparkle effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Text */}
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-pink-200 group-hover:to-purple-200 transition-all duration-300">
                  ऑटो<span className="text-pink-300">Eval</span>
                </h1>
                <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full border border-purple-400/20">
                  AI
                </span>
              </div>
              <p className="text-xs font-medium text-purple-300/80 tracking-wide">
                Intelligent Assessment Platform
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          {!isLoginPage && (
            <ul className="flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center space-x-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white shadow-xl shadow-purple-500/40"
                          : "text-purple-200/90 hover:bg-white/5 hover:text-white hover:shadow-lg hover:shadow-purple-500/20"
                      }`}
                    >
                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white/50"></div>
                      )}
                      
                      <svg 
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive ? "drop-shadow-lg" : "group-hover:scale-110 group-hover:rotate-3"
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={isActive ? 2.5 : 2} 
                          d={item.icon}
                        />
                      </svg>
                      
                      <span className={`font-semibold text-sm tracking-wide ${
                        isActive ? "drop-shadow-lg" : ""
                      }`}>
                        {item.name}
                      </span>

                      {/* Hover effect background */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}