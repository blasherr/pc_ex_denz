'use client';

import { useEffect, useRef } from 'react';

interface ReportViewerProps {
  content: string;
  onClose: () => void;
}

export default function ReportViewer({ content, onClose }: ReportViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 sm:p-8">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 32, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 5px;
          border: 2px solid rgba(15, 23, 32, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>

      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0a0f14] border border-cyan-500/30 rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-12 bg-[#0f1720] border-b border-cyan-500/20 flex items-center justify-between px-4 select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="h-4 w-[1px] bg-cyan-500/20 mx-2" />
            <span className="text-cyan-400/90 font-mono text-sm tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              SECURE_VIEWER_V2.4.exe
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-cyan-700 font-mono hidden sm:block uppercase tracking-widest">
              Level 5 Clearance
            </span>
            <button 
              onClick={onClose}
              className="text-cyan-500 hover:text-cyan-300 hover:bg-cyan-500/10 px-3 py-1 rounded text-xs font-mono transition-colors border border-transparent hover:border-cyan-500/30"
            >
              [ESC] CLOSE
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-[#0a0f14] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          </div>
          
          <div 
            ref={contentRef}
            className="absolute inset-0 overflow-auto custom-scrollbar"
          >
            <div className="min-h-full p-6 md:p-12 flex justify-center">
              <div className="w-full max-w-[85ch] relative">
                <div className="absolute top-20 right-10 -rotate-12 border-[6px] border-red-500/10 text-red-500/10 text-7xl font-black p-4 pointer-events-none select-none z-0 tracking-widest">
                  CONFIDENTIAL
                </div>

                <div className="relative z-10 bg-[#0a0f14]/80 backdrop-blur-[2px] p-6 rounded border border-cyan-500/5 shadow-2xl">
                  <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-cyan-100/80 selection:bg-cyan-500/30 selection:text-white">
                    {content}
                  </pre>
                </div>

                <div className="mt-12 pt-6 border-t border-cyan-500/20 flex flex-col gap-2 text-[10px] text-cyan-800 font-mono uppercase tracking-widest">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-900 rounded-full animate-pulse"></span>
                      Murkoff Corporation Systems
                    </span>
                    <span>Encrypted Connection</span>
                  </div>
                  <div className="flex justify-between opacity-50">
                    <span>Term: MKF-TERM-042</span>
                    <span>User: H. Murkoff</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}