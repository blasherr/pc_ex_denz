'use client';

import { useMemo, useState, useEffect, useRef } from 'react';

interface ReportViewerProps {
  content: string;
  onClose: () => void;
}

interface ParsedReport {
  company: string;
  division: string;
  classification: string;
  reportNumber: string;
  metadata: { label: string; value: string }[];
  studyObject: string;
  executiveSummary: string;
  scientificContext: string;
  methodology: { category: string; items: string[] }[];
  results: { label: string; value: string }[];
  statistics: { label: string; value: string }[];
  securityProtocols: string[];
  conclusion: string;
  recommendations: string[];
  signatures: { name: string; title: string }[];
}

// CSS Animations - Pure CSS, no JS intervals
const cyberStyles = `
  @keyframes cyber-flicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.8; }
    94% { opacity: 1; }
    97% { opacity: 0.9; }
  }
  @keyframes scan-line {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes data-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
  @keyframes glitch-text {
    0%, 100% { text-shadow: none; transform: translate(0); }
    20% { text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
    40% { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; transform: translate(-1px, 1px); }
    60% { text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; transform: translate(1px, -1px); }
    80% { text-shadow: 1px 0 #ff0000, -1px 0 #00ffff; }
  }
  @keyframes cyber-boot {
    0% { clip-path: inset(100% 0 0 0); }
    100% { clip-path: inset(0 0 0 0); }
  }
  @keyframes progress-fill {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
  @keyframes float-data {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  @keyframes circuit-flow {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
  .cyber-flicker { animation: cyber-flicker 4s infinite; }
  .glitch-hover:hover { animation: glitch-text 0.3s ease-in-out; }
  .data-pulse { animation: data-pulse 2s ease-in-out infinite; }
  .cyber-boot { animation: cyber-boot 0.8s ease-out forwards; }
  .float-data { animation: float-data 3s ease-in-out infinite; }
`;

export default function ReportViewer({ content, onClose }: ReportViewerProps) {
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootPhase, setBootPhase] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Get report number early for boot screen
  const reportNum = useMemo(() => {
    const match = content.match(/N°(\d+)/);
    return match ? match[1] : '001';
  }, [content]);

  // Extended boot sequence with terminal lines
  useEffect(() => {
    const terminalLines = [
      { text: '> CERBERUS_SYS v4.7.2 [BUILD 2847]', delay: 80 },
      { text: '> Initializing secure terminal...', delay: 100 },
      { text: '[OK] Kernel modules loaded', delay: 120 },
      { text: '[OK] Memory allocation: 847.2 TB available', delay: 100 },
      { text: '', delay: 50 },
      { text: '> Establishing encrypted connection...', delay: 150 },
      { text: '[AUTH] Connecting to OMEGA-9 mainframe...', delay: 200 },
      { text: '[AUTH] Protocol: AES-512-QUANTUM', delay: 120 },
      { text: '[AUTH] Certificate: VALID (exp: 2089-12-31)', delay: 100 },
      { text: '[OK] Secure tunnel established', delay: 150 },
      { text: '', delay: 50 },
      { text: '> Authentication sequence initiated...', delay: 180 },
      { text: '[SCAN] Biometric verification...', delay: 250 },
      { text: '[SCAN] Retinal pattern: MATCH', delay: 150 },
      { text: '[SCAN] Neural signature: CONFIRMED', delay: 150 },
      { text: '[AUTH] Clearance: LEVEL OMEGA-9', delay: 120 },
      { text: '[OK] User authenticated: GP-TWO', delay: 100 },
      { text: '', delay: 50 },
      { text: `> Requesting document: RAPPORT_ALPHA_${reportNum.padStart(3, '0')}`, delay: 200 },
      { text: '[TRANSCRYPT] Decryption key verified...', delay: 180 },
      { text: '[TRANSCRYPT] Decoding layer 1/5... OK', delay: 120 },
      { text: '[TRANSCRYPT] Decoding layer 2/5... OK', delay: 100 },
      { text: '[TRANSCRYPT] Decoding layer 3/5... OK', delay: 100 },
      { text: '[TRANSCRYPT] Decoding layer 4/5... OK', delay: 100 },
      { text: '[TRANSCRYPT] Decoding layer 5/5... OK', delay: 120 },
      { text: '[OK] Document decrypted successfully', delay: 150 },
      { text: '', delay: 50 },
      { text: '> Loading classified content...', delay: 180 },
      { text: '[DATA] Parsing metadata blocks...', delay: 120 },
      { text: '[DATA] Loading research data...', delay: 100 },
      { text: '[DATA] Rendering neural interface...', delay: 150 },
      { text: '[OK] Content loaded: 100%', delay: 100 },
      { text: '', delay: 50 },
      { text: '════════════════════════════════════════', delay: 80 },
      { text: ' ACCESS GRANTED - DOCUMENT READY', delay: 200 },
      { text: ' Classification: NIVEAU OMEGA-9', delay: 100 },
      { text: ` Report: SÉRIE ALPHA N°${reportNum.padStart(3, '0')}`, delay: 100 },
      { text: '════════════════════════════════════════', delay: 80 },
      { text: '', delay: 300 },
    ];

    let currentLine = 0;
    let timeout: NodeJS.Timeout;

    const addLine = () => {
      if (currentLine >= terminalLines.length) {
        setTimeout(() => setIsBooting(false), 500);
        return;
      }
      
      const line = terminalLines[currentLine];
      setBootLines(prev => [...prev, line.text]);
      setBootPhase(Math.floor(((currentLine + 1) / terminalLines.length) * 100));
      currentLine++;
      
      if (currentLine < terminalLines.length) {
        timeout = setTimeout(addLine, terminalLines[currentLine].delay);
      } else {
        setTimeout(() => setIsBooting(false), 500);
      }
    };

    timeout = setTimeout(addLine, 300);
    return () => clearTimeout(timeout);
  }, [reportNum]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [bootLines]);

  const parsedReport = useMemo(() => {
    const lines = content.split('\n');
    const report: ParsedReport = {
      company: '',
      division: '',
      classification: '',
      reportNumber: '',
      metadata: [],
      studyObject: '',
      executiveSummary: '',
      scientificContext: '',
      methodology: [],
      results: [],
      statistics: [],
      securityProtocols: [],
      conclusion: '',
      recommendations: [],
      signatures: [],
    };

    let currentSection = '';
    let tempText: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('═══') || line === '') continue;

      if (line === 'MURKOFF CORPORATION' || line === 'CERBERUS CORPORATION') { report.company = 'CERBERUS CORPORATION'; continue; }
      if (line.includes('ADVANCED ROBOTICS')) { report.division = line; continue; }
      if (line.includes('CLASSIFICATION NIVEAU')) { report.classification = line.replace('CLASSIFICATION ', ''); continue; }
      if (line.includes('SÉRIE ALPHA - N°')) {
        const match = line.match(/N°(\d+)/);
        report.reportNumber = match ? match[1] : '001';
        continue;
      }

      if (line === 'MÉTADONNÉES DOCUMENTAIRES') { currentSection = 'metadata'; continue; }
      if (line === 'OBJET DE L\'ÉTUDE') { currentSection = 'study'; tempText = []; continue; }
      if (line === 'RÉSUMÉ EXÉCUTIF') {
        if (currentSection === 'study') report.studyObject = tempText.join(' ');
        currentSection = 'summary'; tempText = []; continue;
      }
      if (line === 'CONTEXTE SCIENTIFIQUE') {
        if (currentSection === 'summary') report.executiveSummary = tempText.join(' ');
        currentSection = 'context'; tempText = []; continue;
      }
      if (line === 'MÉTHODOLOGIE EXPÉRIMENTALE') {
        if (currentSection === 'context') report.scientificContext = tempText.join(' ');
        currentSection = 'methodology'; continue;
      }
      if (line === 'RÉSULTATS QUANTITATIFS') { currentSection = 'results'; continue; }
      if (line === 'ANALYSE STATISTIQUE') { currentSection = 'statistics'; continue; }
      if (line === 'PROTOCOLES DE SÉCURITÉ') { currentSection = 'security'; continue; }
      if (line === 'CONCLUSION') { currentSection = 'conclusion'; tempText = []; continue; }
      if (line === 'RECOMMANDATIONS') {
        if (currentSection === 'conclusion') report.conclusion = tempText.join(' ');
        currentSection = 'recommendations'; continue;
      }
      if (line === 'VALIDATIONS ET SIGNATURES') { currentSection = 'signatures'; continue; }

      if (currentSection === 'metadata' && line.includes(':')) {
        const [label, value] = [line.substring(0, line.indexOf(':')).trim(), line.substring(line.indexOf(':') + 1).trim()];
        if (label && value) report.metadata.push({ label, value });
      }
      if (['study', 'summary', 'context', 'conclusion'].includes(currentSection) && !line.startsWith('►') && !line.startsWith('•')) {
        tempText.push(line);
      }
      if (currentSection === 'methodology') {
        if (line.startsWith('►')) {
          report.methodology.push({ category: line.replace('►', '').trim(), items: [] });
        } else if (line.startsWith('•') && report.methodology.length > 0) {
          report.methodology[report.methodology.length - 1].items.push(line.replace('•', '').trim());
        }
      }
      if (currentSection === 'results' && line.includes(':') && !line.includes('INDICATEURS')) {
        const [label, value] = [line.substring(0, line.indexOf(':')).trim(), line.substring(line.indexOf(':') + 1).trim()];
        if (label && value) report.results.push({ label, value });
      }
      if (currentSection === 'statistics') {
        if (line.startsWith('•')) {
          const match = line.replace('•', '').trim().match(/(.+?)\s*\((.+)\)/);
          if (match) report.statistics.push({ label: match[1].trim(), value: match[2] });
        } else if (line.includes(':') && !line.includes('appliqués')) {
          const [label, value] = [line.substring(0, line.indexOf(':')).trim(), line.substring(line.indexOf(':') + 1).trim()];
          if (label && value) report.statistics.push({ label, value });
        }
      }
      if (currentSection === 'security' && line.startsWith('✓')) {
        report.securityProtocols.push(line.replace('✓', '').trim());
      }
      if (currentSection === 'recommendations') {
        const match = line.match(/^\d+\.\s*(.+)/);
        if (match) report.recommendations.push(match[1]);
      }
      if (currentSection === 'signatures' && (line.startsWith('Dr.') || line.startsWith('Prof.'))) {
        const title = lines[i + 1]?.trim() || '';
        if (title && !title.startsWith('Dr.')) {
          report.signatures.push({ name: line, title });
          i++;
        }
      }
    }
    if (currentSection === 'conclusion') report.conclusion = tempText.join(' ');
    return report;
  }, [content]);

  const c = useMemo(() => {
    const schemes = [
      { p: '#00ffff', s: '#003333', name: 'CYAN' },
      { p: '#ff00ff', s: '#330033', name: 'MAGENTA' },
      { p: '#00ff00', s: '#003300', name: 'MATRIX' },
      { p: '#ffaa00', s: '#332200', name: 'AMBER' },
      { p: '#ff0066', s: '#330015', name: 'NEON' },
      { p: '#6600ff', s: '#150033', name: 'VIOLET' },
      { p: '#00ffaa', s: '#003322', name: 'TEAL' },
      { p: '#ff3300', s: '#330a00', name: 'RED' },
      { p: '#ffff00', s: '#333300', name: 'GOLD' },
      { p: '#0099ff', s: '#002233', name: 'BLUE' },
    ];
    return schemes[(parseInt(parsedReport.reportNumber || '1') - 1) % schemes.length];
  }, [parsedReport.reportNumber]);

  const SectionTitle = ({ children, code }: { children: string; code: string }) => (
    <div className="flex items-center gap-3 mb-4 glitch-hover">
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-mono data-pulse" style={{ color: c.p }}>[{code}]</span>
        <span className="w-2 h-2 rounded-full data-pulse" style={{ background: c.p, boxShadow: `0 0 10px ${c.p}` }} />
      </div>
      <div className="h-px flex-1 relative overflow-hidden" style={{ background: `linear-gradient(90deg, ${c.p}60, transparent)` }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${c.p}, transparent)`, animation: 'circuit-flow 3s linear infinite' }} />
      </div>
      <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase cyber-flicker" style={{ color: c.p }}>{children}</span>
      <div className="h-px flex-1 relative overflow-hidden" style={{ background: `linear-gradient(90deg, transparent, ${c.p}60)` }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${c.p}, transparent)`, animation: 'circuit-flow 3s linear infinite reverse' }} />
      </div>
      <span className="w-2 h-2 data-pulse" style={{ background: c.p, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
    </div>
  );

  const HexCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const isTop = position.includes('t');
    const isLeft = position.includes('l');
    return (
      <div className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isLeft ? 'left-0' : 'right-0'} w-4 h-4`}>
        <svg viewBox="0 0 16 16" className="w-full h-full" style={{ color: c.p }}>
          {isTop && isLeft && <path d="M0 16V4L4 0H16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />}
          {isTop && !isLeft && <path d="M16 16V4L12 0H0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />}
          {!isTop && isLeft && <path d="M0 0V12L4 16H16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />}
          {!isTop && !isLeft && <path d="M16 0V12L12 16H0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />}
        </svg>
      </div>
    );
  };

  const DataCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative group ${className}`} style={{ background: `${c.s}80` }}>
      <HexCorner position="tl" />
      <HexCorner position="tr" />
      <HexCorner position="bl" />
      <HexCorner position="br" />
      <div className="absolute inset-0 border opacity-30 group-hover:opacity-60 transition-opacity" style={{ borderColor: c.p }} />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-0.5" style={{ background: c.p }} />
      <div className="absolute top-0 left-0 h-8 w-0.5" style={{ background: c.p }} />
      <div className="absolute bottom-0 right-0 w-8 h-0.5" style={{ background: c.p }} />
      <div className="absolute bottom-0 right-0 h-8 w-0.5" style={{ background: c.p }} />
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${c.p}15` }} />
      <div className="relative p-4">{children}</div>
    </div>
  );

  // Boot screen - Terminal style
  if (isBooting) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: '#0a0a0f' }}>
        <style>{cyberStyles}</style>
        
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${c.p}20 2px, ${c.p}20 4px)`
          }}
        />

        {/* Header bar */}
        <div className="flex-shrink-0 h-8 border-b flex items-center justify-between px-4" style={{ borderColor: `${c.p}30`, background: `${c.s}90` }}>
          <div className="flex items-center gap-3 text-[10px] font-mono" style={{ color: c.p }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#ff5f57' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#ffbd2e' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#28ca41' }} />
            </span>
            <span className="ml-2">CERBERUS_TERMINAL v4.7.2</span>
          </div>
          <div className="text-[10px] font-mono" style={{ color: `${c.p}60` }}>
            SESSION: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}
          </div>
        </div>

        {/* Terminal content */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          <div className="min-h-full flex flex-col justify-end">
            {bootLines.map((line, i) => (
              <div 
                key={i} 
                className="py-0.5"
                style={{ 
                  color: line.startsWith('[OK]') ? '#28ca41' 
                       : line.startsWith('[AUTH]') ? '#ffbd2e'
                       : line.startsWith('[SCAN]') ? '#ff9f0a'
                       : line.startsWith('[TRANSCRYPT]') ? '#bf5af2'
                       : line.startsWith('[DATA]') ? '#64d2ff'
                       : line.startsWith('═') ? c.p
                       : line.includes('ACCESS GRANTED') ? '#28ca41'
                       : line.includes('OMEGA-9') ? '#ff5f57'
                       : `${c.p}90`
                }}
              >
                {line || '\u00A0'}
              </div>
            ))}
            {/* Cursor */}
            <div className="py-0.5 flex items-center">
              <span style={{ color: c.p }}>{'>'}</span>
              <span className="ml-1 w-2 h-4" style={{ background: c.p, animation: 'blink 0.8s infinite' }} />
            </div>
          </div>
        </div>

        {/* Progress bar at bottom */}
        <div className="flex-shrink-0 border-t p-4" style={{ borderColor: `${c.p}30`, background: `${c.s}60` }}>
          <div className="flex items-center justify-between mb-2 text-[10px] font-mono" style={{ color: `${c.p}80` }}>
            <span>LOADING DOCUMENT: RAPPORT_ALPHA_{reportNum.padStart(3, '0')}</span>
            <span>{bootPhase}%</span>
          </div>
          <div className="relative h-1.5 bg-white/10 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full transition-all duration-200"
              style={{ width: `${bootPhase}%`, background: c.p, boxShadow: `0 0 10px ${c.p}` }}
            />
            <div className="absolute inset-0" style={{ 
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.3) 4px, rgba(0,0,0,0.3) 8px)`
            }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-[9px] font-mono text-white/30">
            <span>ENCRYPTION: AES-512-QUANTUM</span>
            <span>CLEARANCE: GP-TWO // OMEGA-9</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden cyber-boot" style={{ background: '#0a0a0f' }}>
      <style>{cyberStyles}</style>
      
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${c.p} 1px, transparent 1px), linear-gradient(90deg, ${c.p} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Animated scan line */}
      <div 
        className="absolute left-0 right-0 h-32 pointer-events-none opacity-[0.03]"
        style={{
          background: `linear-gradient(180deg, transparent, ${c.p}, transparent)`,
          animation: 'scan-line 4s linear infinite'
        }}
      />

      {/* Corner decorations */}
      <svg className="absolute top-4 left-4 w-16 h-16 opacity-40" viewBox="0 0 64 64">
        <path d="M0 20 L0 0 L20 0" fill="none" stroke={c.p} strokeWidth="1" />
        <path d="M0 10 L10 0" fill="none" stroke={c.p} strokeWidth="1" className="data-pulse" />
      </svg>
      <svg className="absolute top-4 right-4 w-16 h-16 opacity-40" viewBox="0 0 64 64">
        <path d="M64 20 L64 0 L44 0" fill="none" stroke={c.p} strokeWidth="1" />
        <path d="M64 10 L54 0" fill="none" stroke={c.p} strokeWidth="1" className="data-pulse" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-16 h-16 opacity-40" viewBox="0 0 64 64">
        <path d="M0 44 L0 64 L20 64" fill="none" stroke={c.p} strokeWidth="1" />
        <path d="M0 54 L10 64" fill="none" stroke={c.p} strokeWidth="1" className="data-pulse" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-16 h-16 opacity-40" viewBox="0 0 64 64">
        <path d="M64 44 L64 64 L44 64" fill="none" stroke={c.p} strokeWidth="1" />
        <path d="M64 54 L54 64" fill="none" stroke={c.p} strokeWidth="1" className="data-pulse" />
      </svg>

      <div className="relative h-full flex flex-col">
        {/* HEADER - Terminal style */}
        <header className="flex-shrink-0 border-b relative" style={{ borderColor: `${c.p}40`, background: `${c.s}90` }}>
          {/* Animated top line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
            <div className="h-full" style={{ background: `linear-gradient(90deg, transparent, ${c.p}, transparent)`, animation: 'circuit-flow 2s linear infinite' }} />
          </div>
          
          {/* Top bar with system info */}
          <div className="h-6 px-4 flex items-center justify-between text-[10px] font-mono border-b" style={{ borderColor: `${c.p}20`, color: `${c.p}80` }}>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full data-pulse" style={{ background: '#00ff00', boxShadow: '0 0 6px #00ff00' }} />
                CERBERUS_SYS v4.7.2
              </span>
              <span>│</span>
              <span>NODE::RESEARCH_DIVISION</span>
              <span>│</span>
              <span className="cyber-flicker">◈ NEURAL_LINK::ACTIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="text-[8px] px-1.5 py-0.5 border" style={{ borderColor: `${c.p}40` }}>AI</span>
                CORTEX_ENABLED
              </span>
              <span>│</span>
              <span>MEM: 847.2 TB</span>
              <span>│</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.p, boxShadow: `0 0 6px ${c.p}` }} />
                UPLINK: ACTIVE
              </span>
              <span>│</span>
              <span>{new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>
          
          {/* Main header */}
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Report number hex badge */}
              <div className="relative group">
                <svg viewBox="0 0 60 52" className="w-14 h-12 float-data">
                  <polygon 
                    points="30,2 56,15 56,37 30,50 4,37 4,15" 
                    fill={c.s}
                    stroke={c.p}
                    strokeWidth="1.5"
                  />
                  {/* Inner hexagon */}
                  <polygon 
                    points="30,10 48,20 48,32 30,42 12,32 12,20" 
                    fill="none"
                    stroke={c.p}
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                  <text x="30" y="32" textAnchor="middle" fill={c.p} className="text-lg font-black font-mono">
                    {parsedReport.reportNumber.padStart(2, '0')}
                  </text>
                </svg>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: `0 0 30px ${c.p}60` }} />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold glitch-hover" style={{ color: c.p }}>
                    RAPPORT_ALPHA::{parsedReport.reportNumber.padStart(3, '0')}
                  </span>
                  <span className="px-2 py-0.5 text-[8px] font-mono border" style={{ borderColor: `${c.p}60`, color: c.p }}>
                    v2.{parsedReport.reportNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-white/30">DIVISION::</span>
                  <span className="text-[10px] font-mono" style={{ color: `${c.p}90` }}>ADVANCED_ROBOTICS</span>
                  <span className="text-[10px] font-mono text-white/20">// SECTOR_7</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Robot status */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border" style={{ borderColor: `${c.p}30`, background: `${c.s}60` }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={c.p} strokeWidth="1.5">
                  <rect x="4" y="4" width="16" height="12" rx="1" />
                  <circle cx="9" cy="10" r="1.5" fill={c.p} />
                  <circle cx="15" cy="10" r="1.5" fill={c.p} />
                  <path d="M8 18v2M16 18v2M12 2v2" />
                </svg>
                <span className="text-[9px] font-mono" style={{ color: c.p }}>ANDROID_READY</span>
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center gap-2 px-3 py-1.5 border" style={{ borderColor: `${c.p}40`, background: `${c.p}10` }}>
                <div className="w-2 h-2 rounded-full data-pulse" style={{ background: c.p, boxShadow: `0 0 8px ${c.p}` }} />
                <span className="text-[10px] font-mono font-bold" style={{ color: c.p }}>{c.name}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 border border-red-500/40 bg-red-500/10">
                <div className="w-2 h-2 rounded-full bg-red-500 data-pulse" style={{ boxShadow: '0 0 8px #ff0000' }} />
                <span className="text-[10px] font-mono font-bold text-red-400">OMEGA-9</span>
              </div>

              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center border transition-all hover:bg-red-500/20 hover:border-red-500/60 group"
                style={{ borderColor: `${c.p}40` }}
              >
                <span className="text-xl font-mono transition-colors group-hover:text-red-400" style={{ color: c.p }}>×</span>
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
            
            {/* STUDY OBJECT - Hero */}
            <div className="relative p-6 group" style={{ background: `linear-gradient(135deg, ${c.s}, transparent)` }}>
              <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
                <div className="h-full" style={{ background: `linear-gradient(90deg, ${c.p}, transparent)` }} />
                <div className="absolute top-0 left-0 w-20 h-full" style={{ background: `linear-gradient(90deg, ${c.p}, transparent)`, animation: 'circuit-flow 2s linear infinite' }} />
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.p}40)` }} />
              
              {/* Robot icon */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke={c.p} strokeWidth="1">
                  <rect x="8" y="12" width="32" height="24" rx="2" />
                  <circle cx="18" cy="24" r="4" />
                  <circle cx="30" cy="24" r="4" />
                  <path d="M18 24h0M30 24h0" stroke={c.p} strokeWidth="2" strokeLinecap="round" />
                  <path d="M24 8v4M8 28H4M44 28h-4" />
                  <rect x="16" y="36" width="4" height="6" />
                  <rect x="28" y="36" width="4" height="6" />
                </svg>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-1 h-full min-h-[60px] relative" style={{ background: c.p }}>
                  <div className="absolute top-0 left-0 w-full h-full" style={{ background: `linear-gradient(180deg, ${c.p}, transparent, ${c.p})`, animation: 'data-pulse 2s ease-in-out infinite' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 flex items-center gap-1" style={{ background: `${c.p}20`, color: c.p }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.p }} />
                      OBJET_ÉTUDE
                    </span>
                    <span className="text-[10px] font-mono text-white/20">ID::{parsedReport.reportNumber}-OBJ</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 border" style={{ borderColor: `${c.p}30`, color: `${c.p}60` }}>PRIORITY::HIGH</span>
                  </div>
                  <p className="text-white text-lg font-medium leading-relaxed">{parsedReport.studyObject}</p>
                </div>
              </div>
            </div>

            {/* METADATA GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {parsedReport.metadata.slice(0, 8).map((item, i) => (
                <div 
                  key={i} 
                  className="px-3 py-2 border-l-2"
                  style={{ borderColor: c.p, background: `${c.s}50` }}
                >
                  <div className="text-[9px] font-mono text-white/30 uppercase">{item.label}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: c.p }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* SUMMARY & CONTEXT */}
            <div className="grid md:grid-cols-2 gap-4">
              <DataCard>
                <SectionTitle code="0x01">RÉSUMÉ EXÉCUTIF</SectionTitle>
                <p className="text-white/60 text-sm leading-relaxed font-mono">{parsedReport.executiveSummary}</p>
              </DataCard>
              
              <DataCard>
                <SectionTitle code="0x02">CONTEXTE</SectionTitle>
                <p className="text-white/60 text-sm leading-relaxed font-mono">{parsedReport.scientificContext}</p>
              </DataCard>
            </div>

            {/* METHODOLOGY */}
            {parsedReport.methodology.length > 0 && (
              <DataCard>
                <SectionTitle code="0x03">MÉTHODOLOGIE</SectionTitle>
                <div className="grid md:grid-cols-2 gap-4">
                  {parsedReport.methodology.map((cat, i) => (
                    <div key={i} className="p-3 border" style={{ borderColor: `${c.p}20`, background: `${c.s}40` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold" style={{ background: c.p, color: '#000' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-mono font-bold" style={{ color: c.p }}>{cat.category}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs font-mono text-white/50">
                            <span style={{ color: c.p }}>▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </DataCard>
            )}

            {/* RESULTS */}
            {parsedReport.results.length > 0 && (
              <DataCard>
                <SectionTitle code="0x04">RÉSULTATS</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {parsedReport.results.map((r, i) => (
                    <div key={i} className="relative p-4 text-center border group hover:border-opacity-100 transition-all" style={{ borderColor: `${c.p}30`, background: `${c.s}60` }}>
                      <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
                        <div className="h-full" style={{ background: `linear-gradient(90deg, transparent, ${c.p}, transparent)` }} />
                      </div>
                      {/* Circuit decoration */}
                      <div className="absolute top-1 right-1 w-4 h-4 opacity-30">
                        <svg viewBox="0 0 16 16" fill="none" stroke={c.p} strokeWidth="0.5">
                          <circle cx="8" cy="8" r="3" />
                          <path d="M8 0v5M8 11v5M0 8h5M11 8h5" />
                        </svg>
                      </div>
                      <div className="text-2xl font-mono font-black group-hover:scale-110 transition-transform" style={{ color: c.p, textShadow: `0 0 20px ${c.p}40` }}>
                        {r.value.split('(')[0].trim()}
                      </div>
                      <div className="text-[10px] font-mono text-white/40 mt-2 uppercase tracking-wider">{r.label}</div>
                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: `inset 0 0 20px ${c.p}20, 0 0 20px ${c.p}10` }} />
                    </div>
                  ))}
                </div>
              </DataCard>
            )}

            {/* STATS & SECURITY */}
            <div className="grid md:grid-cols-2 gap-4">
              {parsedReport.statistics.length > 0 && (
                <DataCard>
                  <SectionTitle code="0x05">STATISTIQUES</SectionTitle>
                  <div className="space-y-2">
                    {parsedReport.statistics.map((s, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b" style={{ borderColor: `${c.p}15` }}>
                        <span className="text-xs font-mono text-white/40">{s.label}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: c.p }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </DataCard>
              )}

              {parsedReport.securityProtocols.length > 0 && (
                <DataCard>
                  <SectionTitle code="0x06">SÉCURITÉ</SectionTitle>
                  <div className="space-y-2">
                    {parsedReport.securityProtocols.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 px-3 border" style={{ borderColor: `${c.p}15`, background: `${c.s}30` }}>
                        <span className="text-green-400 text-sm">✓</span>
                        <span className="text-xs font-mono text-white/50">{p}</span>
                      </div>
                    ))}
                  </div>
                </DataCard>
              )}
            </div>

            {/* CONCLUSION */}
            {parsedReport.conclusion && (
              <div className="relative p-6" style={{ background: `linear-gradient(90deg, ${c.s}80, transparent)` }}>
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: c.p }} />
                <SectionTitle code="0x07">CONCLUSION</SectionTitle>
                <p className="text-white/60 text-sm leading-relaxed font-mono pl-4">{parsedReport.conclusion}</p>
              </div>
            )}

            {/* RECOMMENDATIONS */}
            {parsedReport.recommendations.length > 0 && (
              <DataCard>
                <SectionTitle code="0x08">RECOMMANDATIONS</SectionTitle>
                <div className="grid md:grid-cols-2 gap-2">
                  {parsedReport.recommendations.map((r, i) => (
                    <div key={i} className="flex gap-3 p-3 border" style={{ borderColor: `${c.p}20`, background: `${c.s}30` }}>
                      <span 
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-mono font-bold"
                        style={{ border: `1px solid ${c.p}`, color: c.p }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-mono text-white/50">{r}</span>
                    </div>
                  ))}
                </div>
              </DataCard>
            )}

            {/* SIGNATURES */}
            {parsedReport.signatures.length > 0 && (
              <DataCard>
                <SectionTitle code="0x09">VALIDATIONS</SectionTitle>
                <div className="grid md:grid-cols-3 gap-3">
                  {parsedReport.signatures.map((s, i) => (
                    <div key={i} className="p-4 text-center border relative group" style={{ borderColor: `${c.p}30`, background: `${c.s}40` }}>
                      {/* Biometric scan effect */}
                      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute top-0 left-0 right-0 h-full" style={{ 
                          background: `repeating-linear-gradient(0deg, transparent, transparent 4px, ${c.p}10 4px, ${c.p}10 5px)`,
                          animation: 'scan-line 2s linear infinite'
                        }} />
                      </div>
                      <div className="w-16 h-px mx-auto mb-3 relative" style={{ background: c.p }}>
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2" style={{ background: c.p, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                      </div>
                      <div className="text-sm font-mono text-white font-medium">{s.name}</div>
                      <div className="text-[10px] font-mono text-white/30 mt-1 uppercase">{s.title}</div>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff00', boxShadow: '0 0 6px #00ff00' }} />
                        <span className="text-[9px] font-mono" style={{ color: `${c.p}80` }}>
                          [BIOMETRIC_VERIFIED]
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DataCard>
            )}

          </div>
        </main>

        {/* FOOTER */}
        <footer className="flex-shrink-0 h-12 border-t px-6 flex items-center justify-between relative" style={{ borderColor: `${c.p}30`, background: `${c.s}90` }}>
          {/* Animated line */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div className="h-full w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${c.p}, transparent)`, animation: 'circuit-flow 3s linear infinite' }} />
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={c.p} strokeWidth="1.5" opacity="0.6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              CERBERUS_CORPORATION
            </span>
            <span style={{ color: `${c.p}60` }}>│</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" style={{ boxShadow: '0 0 4px #fbbf24' }} />
              DOCUMENT::CLASSIFIÉ
            </span>
            <span style={{ color: `${c.p}60` }}>│</span>
            <span className="flex items-center gap-1" style={{ color: c.p }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" style={{ boxShadow: '0 0 4px #ef4444' }} />
              NIVEAU_OMEGA-9
            </span>
            <span style={{ color: `${c.p}60` }}>│</span>
            <span className="cyber-flicker">ENCRYPTION::AES-512</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-white/20">
            <span className="hidden md:inline">SESSION_ID::0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
            <span>© 2017</span>
            <span style={{ color: `${c.p}60` }}>// END_TRANSMISSION</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
