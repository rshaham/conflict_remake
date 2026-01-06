// ============================================
// Game Over Screen - End Game Summary
// ============================================

import { useNavigate } from 'react-router-dom';

export function GameOverScreen() {
  const navigate = useNavigate();

  // Placeholder values - would come from game state
  const isVictory = true;
  const score = 250;
  const leadershipStyle = 'Diplomatic';

  return (
    <div className="min-h-screen bg-game-bg-dark p-4 flex flex-col">
      {/* Result Header */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">
          {isVictory ? '🏆' : '💀'}
        </div>
        <h1 className={`text-3xl font-bold ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
          {isVictory ? 'Victory!' : 'Defeat'}
        </h1>
        <p className="text-game-text-secondary mt-2">
          {isVictory
            ? 'All four neighboring states have been defeated.'
            : 'Your government has fallen.'}
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
        <p className="text-sm text-game-text-secondary mt-1">
          "Master negotiator who achieved peace through diplomacy."
        </p>
      </div>

      {/* Statistics */}
      <div className="card mb-4">
        <h3 className="font-bold text-game-text-primary mb-3">Statistics</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-game-text-secondary">Turns Played</span>
            <span className="text-game-text-primary">36</span>
          </div>
          <div className="flex justify-between">
            <span className="text-game-text-secondary">Wars Won</span>
            <span className="text-game-text-primary">4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-game-text-secondary">Wars Lost</span>
            <span className="text-game-text-primary">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-game-text-secondary">Airstrikes</span>
            <span className="text-game-text-primary">12</span>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div className="card mb-6 flex-1">
        <h3 className="font-bold text-game-text-primary mb-2">Your Legacy</h3>
        <p className="text-sm text-game-text-secondary leading-relaxed">
          Under your leadership, Israel achieved complete regional dominance.
          Through a combination of shrewd diplomacy and calculated military action,
          you systematically neutralized each neighboring threat. History will
          remember you as the Prime Minister who secured Israel's future.
        </p>
        <p className="text-xs text-game-text-secondary mt-3 italic">
          [AI-generated narrative - Phase 4]
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/')}
          className="btn-primary w-full"
        >
          Play Again
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary w-full"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}
