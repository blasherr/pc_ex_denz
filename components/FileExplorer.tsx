'use client';

import { useState } from 'react';
import { fileSystem, FileItem } from '@/data/fileSystem';

interface FileExplorerProps {
  onClose: () => void;
}

export default function FileExplorer({ onClose }: FileExplorerProps) {
  const [currentFolder, setCurrentFolder] = useState<FileItem | null>(null);
  const [path, setPath] = useState<string[]>(['This PC']);

  const handleFolderClick = (folder: FileItem) => {
    setCurrentFolder(folder);
    setPath([...path, folder.name]);
  };

  const handleBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setCurrentFolder(null);
    }
  };

  const handleFileClick = (file: FileItem) => {
    if (file.canOpen === false) {
      alert('This file cannot be opened.');
    } else {
      alert('File viewer not implemented yet.');
    }
  };

  const currentItems = currentFolder ? currentFolder.children || [] : fileSystem;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-8">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Title Bar */}
        <div className="h-10 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-between px-4 text-white">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
            </svg>
            <span className="font-semibold">File Explorer</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-6 h-6 hover:bg-white/20 rounded flex items-center justify-center transition-all">
              <span className="text-lg leading-none">−</span>
            </button>
            <button className="w-6 h-6 hover:bg-white/20 rounded flex items-center justify-center transition-all">
              <span className="text-lg leading-none">□</span>
            </button>
            <button
              onClick={onClose}
              className="w-6 h-6 hover:bg-red-600 rounded flex items-center justify-center transition-all"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4 gap-2">
          <button
            onClick={handleBack}
            disabled={path.length <= 1}
            className={`p-2 rounded ${
              path.length > 1
                ? 'hover:bg-gray-200 text-gray-700'
                : 'text-gray-400 cursor-not-allowed'
            } transition-all`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="p-2 rounded hover:bg-gray-200 text-gray-400 cursor-not-allowed transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => {
              setCurrentFolder(null);
              setPath(['This PC']);
            }}
            className="p-2 rounded hover:bg-gray-200 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          {/* Address bar */}
          <div className="flex-1 flex items-center bg-white border border-gray-300 rounded px-3 py-1">
            <svg className="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
            </svg>
            <span className="text-sm text-gray-700">{path.join(' > ')}</span>
          </div>

          <button className="p-2 rounded hover:bg-gray-200 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-white">
          <div className="grid grid-cols-4 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'folder') {
                    handleFolderClick(item);
                  } else {
                    handleFileClick(item);
                  }
                }}
                className="flex flex-col items-center p-4 hover:bg-blue-50 rounded-lg cursor-pointer transition-all group"
              >
                {item.type === 'folder' ? (
                  <svg className="w-16 h-16 mb-2" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M8 14h20l4 6h24v32H8V14z"
                      fill="#FCD34D"
                      stroke="#F59E0B"
                      strokeWidth="2"
                    />
                    <path d="M8 20h48v32H8V20z" fill="#FBBF24" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16 mb-2" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M16 8h24l8 8v40H16V8z"
                      fill="#60A5FA"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />
                    <path d="M40 8v8h8" fill="#93C5FD" />
                    <path d="M24 28h16M24 36h16M24 44h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span className="text-sm text-center text-gray-700 group-hover:text-blue-600 break-words line-clamp-2">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {currentItems.length === 0 && (
            <div className="text-center text-gray-400 py-16">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">This folder is empty</p>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-gray-100 border-t border-gray-300 flex items-center px-4 text-xs text-gray-600">
          <span>{currentItems.length} items</span>
        </div>
      </div>
    </div>
  );
}
