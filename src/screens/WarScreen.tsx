// ============================================
// War Screen - Active War Management
// ============================================

import { GameLayout } from '../components/layout/GameLayout';
import { useGameStore } from '../store/gameStore';
import { CombatEngine } from '../engine/CombatEngine';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../utils/countryData';
import type { CountryId, War } from '../types/game';

interface WarCardProps {
  war: War;
  playerArsenal: Record<string, number>;
  enemyStrength: number;
  onCeasefire: (warId: string) => void;
  onNuclearStrike: (target: CountryId) => void;
  hasNukes: boolean;
}

function WarCard({
  war,
  playerArsenal,
  enemyStrength,
  onCeasefire,
  onNuclearStrike,
  hasNukes,
}: WarCardProps) {
  const isPlayerAttacker = war.attacker === 'israel';
  const enemyId = isPlayerAttacker ? war.defender : war.attacker;

  // Calculate progress position (progress is -10 to +10)
  // Positive = attacker winning, negative = defender winning
  const progressPercent = ((war.progress + 10) / 20) * 100;

  // Determine who is winning
  const isWinning = isPlayerAttacker ? war.progress > 0 : war.progress < 0;
  const isLosing = isPlayerAttacker ? war.progress < 0 : war.progress > 0;

  return (
    <div className="card mb-4 border border-red-800">
      {/* War Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{COUNTRY_FLAGS[enemyId]}</span>
          <div>
            <h3 className="font-bold text-red-400">War with {COUNTRY_NAMES[enemyId]}</h3>
            <p className="text-xs text-game-text-secondary">
              Turn {war.startTurn} -{' '}
              {isPlayerAttacker ? 'Israel attacked' : `${COUNTRY_NAMES[enemyId]} attacked`}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            isWinning
              ? 'bg-green-600 text-white'
              : isLosing
              ? 'bg-red-600 text-white'
              : 'bg-yellow-600 text-white'
          }`}
        >
          {isWinning ? 'Winning' : isLosing ? 'Losing' : 'Stalemate'}
        </span>
      </div>

      {/* War Progress Bar */}
      <div className="mb-4">
        <div className="relative h-6 bg-game-bg-dark rounded-full overflow-hidden">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 z-10" />
          {/* Progress indicator */}
          <div
            className="absolute top-0 bottom-0 transition-all duration-300"
            style={{
              left: progressPercent < 50 ? `${progressPercent}%` : '50%',
              width: `${Math.abs(progressPercent - 50)}%`,
              backgroundColor: progressPercent > 50 ? '#22c55e' : '#ef4444',
            }}
          />
          {/* Progress marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white z-20"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-game-text-secondary mt-1">
          <span>{isPlayerAttacker ? 'Enemy Winning' : 'We Win'}</span>
          <span>Stalemate</span>
          <span>{isPlayerAttacker ? 'We Win' : 'Enemy Winning'}</span>
        </div>
      </div>

      {/* Force Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-900/20 p-3 rounded">
          <p className="text-green-400 font-bold text-sm mb-2">
            {COUNTRY_FLAGS.israel} Israel
          </p>
          <div className="text-xs space-y-1 text-game-text-secondary">
            <p>
              Tanks: {(playerArsenal.light_tank || 0) + (playerArsenal.main_battle_tank || 0)}
            </p>
            <p>Aircraft: {playerArsenal.fighter_aircraft || 0}</p>
            <p>SAM: {playerArsenal.sam_battery || 0}</p>
            <p>Helicopters: {(playerArsenal.anti_tank_helicopter || 0) + (playerArsenal.anti_sam_helicopter || 0)}</p>
          </div>
        </div>
        <div className="bg-red-900/20 p-3 rounded">
          <p className="text-red-400 font-bold text-sm mb-2">
            {COUNTRY_FLAGS[enemyId]} {COUNTRY_NAMES[enemyId]}
          </p>
          <div className="text-xs space-y-1 text-game-text-secondary">
            <p>Military Strength: {enemyStrength}</p>
          </div>
        </div>
      </div>

      {/* Losses */}
      {(Object.keys(war.attackerLosses).length > 0 ||
        Object.keys(war.defenderLosses).length > 0) && (
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <h4 className="text-xs font-semibold text-game-text-secondary uppercase mb-2">
            Casualties This War
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-green-400 mb-1">Israel Losses:</p>
              {Object.entries(isPlayerAttacker ? war.attackerLosses : war.defenderLosses).map(
                ([weapon, count]) => (
                  <p key={weapon} className="text-game-text-secondary">
                    {count}x {weapon.replace(/_/g, ' ')}
                  </p>
                )
              )}
            </div>
            <div>
              <p className="text-red-400 mb-1">{COUNTRY_NAMES[enemyId]} Losses:</p>
              {Object.entries(isPlayerAttacker ? war.defenderLosses : war.attackerLosses).map(
                ([weapon, count]) => (
                  <p key={weapon} className="text-game-text-secondary">
                    {count}x {weapon.replace(/_/g, ' ')}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* War Actions */}
      <div className="space-y-2">
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => onCeasefire(war.id)}
        >
          Offer Ceasefire
        </button>
        {hasNukes && (
          <button
            type="button"
            className="w-full py-2 px-4 rounded bg-red-900/50 border border-red-700 text-red-400 hover:bg-red-900 transition-colors"
            onClick={() => onNuclearStrike(enemyId)}
          >
            Launch Nuclear Strike
          </button>
        )}
      </div>
    </div>
  );
}

export function WarScreen() {
  const { game, offerCeasefire, launchNuclearStrike } = useGameStore();

  // If no game is loaded, show placeholder
  if (!game) {
    return (
      <GameLayout showActionBar={false}>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const activeWars = game.wars;
  const hasNukes = CombatEngine.hasNuclearCapability(game);

  if (activeWars.length === 0) {
    return (
      <GameLayout showActionBar={false}>
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">{'\u262E\uFE0F'}</div>
          <h2 className="text-xl font-bold text-game-text-primary mb-2">No Active Wars</h2>
          <p className="text-game-text-secondary text-center max-w-xs">
            Israel is currently at peace with all nations. Use diplomacy to maintain
            relations or prepare for conflict.
          </p>
          {hasNukes && (
            <p className="text-yellow-400 text-sm mt-4">
              Nuclear capability: Operational
            </p>
          )}
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="p-4 pb-24">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          {'\u2694\uFE0F'} Active Wars ({activeWars.length})
        </h2>

        {/* Active Wars List */}
        {activeWars.map((war) => {
          const enemyId = war.attacker === 'israel' ? war.defender : war.attacker;
          const enemyStrength = game.countries[enemyId].militaryStrength;

          return (
            <WarCard
              key={war.id}
              war={war}
              playerArsenal={game.player.arsenal}
              enemyStrength={enemyStrength}
              onCeasefire={offerCeasefire}
              onNuclearStrike={launchNuclearStrike}
              hasNukes={hasNukes}
            />
          );
        })}

        {/* Total Force Summary */}
        <div className="card bg-game-bg-dark">
          <h3 className="text-sm font-semibold text-game-text-secondary mb-3">
            Total Israeli Forces
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-800 rounded">
              <p className="text-lg font-bold text-game-text-primary">
                {(game.player.arsenal.light_tank || 0) +
                  (game.player.arsenal.main_battle_tank || 0)}
              </p>
              <p className="text-xs text-game-text-secondary">Tanks</p>
            </div>
            <div className="p-2 bg-gray-800 rounded">
              <p className="text-lg font-bold text-game-text-primary">
                {game.player.arsenal.fighter_aircraft || 0}
              </p>
              <p className="text-xs text-game-text-secondary">Aircraft</p>
            </div>
            <div className="p-2 bg-gray-800 rounded">
              <p className="text-lg font-bold text-game-text-primary">
                {game.player.arsenal.infantry_brigade || 0}
              </p>
              <p className="text-xs text-game-text-secondary">Brigades</p>
            </div>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-red-900/30 text-red-400 rounded text-xs">
            War Resolution Phase
          </span>
        </div>
      </div>
    </GameLayout>
  );
}
