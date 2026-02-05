'use client';

import { useState } from 'react';
import FileExplorer from './FileExplorer';
import RecycleBin from './RecycleBin';
import { fileSystem } from '@/data/fileSystem';

export default function Desktop() {
  const [openExplorer, setOpenExplorer] = useState(false);
  const [openRecycleBin, setOpenRecycleBin] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  });

  const desktopFolders = fileSystem.slice(0, 10);

  // Position folders randomly on desktop
  const folderPositions = [
    { top: '10%', left: '5%' },
    { top: '10%', right: '5%' },
    { top: '35%', left: '10%' },
    { top: '35%', right: '15%' },
    { top: '60%', left: '8%' },
    { top: '60%', right: '10%' },
    { top: '25%', left: '70%' },
    { top: '50%', left: '65%' },
    { top: '15%', left: '40%' },
    { top: '45%', right: '35%' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Desktop wallpaper pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Desktop Icons - Folders */}
      {desktopFolders.map((folder, index) => (
        <div
          key={folder.id}
          className="absolute cursor-not-allowed"
          style={folderPositions[index]}
        >
          <div className="flex flex-col items-center w-24 hover:bg-white/20 p-2 rounded group transition-all">
            <svg className="w-16 h-16 mb-1 drop-shadow-lg" viewBox="0 0 64 64" fill="none">
              <path
                d="M8 14h20l4 6h24v32H8V14z"
                fill="#FCD34D"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <path d="M8 20h48v32H8V20z" fill="#FBBF24" />
            </svg>
            <span className="text-xs text-white font-medium text-center drop-shadow-md line-clamp-2 break-words">
              {folder.name}
            </span>
          </div>
        </div>
      ))}

      {/* Recycle Bin */}
      <div
        className="absolute top-[70%] left-[5%] cursor-pointer"
        onClick={() => setOpenRecycleBin(true)}
      >
        <div className="flex flex-col items-center w-24 hover:bg-white/20 p-2 rounded transition-all">
          <svg className="w-16 h-16 mb-1 drop-shadow-lg" viewBox="0 0 64 64" fill="none">
            <path
              d="M16 20v32a4 4 0 004 4h24a4 4 0 004-4V20M12 16h40M24 16V12a2 2 0 012-2h12a2 2 0 012 2v4"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M28 28v16M36 28v16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-white font-medium text-center drop-shadow-md">
            Recycle Bin
          </span>
        </div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-md border-t border-gray-700 flex items-center justify-between px-4 shadow-2xl">
        {/* Start Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-all shadow-lg">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
          </svg>
          <span className="text-white font-semibold text-sm">Start</span>
        </button>

        {/* Running Apps */}
        <div className="flex-1 flex items-center gap-2 px-4">
          {/* File Explorer Icon */}
          <button
            onClick={() => setOpenExplorer(true)}
            className="p-2 hover:bg-gray-700 rounded transition-all group relative"
          >
            <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
            </svg>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              File Explorer
            </div>
          </button>

          {/* Disabled Browser Icons */}
          {[
            { name: 'Chrome', color: 'text-red-400' },
            { name: 'Firefox', color: 'text-orange-400' },
            { name: 'Edge', color: 'text-blue-400' },
          ].map((browser) => (
            <button
              key={browser.name}
              className="p-2 opacity-50 cursor-not-allowed relative group"
              title="Not accessible"
            >
              <svg className={`w-6 h-6 ${browser.color}`} viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {browser.name} (Disabled)
              </div>
            </button>
          ))}

          {/* More disabled apps */}
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              className="p-2 opacity-50 cursor-not-allowed"
              title="Not accessible"
            >
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-4">
          {/* Network Icon */}
          <div className="text-green-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0" />
            </svg>
          </div>

          {/* Volume Icon */}
          <div className="text-cyan-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          </div>

          {/* Clock */}
          <div className="text-white text-sm font-medium min-w-[80px] text-right">
            <div>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
            <div className="text-xs text-gray-400">
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* File Explorer Window */}
      {openExplorer && (
        <FileExplorer onClose={() => setOpenExplorer(false)} />
      )}

      {/* Recycle Bin Window */}
      {openRecycleBin && (
        <RecycleBin onClose={() => setOpenRecycleBin(false)} />
      )}
    </div>
  );
}
