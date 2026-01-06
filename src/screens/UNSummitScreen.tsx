// ============================================
// UN Summit Screen - Annual Diplomatic Event
// ============================================

import { GameLayout } from '../components/layout/GameLayout';

export function UNSummitScreen() {
  return (
    <GameLayout showActionBar={false}>
      <div className="p-4">
        {/* UN Header */}
        <div className="card mb-4 text-center">
          <div className="text-4xl mb-2">🇺🇳</div>
          <h2 className="text-xl font-bold text-game-text-primary">
            United Nations Summit
          </h2>
          <p className="text-sm text-game-text-secondary">
            December 1997
          </p>
        </div>

        {/* US Aid */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">
            US Foreign Aid Package
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-game-text-primary">
              Based on your relationship
            </span>
            <span className="text-green-400 font-bold text-lg">
              $50M
            </span>
          </div>
        </div>

        {/* Proposals */}
        <h3 className="text-lg font-bold text-game-text-primary mb-3">
          International Proposals
        </h3>

        <div className="space-y-3">
          {/* Palestinian Homeland */}
          <div className="card">
            <h4 className="font-medium text-game-text-primary mb-1">
              Palestinian Homeland
            </h4>
            <p className="text-sm text-game-text-secondary mb-3">
              Recognize Palestinian autonomy. +25 US attitude, +1 prestige.
              Permanent resolution but weakens position in future wars.
            </p>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">Accept</button>
              <button className="btn-secondary flex-1">Reject</button>
            </div>
          </div>

          {/* Army Limit */}
          <div className="card">
            <h4 className="font-medium text-game-text-primary mb-1">
              Army Size Limitation
            </h4>
            <p className="text-sm text-game-text-secondary mb-3">
              Cap military at current levels. +15 US attitude.
              No new weapon purchases for 12 months.
            </p>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">Accept</button>
              <button className="btn-secondary flex-1">Reject</button>
            </div>
          </div>

          {/* Defense Budget */}
          <div className="card">
            <h4 className="font-medium text-game-text-primary mb-1">
              Defense Budget Reduction
            </h4>
            <p className="text-sm text-game-text-secondary mb-3">
              Reduce defense spending by 5%. +5 US attitude.
            </p>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">Accept</button>
              <button className="btn-secondary flex-1">Reject</button>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-6">
          <button className="btn-primary w-full">
            End Summit & Continue to January
          </button>
        </div>

        {/* Phase Indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-game-text-secondary">
            UN Summit Phase - Placeholder Screen
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
