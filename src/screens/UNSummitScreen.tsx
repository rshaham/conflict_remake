// ============================================
// UN Summit Screen - Annual Diplomatic Event
// ============================================

import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { useGameStore } from '../store/gameStore';

export function UNSummitScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);
  const acceptPalestinianHomeland = useGameStore((state) => state.acceptPalestinianHomeland);
  const navigate = useNavigate();

  if (!game) {
    return (
      <GameLayout showActionBar={false}>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  // Calculate US aid based on attitude
  const usAid = Math.max(0, 20 + game.player.usAttitude) * 1000000;

  const handleLeaveSummit = () => {
    advancePhase();
    navigate('/game/news');
  };

  return (
    <GameLayout showActionBar={false}>
      <div className="p-4 pb-24">
        {/* UN Header */}
        <div className="card mb-4 text-center">
          <div className="text-4xl mb-2">{'\u{1F1FA}\u{1F1F3}'}</div>
          <h2 className="text-xl font-bold text-game-text-primary">
            United Nations Summit
          </h2>
          <p className="text-sm text-game-text-secondary">
            December {game.year}
          </p>
        </div>

        {/* US Aid */}
        <div className="card mb-4">
          <h3 className="text-sm text-game-text-secondary mb-2">
            US Foreign Aid Package
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-game-text-primary">
                Based on US Relations ({game.player.usAttitude >= 0 ? '+' : ''}{game.player.usAttitude})
              </span>
            </div>
            <span className="text-green-400 font-bold text-lg">
              ${(usAid / 1000000).toFixed(0)}M
            </span>
          </div>
        </div>

        {/* Proposals */}
        <h3 className="text-lg font-bold text-game-text-primary mb-3">
          International Proposals
        </h3>

        <div className="space-y-3">
          {/* Palestinian Homeland */}
          {!game.player.palestinianHomeland && (
            <div className="card">
              <h4 className="font-medium text-game-text-primary mb-1">
                Palestinian Homeland
              </h4>
              <p className="text-sm text-game-text-secondary mb-2">
                Recognize Palestinian autonomy. +25 US attitude, +1 prestige.
                Permanently resolves the Palestinian situation.
              </p>
              {game.player.usAttitude < 25 && (
                <p className="text-xs text-yellow-400 mb-3">
                  Requires US attitude of 25+ (current: {game.player.usAttitude})
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={acceptPalestinianHomeland}
                  disabled={game.player.usAttitude < 25}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept
                </button>
                <button type="button" className="btn-secondary flex-1">Reject</button>
              </div>
            </div>
          )}

          {/* Army Limit */}
          {!game.player.armyLimitAgreement && (
            <div className="card">
              <h4 className="font-medium text-game-text-primary mb-1">
                Army Size Limitation
              </h4>
              <p className="text-sm text-game-text-secondary mb-3">
                Cap military at current levels. +15 US attitude.
                No new weapon purchases for 12 months.
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn-primary flex-1">Accept</button>
                <button type="button" className="btn-secondary flex-1">Reject</button>
              </div>
            </div>
          )}

          {/* Defense Budget */}
          <div className="card">
            <h4 className="font-medium text-game-text-primary mb-1">
              Defense Budget Reduction
            </h4>
            <p className="text-sm text-game-text-secondary mb-3">
              Reduce defense spending by 5%. +5 US attitude.
            </p>
            <div className="flex gap-2">
              <button type="button" className="btn-primary flex-1">Accept</button>
              <button type="button" className="btn-secondary flex-1">Reject</button>
            </div>
          </div>

          {/* Already accepted agreements */}
          {game.player.palestinianHomeland && (
            <div className="card bg-green-900/20 border-green-800">
              <h4 className="font-medium text-green-400 mb-1">
                Palestinian Homeland - Recognized
              </h4>
              <p className="text-sm text-game-text-secondary">
                You have already recognized Palestinian autonomy.
              </p>
            </div>
          )}

          {game.player.armyLimitAgreement && (
            <div className="card bg-yellow-900/20 border-yellow-800">
              <h4 className="font-medium text-yellow-400 mb-1">
                Army Limit Agreement - Active
              </h4>
              <p className="text-sm text-game-text-secondary">
                Weapon purchases are restricted.
              </p>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleLeaveSummit}
            className="btn-primary w-full py-3 text-lg"
          >
            End Summit & Continue to January {game.year + 1}
          </button>
        </div>

        {/* Phase Indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
            UN Summit Phase
          </span>
        </div>
      </div>
    </GameLayout>
  );
}
