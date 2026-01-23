// ============================================
// Debug Panel - Development Testing Tools
// ============================================
// Hidden panel for quick state manipulation during development
// Opens via backtick (`) or Ctrl+Shift+D

import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { COUNTRY_NAMES } from '../../utils/countryData';
import type {
  NeighborCountryId,
  RelationshipLevel,
} from '../../types/game';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NEIGHBOR_COUNTRIES: NeighborCountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

const RELATIONSHIP_LEVELS: RelationshipLevel[] = [
  'military_pact',
  'profitable',
  'beneficial',
  'favourable',
  'satisfactory',
  'cool',
  'lamentable',
  'hostile',
  'war',
];

export function DebugPanel({ isOpen, onClose }: DebugPanelProps) {
  const game = useGameStore((state) => state.game);
  const {
    debugAddBudget,
    debugSetPrestige,
    debugSetKnessetDisapproval,
    debugModifyUSAttitude,
    debugAddWeapon,
    debugSetNuclearStage,
    debugSetPalestinianLevel,
    debugSetRelationship,
    debugDefeatCountry,
    debugWinWar,
    debugLoseWar,
    debugSkipTurns,
  } = useGameStore();

  const [selectedCountry, setSelectedCountry] = useState<NeighborCountryId>('egypt');

  if (!game) {
    return null;
  }

  const activeWar = game.wars.length > 0 ? game.wars[0] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-[100] transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-up Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[101] transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-gray-900 border-t-2 border-green-500 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-black text-green-400 p-3 flex items-center justify-between border-b border-green-500/50">
            <div>
              <h2 className="font-mono text-sm font-bold">DEBUG PANEL</h2>
              <div className="font-mono text-[10px] text-green-600">
                Press ` or Ctrl+Shift+D to close
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-green-500 text-green-400 font-mono font-bold hover:bg-green-500 hover:text-black transition-colors"
            >
              X
            </button>
          </div>

          {/* Content */}
          <div className="p-3 space-y-4">
            {/* Current State Display */}
            <div className="font-mono text-[10px] text-green-600 grid grid-cols-4 gap-2">
              <div>Budget: ${Math.floor(game.player.budget / 1000000)}M</div>
              <div>Prestige: {game.player.prestige}</div>
              <div>Knesset: {game.player.knessetDisapproval}</div>
              <div>US Att: {game.player.usAttitude}</div>
            </div>

            {/* Budget Cheats */}
            <Section title="BUDGET">
              <div className="grid grid-cols-3 gap-2">
                <DebugButton label="+$50M" onClick={() => debugAddBudget(50000000)} />
                <DebugButton label="+$100M" onClick={() => debugAddBudget(100000000)} />
                <DebugButton label="Set $500M" onClick={() => debugAddBudget(500000000 - game.player.budget)} />
              </div>
            </Section>

            {/* Stats Cheats */}
            <Section title="STATS">
              <div className="grid grid-cols-4 gap-2">
                <DebugButton label="Max Prestige" onClick={() => debugSetPrestige(10)} />
                <DebugButton label="Reset Knesset" onClick={() => debugSetKnessetDisapproval(0)} />
                <DebugButton label="US +20" onClick={() => debugModifyUSAttitude(20)} />
                <DebugButton label="US -20" onClick={() => debugModifyUSAttitude(-20)} />
              </div>
            </Section>

            {/* Military Cheats */}
            <Section title="MILITARY">
              <div className="grid grid-cols-3 gap-2">
                <DebugButton label="+10 Fighters" onClick={() => debugAddWeapon('fighter_aircraft', 10)} />
                <DebugButton label="+5 Tanks" onClick={() => debugAddWeapon('main_battle_tank', 5)} />
                <DebugButton label="+5 Infantry" onClick={() => debugAddWeapon('infantry_brigade', 5)} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <DebugButton
                  label="Complete Nuclear"
                  onClick={() => debugSetNuclearStage('operational')}
                  variant="warning"
                />
                <DebugButton label="+3 SAM" onClick={() => debugAddWeapon('sam_battery', 3)} />
              </div>
            </Section>

            {/* War Cheats */}
            {activeWar && (
              <Section title="WAR">
                <div className="font-mono text-[10px] text-yellow-400 mb-2">
                  Active war vs {COUNTRY_NAMES[activeWar.defender === 'israel' ? activeWar.attacker : activeWar.defender]}
                  (Progress: {activeWar.progress})
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <DebugButton
                    label="Win War"
                    onClick={() => debugWinWar(activeWar.id)}
                    variant="success"
                  />
                  <DebugButton
                    label="Lose War"
                    onClick={() => debugLoseWar(activeWar.id)}
                    variant="danger"
                  />
                </div>
              </Section>
            )}

            {/* Palestinian Cheats */}
            <Section title="PALESTINIAN">
              <div className="grid grid-cols-2 gap-2">
                <DebugButton
                  label="Set Calm"
                  onClick={() => debugSetPalestinianLevel('calm')}
                  variant="success"
                />
                <DebugButton
                  label="Set Intifada"
                  onClick={() => debugSetPalestinianLevel('intifada')}
                  variant="danger"
                />
              </div>
            </Section>

            {/* Country Actions */}
            <Section title="COUNTRY ACTIONS">
              <div className="flex gap-2 mb-2">
                {NEIGHBOR_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => setSelectedCountry(country)}
                    className={`flex-1 px-2 py-1 font-mono text-[10px] border transition-colors ${
                      selectedCountry === country
                        ? 'bg-green-600 text-black border-green-400'
                        : 'bg-gray-800 text-green-400 border-green-700 hover:bg-gray-700'
                    }`}
                  >
                    {COUNTRY_NAMES[country].slice(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="font-mono text-[10px] text-gray-400 mb-2">
                {COUNTRY_NAMES[selectedCountry]}: {game.countries[selectedCountry].relationship}
                {game.countries[selectedCountry].isDefeated && ' (DEFEATED)'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <DebugButton
                  label="Defeat"
                  onClick={() => debugDefeatCountry(selectedCountry)}
                  variant="danger"
                  disabled={game.countries[selectedCountry].isDefeated}
                />
                <DebugButton
                  label="Set Hostile"
                  onClick={() => debugSetRelationship(selectedCountry, 'hostile')}
                />
                <DebugButton
                  label="Set Friendly"
                  onClick={() => debugSetRelationship(selectedCountry, 'beneficial')}
                />
              </div>
              <div className="mt-2">
                <select
                  value={game.countries[selectedCountry].relationship}
                  onChange={(e) => debugSetRelationship(selectedCountry, e.target.value as RelationshipLevel)}
                  className="w-full bg-gray-800 text-green-400 border border-green-700 font-mono text-[10px] p-2"
                >
                  {RELATIONSHIP_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </Section>

            {/* Game Flow */}
            <Section title="GAME FLOW">
              <div className="grid grid-cols-2 gap-2">
                <DebugButton label="Skip 5 Turns" onClick={() => debugSkipTurns(5)} />
                <DebugButton label="Skip 10 Turns" onClick={() => debugSkipTurns(10)} />
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="p-3 bg-black border-t border-green-500/50">
            <div className="font-mono text-[8px] text-center text-green-600">
              DEV MODE ONLY - NOT AVAILABLE IN PRODUCTION
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper Components

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-green-700/50 p-2">
      <div className="font-mono text-[10px] text-green-500 font-bold mb-2 pb-1 border-b border-green-700/30">
        {title}
      </div>
      {children}
    </div>
  );
}

interface DebugButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
}

function DebugButton({ label, onClick, variant = 'default', disabled = false }: DebugButtonProps) {
  const variantClasses = {
    default: 'bg-gray-800 text-green-400 border-green-700 hover:bg-green-700 hover:text-black',
    success: 'bg-gray-800 text-green-400 border-green-500 hover:bg-green-500 hover:text-black',
    warning: 'bg-gray-800 text-yellow-400 border-yellow-600 hover:bg-yellow-600 hover:text-black',
    danger: 'bg-gray-800 text-red-400 border-red-600 hover:bg-red-600 hover:text-black',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-2 font-mono text-[10px] font-bold border transition-colors ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {label}
    </button>
  );
}
