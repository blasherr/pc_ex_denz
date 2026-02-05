'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LoginScreenProps {
  onLogin: (success: boolean) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === '1234') {
      setError(false);
      onLogin(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Profile Picture */}
        <div className="relative mb-8">
          <div className="w-40 h-40 rounded-full border-4 border-cyan-400 overflow-hidden shadow-2xl shadow-cyan-500/50 bg-gray-800">
            <Image
              src="https://imgg.fr/r/7sf9n0H4.png"
              alt="Profile"
              width={160}
              height={160}
              className="w-full h-full object-cover"
              priority
              unoptimized
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-blue-900 flex items-center justify-center">
            <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Username */}
        <h2 className="text-3xl font-bold text-white mb-2">Harry Murkoff</h2>
        <p className="text-cyan-300 text-sm mb-8">Administrator • Online</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-80">
          <div className={`relative ${shake ? 'animate-shake' : ''}`}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-6 py-4 bg-blue-950/50 backdrop-blur-sm border-2 ${
                error ? 'border-red-500' : 'border-cyan-500/50'
              } rounded-full text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 transition-all`}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center animate-pulse">
              Incorrect password. Please try again.
            </p>
          )}
        </form>

        {/* System Info */}
        <div className="mt-12 flex items-center gap-6 text-cyan-300/70 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Secure Connection</span>
          </div>
        </div>

        {/* Time and Date */}
        <div className="mt-6 text-center">
          <p className="text-4xl font-light text-white mb-1">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </p>
          <p className="text-cyan-300 text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
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

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
