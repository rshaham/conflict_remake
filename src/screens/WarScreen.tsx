// ============================================
// War Screen - Active War Management
// ============================================
// War room with combat status and options

import { useNavigate } from 'react-router-dom';
import { Scanlines } from '../components/ui/Scanlines';
import { HatchedBar } from '../components/ui/HatchedBar';
import { FlagImage } from '../components/ui/FlagImage';
import { useGameStore } from '../store/gameStore';
import { CombatEngine } from '../engine/CombatEngine';
import { COUNTRY_NAMES } from '../utils/countryData';
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
  const progressPercent = ((war.progress + 10) / 20) * 100;

  // Determine who is winning
  const isWinning = isPlayerAttacker ? war.progress > 0 : war.progress < 0;
  const isLosing = isPlayerAttacker ? war.progress < 0 : war.progress > 0;

  return (
    <div className="bg-white border-2 border-red-600 retro-shadow-red p-3 mb-3">
      {/* War Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-dashed border-red-300">
        <div className="flex items-center gap-2">
          <FlagImage id={enemyId} size="lg" />
          <div>
            <div className="font-mono font-bold text-xs text-red-700">
              WAR: {COUNTRY_NAMES[enemyId].toUpperCase()}
            </div>
            <div className="font-mono text-[8px] text-gray-500">
              Turn {war.startTurn} - {isPlayerAttacker ? 'Israel attacked' : `${COUNTRY_NAMES[enemyId]} attacked`}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 border-2 font-mono text-[10px] font-bold ${
          isWinning
            ? 'border-green-600 bg-green-100 text-green-700'
            : isLosing
            ? 'border-red-600 bg-red-100 text-red-700'
            : 'border-yellow-600 bg-yellow-100 text-yellow-700'
        }`}>
          {isWinning ? 'WINNING' : isLosing ? 'LOSING' : 'STALEMATE'}
        </span>
      </div>

      {/* War Progress Bar */}
      <div className="mb-3">
        <div className="font-mono text-[8px] text-gray-500 mb-1">FRONT LINE STATUS</div>
        <div className="relative h-6 border-2 border-black bg-gray-100">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-10" />
          {/* Progress fill */}
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
            className="absolute top-0 bottom-0 w-1 bg-black z-20"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[8px] text-gray-500 mt-1">
          <span>{isPlayerAttacker ? 'RETREAT' : 'ADVANCE'}</span>
          <span>STALEMATE</span>
          <span>{isPlayerAttacker ? 'ADVANCE' : 'RETREAT'}</span>
        </div>
      </div>

      {/* Force Comparison */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 border border-green-400 bg-green-50">
          <div className="font-mono text-[9px] text-green-700 font-bold mb-1 flex items-center gap-1">
            <FlagImage id="israel" size="sm" /> ISRAEL FORCES
          </div>
          <div className="font-mono text-[8px] text-gray-600 space-y-0.5">
            <p>Tanks: {(playerArsenal.light_tank || 0) + (playerArsenal.main_battle_tank || 0)}</p>
            <p>Aircraft: {playerArsenal.fighter_aircraft || 0}</p>
            <p>SAM: {playerArsenal.sam_battery || 0}</p>
            <p>Helos: {(playerArsenal.anti_tank_helicopter || 0) + (playerArsenal.anti_sam_helicopter || 0)}</p>
          </div>
        </div>
        <div className="p-2 border border-red-400 bg-red-50">
          <div className="font-mono text-[9px] text-red-700 font-bold mb-1 flex items-center gap-1">
            <FlagImage id={enemyId} size="sm" /> {COUNTRY_NAMES[enemyId].toUpperCase()}
          </div>
          <div className="font-mono text-[8px] text-gray-600">
            <p>Military Strength: {enemyStrength}</p>
          </div>
        </div>
      </div>

      {/* Losses */}
      {(Object.keys(war.attackerLosses).length > 0 || Object.keys(war.defenderLosses).length > 0) && (
        <div className="mb-3 p-2 border border-gray-300 bg-gray-50">
          <div className="font-mono text-[8px] text-gray-600 font-bold mb-1">CASUALTIES</div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[8px]">
            <div>
              <div className="text-green-700 mb-0.5">Israel:</div>
              {Object.entries(isPlayerAttacker ? war.attackerLosses : war.defenderLosses).map(
                ([weapon, count]) => (
                  <p key={weapon} className="text-gray-600">
                    {count}x {weapon.replace(/_/g, ' ')}
                  </p>
                )
              )}
            </div>
            <div>
              <div className="text-red-700 mb-0.5">{COUNTRY_NAMES[enemyId]}:</div>
              {Object.entries(isPlayerAttacker ? war.defenderLosses : war.attackerLosses).map(
                ([weapon, count]) => (
                  <p key={weapon} className="text-gray-600">
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
          onClick={() => onCeasefire(war.id)}
          className="w-full py-2 font-mono font-bold text-[10px] border-2 border-black bg-white retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          OFFER CEASEFIRE
        </button>
        {hasNukes && (
          <button
            type="button"
            onClick={() => onNuclearStrike(enemyId)}
            className="w-full py-2 font-mono font-bold text-[10px] border-2 border-red-600 bg-red-100 text-red-700 hover:bg-red-200 active:translate-x-0.5 active:translate-y-0.5"
          >
            ☢️ LAUNCH NUCLEAR STRIKE
          </button>
        )}
      </div>
    </div>
  );
}

export function WarScreen() {
  const navigate = useNavigate();
  const { game, offerCeasefire, launchNuclearStrike } = useGameStore();

  if (!game) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <Scanlines />
        <p className="font-mono text-retro-text-dim">No game in progress</p>
      </div>
    );
  }

  const activeWars = game.wars;
  const hasNukes = CombatEngine.hasNuclearCapability(game);

  if (activeWars.length === 0) {
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
            <h1 className="font-pixel text-lg leading-none">WAR ROOM</h1>
            <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">Combat Operations</div>
          </div>
        </div>

        {/* No wars content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-6xl mb-4">☮️</div>
          <div className="font-pixel text-xl text-gray-700 mb-2">NO ACTIVE WARS</div>
          <div className="font-mono text-[10px] text-gray-500 text-center max-w-xs">
            Israel is currently at peace with all nations.
            Use diplomacy to maintain relations or prepare for conflict.
          </div>
          {hasNukes && (
            <div className="mt-4 px-3 py-1 border-2 border-yellow-600 bg-yellow-50 font-mono text-[10px] text-yellow-700">
              ☢️ NUCLEAR DETERRENT: ACTIVE
            </div>
          )}
        </div>
      </div>
    );
  }

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
          <h1 className="font-pixel text-lg leading-none text-red-700">WAR ROOM</h1>
          <div className="font-mono text-[8px] text-red-500 uppercase tracking-wider">Combat Operations Active</div>
        </div>
      </div>

      {/* Terminal status */}
      <div className="shrink-0 px-3 py-2 bg-black text-red-500 font-mono text-[10px] flex justify-between items-center">
        <span>⚔️ {activeWars.length} ACTIVE WAR{activeWars.length > 1 ? 'S' : ''}</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 animate-pulse" />
          COMBAT ALERT
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Active Wars */}
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
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Israeli Forces Summary
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 border border-gray-300 bg-gray-50">
              <div className="font-mono text-lg font-bold">
                {(game.player.arsenal.light_tank || 0) + (game.player.arsenal.main_battle_tank || 0)}
              </div>
              <div className="font-mono text-[8px] text-gray-500">TANKS</div>
            </div>
            <div className="p-2 border border-gray-300 bg-gray-50">
              <div className="font-mono text-lg font-bold">
                {game.player.arsenal.fighter_aircraft || 0}
              </div>
              <div className="font-mono text-[8px] text-gray-500">AIRCRAFT</div>
            </div>
            <div className="p-2 border border-gray-300 bg-gray-50">
              <div className="font-mono text-lg font-bold">
                {game.player.arsenal.infantry_brigade || 0}
              </div>
              <div className="font-mono text-[8px] text-gray-500">BRIGADES</div>
            </div>
          </div>
        </div>

        {/* Combat Readiness */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <HatchedBar
            value={Math.min(100, Object.values(game.player.arsenal).reduce((a, b) => a + b, 0) * 2)}
            label="COMBAT READINESS"
            showDanger={true}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <div className="font-mono text-[9px] text-center text-red-600 uppercase font-bold">
          War Resolution — Combat resolves at end of turn
        </div>
      </div>
    </div>
  );
}
