// ============================================
// Military Screen - Strategic Command
// ============================================
// Forces deployment and airstrike operations
// Weapon purchasing moved to ArmsScreen
// Nuclear program moved to NuclearScreen

import { useState } from 'react';
import { GameLayout } from '../components/game/GameLayout';
import { HatchedBar } from '../components/ui/HatchedBar';
import { useGameStore } from '../store/gameStore';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../utils/countryData';
import type { CountryId, AirstrikeTarget } from '../types/game';

const NEIGHBOR_BORDERS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

// All countries that can be targeted by airstrikes (excludes Israel)
const AIRSTRIKE_TARGETS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon', 'iraq', 'iran', 'libya'];

const AIRSTRIKE_TARGET_TYPES: { id: AirstrikeTarget; name: string; desc: string; warning?: string }[] = [
  { id: 'military', name: 'MILITARY', desc: 'Enemy installations' },
  { id: 'civilian', name: 'CIVILIAN', desc: 'Infrastructure', warning: 'Reduces stability, US impact' },
  { id: 'industrial', name: 'INDUSTRIAL', desc: 'Industrial capacity' },
  { id: 'nuclear', name: 'NUCLEAR', desc: 'Nuclear facilities', warning: 'Severe diplomatic fallout' },
];

// Unit type display data - using correct weapon IDs
const UNIT_TYPES: { id: string; name: string; icon: string }[] = [
  { id: 'infantry_brigade', name: 'Infantry', icon: '🚶' },
  { id: 'light_tank', name: 'Lt Tank', icon: '🛡️' },
  { id: 'main_battle_tank', name: 'MBT', icon: '🛡️' },
  { id: 'fighter_aircraft', name: 'Fighters', icon: '✈️' },
  { id: 'anti_tank_helicopter', name: 'AT Helo', icon: '🚁' },
  { id: 'anti_sam_helicopter', name: 'SEAD', icon: '🚁' },
  { id: 'sam_battery', name: 'SAM', icon: '🚀' },
];

export function MilitaryScreen() {
  const { game, deployTroops, orderAirstrike, cancelAirstrike, declareWar, endTurn, advancePhase } = useGameStore();

  // Airstrike state
  const [selectedAirstrikeCountry, setSelectedAirstrikeCountry] = useState<CountryId>('syria');
  const [selectedAirstrikeType, setSelectedAirstrikeType] = useState<AirstrikeTarget>('military');

  // War confirmation dialog state
  const [showWarConfirm, setShowWarConfirm] = useState<CountryId | null>(null);

  if (!game) {
    return (
      <GameLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-mono text-retro-text-dim">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const handleDeploymentChange = (country: CountryId, delta: number) => {
    const current = game.player.deployedTroops[country] || 0;
    const newValue = Math.max(0, current + delta);
    deployTroops(country, newValue);
  };

  const handleDeclareWar = (country: CountryId) => {
    setShowWarConfirm(country);
  };

  const confirmDeclareWar = () => {
    if (showWarConfirm) {
      declareWar(showWarConfirm);
      setShowWarConfirm(null);
    }
  };

  // Calculate available brigades
  const totalDeployed = Object.values(game.player.deployedTroops).reduce((a, b) => a + b, 0);
  const totalBrigades = game.player.arsenal.infantry_brigade || 0;
  const availableBrigades = totalBrigades - totalDeployed;

  // Calculate readiness (simplified)
  const totalArsenal = Object.values(game.player.arsenal).reduce((a, b) => a + b, 0);
  const readiness = Math.min(100, Math.floor(totalArsenal * 2));

  const fighters = game.player.arsenal.fighter_aircraft || 0;

  return (
    <GameLayout>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-lg leading-none">STRATEGIC COMMAND</h1>
        <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">Military Operations</div>
      </div>

      {/* Terminal-style readiness display */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>READINESS: {readiness}%</span>
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 ${readiness >= 50 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          {game.wars.length > 0 ? 'COMBAT OPS ACTIVE' : 'PEACETIME STATUS'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Force Overview */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Force Overview
          </div>
          <div className="grid grid-cols-4 gap-2">
            {UNIT_TYPES.map((unit) => {
              const count = game.player.arsenal[unit.id as keyof typeof game.player.arsenal] || 0;
              return (
                <div
                  key={unit.id}
                  className="text-center p-2 border border-gray-300 bg-gray-50"
                >
                  <div className="text-lg mb-0.5">{unit.icon}</div>
                  <div className="font-mono text-xs font-bold">{count}</div>
                  <div className="font-mono text-[8px] text-gray-500 uppercase">{unit.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Border Deployment */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Border Deployment
          </div>

          {/* Brigade counter */}
          <div className="mb-3 p-2 bg-gray-100 border border-gray-300 font-mono text-[10px]">
            <span className="text-gray-600">AVAILABLE: </span>
            <span className={availableBrigades > 0 ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
              {availableBrigades}
            </span>
            <span className="text-gray-600"> / {totalBrigades} BRIGADES</span>
          </div>

          <div className="space-y-2">
            {NEIGHBOR_BORDERS.map((country) => {
              const deployed = game.player.deployedTroops[country] || 0;
              const countryState = game.countries[country];
              const isAtWar = countryState.relationship === 'war';
              const isHostile = countryState.relationship === 'hostile';

              return (
                <div key={country}>
                  <div
                    className={`flex items-center justify-between p-2 border-2 ${
                      isAtWar ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{COUNTRY_FLAGS[country]}</span>
                      <div>
                        <div className="font-mono font-bold text-xs">{COUNTRY_NAMES[country].toUpperCase()}</div>
                        {isAtWar && (
                          <div className="font-mono text-[8px] text-red-600 font-bold">AT WAR</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="w-7 h-7 border-2 border-black bg-white font-mono font-bold text-sm retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDeploymentChange(country, -1)}
                        disabled={deployed === 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-sm">{deployed}</span>
                      <button
                        type="button"
                        className="w-7 h-7 border-2 border-black bg-white font-mono font-bold text-sm retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDeploymentChange(country, 1)}
                        disabled={availableBrigades === 0}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Declare War Button - only show if hostile and troops deployed */}
                  {isHostile && deployed > 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeclareWar(country)}
                      className="mt-2 w-full py-2 bg-red-600 text-white font-mono font-bold text-[10px] uppercase border-2 border-black retro-shadow-sm hover:bg-red-700"
                    >
                      DECLARE WAR
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 font-mono text-[8px] text-gray-500 italic">
            Deploy troops to borders to enable war declaration
          </div>
        </div>

        {/* Airstrike Operations */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300 flex justify-between items-center">
            <span>Airstrike Operations</span>
            <span className={`text-[10px] ${fighters > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {fighters} FIGHTERS
            </span>
          </div>

          {/* Target Country Selection */}
          <div className="mb-3">
            <div className="font-mono text-[8px] text-gray-500 uppercase mb-1">Target Country</div>
            <div className="flex flex-wrap gap-1">
              {AIRSTRIKE_TARGETS.filter(c => !game.countries[c].isDefeated).map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => setSelectedAirstrikeCountry(country)}
                  className={`px-2 py-1 border-2 font-mono text-[10px] font-bold transition-all ${
                    selectedAirstrikeCountry === country
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                  }`}
                >
                  {COUNTRY_FLAGS[country]} {COUNTRY_NAMES[country].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Strike Type Selection */}
          <div className="mb-3">
            <div className="font-mono text-[8px] text-gray-500 uppercase mb-1">Strike Type</div>
            <div className="grid grid-cols-2 gap-2">
              {AIRSTRIKE_TARGET_TYPES.map((type) => {
                const isRisky = type.id === 'nuclear' || type.id === 'civilian';
                const isSelected = selectedAirstrikeType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedAirstrikeType(type.id)}
                    className={`p-2 border-2 text-left transition-all ${
                      isSelected
                        ? isRisky
                          ? 'border-red-600 bg-red-50'
                          : 'border-black bg-gray-100'
                        : 'border-gray-300 bg-white hover:border-gray-500'
                    }`}
                  >
                    <div className={`font-mono font-bold text-[10px] ${isSelected && isRisky ? 'text-red-700' : ''}`}>
                      {type.name}
                    </div>
                    <div className="font-mono text-[8px] text-gray-500">{type.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warning for risky strikes */}
          {(selectedAirstrikeType === 'nuclear' || selectedAirstrikeType === 'civilian') && (
            <div className="mb-3 p-2 border-2 border-red-600 bg-red-50 font-mono text-[9px] text-red-700">
              WARNING: {AIRSTRIKE_TARGET_TYPES.find(t => t.id === selectedAirstrikeType)?.warning}
            </div>
          )}

          {/* Order Button */}
          <button
            type="button"
            onClick={() => orderAirstrike(selectedAirstrikeCountry, selectedAirstrikeType)}
            disabled={fighters === 0}
            className="w-full py-2 font-mono font-bold text-xs uppercase border-2 border-black bg-red-600 text-white retro-shadow-sm hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400 disabled:shadow-none transition-all"
          >
            {fighters === 0
              ? 'NO FIGHTERS AVAILABLE'
              : `ORDER AIRSTRIKE → ${COUNTRY_NAMES[selectedAirstrikeCountry].toUpperCase()}`
            }
          </button>
        </div>

        {/* Queued Airstrikes */}
        {game.player.turnActions.airstrikes.length > 0 && (
          <div className="bg-white border-2 border-red-600 retro-shadow-red p-3">
            <div className="font-mono font-bold text-xs uppercase text-red-700 mb-2 pb-1 border-b border-red-300">
              Queued Strikes ({game.player.turnActions.airstrikes.length})
            </div>
            <div className="space-y-2">
              {game.player.turnActions.airstrikes.map((strike, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-red-50 border border-red-300"
                >
                  <div className="font-mono text-[10px]">
                    <span className="font-bold">{COUNTRY_NAMES[strike.target].toUpperCase()}</span>
                    <span className="text-gray-600 ml-2">({strike.type})</span>
                    <span className="text-blue-600 ml-2">{strike.fightersUsed} fighters</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancelAirstrike(index)}
                    className="px-2 py-1 font-mono text-[9px] font-bold text-red-600 border border-red-600 hover:bg-red-100"
                  >
                    CANCEL
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 font-mono text-[8px] text-red-600 italic">
              Strikes execute at end of turn
            </div>
          </div>
        )}

        {/* Pending Deliveries */}
        {game.player.pendingDeliveries.length > 0 && (
          <div className="bg-white border-2 border-black retro-shadow p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Pending Deliveries
            </div>
            <div className="space-y-1">
              {game.player.pendingDeliveries.map((delivery, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 border border-gray-300 font-mono text-[10px]"
                >
                  <span>
                    {delivery.quantity}x {delivery.weaponId.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-yellow-600 font-bold">
                    {delivery.turnsRemaining} TURN{delivery.turnsRemaining > 1 ? 'S' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Military Readiness Bar */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <HatchedBar
            value={readiness}
            label="COMBAT READINESS"
            showDanger={true}
          />
        </div>

      </div>

      {/* Footer - End Turn Button */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={() => endTurn()}
          className="w-full py-3 bg-red-700 text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-red-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          END TURN - RESOLVE ACTIONS
        </button>
        <p className="font-mono text-[8px] text-center text-red-600 mt-2 uppercase">
          Point of no return - All actions will be executed
        </p>
      </div>

      {/* War Confirmation Dialog */}
      {showWarConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-red-600 p-4 max-w-sm w-full">
            <h3 className="font-pixel text-lg text-red-700 mb-3">DECLARE WAR?</h3>
            <p className="font-mono text-[11px] mb-4">
              This will begin military operations against {COUNTRY_NAMES[showWarConfirm]}.
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowWarConfirm(null)}
                className="flex-1 py-2 border-2 border-black bg-white font-mono font-bold text-xs">
                CANCEL
              </button>
              <button type="button" onClick={confirmDeclareWar}
                className="flex-1 py-2 border-2 border-red-600 bg-red-600 text-white font-mono font-bold text-xs">
                DECLARE WAR
              </button>
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  );
}
