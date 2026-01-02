'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameData } from '@/hooks/useGameData';
import { GameData, PieceData, DifficultySettings } from '@/types/game';
import styles from './CircularGame.module.css';

const difficultySettings: Record<string, DifficultySettings> = {
  easy: {
    pairCount: 4,
    snapDistance: 130,
    proximityDistance: 150,
    starThresholds: { three: 45, two: 75 },
  },
  medium: {
    pairCount: 5,
    snapDistance: 100,
    proximityDistance: 120,
    starThresholds: { three: 60, two: 100 },
  },
  hard: {
    pairCount: 7,
    snapDistance: 80,
    proximityDistance: 100,
    starThresholds: { three: 90, two: 150 },
  },
};

export default function CircularGame() {
  const { data: questionsData, loading, error } = useGameData();

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState<GameData[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<GameData[]>([]);

  const playAreaRef = useRef<HTMLDivElement>(null);
  const piecesMapRef = useRef<Map<string, PieceData>>(new Map());
  const currentDragRef = useRef<any>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProximitySoundRef = useRef(0);

  const settings = difficultySettings[difficulty];
  const totalPairs = settings.pairCount;

  // Initialize game when questions data is loaded
  useEffect(() => {
    if (questionsData.length > 0 && !gameStarted) {
      initializeGame();
    }
  }, [questionsData, difficulty]);

  // Timer effect
  useEffect(() => {
    if (gameStarted) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [gameStarted]);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const shuffled = shuffleArray([...questionsData]);
    const selected = shuffled.slice(0, totalPairs);
    setGameData(selected);
    setMatchedCount(0);
    setAttempts(0);
    setStreak(0);
    setElapsedSeconds(0);
    setShowVictory(false);
    setMatchedPairs([]);
    setGameStarted(false);
    piecesMapRef.current.clear();
  };

  const startGame = () => {
    setGameStarted(true);
    if (playAreaRef.current) {
      renderPieces();
    }
  };

  const generateEdgePositions = (width: number, height: number, count: number) => {
    const positions: Array<{ x: number; y: number; rotation: number }> = [];
    const margin = 15;
    const pieceWidth = difficulty === 'hard' ? 140 : 170;
    const pieceHeight = difficulty === 'hard' ? 60 : 75;

    const zones: Array<{ x: [number, number]; y: [number, number] }> = [];
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xStart = margin + (c / cols) * (width - pieceWidth - margin * 2);
        const xEnd = margin + ((c + 1) / cols) * (width - pieceWidth - margin * 2);
        const yStart = margin + (r / rows) * (height - pieceHeight - margin * 2);
        const yEnd = margin + ((r + 1) / rows) * (height - pieceHeight - margin * 2);
        zones.push({ x: [xStart, xEnd], y: [yStart, yEnd] });
      }
    }

    const shuffledZones = shuffleArray(zones);

    for (let i = 0; i < count; i++) {
      const zone = shuffledZones[i % shuffledZones.length];
      const x = zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]);
      const y = zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]);

      positions.push({
        x: Math.max(margin, Math.min(x, width - pieceWidth - margin)),
        y: Math.max(margin, Math.min(y, height - pieceHeight - margin)),
        rotation: (Math.random() - 0.5) * 16,
      });
    }

    return positions;
  };

  const renderPieces = () => {
    if (!playAreaRef.current) return;

    const areaRect = playAreaRef.current.getBoundingClientRect();
    const positions = generateEdgePositions(areaRect.width, areaRect.height, gameData.length * 2);

    let posIndex = 0;

    // Clear existing pieces
    playAreaRef.current.querySelectorAll('.game-piece').forEach((el) => el.remove());
    piecesMapRef.current.clear();

    gameData.forEach((item) => {
      // Create term piece
      const termEl = createPieceElement('term', item);
      const termPos = positions[posIndex++];
      termEl.style.left = `${termPos.x}px`;
      termEl.style.top = `${termPos.y}px`;
      termEl.style.transform = `rotate(${termPos.rotation}deg)`;
      termEl.style.setProperty('--rotation', `${termPos.rotation}deg`);

      piecesMapRef.current.set(`term-${item.id}`, {
        element: termEl,
        type: 'term',
        id: item.id,
        x: termPos.x,
        y: termPos.y,
        rotation: termPos.rotation,
        matched: false,
      });

      playAreaRef.current!.appendChild(termEl);

      // Create definition piece
      const defEl = createPieceElement('definition', item);
      const defPos = positions[posIndex++];
      defEl.style.left = `${defPos.x}px`;
      defEl.style.top = `${defPos.y}px`;
      defEl.style.transform = `rotate(${defPos.rotation}deg)`;
      defEl.style.setProperty('--rotation', `${defPos.rotation}deg`);

      piecesMapRef.current.set(`def-${item.id}`, {
        element: defEl,
        type: 'definition',
        id: item.id,
        x: defPos.x,
        y: defPos.y,
        rotation: defPos.rotation,
        matched: false,
      });

      playAreaRef.current!.appendChild(defEl);
    });
  };

  const createPieceElement = (type: 'term' | 'definition', item: GameData): HTMLDivElement => {
    const el = document.createElement('div');
    el.className = `game-piece ${type === 'term' ? styles.termCard : styles.definitionCard}`;
    el.textContent = type === 'term' ? item.term : item.definition;
    el.dataset.type = type;
    el.dataset.id = item.id;

    el.addEventListener('mousedown', handleDragStart);
    el.addEventListener('touchstart', handleTouchStart as any, { passive: false });

    return el;
  };

  const handleDragStart = (e: MouseEvent) => {
    e.preventDefault();
    const piece = e.currentTarget as HTMLDivElement;
    const pieceKey = getPieceKey(piece);
    const pieceData = piecesMapRef.current.get(pieceKey);

    if (!pieceData || pieceData.matched) return;

    const rect = piece.getBoundingClientRect();
    const playAreaRect = playAreaRef.current!.getBoundingClientRect();

    dragOffsetRef.current.x = e.clientX - rect.left;
    dragOffsetRef.current.y = e.clientY - rect.top;

    currentDragRef.current = { piece, pieceKey, pieceData };
    piece.classList.add(styles.dragging);

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!currentDragRef.current || !playAreaRef.current) return;

    const areaRect = playAreaRef.current.getBoundingClientRect();
    const x = e.clientX - areaRect.left - dragOffsetRef.current.x;
    const y = e.clientY - areaRect.top - dragOffsetRef.current.y;

    currentDragRef.current.piece.style.left = `${x}px`;
    currentDragRef.current.piece.style.top = `${y}px`;
    currentDragRef.current.piece.style.transform = 'rotate(0deg) scale(1.08)';
    currentDragRef.current.pieceData.x = x;
    currentDragRef.current.pieceData.y = y;

    checkProximity(currentDragRef.current.pieceData);
  };

  const handleDragEnd = (e: MouseEvent) => {
    if (!currentDragRef.current) return;

    currentDragRef.current.piece.classList.remove(styles.dragging);
    const rotation = currentDragRef.current.pieceData.rotation;
    currentDragRef.current.piece.style.transform = `rotate(${rotation}deg)`;

    attemptMatch(currentDragRef.current.pieceData);
    clearProximityHighlights();

    currentDragRef.current = null;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const piece = e.currentTarget as HTMLDivElement;
    const pieceKey = getPieceKey(piece);
    const pieceData = piecesMapRef.current.get(pieceKey);

    if (!pieceData || pieceData.matched) return;

    const rect = piece.getBoundingClientRect();
    dragOffsetRef.current.x = touch.clientX - rect.left;
    dragOffsetRef.current.y = touch.clientY - rect.top;

    currentDragRef.current = { piece, pieceKey, pieceData };
    piece.classList.add(styles.dragging);

    document.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!currentDragRef.current || !playAreaRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const areaRect = playAreaRef.current.getBoundingClientRect();
    const x = touch.clientX - areaRect.left - dragOffsetRef.current.x;
    const y = touch.clientY - areaRect.top - dragOffsetRef.current.y;

    currentDragRef.current.piece.style.left = `${x}px`;
    currentDragRef.current.piece.style.top = `${y}px`;
    currentDragRef.current.piece.style.transform = 'rotate(0deg) scale(1.08)';
    currentDragRef.current.pieceData.x = x;
    currentDragRef.current.pieceData.y = y;

    checkProximity(currentDragRef.current.pieceData);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!currentDragRef.current) return;

    currentDragRef.current.piece.classList.remove(styles.dragging);
    const rotation = currentDragRef.current.pieceData.rotation;
    currentDragRef.current.piece.style.transform = `rotate(${rotation}deg)`;

    attemptMatch(currentDragRef.current.pieceData);
    clearProximityHighlights();

    currentDragRef.current = null;
    document.removeEventListener('touchmove', handleTouchMove as any);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const getPieceKey = (element: HTMLDivElement): string => {
    const type = element.dataset.type;
    const id = element.dataset.id;
    return type === 'definition' ? `def-${id}` : `term-${id}`;
  };

  const getPieceCenter = (pieceData: PieceData) => {
    const rect = pieceData.element.getBoundingClientRect();
    return {
      x: pieceData.x + rect.width / 2,
      y: pieceData.y + rect.height / 2,
    };
  };

  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const checkProximity = (draggedPiece: PieceData) => {
    clearProximityHighlights();

    const draggedCenter = getPieceCenter(draggedPiece);

    piecesMapRef.current.forEach((otherPiece) => {
      if (otherPiece === draggedPiece || otherPiece.matched) return;

      const otherCenter = getPieceCenter(otherPiece);
      const distance = getDistance(draggedCenter, otherCenter);

      if (distance < settings.proximityDistance) {
        draggedPiece.element.classList.add(styles.inProximity);
        otherPiece.element.classList.add(styles.inProximity);
      }
    });
  };

  const clearProximityHighlights = () => {
    document.querySelectorAll(`.${styles.inProximity}`).forEach((el) => {
      el.classList.remove(styles.inProximity);
    });
  };

  const attemptMatch = (draggedPiece: PieceData) => {
    const draggedCenter = getPieceCenter(draggedPiece);
    let closestPiece: PieceData | null = null;
    let closestDistance = Infinity;

    piecesMapRef.current.forEach((otherPiece) => {
      if (otherPiece === draggedPiece || otherPiece.matched) return;

      const otherCenter = getPieceCenter(otherPiece);
      const distance = getDistance(draggedCenter, otherCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPiece = otherPiece;
      }
    });

    if (!closestPiece || closestDistance > settings.snapDistance) return;

    setAttempts((prev) => prev + 1);

    const isCorrectMatch =
      draggedPiece.id === closestPiece.id && draggedPiece.type !== closestPiece.type;

    if (isCorrectMatch) {
      setStreak((prev) => prev + 1);
      handleCorrectMatch(draggedPiece, closestPiece);
    } else {
      setStreak(0);
      handleWrongMatch(draggedPiece, closestPiece);
    }
  };

  const handleCorrectMatch = (piece1: PieceData, piece2: PieceData) => {
    piece1.element.classList.add(styles.correctMatch);
    piece2.element.classList.add(styles.correctMatch);

    piece1.matched = true;
    piece2.matched = true;

    const itemData = gameData.find((d) => d.id === piece1.id)!;

    setTimeout(() => {
      piece1.element.remove();
      piece2.element.remove();

      setMatchedPairs((prev) => [...prev, itemData]);
      setMatchedCount((prev) => {
        const newCount = prev + 1;
        if (newCount === totalPairs) {
          setTimeout(() => {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            setShowVictory(true);
          }, 500);
        }
        return newCount;
      });
    }, 600);
  };

  const handleWrongMatch = (piece1: PieceData, piece2: PieceData) => {
    piece1.element.classList.add(styles.wrongMatch);
    piece2.element.classList.add(styles.wrongMatch);

    setTimeout(() => {
      piece1.element.classList.remove(styles.wrongMatch);
      piece2.element.classList.remove(styles.wrongMatch);
    }, 500);
  };

  const calculateStars = () => {
    const accuracy = totalPairs / Math.max(attempts, totalPairs);
    let timeStars = 1;

    if (elapsedSeconds <= settings.starThresholds.three) timeStars = 3;
    else if (elapsedSeconds <= settings.starThresholds.two) timeStars = 2;

    if (accuracy >= 0.9) timeStars = Math.min(3, timeStars + 1);
    else if (accuracy < 0.5) timeStars = Math.max(1, timeStars - 1);

    return Math.min(3, Math.max(1, timeStars));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNewGame = () => {
    initializeGame();
  };

  const handlePlayAgain = () => {
    setShowVictory(false);
    initializeGame();
  };

  if (loading) {
    return <div className="text-white text-center">Loading game...</div>;
  }

  if (error) {
    return <div className="text-red-300 text-center">Error: {error}</div>;
  }

  const stars = showVictory ? calculateStars() : 0;
  const accuracy = attempts > 0 ? Math.round((totalPairs / Math.max(attempts, totalPairs)) * 100) : 100;

  return (
    <div className="space-y-4">
      {/* Settings Bar */}
      <div className={styles.settingsBar}>
        <div className={styles.settingGroup}>
          <span className={styles.settingLabel}>Difficulty:</span>
          <select
            className={styles.settingSelect}
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as any);
              setGameStarted(false);
            }}
            disabled={gameStarted}
          >
            <option value="easy">Easy (4 pairs)</option>
            <option value="medium">Medium (5 pairs)</option>
            <option value="hard">Hard (7 pairs)</option>
          </select>
        </div>
        <button className={styles.startButton} onClick={handleNewGame}>
          New Game
        </button>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⏱️</span>
          <span className={styles.statValue}>{formatTime(elapsedSeconds)}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🎯</span>
          <span className={styles.statValue}>{attempts} attempts</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>✨</span>
          <span className={styles.statValue}>{streak} streak</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressCount}>
            {matchedCount}/{totalPairs} Matched
          </span>
        </div>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${(matchedCount / totalPairs) * 100}%` }}
          />
        </div>
        <div className={styles.matchedArea}>
          {matchedPairs.length === 0 ? (
            <div className={styles.matchedAreaEmpty}>Matched pairs will appear here...</div>
          ) : (
            matchedPairs.map((pair, idx) => (
              <div key={idx} className={styles.matchedPairGroup}>
                <span className={styles.termText}>{pair.term}</span>
                <span className={styles.equals}>=</span>
                <span className={styles.defText}>{pair.definition}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Play Area */}
      <div
        ref={playAreaRef}
        className={`${styles.playArea} ${!gameStarted ? styles.disabled : ''} ${styles[`difficulty${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`]}`}
      >
        {!gameStarted && (
          <div className={styles.startOverlay}>
            <div className={styles.startOverlayText}>Ready to match {totalPairs} pairs?</div>
            <button className={styles.startOverlayButton} onClick={startGame}>
              Start Game
            </button>
          </div>
        )}
      </div>

      {/* Victory Modal */}
      {showVictory && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.successTitle}>Amazing Job!</h2>
            <div className={styles.starRating}>
              {[1, 2, 3].map((i) => (
                <span key={i} className={i <= stars ? styles.starEarned : styles.star}>
                  ⭐
                </span>
              ))}
            </div>
            <div className={styles.successStats}>
              <div className={styles.successStat}>
                <div className={styles.successStatValue}>{formatTime(elapsedSeconds)}</div>
                <div className={styles.successStatLabel}>Time</div>
              </div>
              <div className={styles.successStat}>
                <div className={styles.successStatValue}>{attempts}</div>
                <div className={styles.successStatLabel}>Attempts</div>
              </div>
              <div className={styles.successStat}>
                <div className={styles.successStatValue}>{accuracy}%</div>
                <div className={styles.successStatLabel}>Accuracy</div>
              </div>
            </div>
            <p className={styles.successMessage}>
              {stars === 3 ? "Perfect! You're a matching master!" : stars === 2 ? "Great job! You're getting really good!" : "Nice work! Keep practicing to get faster!"}
            </p>
            <button className={styles.resetButton} onClick={handlePlayAgain}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
