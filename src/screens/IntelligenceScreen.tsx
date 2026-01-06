// ============================================
// Intelligence Screen - Covert Operations
// ============================================

import { GameLayout } from '../components/layout/GameLayout';

const INTEL_TARGETS = [
  { id: 'egypt', name: 'Egypt', insurgency: 'None', action: 'none' },
  { id: 'syria', name: 'Syria', insurgency: 'None', action: 'support' },
  { id: 'jordan', name: 'Jordan', insurgency: 'Scattered', action: 'none' },
  { id: 'lebanon', name: 'Lebanon', insurgency: 'Organized', action: 'disrupt' },
];

export function IntelligenceScreen() {
  return (
    <GameLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold text-game-text-primary mb-4">
          Intelligence Operations
        </h2>

        {/* Monthly Budget */}
        <div className="card mb-4">
          <div className="flex justify-between items-center">
            <span className="text-game-text-secondary">Intel Budget</span>
            <span className="text-green-400 font-medium">$10M/month</span>
          </div>
        </div>

        {/* Operations by Country */}
        <div className="space-y-3">
          {INTEL_TARGETS.map((target) => (
            <div key={target.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-game-text-primary">
                  {target.name}
                </h3>
                <span className={`text-sm ${
                  target.insurgency === 'None' ? 'text-green-400' :
                  target.insurgency === 'Scattered' ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {target.insurgency}
                </span>
              </div>
              <div className="flex gap-2">
                <button className={`flex-1 text-sm py-2 rounded ${
                  target.action === 'support' ? 'bg-game-accent text-white' : 'bg-game-bg-dark text-game-text-secondary'
                }`}>
                  Support
                </button>
                <button className={`flex-1 text-sm py-2 rounded ${
                  target.action === 'none' ? 'bg-game-accent text-white' : 'bg-game-bg-dark text-game-text-secondary'
                }`}>
                  None
                </button>
                <button className={`flex-1 text-sm py-2 rounded ${
                  target.action === 'disrupt' ? 'bg-game-accent text-white' : 'bg-game-bg-dark text-game-text-secondary'
                }`}>
                  Disrupt
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Extreme Measures */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-red-400 mb-2">
            Extreme Measures
          </h3>
          <div className="card border-red-900">
            <p className="text-sm text-game-text-secondary mb-3">
              Available when target country is destabilized (Weak or Critical stability)
            </p>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1 opacity-50" disabled>
                Assassination
              </button>
              <button className="btn-secondary flex-1 opacity-50" disabled>
                Trigger Coup
              </button>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-game-text-secondary">
            Intelligence Phase - Placeholder Screen
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
