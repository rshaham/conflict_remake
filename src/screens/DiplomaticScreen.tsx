// ============================================
// Diplomatic Screen - Retro Style
// ============================================

import { Panel } from '../components/ui/Panel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StabilityBar } from '../components/ui/HatchedBar';
import { LeaderPortrait } from '../components/ui/GameImage';
import { FlagImage } from '../components/ui/FlagImage';
import { GameShell } from '../components/layout/GameShell';
import { useGameStore } from '../store/gameStore';
import { COUNTRY_NAMES, COUNTRY_CODES } from '../utils/countryData';
import type { CountryId, CountryState, DiplomaticAction } from '../types/game';

// The four neighboring countries (primary focus)
const NEIGHBOR_COUNTRIES: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

// Other countries in the region
const OTHER_COUNTRIES: CountryId[] = ['iraq', 'iran', 'libya'];

interface RetroCountryCardProps {
  country: CountryState;
  currentAction?: DiplomaticAction;
  onActionChange: (countryId: CountryId, action: DiplomaticAction) => void;
}

function RetroCountryCard({ country, currentAction, onActionChange }: RetroCountryCardProps) {
  const isDefeated = country.isDefeated;
  const isAtWar = country.relationship === 'war';
  const countryCode = COUNTRY_CODES[country.id] || country.id.toUpperCase().slice(0, 3);

  return (
    <div className="bg-white border-2 border-black retro-shadow relative">
      {/* Floppy label */}
      <div className="bg-black text-white text-[8px] font-mono font-bold px-2 py-0.5 absolute -top-2.5 left-3 uppercase">
        REF: {countryCode}-97
      </div>

      <div className="p-4 pt-5">
        {/* Header row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <FlagImage id={country.id} size="lg" />
            <h3 className="font-pixel text-2xl">{COUNTRY_NAMES[country.id]}</h3>
          </div>
          <StatusBadge status={country.relationship} defeated={isDefeated} />
        </div>

        {/* Leader */}
        <div className="flex items-center gap-2 mb-3">
          <LeaderPortrait
            leaderId={`leader_${country.id}`}
            leaderName={country.leader.name}
            countryId={country.id}
            size="sm"
          />
          <div className="font-mono text-[9px] text-gray-500">
            LEADER: {country.leader.name.toUpperCase()}
          </div>
        </div>

        {/* Stability bar */}
        <StabilityBar stability={country.stability} className="mb-3" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="border-2 border-black p-2 bg-gray-50">
            <div className="font-mono text-[8px] text-gray-500 font-bold">STANCE</div>
            <div className="font-mono text-xs font-bold uppercase">{country.stance}</div>
          </div>
          <div className="border-2 border-black p-2 bg-gray-50">
            <div className="font-mono text-[8px] text-gray-500 font-bold">NUCLEAR</div>
            <div className={`font-mono text-xs font-bold uppercase ${
              country.nuclearStage !== 'none' ? 'text-orange-600' : 'text-gray-400'
            }`}>
              {country.nuclearStage === 'none' ? 'NONE' : country.nuclearStage}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isDefeated && !isAtWar && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t-2 border-dashed border-black">
            <button
              type="button"
              onClick={() => onActionChange(country.id, 'improve')}
              className={`px-2 py-2 font-mono font-bold text-[9px] uppercase border-2 border-black transition-all ${
                currentAction === 'improve'
                  ? 'bg-green-600 text-white'
                  : 'bg-white hover:bg-green-50'
              }`}
            >
              IMPROVE
            </button>
            <button
              type="button"
              onClick={() => onActionChange(country.id, 'maintain')}
              className={`px-2 py-2 font-mono font-bold text-[9px] uppercase border-2 border-black transition-all ${
                currentAction === 'maintain'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-blue-50'
              }`}
            >
              MAINTAIN
            </button>
            <button
              type="button"
              onClick={() => onActionChange(country.id, 'worsen')}
              className={`px-2 py-2 font-mono font-bold text-[9px] uppercase border-2 border-black transition-all ${
                currentAction === 'worsen'
                  ? 'bg-red-600 text-white'
                  : 'bg-white hover:bg-red-50'
              }`}
            >
              WORSEN
            </button>
          </div>
        )}

        {/* War Status */}
        {isAtWar && (
          <div className="mt-3 p-2 bg-red-100 border-2 border-red-600 text-center">
            <span className="text-red-800 font-mono font-bold text-xs uppercase">AT WAR</span>
          </div>
        )}

        {/* Defeated Status */}
        {isDefeated && (
          <div className="mt-3 p-2 bg-gray-100 border-2 border-gray-400 text-center">
            <span className="text-gray-600 font-mono text-[10px]">
              DEFEATED TURN {country.defeatedOnTurn}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function DiplomaticScreen() {
  const { game, setDiplomaticAction } = useGameStore();

  if (!game) {
    return null;
  }

  const diplomaticActions = game.player.turnActions.diplomaticActions;

  const handleActionChange = (countryId: CountryId, action: DiplomaticAction) => {
    setDiplomaticAction(countryId, action);
  };

  return (
    <GameShell>
      {/* Legend */}
      <div className="px-3 py-2 bg-gray-100 border-b-2 border-black flex gap-3 font-mono text-[8px]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-600" /> FRIENDLY
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-600" /> HOSTILE
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-500" /> TENSE
        </span>
      </div>

      {/* Country list */}
      <div className="p-3 space-y-4">
        {/* Neighboring Countries */}
        <div className="font-mono text-[9px] font-bold text-gray-500 uppercase mb-2">
          NEIGHBORING COUNTRIES
        </div>
        {NEIGHBOR_COUNTRIES.map((countryId) => {
          const country = game.countries[countryId];
          return (
            <RetroCountryCard
              key={countryId}
              country={country}
              currentAction={diplomaticActions[countryId]}
              onActionChange={handleActionChange}
            />
          );
        })}

        {/* Regional Powers */}
        <div className="font-mono text-[9px] font-bold text-gray-500 uppercase mt-6 mb-2">
          REGIONAL POWERS
        </div>
        {OTHER_COUNTRIES.map((countryId) => {
          const country = game.countries[countryId];
          return (
            <RetroCountryCard
              key={countryId}
              country={country}
              currentAction={diplomaticActions[countryId]}
              onActionChange={handleActionChange}
            />
          );
        })}

        {/* Victory Progress */}
        <Panel className="p-3 mt-4">
          <div className="font-mono font-bold text-[10px] border-b-2 border-black pb-2 mb-3">
            VICTORY PROGRESS
          </div>
          <div className="flex items-center gap-2">
            {NEIGHBOR_COUNTRIES.map((countryId) => {
              const country = game.countries[countryId];
              const code = COUNTRY_CODES[countryId] || countryId.toUpperCase().slice(0, 3);
              return (
                <div
                  key={countryId}
                  className={`flex-1 h-8 border-2 border-black flex items-center justify-center text-[10px] font-mono font-bold ${
                    country.isDefeated
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {code}
                </div>
              );
            })}
          </div>
          <p className="font-mono text-[8px] text-gray-500 mt-2 text-center uppercase">
            Defeat all 4 neighbors to achieve victory
          </p>
        </Panel>
      </div>
    </GameShell>
  );
}
