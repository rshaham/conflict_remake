// ============================================
// Intelligence Screen - Covert Operations
// ============================================
// Mossad operations and intelligence actions
// Retro terminal-heavy styling

import { GameLayout } from '../components/game/GameLayout';
import { useGameStore } from '../store/gameStore';
import { IntelligenceEngine } from '../engine/IntelligenceEngine';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../utils/countryData';
import type { CountryId, IntelligenceAction, ExtremeMeasureType } from '../types/game';

// Target countries for intelligence operations
const INTEL_TARGETS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon', 'iraq', 'iran', 'libya'];

const INSURGENCY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  none: { bg: 'bg-green-100', text: 'text-green-700', label: 'NONE' },
  scattered: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'SCATTERED' },
  organized: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'ORGANIZED' },
  powerful: { bg: 'bg-red-100', text: 'text-red-700', label: 'POWERFUL' },
};

const STABILITY_STYLES: Record<string, string> = {
  very_solid: 'text-green-700',
  solid: 'text-green-600',
  good: 'text-blue-600',
  weak: 'text-orange-600',
  critical: 'text-red-600',
  collapse: 'text-red-800',
};

export function IntelligenceScreen() {
  const game = useGameStore((state) => state.game);
  const setIntelligenceAction = useGameStore((state) => state.setIntelligenceAction);
  const attemptExtremeMeasure = useGameStore((state) => state.attemptExtremeMeasure);
  const advancePhase = useGameStore((state) => state.advancePhase);

  if (!game) {
    return (
      <GameLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-mono text-retro-text-dim">No game in progress</p>
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

  // Count active operations
  const activeOps = Object.values(intelligenceActions).filter(a => a !== 'do_nothing').length;

  return (
    <GameLayout>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-lg leading-none">COVERT OPERATIONS</h1>
        <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">Intelligence Division</div>
      </div>

      {/* Terminal-style status display */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>MOSSAD OPERATIONS CENTER</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 animate-pulse" />
          {activeOps > 0 ? `${activeOps} ACTIVE OPS` : 'AWAITING ORDERS'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Covert Operations Header */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2">Operations Overview</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 border border-green-300">
              <div className="font-mono text-[10px] text-green-700 font-bold">SUPPORT</div>
              <div className="font-mono text-[8px] text-green-600">Fund insurgents</div>
            </div>
            <div className="p-2 bg-gray-50 border border-gray-300">
              <div className="font-mono text-[10px] text-gray-700 font-bold">NONE</div>
              <div className="font-mono text-[8px] text-gray-600">No action</div>
            </div>
            <div className="p-2 bg-blue-50 border border-blue-300">
              <div className="font-mono text-[10px] text-blue-700 font-bold">DISRUPT</div>
              <div className="font-mono text-[8px] text-blue-600">Counter ops</div>
            </div>
          </div>
        </div>

        {/* Country Operations */}
        {INTEL_TARGETS.map((countryId) => {
          const country = game.countries[countryId];
          if (country.isDefeated) return null;

          const currentAction = intelligenceActions[countryId] || 'do_nothing';
          const insurgencyStyle = INSURGENCY_STYLES[country.insurgency] || INSURGENCY_STYLES.none;
          const stabilityStyle = STABILITY_STYLES[country.stability] || 'text-gray-600';

          // Check if extreme measures are available
          const canAssassinate = IntelligenceEngine.canAttemptExtremeMeasure(game, countryId, 'assassination');
          const canCoup = IntelligenceEngine.canAttemptExtremeMeasure(game, countryId, 'coup');
          const hasExtreme = canAssassinate || canCoup;

          return (
            <div
              key={countryId}
              className={`bg-white border-2 ${hasExtreme ? 'border-red-400' : 'border-black'} retro-shadow p-3`}
            >
              {/* Country Header */}
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{COUNTRY_FLAGS[countryId]}</span>
                  <div>
                    <div className="font-mono font-bold text-xs">{COUNTRY_NAMES[countryId].toUpperCase()}</div>
                    <div className="font-mono text-[8px] text-gray-500">
                      Leader: {country.leader.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 border font-mono text-[9px] font-bold ${insurgencyStyle.bg} ${insurgencyStyle.text}`}>
                    {insurgencyStyle.label}
                  </span>
                  <div className={`font-mono text-[8px] mt-1 ${stabilityStyle}`}>
                    Stability: {country.stability.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 mb-2">
                <button
                  type="button"
                  onClick={() => handleActionChange(countryId, 'support_insurgents')}
                  className={`flex-1 py-2 font-mono text-[10px] font-bold border-2 transition-all ${
                    currentAction === 'support_insurgents'
                      ? 'border-green-600 bg-green-100 text-green-800'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  SUPPORT
                </button>
                <button
                  type="button"
                  onClick={() => handleActionChange(countryId, 'do_nothing')}
                  className={`flex-1 py-2 font-mono text-[10px] font-bold border-2 transition-all ${
                    currentAction === 'do_nothing'
                      ? 'border-gray-600 bg-gray-200 text-gray-800'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  NONE
                </button>
                <button
                  type="button"
                  onClick={() => handleActionChange(countryId, 'disrupt_insurgents')}
                  className={`flex-1 py-2 font-mono text-[10px] font-bold border-2 transition-all ${
                    currentAction === 'disrupt_insurgents'
                      ? 'border-blue-600 bg-blue-100 text-blue-800'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  DISRUPT
                </button>
              </div>

              {/* Extreme Measures (if available) */}
              {hasExtreme && (
                <div className="pt-2 border-t-2 border-dashed border-red-300">
                  <div className="font-mono text-[8px] text-red-600 font-bold mb-1">
                    ⚠ EXTREME MEASURES AVAILABLE
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleExtremeMeasure(countryId, 'assassination')}
                      disabled={!canAssassinate}
                      className={`flex-1 py-1.5 font-mono text-[9px] font-bold border-2 transition-all ${
                        canAssassinate
                          ? 'border-red-600 bg-red-50 text-red-700 hover:bg-red-100'
                          : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      ASSASSINATE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExtremeMeasure(countryId, 'coup')}
                      disabled={!canCoup}
                      className={`flex-1 py-1.5 font-mono text-[9px] font-bold border-2 transition-all ${
                        canCoup
                          ? 'border-red-600 bg-red-50 text-red-700 hover:bg-red-100'
                          : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      TRIGGER COUP
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Extreme Measures Info */}
        <div className="bg-white border-2 border-red-600 retro-shadow-red p-3">
          <div className="font-mono font-bold text-xs text-red-700 uppercase mb-2">
            Extreme Measures Protocol
          </div>
          <div className="font-mono text-[10px] text-gray-700 space-y-1">
            <p>
              Assassination and coup attempts become available when target stability
              reaches <span className="font-bold text-orange-600">WEAK</span> or <span className="font-bold text-red-600">CRITICAL</span>.
            </p>
            <p className="text-red-600 font-bold">
              ⚠ Success not guaranteed. Failure carries severe diplomatic consequences.
            </p>
          </div>
        </div>

        {/* Operations Summary */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Operations Summary
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 border border-green-300 text-center">
              <div className="font-mono text-lg font-bold text-green-700">
                {Object.values(intelligenceActions).filter(a => a === 'support_insurgents').length}
              </div>
              <div className="font-mono text-[8px] text-green-600">SUPPORT OPS</div>
            </div>
            <div className="p-2 bg-blue-50 border border-blue-300 text-center">
              <div className="font-mono text-lg font-bold text-blue-700">
                {Object.values(intelligenceActions).filter(a => a === 'disrupt_insurgents').length}
              </div>
              <div className="font-mono text-[8px] text-blue-600">DISRUPT OPS</div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer with Continue */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={() => advancePhase()}
          className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          CONTINUE → MILITARY
        </button>
      </div>
    </GameLayout>
  );
}
