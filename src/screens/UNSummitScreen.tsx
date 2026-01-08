// ============================================
// UN Summit Screen - Annual Diplomatic Event
// ============================================
// December summit for international proposals

import { useNavigate } from 'react-router-dom';
import { Scanlines } from '../components/ui/Scanlines';
import { useGameStore } from '../store/gameStore';

export function UNSummitScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);
  const acceptPalestinianHomeland = useGameStore((state) => state.acceptPalestinianHomeland);
  const navigate = useNavigate();

  if (!game) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <Scanlines />
        <p className="font-mono text-retro-text-dim">No game in progress</p>
      </div>
    );
  }

  // Calculate US aid based on attitude
  const usAid = Math.max(0, 20 + game.player.usAttitude) * 1000000;
  const usAidM = Math.floor(usAid / 1000000);

  const handleLeaveSummit = () => {
    advancePhase();
    navigate('/game/news');
  };

  return (
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />

      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <div className="text-center">
          <div className="text-4xl mb-1">🇺🇳</div>
          <h1 className="font-pixel text-xl leading-none">UNITED NATIONS</h1>
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
            Annual Summit — December {game.year}
          </div>
        </div>
      </div>

      {/* Terminal-style display */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>DIPLOMATIC SESSION ACTIVE</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 animate-pulse" />
          NEW YORK
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* US Aid Package */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300 flex justify-between">
            <span>🇺🇸 US Foreign Aid Package</span>
            <span className="text-green-600">${usAidM}M</span>
          </div>
          <div className="font-mono text-[10px] text-gray-600">
            <p>Based on current US Relations: <span className={game.player.usAttitude >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {game.player.usAttitude >= 0 ? '+' : ''}{game.player.usAttitude}
            </span></p>
          </div>
          <div className="mt-2 p-2 bg-green-50 border border-green-300">
            <div className="font-mono text-[10px] text-green-700 text-center">
              Aid package will be added to your budget
            </div>
          </div>
        </div>

        {/* International Proposals */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-3 pb-1 border-b border-gray-300">
            International Proposals
          </div>

          <div className="space-y-3">
            {/* Palestinian Homeland */}
            {!game.player.palestinianHomeland && (
              <div className="p-3 border-2 border-gray-300">
                <div className="font-mono font-bold text-xs mb-1">PALESTINIAN HOMELAND</div>
                <div className="font-mono text-[10px] text-gray-600 mb-2">
                  Recognize Palestinian autonomy. +25 US attitude, +1 prestige.
                  Permanently resolves the Palestinian situation.
                </div>
                {game.player.usAttitude < 25 && (
                  <div className="p-2 mb-2 bg-yellow-50 border border-yellow-400 font-mono text-[9px] text-yellow-700">
                    Requires US attitude of 25+ (current: {game.player.usAttitude})
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={acceptPalestinianHomeland}
                    disabled={game.player.usAttitude < 25}
                    className="flex-1 py-2 font-mono font-bold text-[10px] border-2 border-green-600 bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5"
                  >
                    ACCEPT
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 font-mono font-bold text-[10px] border-2 border-red-600 bg-red-100 text-red-700 hover:bg-red-200 active:translate-x-0.5 active:translate-y-0.5"
                  >
                    REJECT
                  </button>
                </div>
              </div>
            )}

            {/* Army Limit */}
            {!game.player.armyLimitAgreement && (
              <div className="p-3 border-2 border-gray-300">
                <div className="font-mono font-bold text-xs mb-1">ARMY SIZE LIMITATION</div>
                <div className="font-mono text-[10px] text-gray-600 mb-2">
                  Cap military at current levels. +15 US attitude.
                  No new weapon purchases for 12 months.
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 py-2 font-mono font-bold text-[10px] border-2 border-green-600 bg-green-100 text-green-700 hover:bg-green-200 active:translate-x-0.5 active:translate-y-0.5"
                  >
                    ACCEPT
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 font-mono font-bold text-[10px] border-2 border-red-600 bg-red-100 text-red-700 hover:bg-red-200 active:translate-x-0.5 active:translate-y-0.5"
                  >
                    REJECT
                  </button>
                </div>
              </div>
            )}

            {/* Defense Budget */}
            <div className="p-3 border-2 border-gray-300">
              <div className="font-mono font-bold text-xs mb-1">DEFENSE BUDGET REDUCTION</div>
              <div className="font-mono text-[10px] text-gray-600 mb-2">
                Reduce defense spending by 5%. +5 US attitude.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 py-2 font-mono font-bold text-[10px] border-2 border-green-600 bg-green-100 text-green-700 hover:bg-green-200 active:translate-x-0.5 active:translate-y-0.5"
                >
                  ACCEPT
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 font-mono font-bold text-[10px] border-2 border-red-600 bg-red-100 text-red-700 hover:bg-red-200 active:translate-x-0.5 active:translate-y-0.5"
                >
                  REJECT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Already Accepted Agreements */}
        {(game.player.palestinianHomeland || game.player.armyLimitAgreement) && (
          <div className="bg-white border-2 border-black retro-shadow p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Active Agreements
            </div>

            {game.player.palestinianHomeland && (
              <div className="p-2 mb-2 border border-green-400 bg-green-50">
                <div className="font-mono text-[10px] text-green-700">
                  <span className="font-bold">PALESTINIAN HOMELAND</span> — Recognized
                </div>
              </div>
            )}

            {game.player.armyLimitAgreement && (
              <div className="p-2 border border-yellow-400 bg-yellow-50">
                <div className="font-mono text-[10px] text-yellow-700">
                  <span className="font-bold">ARMY LIMIT</span> — Active (purchases restricted)
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer with continue button */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={handleLeaveSummit}
          className="w-full py-3 font-mono font-bold text-sm uppercase border-2 border-black bg-blue-500 text-white retro-shadow-sm hover:bg-blue-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          END SUMMIT → JANUARY {game.year + 1}
        </button>
      </div>
    </div>
  );
}
