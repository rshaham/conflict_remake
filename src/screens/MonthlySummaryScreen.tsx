// ============================================
// Monthly Summary Screen - Turn resolution summary
// ============================================

import { GameLayout } from '../components/game/GameLayout';
import { useGameStore } from '../store/gameStore';
import { COUNTRY_NAMES } from '../utils/countryData';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function MonthlySummaryScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);

  if (!game) {
    return (
      <GameLayout hideArsenal>
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-gray-500">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const results = game.lastTurnResults;
  const monthName = MONTH_NAMES[game.month - 1];

  return (
    <GameLayout hideArsenal>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-xl">MONTHLY SUMMARY</h1>
        <div className="font-mono text-[10px] text-gray-500">
          {monthName} {game.year}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Treasury */}
        {results?.economy && (
          <div className="border-2 border-black bg-white p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Treasury
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Starting:</span>
                <span>${Math.floor(results.economy.startingBudget / 1000000)}M</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Income:</span>
                <span>+${Math.floor(results.economy.income / 1000000)}M</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Expenses:</span>
                <span>-${Math.floor(results.economy.expenses / 1000000)}M</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                <span>Ending:</span>
                <span className="text-green-700">${Math.floor(results.economy.endingBudget / 1000000)}M</span>
              </div>
            </div>
          </div>
        )}

        {/* Diplomatic Shifts */}
        {results?.diplomaticShifts && results.diplomaticShifts.length > 0 && (
          <div className="border-2 border-black bg-white p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Diplomatic Shifts
            </div>
            <div className="space-y-1">
              {results.diplomaticShifts.map((shift) => (
                <div key={shift.country} className="font-mono text-[11px] flex justify-between">
                  <span>{COUNTRY_NAMES[shift.country]}:</span>
                  <span>
                    <span className="text-gray-500">{shift.from}</span>
                    {' -> '}
                    <span className={shift.to === 'war' ? 'text-red-600 font-bold' : ''}>
                      {shift.to}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Overview */}
        <div className="border-2 border-black bg-white p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Status Overview
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">US ATTITUDE</div>
              <div className={`font-mono font-bold ${
                game.player.usAttitude >= 0 ? 'text-green-700' : 'text-red-600'
              }`}>
                {game.player.usAttitude > 0 ? '+' : ''}{game.player.usAttitude}
              </div>
            </div>
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">PRESTIGE</div>
              <div className="font-mono font-bold">{game.player.prestige}</div>
            </div>
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">KNESSET</div>
              <div className={`font-mono font-bold ${
                game.player.knessetDisapproval >= 7 ? 'text-red-600' : ''
              }`}>
                {game.player.knessetDisapproval}/10 disapproval
              </div>
            </div>
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">PALESTINIAN</div>
              <div className="font-mono font-bold capitalize">{game.player.palestinianLevel}</div>
            </div>
          </div>
        </div>

        {/* Active Wars */}
        {game.wars.length > 0 && (
          <div className="border-2 border-red-600 bg-red-50 p-3">
            <div className="font-mono font-bold text-xs uppercase text-red-700 mb-2">
              Active Wars: {game.wars.length}
            </div>
            {game.wars.map((war) => {
              const enemy = war.attacker === 'israel' ? war.defender : war.attacker;
              return (
                <div key={war.id} className="font-mono text-[11px]">
                  {COUNTRY_NAMES[enemy]} - Progress: {war.progress}/10
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={() => advancePhase()}
          className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          {game.month === 12 ? 'CONTINUE -> UN SUMMIT' : 'CONTINUE -> NEXT MONTH'}
        </button>
      </div>
    </GameLayout>
  );
}
