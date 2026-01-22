// ============================================
// Force Comparison - Shows forces with counter relationships
// ============================================
// Modal component for analyzing combat strength before war

import { useGameStore } from '../../store/gameStore';
import { COUNTRY_NAMES } from '../../utils/countryData';
import { FlagImage } from '../ui/FlagImage';
import type { CountryId, WeaponId } from '../../types/game';

interface ForceComparisonProps {
  enemyId: CountryId;
  isOpen: boolean;
  onClose: () => void;
}

const COMBAT_PHASES = [
  {
    name: 'Air Superiority',
    playerUnits: ['fighter_aircraft', 'sam_battery'] as WeaponId[],
    counters: ['SAM counters Fighters & Helicopters', 'Fighters counter Helicopters'],
  },
  {
    name: 'Air Defense Suppression',
    playerUnits: ['anti_sam_helicopter'] as WeaponId[],
    counters: ['SEAD Helicopter counters SAM'],
  },
  {
    name: 'Close Air Support',
    playerUnits: ['anti_tank_helicopter', 'fighter_aircraft'] as WeaponId[],
    counters: ['AT Helicopter counters Tanks', 'Fighters provide support'],
  },
  {
    name: 'Ground Battle',
    playerUnits: ['main_battle_tank', 'light_tank', 'infantry_brigade'] as WeaponId[],
    counters: ['MBT counters Light Tank', 'Infantry holds ground'],
  },
];

const UNIT_NAMES: Record<string, string> = {
  fighter_aircraft: 'Fighters',
  sam_battery: 'SAM',
  anti_sam_helicopter: 'SEAD Helo',
  anti_tank_helicopter: 'AT Helo',
  main_battle_tank: 'MBT',
  light_tank: 'Light Tank',
  infantry_brigade: 'Infantry',
};

export function ForceComparison({ enemyId, isOpen, onClose }: ForceComparisonProps) {
  const game = useGameStore((state) => state.game);

  if (!isOpen || !game) return null;

  const enemy = game.countries[enemyId];
  const { arsenal } = game.player;

  // Calculate total player strength
  const playerStrength = Object.entries(arsenal).reduce(
    (sum, [_, count]) => sum + (count || 0) * 2,
    0
  );
  const enemyStrength = enemy.militaryStrength;
  const ratio = playerStrength / Math.max(1, enemyStrength);

  let assessment = '';
  let assessmentColor = '';
  if (ratio > 1.5) {
    assessment = 'FAVORABLE';
    assessmentColor = 'text-green-700';
  } else if (ratio > 0.8) {
    assessment = 'EVEN';
    assessmentColor = 'text-yellow-700';
  } else {
    assessment = 'UNFAVORABLE';
    assessmentColor = 'text-red-700';
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-4 bg-white border-4 border-black z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-black p-3 flex justify-between items-center">
          <div>
            <h2 className="font-pixel text-lg">FORCE COMPARISON</h2>
            <div className="font-mono text-[10px] text-gray-500">
              Israel vs {COUNTRY_NAMES[enemyId]}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white font-mono font-bold hover:bg-gray-100"
          >
            X
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Combat Phases */}
          {COMBAT_PHASES.map((phase) => (
            <div key={phase.name} className="border-2 border-black p-3">
              <div className="font-mono font-bold text-[10px] uppercase mb-2 pb-1 border-b border-gray-300">
                {phase.name}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="font-mono text-[8px] text-green-700 font-bold mb-1 flex items-center gap-1">
                    <FlagImage id="israel" size="sm" /> ISRAEL
                  </div>
                  {phase.playerUnits.map((unit) => (
                    <div key={unit} className="font-mono text-[10px]">
                      {UNIT_NAMES[unit]}: {arsenal[unit] || 0}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-mono text-[8px] text-red-700 font-bold mb-1 flex items-center gap-1">
                    <FlagImage id={enemyId} size="sm" /> {COUNTRY_NAMES[enemyId].toUpperCase()}
                  </div>
                  <div className="font-mono text-[10px] text-gray-600">
                    Est. Strength: ~{Math.round(enemyStrength * 0.25)}
                  </div>
                </div>
              </div>

              <div className="text-[9px] font-mono text-gray-500 border-t border-dashed border-gray-300 pt-1">
                {phase.counters.map((counter, i) => (
                  <div key={i}>* {counter}</div>
                ))}
              </div>
            </div>
          ))}

          {/* Overall Assessment */}
          <div className="border-2 border-black p-3 bg-gray-50">
            <div className="font-mono font-bold text-[10px] uppercase mb-2">
              Combat Assessment
            </div>
            <div className={`font-mono font-bold text-lg ${assessmentColor}`}>
              {assessment}
            </div>
            <div className="h-3 bg-gray-200 border border-black mt-2">
              <div
                className={`h-full ${ratio > 1 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, ratio * 50)}%` }}
              />
            </div>
            <div className="font-mono text-[9px] text-gray-600 mt-2">
              {ratio > 1.5
                ? 'You have a significant advantage. Victory likely with minimal losses.'
                : ratio > 0.8
                ? 'Forces are evenly matched. Expect a prolonged conflict with heavy casualties.'
                : 'Enemy has superior forces. Consider building up before engaging.'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
