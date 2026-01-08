// ============================================
// Territories Screen - Palestinian Situation
// ============================================
// Manage occupied territories and policing tactics
// Renamed from Palestinian for hub navigation

import { useNavigate } from 'react-router-dom';
import { Scanlines } from '../components/ui/Scanlines';
import { HatchedBar } from '../components/ui/HatchedBar';
import { useGameStore } from '../store/gameStore';
import { PalestinianEngine } from '../engine/PalestinianEngine';
import type { PolicingTactic } from '../types/game';

const PALESTINIAN_LEVELS = ['calm', 'unrest', 'protests', 'violence', 'intifada'] as const;

const LEVEL_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  calm: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-600' },
  unrest: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-600' },
  protests: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-600' },
  violence: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-600' },
  intifada: { bg: 'bg-red-200', text: 'text-red-800', border: 'border-red-800' },
};

const TACTIC_INFO: Record<PolicingTactic, { name: string; desc: string; warning?: string; icon: string }> = {
  none: {
    name: 'NO POLICING',
    desc: 'No active enforcement. Situation may escalate freely.',
    icon: '⚪',
  },
  soft: {
    name: 'SOFT POLICING',
    desc: 'Minimal force. Requires 1 brigade. 50% escalation reduction.',
    icon: '🛡️',
  },
  hard: {
    name: 'HARD POLICING',
    desc: 'Aggressive enforcement. Requires 1 brigade. Prevents escalation.',
    warning: '-5 US attitude and +1 violence points per month.',
    icon: '⚔️',
  },
};

export function PalestinianScreen() {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const setPolicingTactic = useGameStore((state) => state.setPolicingTactic);

  if (!game) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <Scanlines />
        <p className="font-mono text-retro-text-dim">No game in progress</p>
      </div>
    );
  }

  // Check if Palestinian homeland has been granted
  if (game.player.palestinianHomeland) {
    return (
      <div className="min-h-screen flex flex-col bg-retro-bg">
        <Scanlines />

        {/* Header */}
        <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/game/hub')}
            className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            ←
          </button>
          <div>
            <h1 className="font-pixel text-lg leading-none">TERRITORIES</h1>
            <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">Palestinian Issue</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3">
          <div className="bg-white border-2 border-green-600 retro-shadow p-6 text-center">
            <div className="text-6xl mb-4">🕊️</div>
            <div className="font-pixel text-xl text-green-700 mb-2">HOMELAND ESTABLISHED</div>
            <div className="font-mono text-[10px] text-gray-600">
              The Palestinian question has been resolved through the UN Summit.
              International recognition and US support have been secured.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLevel = game.player.palestinianLevel;
  const currentTactic = game.player.policingTactic;
  const knessetDisapproval = game.player.knessetDisapproval;

  // Calculate external factors
  const hostileCount = PalestinianEngine.countHostileNeighbors(game);
  const warCount = game.wars.length;
  const escalationRisk = PalestinianEngine.getEscalationRisk(game);

  // Calculate level index for display
  const levelIndex = PALESTINIAN_LEVELS.indexOf(currentLevel);
  const levelStyle = LEVEL_STYLES[currentLevel] || LEVEL_STYLES.calm;

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
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />

      {/* Header with back button */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/game/hub')}
          className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          ←
        </button>
        <div>
          <h1 className="font-pixel text-lg leading-none">TERRITORIES</h1>
          <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">Palestinian Issue</div>
        </div>
      </div>

      {/* Terminal-style status display */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>OCCUPIED TERRITORIES STATUS</span>
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 ${currentLevel === 'calm' ? 'bg-green-500' : currentLevel === 'intifada' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`} />
          {PalestinianEngine.getLevelName(currentLevel).toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Large Status Meter */}
        <div className="bg-white border-2 border-black retro-shadow p-4">
          <div className="text-center mb-3">
            <div className={`inline-block px-4 py-2 border-2 ${levelStyle.border} ${levelStyle.bg}`}>
              <div className={`font-pixel text-2xl ${levelStyle.text}`}>
                {PalestinianEngine.getLevelName(currentLevel).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Level Progress Indicator */}
          <div className="flex justify-between items-center gap-1 mb-2">
            {PALESTINIAN_LEVELS.map((level, idx) => {
              const isActive = idx === levelIndex;
              const isPast = idx < levelIndex;
              const style = LEVEL_STYLES[level];
              return (
                <div
                  key={level}
                  className={`flex-1 h-4 border-2 ${
                    isActive
                      ? `${style.border} ${style.bg}`
                      : isPast
                      ? `${style.border} ${style.bg} opacity-50`
                      : 'border-gray-300 bg-gray-100'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex justify-between font-mono text-[8px] text-gray-500">
            <span>CALM</span>
            <span>INTIFADA</span>
          </div>
        </div>

        {/* Escalation Risk */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300 flex justify-between">
            <span>Escalation Risk</span>
            <span className={`${
              escalationRisk === 0 ? 'text-green-600' :
              escalationRisk < 0.2 ? 'text-yellow-600' :
              escalationRisk < 0.4 ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {Math.round(escalationRisk * 100)}%
            </span>
          </div>
          <HatchedBar
            value={100 - Math.round(escalationRisk * 100)}
            label="STABILITY"
            showDanger={true}
          />
        </div>

        {/* External Factors */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            External Factors
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 border ${hostileCount > 0 ? 'border-yellow-400 bg-yellow-50' : 'border-green-400 bg-green-50'}`}>
              <div className="font-mono text-lg font-bold text-center">
                {hostileCount}
              </div>
              <div className="font-mono text-[8px] text-center text-gray-600">
                HOSTILE NEIGHBORS
              </div>
              {hostileCount > 0 && (
                <div className="font-mono text-[8px] text-center text-yellow-700">
                  +{hostileCount * 10}% risk
                </div>
              )}
            </div>
            <div className={`p-2 border ${warCount > 0 ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'}`}>
              <div className="font-mono text-lg font-bold text-center">
                {warCount}
              </div>
              <div className="font-mono text-[8px] text-center text-gray-600">
                ACTIVE WARS
              </div>
              {warCount > 0 && (
                <div className="font-mono text-[8px] text-center text-red-700">
                  +{warCount * 20}% risk
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Policing Tactics */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300 flex justify-between">
            <span>Policing Tactics</span>
            <span className="text-blue-600">{availableBrigades} BRIGADES FREE</span>
          </div>

          <div className="space-y-2">
            {(['none', 'soft', 'hard'] as PolicingTactic[]).map((tactic) => {
              const isSelected = currentTactic === tactic;
              const canSelect = PalestinianEngine.canSetPolicingTactic(game, tactic);
              const brigadesRequired = PalestinianEngine.getBrigadesRequired(tactic);
              const info = TACTIC_INFO[tactic];

              return (
                <button
                  key={tactic}
                  type="button"
                  onClick={() => handleTacticSelect(tactic)}
                  disabled={!canSelect}
                  className={`w-full p-3 border-2 text-left transition-all ${
                    isSelected
                      ? tactic === 'hard'
                        ? 'border-red-600 bg-red-50'
                        : 'border-black bg-gray-100 retro-shadow-sm'
                      : canSelect
                        ? 'border-gray-300 bg-white hover:border-gray-500'
                        : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{info.icon}</span>
                      <span className={`font-mono font-bold text-xs ${
                        tactic === 'hard' ? 'text-red-700' : ''
                      }`}>
                        {info.name}
                      </span>
                    </div>
                    {brigadesRequired > 0 && (
                      <span className={`font-mono text-[9px] px-2 py-0.5 border ${
                        canSelect
                          ? 'border-blue-400 bg-blue-50 text-blue-700'
                          : 'border-red-400 bg-red-50 text-red-700'
                      }`}>
                        {brigadesRequired} BRIGADE
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] text-gray-600 ml-8">
                    {info.desc}
                  </div>
                  {info.warning && (
                    <div className="font-mono text-[9px] text-red-600 ml-8 mt-1">
                      ⚠ {info.warning}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Knesset Pressure */}
        <div className={`bg-white border-2 ${knessetDisapproval >= 8 ? 'border-red-600' : 'border-black'} retro-shadow p-3`}>
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300 flex justify-between">
            <span>Knesset Pressure</span>
            <span className={`${
              knessetDisapproval >= 8 ? 'text-red-600' :
              knessetDisapproval >= 5 ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {knessetDisapproval.toFixed(1)} / 10
            </span>
          </div>

          <HatchedBar
            value={100 - (knessetDisapproval * 10)}
            label="COALITION STABILITY"
            showDanger={true}
          />

          <div className={`mt-2 p-2 font-mono text-[10px] ${
            knessetDisapproval >= 8
              ? 'bg-red-100 border border-red-400 text-red-700'
              : knessetDisapproval >= 5
              ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              : 'bg-gray-100 border border-gray-300 text-gray-600'
          }`}>
            {knessetDisapproval >= 8
              ? '⚠ CRITICAL: Coalition on verge of collapse!'
              : knessetDisapproval >= 5
              ? '⚠ WARNING: Parliament growing restless'
              : 'Reach 10 points and you will be removed from office'}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <div className="font-mono text-[9px] text-center text-gray-500 uppercase">
          Territories Phase — Policing applied at end of turn
        </div>
      </div>
    </div>
  );
}
