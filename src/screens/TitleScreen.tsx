// ============================================
// Title Screen - BIOS Boot Style
// ============================================

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { loadAllGameData } from '../data/loader';
import type { GameData } from '../types/data';
import { Scanlines } from '../components/ui/Scanlines';

interface SaveInfo {
  turn: number;
  month: number;
  year: number;
}

function getSaveInfo(): SaveInfo | null {
  try {
    const saved = localStorage.getItem('conflict-save');
    if (!saved) return null;

    const data = JSON.parse(saved);
    if (data?.state?.game) {
      const { turn, month, year } = data.state.game;
      return { turn, month, year };
    }
    return null;
  } catch {
    return null;
  }
}

export function TitleScreen() {
  const navigate = useNavigate();
  const newGame = useGameStore((state) => state.newGame);
  const existingGame = useGameStore((state) => state.game);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveInfo = getSaveInfo();

  useEffect(() => {
    loadAllGameData()
      .then((data) => {
        console.log('Game data loaded:', data);
        setGameData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load game data:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleNewGame = async () => {
    await newGame('normal', 'classic_1997');
    navigate('/game/news');
  };

  const handleContinue = () => {
    if (existingGame) {
      navigate('/game/news');
    }
  };

  // Loading state - terminal style
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <Scanlines />
        <div className="terminal p-6 w-full max-w-xs text-center terminal-glow">
          <div className="text-green-500 font-mono text-sm mb-4">
            LOADING SYSTEM...
          </div>
          <div className="text-green-700 font-mono text-xs animate-pulse">
            ████████████████
          </div>
        </div>
      </div>
    );
  }

  // Error state - terminal style
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <Scanlines />
        <div className="terminal p-6 w-full max-w-xs text-center">
          <div className="text-red-500 font-mono text-sm mb-4">
            SYSTEM ERROR
          </div>
          <div className="text-red-400 font-mono text-xs mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 bg-red-900/20 border-2 border-red-500 text-red-500 font-mono font-bold text-xs hover:bg-red-500 hover:text-black transition-all"
          >
            [ RETRY ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative">
      <Scanlines />

      {/* Main terminal container */}
      <div className="border-2 border-green-500 p-6 w-full max-w-xs text-center terminal-glow">
        {/* BIOS header */}
        <div className="text-green-600 font-mono text-[9px] mb-6 flex justify-between">
          <span>BIOS 01/01/97</span>
          <span>640K OK</span>
        </div>

        {/* Title */}
        <h1 className="font-pixel text-6xl text-green-500 leading-none mb-2">
          CONFLICT
        </h1>
        <h2 className="font-mono text-green-700 text-[10px] tracking-[0.25em] mb-8 border-y border-green-900 py-2">
          MIDDLE EAST SIMULATION
        </h2>

        {/* Menu buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleNewGame}
            className="w-full py-3 bg-green-900/20 border-2 border-green-500 text-green-500 font-mono font-bold text-xs hover:bg-green-500 hover:text-black transition-all"
          >
            [ INITIALIZE ]
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!saveInfo || !existingGame}
            className={`w-full py-2 border font-mono text-[10px] transition-all ${
              saveInfo && existingGame
                ? 'border-green-500 text-green-500 hover:border-green-400 hover:text-green-400'
                : 'border-green-900 text-green-900 cursor-not-allowed'
            }`}
          >
            {saveInfo
              ? `LOAD SAVE — TURN ${saveInfo.turn}`
              : 'NO SAVE DATA'
            }
          </button>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-green-900 text-[9px] font-mono">
          (C) 1990-1997 DISCOVERY
        </div>

        {/* Data loaded indicator */}
        {gameData && (
          <div className="mt-2 text-green-800 text-[8px] font-mono">
            {Object.keys(gameData.countries.countries).length} NATIONS LOADED
          </div>
        )}
      </div>

      {/* Command prompt footer */}
      <div className="absolute bottom-6 font-mono text-green-700 text-[10px]">
        C:\{'>'} <span className="animate-pulse">█</span>
      </div>
    </div>
  );
}
