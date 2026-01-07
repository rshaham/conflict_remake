// ============================================
// Intelligence Screen - Covert Operations
// ============================================

import { GameLayout } from '../components/layout/GameLayout';
import { useGameStore } from '../store/gameStore';
import { IntelligenceEngine } from '../engine/IntelligenceEngine';
import type { CountryId, IntelligenceAction, ExtremeMeasureType } from '../types/game';

// Target countries for intelligence operations
const INTEL_TARGETS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon', 'iraq', 'iran', 'libya'];

const ACTION_LABELS: Record<IntelligenceAction, string> = {
  support_insurgents: 'Support',
  disrupt_insurgents: 'Disrupt',
  do_nothing: 'None',
};

export function IntelligenceScreen() {
  const game = useGameStore((state) => state.game);
  const setIntelligenceAction = useGameStore((state) => state.setIntelligenceAction);
  const attemptExtremeMeasure = useGameStore((state) => state.attemptExtremeMeasure);

  if (!game) {
    return (
      <GameLayout>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const intelligenceActions = game.player.turnActions.intelligenceActions;

  const handleActionChange = (countryId: CountryId, action: IntelligenceAction) => {
    setIntelligenceAction(countryId, action);
  };

  const handleExtremeMeasure = (countryId: CountryId, type: ExtremeMeasureType) => {
    attemptExtremeMeasure(countryId, type);
  };

  return (
    <GameLayout>
      <div className="p-4 pb-24">
        <h2 className="text-xl font-bold text-game-text-primary mb-4">
          Intelligence Operations
        </h2>

        {/* Operations by Country */}
        <div className="space-y-3">
          {INTEL_TARGETS.map((countryId) => {
            const country = game.countries[countryId];
            if (country.isDefeated) return null;

            const currentAction = intelligenceActions[countryId] || 'do_nothing';
            const insurgencyName = IntelligenceEngine.getInsurgencyName(country.insurgency);

            // Check if extreme measures are available
            const canAssassinate = IntelligenceEngine.canAttemptExtremeMeasure(game, countryId, 'assassination');
            const canCoup = IntelligenceEngine.canAttemptExtremeMeasure(game, countryId, 'coup');

            return (
              <div key={countryId} className="card">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium text-game-text-primary">
                      {countryId.charAt(0).toUpperCase() + countryId.slice(1)}
                    </h3>
                    <p className="text-xs text-game-text-secondary">
                      Stability: {country.stability} | Leader: {country.leader.name}
                    </p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    country.insurgency === 'none' ? 'bg-green-900/30 text-green-400' :
                    country.insurgency === 'scattered' ? 'bg-yellow-900/30 text-yellow-400' :
                    country.insurgency === 'organized' ? 'bg-orange-900/30 text-orange-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {insurgencyName}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-2">
                  {(['support_insurgents', 'do_nothing', 'disrupt_insurgents'] as IntelligenceAction[]).map((action) => (
                    <button
                      key={action}
                      onClick={() => handleActionChange(countryId, action)}
                      className={`flex-1 text-sm py-2 rounded transition-colors ${
                        currentAction === action
                          ? 'bg-game-accent text-white'
                          : 'bg-game-bg-dark text-game-text-secondary hover:bg-gray-700'
                      }`}
                    >
                      {ACTION_LABELS[action]}
                    </button>
                  ))}
                </div>

                {/* Extreme Measures (if available) */}
                {(canAssassinate || canCoup) && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700">
                    <button
                      onClick={() => handleExtremeMeasure(countryId, 'assassination')}
                      disabled={!canAssassinate}
                      className={`flex-1 text-xs py-1.5 rounded ${
                        canAssassinate
                          ? 'bg-red-900/50 text-red-400 hover:bg-red-800/50'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Assassinate
                    </button>
                    <button
                      onClick={() => handleExtremeMeasure(countryId, 'coup')}
                      disabled={!canCoup}
                      className={`flex-1 text-xs py-1.5 rounded ${
                        canCoup
                          ? 'bg-red-900/50 text-red-400 hover:bg-red-800/50'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Trigger Coup
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extreme Measures Info */}
        <div className="mt-6">
          <div className="card border-red-900/50 bg-red-950/20">
            <h3 className="text-sm font-semibold text-red-400 mb-2">
              Extreme Measures
            </h3>
            <p className="text-xs text-game-text-secondary">
              Assassination and coup attempts become available when a target country's
              stability reaches "Weak" or "Critical". Success is not guaranteed and
              failure carries severe diplomatic consequences.
            </p>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
            Intelligence Phase
          </span>
        </div>
      </div>
    </GameLayout>
  );
}
