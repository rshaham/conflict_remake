// ============================================
// Title Screen - Main Menu
// ============================================

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { loadAllGameData } from '../data/loader';
import type { GameData } from '../types/data';

export function TitleScreen() {
  const navigate = useNavigate();
  const newGame = useGameStore((state) => state.newGame);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load game data on mount
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-game-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-game-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-game-text-secondary">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-game-bg-dark flex items-center justify-center p-4">
        <div className="card text-center max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Game</h2>
          <p className="text-game-text-secondary mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-bg-dark flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-game-text-primary mb-2">
          CONFLICT
        </h1>
        <h2 className="text-xl text-game-accent">
          Middle East Political Simulator
        </h2>
        <p className="text-sm text-game-text-secondary mt-2">
          A remake of the 1990 classic
        </p>
      </div>

      {/* Menu Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button onClick={handleNewGame} className="btn-primary text-lg py-4">
          New Game
        </button>

        <button className="btn-secondary" disabled>
          Continue (No save found)
        </button>

        <button className="btn-secondary" disabled>
          Settings
        </button>

        <button className="btn-secondary" disabled>
          How to Play
        </button>
      </div>

      {/* Data loaded indicator (for debugging) */}
      {gameData && (
        <p className="text-xs text-game-text-secondary mt-8">
          ✓ {Object.keys(gameData.countries.countries).length} countries loaded
        </p>
      )}

      {/* Footer */}
      <p className="text-xs text-game-text-secondary mt-8 text-center">
        Phase 1 Foundation - Scaffolding Complete
      </p>
    </div>
  );
}
