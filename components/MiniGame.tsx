'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from './AudioManager';

export type GameType = 'simon' | 'memory' | 'codebreaker';

interface MiniGameProps {
  onClose: () => void;
  onSuccess: () => void;
  gameType: GameType;
  folderName: string;
}

// Hiéroglyphes et symboles anciens
const HIEROGLYPHS = ['𓀀', '𓁀', '𓂀', '𓃀', '𓄀', '𓅀', '𓆀', '𓇀', '𓈀', '𓉀', '𓊀', '𓋀'];
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ'];
const ALCHEMICAL = ['🜁', '🜂', '🜃', '🜄', '🜅', '🜆', '🜇', '🜈', '🜉', '🜊'];
const CUNEIFORM = ['𒀀', '𒁀', '𒂀', '𒃀', '𒄀', '𒅀', '𒆀', '𒇀', '𒈀', '𒉀', '𒊀', '𒋀'];

// ============================================================
// GAME 1: SÉQUENCE HIÉROGLYPHIQUE (for ex-toxique)
// Mémoriser des séquences de hiéroglyphes qui s'affichent
// puis disparaissent. Les symboles se mélangent à chaque tour.
// ============================================================
function HieroglyphSequenceGame({ onSuccess, playSound }: { onSuccess: () => void; playSound: (s: string) => void }) {
  const WIN_ROUNDS = 4;
  const MAX_LIVES = 3;
  const GRID_SIZE = 6; // 6 symboles dans la grille

  const [round, setRound] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [won, setWon] = useState(false);
  const [phase, setPhase] = useState<'showing' | 'input' | 'feedback'>('showing');
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [gridSymbols, setGridSymbols] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [showingIndex, setShowingIndex] = useState(-1);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);

  // Nombre de symboles à mémoriser (augmente avec les rounds)
  const seqLength = Math.min(2 + round, 5);
  // Temps d'affichage qui diminue
  const displayTime = Math.max(600, 1000 - round * 50);

  const generateRound = useCallback(() => {
    // Choisir des symboles aléatoires pour la grille
    const shuffled = [...HIEROGLYPHS].sort(() => Math.random() - 0.5);
    const grid = shuffled.slice(0, GRID_SIZE);
    setGridSymbols(grid);

    // Choisir la séquence à mémoriser parmi la grille
    const len = Math.min(2 + round, 5);
    const seq: string[] = [];
    for (let i = 0; i < len; i++) {
      seq.push(grid[Math.floor(Math.random() * grid.length)]);
    }
    setTargetSequence(seq);
    setPlayerInput([]);
    setPhase('showing');
    setShowingIndex(-1);
    setFeedbackType(null);
  }, [round]);

  useEffect(() => {
    generateRound();
  }, [round, generateRound]);

  // Afficher la séquence un par un
  useEffect(() => {
    if (phase !== 'showing' || won) return;

    let idx = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timerId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (idx < targetSequence.length) {
          setShowingIndex(idx);
          playSound('click');
          idx++;
        } else {
          if (intervalId) clearInterval(intervalId);
          intervalId = null;
          setTimeout(() => {
            setShowingIndex(-1);
            setPhase('input');
          }, 300);
        }
      }, displayTime);
    }, 600);

    return () => {
      clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [phase, targetSequence, won, displayTime, playSound]);

  const handleSymbolClick = (symbol: string) => {
    if (phase !== 'input' || won) return;

    playSound('click');
    const newInput = [...playerInput, symbol];
    setPlayerInput(newInput);
    setHighlightedIndex(gridSymbols.indexOf(symbol));
    setTimeout(() => setHighlightedIndex(null), 200);

    // Vérifier au fur et à mesure
    const currentIdx = newInput.length - 1;
    if (newInput[currentIdx] !== targetSequence[currentIdx]) {
      // Erreur
      playSound('error');
      setPhase('feedback');
      setFeedbackType('wrong');
      const newLives = lives - 1;
      setLives(newLives);

      setTimeout(() => {
        if (newLives <= 0) {
          // Reset total
          setRound(0);
          setLives(MAX_LIVES);
        } else {
          // Rejouer le même round
          generateRound();
        }
      }, 1500);
      return;
    }

    if (newInput.length === targetSequence.length) {
      // Séquence complète !
      playSound('success');
      setPhase('feedback');
      setFeedbackType('correct');

      const nextRound = round + 1;
      setTimeout(() => {
        if (nextRound >= WIN_ROUNDS) {
          setWon(true);
          onSuccess();
        } else {
          setRound(nextRound);
        }
      }, 1000);
    }
  };

  if (won) return null;

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-mono">NIVEAU:</span>
          <span className="text-red-400 text-xl font-bold font-mono">{round + 1}/{WIN_ROUNDS}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-mono">GLYPHES:</span>
          <span className="text-red-400 text-sm font-bold font-mono">{seqLength}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-mono">VIES:</span>
          <div className="flex gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < lives ? 'bg-green-400' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Zone de séquence affichée */}
      <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-3 min-h-[50px] flex items-center justify-center gap-1.5">
        {phase === 'showing' ? (
          targetSequence.map((sym, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                i === showingIndex
                  ? 'bg-red-500/30 border-red-400 scale-125 shadow-lg shadow-red-500/40'
                  : i < showingIndex
                    ? 'bg-slate-700/50 border-slate-600 opacity-30'
                    : 'bg-slate-800 border-slate-700 opacity-20'
              }`}
            >
              <span className={`text-2xl ${i === showingIndex ? 'opacity-100' : 'opacity-0'}`}>
                {sym}
              </span>
            </div>
          ))
        ) : phase === 'input' ? (
          targetSequence.map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                i < playerInput.length
                  ? 'bg-red-500/20 border-red-400'
                  : i === playerInput.length
                    ? 'bg-slate-700 border-red-500/50 animate-pulse'
                    : 'bg-slate-800 border-slate-700'
              }`}
            >
              <span className="text-2xl">
                {i < playerInput.length ? playerInput[i] : ''}
              </span>
            </div>
          ))
        ) : (
          <div className={`text-lg font-mono font-bold ${feedbackType === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
            {feedbackType === 'correct' ? '✓ SÉQUENCE CORRECTE' : '✗ SÉQUENCE INCORRECTE'}
          </div>
        )}
      </div>

      {/* Grille de symboles à choisir */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {gridSymbols.map((symbol, index) => (
          <button
            key={index}
            onClick={() => handleSymbolClick(symbol)}
            disabled={phase !== 'input'}
            className={`
              h-14 rounded-xl text-2xl font-bold
              transition-all duration-200 relative overflow-hidden border-2
              ${phase !== 'input' ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 active:scale-95'}
              ${highlightedIndex === index
                ? 'bg-red-500/30 border-red-400 scale-110 shadow-lg shadow-red-500/40'
                : 'bg-slate-800 border-slate-600 hover:border-red-500/40 hover:bg-slate-700'
              }
            `}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-slate-400 text-sm font-mono">
          {phase === 'showing'
            ? '➤ MÉMORISEZ LA SÉQUENCE DE HIÉROGLYPHES...'
            : phase === 'input'
              ? `➤ REPRODUISEZ (${playerInput.length}/${targetSequence.length})`
              : '➤ VÉRIFICATION...'
          }
        </p>
      </div>
    </div>
  );
}

// ============================================================
// GAME 2: TRADUCTION DE GLYPHES (for image +18)
// Table de correspondance rune→lettre qui s'affiche brièvement,
// puis traduire un mot secret écrit en runes.
// ============================================================
function GlyphTranslationGame({ onSuccess, playSound }: { onSuccess: () => void; playSound: (s: string) => void }) {
  const WIN_ROUNDS = 3;
  const MAX_LIVES = 3;

  // Mots secrets thématiques (courts)
  const wordPool = [
    'OMEGA', 'ALPHA', 'GHOST', 'NEXUS', 'HYDRA',
    'TITAN', 'PULSE', 'VENOM', 'RUNE', 'CODE',
    'NOIR', 'FLUX', 'DATA', 'ZONE', 'IRIS',
  ];

  const [round, setRound] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [won, setWon] = useState(false);
  const [phase, setPhase] = useState<'studying' | 'translating' | 'feedback'>('studying');
  const [runeMap, setRuneMap] = useState<Record<string, string>>({});
  const [currentWord, setCurrentWord] = useState('');
  const [encodedWord, setEncodedWord] = useState<string[]>([]);
  const [playerGuess, setPlayerGuess] = useState<string[]>([]);
  const [studyTimeLeft, setStudyTimeLeft] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [hintShown, setHintShown] = useState<Record<string, string>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Temps d'étude fixe (secondes)
  const studyDuration = 10;

  const generateRound = useCallback(() => {
    // Créer un mapping aléatoire lettres → runes — utiliser des symboles bien visibles
    const visibleSymbols = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'ξ', 'π', 'σ', 'φ', 'ψ', 'ω', 'Σ', 'Ω', 'Δ', 'Φ', 'Ψ', 'Π', 'Λ', 'Θ', 'Ξ', 'Γ'];
    const shuffledSymbols = [...visibleSymbols].sort(() => Math.random() - 0.5);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const map: Record<string, string> = {};
    alphabet.forEach((letter, i) => {
      map[letter] = shuffledSymbols[i % shuffledSymbols.length];
    });
    setRuneMap(map);

    // Choisir un mot
    const word = wordPool[Math.floor(Math.random() * wordPool.length)];
    setCurrentWord(word);
    setEncodedWord(word.split('').map(l => map[l]));
    setPlayerGuess(new Array(word.length).fill(''));
    setPhase('studying');
    setStudyTimeLeft(studyDuration);
    setFeedbackType(null);

    // Montrer seulement une partie de la table (rend plus dur)
    const lettersInWord = [...new Set(word.split(''))];
    // Montrer les lettres du mot + quelques leurres
    const extraLetters = alphabet.filter(l => !lettersInWord.includes(l)).sort(() => Math.random() - 0.5).slice(0, 2);
    const shownLetters = [...lettersInWord, ...extraLetters].sort(() => Math.random() - 0.5);
    const hint: Record<string, string> = {};
    shownLetters.forEach(l => { hint[l] = map[l]; });
    setHintShown(hint);
  }, [studyDuration]);

  useEffect(() => {
    generateRound();
  }, [round, generateRound]);

  // Timer d'étude
  useEffect(() => {
    if (phase !== 'studying') return;

    if (studyTimeLeft <= 0) {
      setPhase('translating');
      return;
    }

    timerRef.current = setTimeout(() => {
      setStudyTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, studyTimeLeft]);

  const handleLetterInput = (index: number, letter: string) => {
    if (phase !== 'translating' || won) return;
    playSound('click');

    const upper = letter.toUpperCase();
    if (!/^[A-Z]$/.test(upper) && letter !== '') return;

    const newGuess = [...playerGuess];
    newGuess[index] = upper;
    setPlayerGuess(newGuess);
  };

  const submitTranslation = () => {
    const guess = playerGuess.join('');
    if (guess.length !== currentWord.length) return;

    if (guess === currentWord) {
      playSound('success');
      setPhase('feedback');
      setFeedbackType('correct');

      const nextRound = round + 1;
      setTimeout(() => {
        if (nextRound >= WIN_ROUNDS) {
          setWon(true);
          onSuccess();
        } else {
          setRound(nextRound);
        }
      }, 1200);
    } else {
      playSound('error');
      setPhase('feedback');
      setFeedbackType('wrong');
      const newLives = lives - 1;
      setLives(newLives);

      setTimeout(() => {
        if (newLives <= 0) {
          setRound(0);
          setLives(MAX_LIVES);
        } else {
          generateRound();
        }
      }, 1500);
    }
  };

  if (won) return null;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-mono">ROUND:</span>
          <span className="text-cyan-400 text-xl font-bold font-mono">{round + 1}/{WIN_ROUNDS}</span>
        </div>
        {phase === 'studying' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-mono">TEMPS:</span>
            <span className={`text-xl font-bold font-mono ${studyTimeLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
              {studyTimeLeft}s
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-mono">VIES:</span>
          <div className="flex gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < lives ? 'bg-green-400' : 'bg-slate-700'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Table de correspondance (visible pendant étude ET traduction) */}
      {(phase === 'studying' || phase === 'translating') && Object.keys(hintShown).length > 0 && (
        <div className={`border rounded-lg p-3 transition-all ${
          phase === 'studying' 
            ? 'bg-cyan-500/5 border-cyan-500/20' 
            : 'bg-cyan-500/5 border-cyan-500/10 opacity-70'
        }`}>
          <p className="text-cyan-400 text-xs font-mono mb-2 text-center">
            {phase === 'studying' ? '⚡ TABLE DE DÉCHIFFRAGE — MÉMORISEZ !' : '📖 TABLE DE RÉFÉRENCE'}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {Object.entries(hintShown).map(([letter, symbol]) => (
              <div key={letter} className="flex items-center justify-center gap-1.5 bg-slate-800/80 rounded p-1.5 border border-cyan-500/20">
                <span className="text-lg font-bold text-cyan-300">{symbol}</span>
                <span className="text-cyan-400 font-mono font-bold text-xs">=</span>
                <span className="text-white font-mono font-bold text-sm">{letter}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message encodé */}
      <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-3">
        <p className="text-cyan-400 text-xs font-mono mb-2 text-center">MESSAGE CHIFFRÉ:</p>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {encodedWord.map((rune, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 bg-slate-900 border-2 border-cyan-500/30 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-cyan-300">{rune}</span>
              </div>
              <span className="text-slate-500 text-xs font-mono">#{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de saisie (phase traduction) */}
      {phase === 'translating' && (
        <>
          <div className="flex items-center justify-center gap-1.5">
            {playerGuess.map((letter, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={letter}
                onChange={(e) => handleLetterInput(i, e.target.value)}
                className="w-10 h-10 rounded-lg border-2 bg-slate-800 border-cyan-500/40 text-white font-mono font-bold text-lg text-center uppercase focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                autoFocus={i === 0}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={submitTranslation}
              disabled={playerGuess.some(l => l === '')}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-mono font-bold text-sm transition-all disabled:opacity-40 shadow-lg hover:shadow-cyan-500/30"
            >
              DÉCHIFFRER
            </button>
          </div>
        </>
      )}

      {/* Feedback */}
      {phase === 'feedback' && (
        <div className={`text-center py-4 rounded-lg border ${
          feedbackType === 'correct'
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <p className={`font-mono font-bold text-lg ${feedbackType === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
            {feedbackType === 'correct'
              ? `✓ CORRECT — "${currentWord}"`
              : `✗ INCORRECT — Le mot était "${currentWord}"`
            }
          </p>
        </div>
      )}

      <div className="text-center">
        <p className="text-slate-400 text-sm font-mono">
          {phase === 'studying'
            ? '➤ MÉMORISEZ LA TABLE DE CORRESPONDANCE...'
            : phase === 'translating'
              ? '➤ TRADUISEZ LE MESSAGE CHIFFRÉ'
              : '➤ VÉRIFICATION...'
          }
        </p>
      </div>
    </div>
  );
}

// ============================================================
// GAME 3: CIPHER ALCHIMIQUE (for dossier test)
// Un mot est chiffré avec des symboles alchimiques/anciens.
// Des indices se dévoilent progressivement. Deviner le mot
// avant la fin du temps / tentatives.
// ============================================================
function AlchemyCipherGame({ onSuccess, playSound }: { onSuccess: () => void; playSound: (s: string) => void }) {
  const WIN_ROUNDS = 3;
  const MAX_ATTEMPTS_PER_ROUND = 5;

  const cipherWords = [
    { word: 'VIRUS', hint: 'Programme malveillant' },
    { word: 'NEXUS', hint: 'Point de connexion' },
    { word: 'OMEGA', hint: 'La dernière lettre' },
    { word: 'GHOST', hint: 'Esprit invisible' },
    { word: 'PULSE', hint: 'Battement vital' },
    { word: 'CRYPT', hint: 'Lieu secret souterrain' },
    { word: 'TITAN', hint: 'Géant mythologique' },
    { word: 'HYDRA', hint: 'Serpent à plusieurs têtes' },
    { word: 'ROGUE', hint: 'Agent rebelle' },
    { word: 'CYBER', hint: 'Monde numérique' },
    { word: 'VENOM', hint: 'Poison mortel' },
    { word: 'CHAOS', hint: 'Désordre total' },
  ];

  const [round, setRound] = useState(0);
  const [won, setWon] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<{ word: string; hint: string } | null>(null);
  const [cipherMap, setCipherMap] = useState<Record<string, string>>({});
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());
  const [guessInput, setGuessInput] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS_PER_ROUND);
  const [phase, setPhase] = useState<'playing' | 'feedback'>('playing');
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [revealTimer, setRevealTimer] = useState(0);
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const usedWordsRef = useRef<Set<number>>(new Set());

  const generateRound = useCallback(() => {
    // Choisir un mot non utilisé
    let idx: number;
    do {
      idx = Math.floor(Math.random() * cipherWords.length);
    } while (usedWordsRef.current.has(idx) && usedWordsRef.current.size < cipherWords.length);
    usedWordsRef.current = new Set([...usedWordsRef.current, idx]);
    setUsedWords(usedWordsRef.current);

    const puzzle = cipherWords[idx];
    setCurrentPuzzle(puzzle);

    // Créer le mapping lettre → symbole alchimique
    const uniqueLetters = [...new Set(puzzle.word.split(''))];
    const allSymbols = [...ALCHEMICAL, ...HIEROGLYPHS.slice(0, 6)].sort(() => Math.random() - 0.5);
    const map: Record<string, string> = {};
    uniqueLetters.forEach((letter, i) => {
      map[letter] = allSymbols[i % allSymbols.length];
    });
    setCipherMap(map);

    // Commencer sans lettres révélées
    setRevealedLetters(new Set());
    setGuessInput('');
    setAttemptsLeft(MAX_ATTEMPTS_PER_ROUND);
    setPhase('playing');
    setFeedbackType(null);
    setRevealTimer(0);
  }, [round]);

  useEffect(() => {
    generateRound();
  }, [round, generateRound]);

  // Révéler une lettre toutes les 5 secondes
  useEffect(() => {
    if (phase !== 'playing' || won || !currentPuzzle) return;

    const uniqueLetters = [...new Set(currentPuzzle.word.split(''))];
    const unrevealed = uniqueLetters.filter(l => !revealedLetters.has(l));
    if (unrevealed.length === 0) return;

    const timer = setTimeout(() => {
      setRevealTimer(prev => {
        const next = prev + 1;
        if (next % 5 === 0 && unrevealed.length > 0) {
          // Révéler une correspondance
          const toReveal = unrevealed[Math.floor(Math.random() * unrevealed.length)];
          setRevealedLetters(prev => new Set([...prev, toReveal]));
          playSound('notification');
        }
        return next;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, won, revealTimer, revealedLetters, currentPuzzle]);

  const handleGuess = () => {
    if (!currentPuzzle || phase !== 'playing') return;

    const guess = guessInput.toUpperCase().trim();
    if (guess === '') return;

    if (guess === currentPuzzle.word) {
      playSound('success');
      setPhase('feedback');
      setFeedbackType('correct');

      const nextRound = round + 1;
      setTimeout(() => {
        if (nextRound >= WIN_ROUNDS) {
          setWon(true);
          onSuccess();
        } else {
          setRound(nextRound);
        }
      }, 1200);
    } else {
      playSound('error');
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setGuessInput('');

      if (newAttempts <= 0) {
        setPhase('feedback');
        setFeedbackType('wrong');
        setTimeout(() => {
          setRound(0);
          usedWordsRef.current = new Set();
          setUsedWords(new Set());
        }, 2000);
      }
    }
  };

  if (won || !currentPuzzle) return null;

  const uniqueLetters = [...new Set(currentPuzzle.word.split(''))];

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-mono">ROUND:</span>
          <span className="text-amber-400 text-xl font-bold font-mono">{round + 1}/{WIN_ROUNDS}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-mono">ESSAIS:</span>
          <span className={`text-xl font-bold font-mono ${attemptsLeft <= 1 ? 'text-red-400' : 'text-amber-400'}`}>
            {attemptsLeft}/{MAX_ATTEMPTS_PER_ROUND}
          </span>
        </div>
      </div>

      {/* Indice */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-center">
        <p className="text-amber-400 text-xs font-mono mb-1">💡 INDICE:</p>
        <p className="text-slate-300 font-mono text-sm">&quot;{currentPuzzle.hint}&quot;</p>
        <p className="text-slate-500 text-xs font-mono mt-1">{currentPuzzle.word.length} lettres</p>
      </div>

      {/* Mot chiffré */}
      <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-4">
        <p className="text-amber-400 text-xs font-mono mb-3 text-center">MOT CHIFFRÉ EN SYMBOLES ANCIENS:</p>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {currentPuzzle.word.split('').map((letter, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-12 border-2 rounded-lg flex items-center justify-center transition-all ${
                revealedLetters.has(letter)
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 border-amber-500/20'
              }`}>
                <span className="text-xl">{cipherMap[letter]}</span>
              </div>
              {revealedLetters.has(letter) && (
                <span className="text-amber-400 text-xs font-mono font-bold mt-1">{letter}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Correspondances révélées */}
      {revealedLetters.size > 0 && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {[...revealedLetters].map(letter => (
            <div key={letter} className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1">
              <span className="text-lg">{cipherMap[letter]}</span>
              <span className="text-amber-400 font-mono text-xs">=</span>
              <span className="text-white font-mono font-bold text-sm">{letter}</span>
            </div>
          ))}
          <span className="text-slate-500 text-xs font-mono">
            ({revealedLetters.size}/{uniqueLetters.length} dévoilés)
          </span>
        </div>
      )}

      {/* Input de devinette */}
      {phase === 'playing' && (
        <div className="flex gap-2 justify-center items-center">
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
            placeholder="Entrez le mot déchiffré..."
            className="flex-1 max-w-xs px-4 py-2 rounded-lg border-2 bg-slate-800 border-amber-500/30 text-white font-mono uppercase focus:outline-none focus:border-amber-400 focus:shadow-lg focus:shadow-amber-500/20 transition-all placeholder:text-slate-600 placeholder:normal-case"
            autoFocus
          />
          <button
            onClick={handleGuess}
            disabled={guessInput.trim() === ''}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-sm transition-all disabled:opacity-40 shadow-lg hover:shadow-amber-500/30"
          >
            DÉCHIFFRER
          </button>
        </div>
      )}

      {/* Feedback */}
      {phase === 'feedback' && (
        <div className={`text-center py-4 rounded-lg border ${
          feedbackType === 'correct'
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <p className={`font-mono font-bold text-lg ${feedbackType === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
            {feedbackType === 'correct'
              ? `✓ DÉCHIFFRÉ — "${currentPuzzle.word}"`
              : `✗ ÉCHEC — Le mot était "${currentPuzzle.word}"`
            }
          </p>
          {feedbackType === 'wrong' && (
            <p className="text-slate-400 text-sm font-mono mt-1">Réinitialisation complète...</p>
          )}
        </div>
      )}

      <div className="text-center">
        <p className="text-slate-400 text-xs font-mono">
          ➤ Des correspondances se révèlent avec le temps — mais n&apos;attendez pas trop !
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN MINIGAME COMPONENT
// ============================================================
export default function MiniGame({ onClose, onSuccess, gameType, folderName }: MiniGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success'>('intro');
  const { playSound } = useAudio();

  const gameConfig = {
    simon: {
      title: 'PROTOCOLE HIÉROGLYPHIQUE',
      description: 'Mémorisez et reproduisez des séquences de hiéroglyphes anciens. La séquence s\'allonge et s\'accélère à chaque niveau.',
      rules: [
        'Des hiéroglyphes s\'affichent un par un — mémorisez l\'ordre',
        'Reproduisez la séquence exacte en cliquant les symboles',
        'La séquence s\'allonge progressivement (jusqu\'à 5 glyphes)',
        '3 vies disponibles — la vitesse augmente légèrement',
        'Réussissez 4 rounds pour déverrouiller',
      ],
      accentColor: 'red',
      clearance: 'ALPHA-3',
    },
    memory: {
      title: 'TRADUCTION DE GLYPHES ANCIENS',
      description: 'Une table de correspondance rune→lettre s\'affiche brièvement. Mémorisez-la pour traduire le message chiffré.',
      rules: [
        'Étudiez la table de déchiffrage (temps généreux)',
        'La table disparaît — traduisez le mot en runes',
        'Tapez la traduction lettre par lettre',
        'Le temps d\'étude diminue légèrement entre les rounds',
        'Réussissez 3 traductions pour déverrouiller',
      ],
      accentColor: 'cyan',
      clearance: 'BETA-7',
    },
    codebreaker: {
      title: 'DÉCHIFFRAGE ALCHIMIQUE',
      description: 'Un mot secret est chiffré avec des symboles alchimiques anciens. Déduisez le mot grâce aux indices et correspondances qui se révèlent.',
      rules: [
        'Un mot court est chiffré en symboles alchimiques',
        'Un indice textuel vous guide',
        'Des correspondances se révèlent rapidement',
        '5 tentatives par mot',
        'Déchiffrez 3 mots pour déverrouiller',
      ],
      accentColor: 'amber',
      clearance: 'OMEGA-9',
    },
  };

  const config = gameConfig[gameType];

  const accentClasses = {
    red: {
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      dot: 'bg-red-500',
      btnBg: 'from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500',
      btnShadow: 'hover:shadow-red-500/50',
      rulesBorder: 'border-red-500/20',
      rulesBg: 'bg-red-500/5',
      rulesText: 'text-red-400',
    },
    cyan: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      dot: 'bg-cyan-500',
      btnBg: 'from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500',
      btnShadow: 'hover:shadow-cyan-500/50',
      rulesBorder: 'border-cyan-500/20',
      rulesBg: 'bg-cyan-500/5',
      rulesText: 'text-cyan-400',
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      dot: 'bg-amber-500',
      btnBg: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500',
      btnShadow: 'hover:shadow-amber-500/50',
      rulesBorder: 'border-amber-500/20',
      rulesBg: 'bg-amber-500/5',
      rulesText: 'text-amber-400',
    },
  };

  const ac = accentClasses[config.accentColor as keyof typeof accentClasses];

  const handleGameSuccess = useCallback(() => {
    setGameState('success');
  }, []);

  const handleContinue = () => {
    onSuccess();
    onClose();
  };

  const startGame = () => {
    setGameState('playing');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border-2 ${ac.border} shadow-2xl flex flex-col overflow-hidden`}>

        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center ${ac.bg} hover:opacity-80 rounded-lg transition-colors border ${ac.border}`}
        >
          <span className={`${ac.text} text-2xl leading-none`}>×</span>
        </button>

        {/* Header — fixed at top */}
        <div className={`flex-shrink-0 p-6 border-b ${ac.border}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-2 h-2 ${ac.dot} rounded-full animate-pulse`} />
            <h2 className={`text-xl font-bold ${ac.text} font-mono`}>
              [SYSTÈME DE SÉCURITÉ GP-TWO]
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-mono">
            RESTAURATION DU DOSSIER: &quot;{folderName}&quot;
          </p>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {gameState === 'intro' && (
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 mx-auto ${ac.bg} rounded-full flex items-center justify-center border-2 ${ac.border}`}>
                <span className="text-4xl">𓂀</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white font-mono">{config.title}</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  {config.description}
                </p>
              </div>

              <div className={`${ac.rulesBg} border ${ac.rulesBorder} rounded-lg p-4 max-w-md mx-auto`}>
                <p className={`${ac.rulesText} text-xs font-mono mb-2`}>➤ RÈGLES DU PROTOCOLE:</p>
                <ul className="text-slate-300 text-sm space-y-1 text-left">
                  {config.rules.map((rule, i) => (
                    <li key={i}>• {rule}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={startGame}
                className={`px-8 py-3 bg-gradient-to-r ${ac.btnBg} text-white font-mono font-bold rounded-lg transition-all shadow-lg ${ac.btnShadow}`}
              >
                INITIALISER LE PROTOCOLE
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <>
              {gameType === 'simon' && <HieroglyphSequenceGame onSuccess={handleGameSuccess} playSound={playSound} />}
              {gameType === 'memory' && <GlyphTranslationGame onSuccess={handleGameSuccess} playSound={playSound} />}
              {gameType === 'codebreaker' && <AlchemyCipherGame onSuccess={handleGameSuccess} playSound={playSound} />}
            </>
          )}

          {gameState === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30 animate-pulse">
                <span className="text-4xl">𓁀</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-400 font-mono">DÉCHIFFRAGE RÉUSSI</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Les glyphes anciens ont été décodés avec succès.
                  Accès au dossier &quot;{folderName}&quot; autorisé.
                </p>
              </div>

              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-green-400 text-xs font-mono mb-2">✓ CLEARANCE LEVEL: {config.clearance}</p>
                <p className="text-slate-300 text-sm">
                  Le dossier &quot;{folderName}&quot; a été restauré sur le bureau.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-mono font-bold rounded-lg transition-all shadow-lg hover:shadow-green-500/50"
              >
                CONTINUER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
