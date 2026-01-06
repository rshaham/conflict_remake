// ============================================
// Palestinian Screen - Manage Internal Situation
// ============================================

import { GameLayout } from '../components/layout/GameLayout';

export function PalestinianScreen() {
  return (
    <GameLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold text-game-text-primary mb-4">
          Palestinian Situation
        </h2>

        {/* Situation Meter */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">Current Status</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-game-bg-dark rounded-full overflow-hidden">
                <div className="h-full w-1/5 bg-green-500 rounded-full" />
              </div>
            </div>
            <span className="text-green-400 font-medium">Calm</span>
          </div>
          <div className="flex justify-between text-xs text-game-text-secondary mt-2">
            <span>Calm</span>
            <span>Unrest</span>
            <span>Protests</span>
            <span>Violence</span>
            <span>Intifada</span>
          </div>
        </div>

        {/* External Factors */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">External Factors</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Hostile Neighbors</span>
              <span className="text-yellow-400">+10%/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-game-text-secondary">Active Wars</span>
              <span className="text-green-400">None</span>
            </div>
          </div>
        </div>

        {/* Policing Tactics */}
        <div className="card mb-4">
          <h3 className="text-lg font-bold text-game-text-primary mb-3">
            Policing Tactics
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-game-accent rounded-lg text-left">
              <div className="font-medium text-white">No Deployment</div>
              <div className="text-sm text-white text-opacity-80">
                No policing active. Situation may escalate.
              </div>
            </button>

            <button className="w-full p-3 bg-game-bg-dark rounded-lg text-left">
              <div className="font-medium text-game-text-primary">Soft Tactics</div>
              <div className="text-sm text-game-text-secondary">
                Minimal force. Requires 1 brigade. No US penalty.
              </div>
            </button>

            <button className="w-full p-3 bg-game-bg-dark rounded-lg text-left border border-red-900">
              <div className="font-medium text-red-400">Hard Tactics</div>
              <div className="text-sm text-game-text-secondary">
                Aggressive enforcement. -15 US attitude. +3 violence points.
              </div>
            </button>
          </div>
        </div>

        {/* Knesset Pressure */}
        <div className="card">
          <h3 className="text-sm text-game-text-secondary mb-2">Knesset Pressure</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-game-bg-dark rounded-full">
              <div className="h-full w-0 bg-red-500 rounded-full" />
            </div>
            <span className="text-game-text-primary font-medium">0/10</span>
          </div>
          <p className="text-xs text-game-text-secondary mt-2">
            Reach 10 and you will be removed from office.
          </p>
        </div>

        {/* Phase Indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-game-text-secondary">
            Palestinian Phase - Placeholder Screen
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
