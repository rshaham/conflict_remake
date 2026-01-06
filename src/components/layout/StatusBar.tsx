// ============================================
// Status Bar - Top Bar with Game State
// ============================================

import { useGameStore } from '../../store/gameStore';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function StatusBar() {
  const game = useGameStore((state) => state.game);

  // Show minimal bar when no game is active
  if (!game) {
    return (
      <header className="fixed top-0 left-0 right-0 h-14 bg-game-bg-card border-b border-gray-700 z-50">
        <div className="h-full flex items-center justify-center px-4">
          <h1 className="text-lg font-bold text-game-text-primary">
            Conflict: Middle East Political Simulator
          </h1>
        </div>
      </header>
    );
  }

  const monthName = MONTH_NAMES[game.month - 1];
  const budgetFormatted = (game.player.budget / 1000000).toFixed(0);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-game-bg-card border-b border-gray-700 z-50">
      <div className="h-full flex items-center justify-between px-4">
        {/* Date */}
        <div className="flex flex-col">
          <span className="text-xs text-game-text-secondary">Turn {game.turn}</span>
          <span className="text-sm font-medium text-game-text-primary">
            {monthName} {game.year}
          </span>
        </div>

        {/* Phase */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-game-text-secondary">Phase</span>
          <span className="text-sm font-medium text-game-accent capitalize">
            {game.phase.replace('_', ' ')}
          </span>
        </div>

        {/* Budget */}
        <div className="flex flex-col items-end">
          <span className="text-xs text-game-text-secondary">Budget</span>
          <span className="text-sm font-medium text-green-400">
            ${budgetFormatted}M
          </span>
        </div>
      </div>
    </header>
  );
}
