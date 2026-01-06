// ============================================
// War Screen - Active War Management
// ============================================

import { GameLayout } from '../components/layout/GameLayout';

export function WarScreen() {
  // This screen shows when there's an active war
  const hasActiveWar = false; // Placeholder

  if (!hasActiveWar) {
    return (
      <GameLayout showActionBar={false}>
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">☮️</div>
          <h2 className="text-xl font-bold text-game-text-primary mb-2">
            No Active Wars
          </h2>
          <p className="text-game-text-secondary text-center">
            Israel is currently at peace with all nations.
          </p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          ⚔️ War Status
        </h2>

        {/* War Progress */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">
            War with Syria
          </h3>
          <div className="relative h-6 bg-game-bg-dark rounded-full overflow-hidden">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600" />
            <div className="absolute left-1/2 h-full w-1/4 bg-green-500 rounded-r-full" />
          </div>
          <div className="flex justify-between text-xs text-game-text-secondary mt-2">
            <span>Losing</span>
            <span>Stalemate</span>
            <span>Winning</span>
          </div>
        </div>

        {/* Force Comparison */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-3">Forces</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-green-400 font-bold mb-2">Israel</p>
              <div className="text-sm space-y-1">
                <p>Tanks: 35</p>
                <p>Aircraft: 25</p>
                <p>Infantry: 8</p>
              </div>
            </div>
            <div>
              <p className="text-red-400 font-bold mb-2">Syria</p>
              <div className="text-sm space-y-1">
                <p>Tanks: 50</p>
                <p>Aircraft: 30</p>
                <p>Infantry: 12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Losses This Turn */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">
            Losses This Turn
          </h3>
          <p className="text-game-text-primary">
            3 Light Tanks, 1 Fighter Aircraft
          </p>
        </div>

        {/* War Actions */}
        <div className="space-y-3">
          <button className="btn-primary w-full">
            Continue Fighting
          </button>
          <button className="btn-secondary w-full">
            Offer Ceasefire
          </button>
          <button className="btn-secondary w-full border-red-900 text-red-400" disabled>
            Launch Nuclear Strike
          </button>
        </div>

        {/* Phase Indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-game-text-secondary">
            War Phase - Placeholder Screen
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
