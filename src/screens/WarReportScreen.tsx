// ============================================
// War Report Screen - Show war combat results
// ============================================

import { GameLayout } from '../components/game/GameLayout';
import { useGameStore } from '../store/gameStore';
import { FlagImage } from '../components/ui/FlagImage';
import { COUNTRY_NAMES } from '../utils/countryData';

export function WarReportScreen() {
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

  const { wars } = game.lastTurnResults;

  return (
    <GameLayout hideArsenal>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-xl text-red-700">WAR REPORT</h1>
        <div className="font-mono text-[8px] text-red-500 uppercase tracking-wider">
          Combat Results
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {wars.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">Peace</div>
            <p className="font-mono text-gray-500">No active military operations</p>
          </div>
        ) : (
          wars.map((war) => (
            <div
              key={war.warId}
              className="border-2 border-red-600 bg-white p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FlagImage id={war.enemy} size="lg" />
                  <div className="font-mono font-bold text-xs">
                    {COUNTRY_NAMES[war.enemy].toUpperCase()} FRONT
                  </div>
                </div>
                <span className={`px-2 py-1 font-mono text-[10px] font-bold border-2 ${
                  war.outcome === 'victory'
                    ? 'border-green-600 bg-green-100 text-green-700'
                    : war.outcome === 'defeat'
                    ? 'border-red-600 bg-red-100 text-red-700'
                    : war.progressChange > 0
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : war.progressChange < 0
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-yellow-600 bg-yellow-50 text-yellow-700'
                }`}>
                  {war.outcome === 'victory' ? 'VICTORY!' :
                   war.outcome === 'defeat' ? 'DEFEAT' :
                   war.progressChange > 0 ? 'ADVANCING' :
                   war.progressChange < 0 ? 'RETREATING' : 'STALEMATE'}
                </span>
              </div>

              {/* Progress Bar - only for ongoing wars */}
              {war.outcome === 'ongoing' && (
                <div className="mb-3">
                  <div className="font-mono text-[8px] text-gray-500 mb-1">FRONT LINE</div>
                  <div className="relative h-4 border-2 border-black bg-gray-100">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-10" />
                    <div
                      className="absolute top-0 bottom-0 transition-all"
                      style={{
                        left: ((war.newProgress + 10) / 20) * 100 < 50
                          ? `${((war.newProgress + 10) / 20) * 100}%`
                          : '50%',
                        width: `${Math.abs(((war.newProgress + 10) / 20) * 100 - 50)}%`,
                        backgroundColor: war.newProgress > 0 ? '#22c55e' : '#ef4444',
                      }}
                    />
                  </div>
                  <div className="font-mono text-[10px] text-center mt-1">
                    {war.progressChange > 0 ? '+' : ''}{war.progressChange} this turn
                  </div>
                </div>
              )}

              {/* Losses */}
              <div className="grid grid-cols-2 gap-2 border-t border-dashed border-gray-400 pt-2">
                <div>
                  <div className="font-mono text-[8px] text-green-700 font-bold mb-1">YOUR LOSSES</div>
                  {Object.entries(war.playerLosses).length > 0 ? (
                    Object.entries(war.playerLosses).map(([weapon, count]) => (
                      <div key={weapon} className="font-mono text-[9px] text-gray-600">
                        {count}x {weapon.replace(/_/g, ' ')}
                      </div>
                    ))
                  ) : (
                    <div className="font-mono text-[9px] text-gray-400">None</div>
                  )}
                </div>
                <div>
                  <div className="font-mono text-[8px] text-red-700 font-bold mb-1">ENEMY DAMAGE</div>
                  <div className="font-mono text-[9px] text-gray-600">
                    ~{Math.round(war.enemyDamage)} strength destroyed
                  </div>
                </div>
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
