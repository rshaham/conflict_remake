// ============================================
// Game Over Screen - End Game Summary
// ============================================

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export function GameOverScreen() {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);

  // Get end state from game, or show placeholder
  const endState = game?.endState;

  const isVictory = endState?.type === 'victory';
  const score = endState?.finalScore ?? 0;
  const leadershipStyle = endState?.leadershipStyle ?? 'Unknown';
  const narrative = endState?.narrative ?? 'Your time as Prime Minister has ended.';
  const statistics = endState?.statistics;

  const conditionNames: Record<string, string> = {
    total_victory: 'Total Victory',
    military_defeat: 'Military Defeat',
    nuclear_holocaust: 'Nuclear Holocaust',
    impeachment: 'Impeachment',
    assassination: 'Assassination',
  };

  const handlePlayAgain = () => {
    // Reset game state would happen in newGame
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-game-bg-dark p-4 flex flex-col">
      {/* Result Header */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">
          {isVictory ? '\u{1F3C6}' : '\u{1F480}'}
        </div>
        <h1 className={`text-3xl font-bold ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
          {isVictory ? 'Victory!' : 'Defeat'}
        </h1>
        <p className="text-game-text-secondary mt-2">
          {endState?.condition ? conditionNames[endState.condition] : 'Game Over'}
        </p>
      </div>

      {/* Score */}
      <div className="card mb-4 text-center">
        <p className="text-sm text-game-text-secondary">Final Score</p>
        <p className="text-4xl font-bold text-game-accent">{score}</p>
      </div>

      {/* Leadership Style */}
      <div className="card mb-4">
        <p className="text-sm text-game-text-secondary mb-1">Leadership Style</p>
        <p className="text-xl font-bold text-game-text-primary">{leadershipStyle}</p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="card mb-4">
          <h3 className="font-bold text-game-text-primary mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Turns Played</span>
              <span className="text-game-text-primary">{statistics.turnsPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Wars Won</span>
              <span className="text-game-text-primary">{statistics.warsWon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Wars Lost</span>
              <span className="text-game-text-primary">{statistics.warsLost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Countries Defeated</span>
              <span className="text-game-text-primary">{statistics.countriesDefeated.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Weapons Purchased</span>
              <span className="text-game-text-primary">{statistics.totalWeaponsPurchased}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Peak Prestige</span>
              <span className="text-game-text-primary">{statistics.peakPrestige}</span>
            </div>
          </div>
        </div>
      )}

      {/* Countries Defeated */}
      {statistics && statistics.countriesDefeated.length > 0 && (
        <div className="card mb-4">
          <h3 className="font-bold text-game-text-primary mb-2">Defeated Nations</h3>
          <div className="flex flex-wrap gap-2">
            {statistics.countriesDefeated.map((country) => (
              <span
                key={country}
                className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-sm"
              >
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Narrative */}
      <div className="card mb-6 flex-1">
        <h3 className="font-bold text-game-text-primary mb-2">Your Legacy</h3>
        <p className="text-sm text-game-text-secondary leading-relaxed">
          {narrative}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handlePlayAgain}
          className="btn-primary w-full"
        >
          Play Again
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-secondary w-full"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
