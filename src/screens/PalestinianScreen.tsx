// ============================================
// Palestinian Screen - Manage Internal Situation
// ============================================

import { GameLayout } from '../components/layout/GameLayout';
import { useGameStore } from '../store/gameStore';
import { PalestinianEngine } from '../engine/PalestinianEngine';
import type { PolicingTactic } from '../types/game';

const PALESTINIAN_LEVELS = ['calm', 'unrest', 'protests', 'violence', 'intifada'] as const;

const LEVEL_COLORS: Record<string, string> = {
  calm: 'bg-green-500',
  unrest: 'bg-yellow-500',
  protests: 'bg-orange-500',
  violence: 'bg-red-500',
  intifada: 'bg-red-700',
};

const TACTIC_INFO: Record<PolicingTactic, { desc: string; warning?: string }> = {
  none: {
    desc: 'No policing active. Situation may escalate.',
  },
  soft: {
    desc: 'Minimal force. Requires 1 brigade. 50% escalation reduction.',
  },
  hard: {
    desc: 'Aggressive enforcement. Requires 1 brigade. Prevents escalation.',
    warning: '-5 US attitude and +1 violence points per month.',
  },
};

export function PalestinianScreen() {
  const game = useGameStore((state) => state.game);
  const setPolicingTactic = useGameStore((state) => state.setPolicingTactic);

  if (!game) {
    return (
      <GameLayout>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  // Check if Palestinian homeland has been granted
  if (game.player.palestinianHomeland) {
    return (
      <GameLayout>
        <div className="p-4 pb-24">
          <h2 className="text-xl font-bold text-game-text-primary mb-4">
            Palestinian Situation
          </h2>
          <div className="card bg-green-900/20 border border-green-800">
            <h3 className="text-lg font-bold text-green-400 mb-2">
              Palestinian Homeland Established
            </h3>
            <p className="text-sm text-game-text-secondary">
              The Palestinian question has been resolved through the UN Summit.
              International recognition and US support have been secured.
            </p>
          </div>
        </div>
      </GameLayout>
    );
  }

  const currentLevel = game.player.palestinianLevel;
  const currentTactic = game.player.policingTactic;
  const knessetDisapproval = game.player.knessetDisapproval;

  // Calculate external factors
  const hostileCount = PalestinianEngine.countHostileNeighbors(game);
  const warCount = game.wars.length;
  const escalationRisk = PalestinianEngine.getEscalationRisk(game);

  // Calculate progress bar width
  const levelIndex = PALESTINIAN_LEVELS.indexOf(currentLevel);
  const progressWidth = ((levelIndex + 1) / PALESTINIAN_LEVELS.length) * 100;

  // Calculate available brigades for policing
  const totalBrigades = game.player.arsenal.infantry_brigade || 0;
  const deployedBrigades = Object.values(game.player.deployedTroops).reduce((a, b) => a + b, 0);
  const availableBrigades = totalBrigades - deployedBrigades;

  const handleTacticSelect = (tactic: PolicingTactic) => {
    if (PalestinianEngine.canSetPolicingTactic(game, tactic)) {
      setPolicingTactic(tactic);
    }
  };

  return (
    <GameLayout>
      <div className="p-4 pb-24">
        <h2 className="text-xl font-bold text-game-text-primary mb-4">
          Palestinian Situation
        </h2>

        {/* Situation Meter */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">Current Status</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-game-bg-dark rounded-full overflow-hidden">
                <div
                  className={`h-full ${LEVEL_COLORS[currentLevel]} rounded-full transition-all duration-500`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>
            <span className={`font-medium ${
              currentLevel === 'calm' ? 'text-green-400' :
              currentLevel === 'unrest' ? 'text-yellow-400' :
              currentLevel === 'protests' ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {PalestinianEngine.getLevelName(currentLevel)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-game-text-secondary mt-2">
            {PALESTINIAN_LEVELS.map((level) => (
              <span
                key={level}
                className={level === currentLevel ? 'text-game-text-primary font-medium' : ''}
              >
                {PalestinianEngine.getLevelName(level)}
              </span>
            ))}
          </div>
        </div>

        {/* Escalation Risk */}
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-game-text-secondary">Escalation Risk</h3>
            <span className={`text-lg font-bold ${
              escalationRisk === 0 ? 'text-green-400' :
              escalationRisk < 0.2 ? 'text-yellow-400' :
              escalationRisk < 0.4 ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {Math.round(escalationRisk * 100)}%
            </span>
          </div>
          <div className="h-2 bg-game-bg-dark rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                escalationRisk === 0 ? 'bg-green-500' :
                escalationRisk < 0.2 ? 'bg-yellow-500' :
                escalationRisk < 0.4 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, escalationRisk * 100)}%` }}
            />
          </div>
        </div>

        {/* External Factors */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">External Factors</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-game-text-secondary">
                Hostile Neighbors ({hostileCount})
              </span>
              <span className={hostileCount > 0 ? 'text-yellow-400' : 'text-green-400'}>
                {hostileCount > 0 ? `+${hostileCount * 10}% risk` : 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-game-text-secondary">
                Active Wars ({warCount})
              </span>
              <span className={warCount > 0 ? 'text-red-400' : 'text-green-400'}>
                {warCount > 0 ? `+${warCount * 20}% risk` : 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Policing Tactics */}
        <div className="card mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-game-text-primary">
              Policing Tactics
            </h3>
            <span className="text-sm text-game-text-secondary">
              {availableBrigades} brigade{availableBrigades !== 1 ? 's' : ''} available
            </span>
          </div>
          <div className="space-y-3">
            {(['none', 'soft', 'hard'] as PolicingTactic[]).map((tactic) => {
              const isSelected = currentTactic === tactic;
              const canSelect = PalestinianEngine.canSetPolicingTactic(game, tactic);
              const brigadesRequired = PalestinianEngine.getBrigadesRequired(tactic);
              const info = TACTIC_INFO[tactic];

              return (
                <button
                  key={tactic}
                  onClick={() => handleTacticSelect(tactic)}
                  disabled={!canSelect}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    isSelected
                      ? tactic === 'hard'
                        ? 'bg-red-900/50 border border-red-700'
                        : 'bg-game-accent'
                      : canSelect
                        ? 'bg-game-bg-dark hover:bg-gray-700'
                        : 'bg-game-bg-dark opacity-50 cursor-not-allowed'
                  } ${tactic === 'hard' && !isSelected ? 'border border-red-900' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      tactic === 'hard' ? 'text-red-400' :
                      isSelected ? 'text-white' : 'text-game-text-primary'
                    }`}>
                      {PalestinianEngine.getTacticName(tactic)}
                    </span>
                    {brigadesRequired > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        canSelect ? 'bg-blue-900/50 text-blue-400' : 'bg-red-900/50 text-red-400'
                      }`}>
                        {brigadesRequired} brigade
                      </span>
                    )}
                  </div>
                  <div className={`text-sm mt-1 ${
                    isSelected ? 'text-white text-opacity-80' : 'text-game-text-secondary'
                  }`}>
                    {info.desc}
                  </div>
                  {info.warning && (
                    <div className="text-xs text-red-400 mt-1">
                      {info.warning}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Knesset Pressure */}
        <div className="card">
          <h3 className="text-sm text-game-text-secondary mb-2">Knesset Pressure</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-game-bg-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${(knessetDisapproval / 10) * 100}%` }}
              />
            </div>
            <span className={`font-medium ${
              knessetDisapproval >= 8 ? 'text-red-400' :
              knessetDisapproval >= 5 ? 'text-yellow-400' :
              'text-game-text-primary'
            }`}>
              {knessetDisapproval.toFixed(1)}/10
            </span>
          </div>
          <p className="text-xs text-game-text-secondary mt-2">
            {knessetDisapproval >= 8
              ? 'CRITICAL: You are close to being removed from office!'
              : knessetDisapproval >= 5
                ? 'Warning: Parliament is growing restless.'
                : 'Reach 10 and you will be removed from office.'}
          </p>
        </div>

        {/* Phase Indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">
            Palestinian Phase
          </span>
        </div>
      </div>
    </GameLayout>
  );
}
