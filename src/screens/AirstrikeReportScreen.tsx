// ============================================
// Airstrike Report Screen - Show airstrike results
// ============================================

import { GameLayout } from '../components/game/GameLayout';
import { useGameStore } from '../store/gameStore';
import { FlagImage } from '../components/ui/FlagImage';
import { COUNTRY_NAMES } from '../utils/countryData';

export function AirstrikeReportScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);

  if (!game || !game.lastTurnResults) {
    return (
      <GameLayout hideArsenal>
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-gray-500">No results to display</p>
        </div>
      </GameLayout>
    );
  }

  const { airstrikes } = game.lastTurnResults;

  return (
    <GameLayout hideArsenal>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-xl">AIRSTRIKE REPORT</h1>
        <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">
          Operation Results
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {airstrikes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✈️</div>
            <p className="font-mono text-gray-500">No airstrikes conducted this turn</p>
          </div>
        ) : (
          airstrikes.map((strike, index) => (
            <div
              key={index}
              className={`border-2 p-3 ${
                strike.success
                  ? 'border-green-600 bg-green-50'
                  : 'border-red-600 bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <FlagImage id={strike.target} size="lg" />
                <div>
                  <div className="font-mono font-bold text-xs">
                    TARGET: {COUNTRY_NAMES[strike.target].toUpperCase()}
                  </div>
                  <div className="font-mono text-[10px] text-gray-600 uppercase">
                    {strike.type} Installation
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-400 pt-2 mt-2">
                <div className={`font-mono font-bold text-sm ${
                  strike.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {strike.success ? '✓ SUCCESS' : '✗ FAILED'}
                </div>
                <p className="font-mono text-[10px] text-gray-700 mt-1">
                  {strike.damage}
                </p>
                {strike.fightersLost > 0 && (
                  <p className="font-mono text-[10px] text-red-600 mt-1">
                    Aircraft Lost: {strike.fightersLost} of {strike.fightersUsed} fighters
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={() => advancePhase()}
          className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          CONTINUE
        </button>
      </div>
    </GameLayout>
  );
}
