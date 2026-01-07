// ============================================
// Military Screen - Arms and Combat
// ============================================

import { useState } from 'react';
import { GameLayout } from '../components/layout/GameLayout';
import { WeaponCard } from '../components/game/WeaponCard';
import { useGameStore } from '../store/gameStore';
import { useUIStore } from '../store/uiStore';
import { EconomyEngine } from '../engine/EconomyEngine';
import { COUNTRY_NAMES } from '../utils/countryData';
import type { VendorId, WeaponId, CountryId, AirstrikeTarget } from '../types/game';

const VENDORS: { id: VendorId; name: string; flag: string }[] = [
  { id: 'usa', name: 'USA', flag: '\u{1F1FA}\u{1F1F8}' },
  { id: 'uk', name: 'UK', flag: '\u{1F1EC}\u{1F1E7}' },
  { id: 'france', name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { id: 'black_market', name: 'Black Market', flag: '\u{1F3F4}' },
];

const NEIGHBOR_BORDERS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

// All countries that can be targeted by airstrikes (excludes Israel)
const AIRSTRIKE_TARGETS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon', 'iraq', 'iran', 'libya'];

const AIRSTRIKE_TARGET_TYPES: { id: AirstrikeTarget; name: string; desc: string; warning?: string }[] = [
  { id: 'military', name: 'Military', desc: 'Target enemy military installations' },
  { id: 'civilian', name: 'Civilian', desc: 'Target civilian infrastructure', warning: 'Reduces stability, US attitude impact' },
  { id: 'industrial', name: 'Industrial', desc: 'Target industrial capacity' },
  { id: 'nuclear', name: 'Nuclear', desc: 'Target nuclear facilities', warning: 'Severe diplomatic consequences' },
];

const NUCLEAR_STAGE_NAMES = {
  none: 'No Program',
  research: 'Research',
  development: 'Development',
  testing: 'Testing',
  operational: 'Operational',
};

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(2)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export function MilitaryScreen() {
  const { game, purchaseWeapon, fundNuclear, deployTroops, orderAirstrike, cancelAirstrike } = useGameStore();
  const selectedVendor = useUIStore((state) => state.selectedVendor);
  const selectVendor = useUIStore((state) => state.selectVendor);

  // Airstrike state
  const [selectedAirstrikeCountry, setSelectedAirstrikeCountry] = useState<CountryId>('syria');
  const [selectedAirstrikeType, setSelectedAirstrikeType] = useState<AirstrikeTarget>('military');

  // If no game is loaded, show placeholder
  if (!game) {
    return (
      <GameLayout>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const currentVendor = selectedVendor || 'usa';
  const vendorWeapons = EconomyEngine.getVendorWeapons(game, currentVendor);
  const isVendorEmbargoed = game.player.embargoedBy.includes(currentVendor);

  const handlePurchase = (weaponId: WeaponId, quantity: number) => {
    purchaseWeapon(currentVendor, weaponId, quantity);
  };

  const handleDeploymentChange = (country: CountryId, delta: number) => {
    const current = game.player.deployedTroops[country] || 0;
    const newValue = Math.max(0, current + delta);
    deployTroops(country, newValue);
  };

  // Calculate available brigades
  const totalDeployed = Object.values(game.player.deployedTroops).reduce(
    (a, b) => a + b,
    0
  );
  const totalBrigades = game.player.arsenal.infantry_brigade || 0;
  const availableBrigades = totalBrigades - totalDeployed;

  return (
    <GameLayout>
      <div className="p-4 pb-24">
        <h2 className="text-xl font-bold text-game-text-primary mb-4">
          Military Command
        </h2>

        {/* Budget Display */}
        <div className="card mb-4">
          <div className="flex justify-between items-center">
            <span className="text-game-text-secondary">Available Budget</span>
            <span className="text-green-400 font-bold text-lg">
              {formatCurrency(game.player.budget)}
            </span>
          </div>
        </div>

        {/* Vendor Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {VENDORS.map((vendor) => {
            const isEmbargoed = game.player.embargoedBy.includes(vendor.id);
            return (
              <button
                key={vendor.id}
                onClick={() => selectVendor(vendor.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentVendor === vendor.id
                    ? 'bg-game-accent text-white'
                    : isEmbargoed
                    ? 'bg-red-900/30 text-red-400'
                    : 'bg-game-bg-card text-game-text-secondary hover:bg-gray-700'
                }`}
              >
                <span>{vendor.flag}</span>
                <span className="text-sm">{vendor.name}</span>
                {isEmbargoed && <span className="text-xs ml-1">(Embargo)</span>}
              </button>
            );
          })}
        </div>

        {/* Embargo Warning */}
        {isVendorEmbargoed && (
          <div className="card mb-4 bg-red-900/20 border border-red-800">
            <p className="text-red-400 text-sm">
              This vendor has placed an embargo on Israel. You cannot purchase weapons
              from them.
            </p>
          </div>
        )}

        {/* Weapon Catalog */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-game-text-secondary uppercase tracking-wide mb-3">
            Weapon Catalog - {VENDORS.find((v) => v.id === currentVendor)?.name}
          </h3>
          <div className="space-y-3">
            {vendorWeapons.map(({ weapon, price, available, reason }) => (
              <WeaponCard
                key={weapon}
                weaponId={weapon}
                vendor={currentVendor}
                price={price}
                owned={game.player.arsenal[weapon] || 0}
                available={available && !isVendorEmbargoed}
                reason={isVendorEmbargoed ? 'Vendor has embargoed you' : reason}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </div>

        {/* Nuclear Program */}
        <div className="card mb-6">
          <h3 className="font-bold text-game-text-primary mb-2">Nuclear Program</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-game-text-secondary">
                Status:{' '}
                <span
                  className={
                    game.player.nuclearStage === 'operational'
                      ? 'text-yellow-400'
                      : 'text-game-text-primary'
                  }
                >
                  {NUCLEAR_STAGE_NAMES[game.player.nuclearStage]}
                </span>
              </p>
              {game.player.nuclearStage !== 'none' &&
                game.player.nuclearStage !== 'operational' && (
                  <p className="text-xs text-game-text-secondary">
                    Progress: {game.player.nuclearProgress} months
                  </p>
                )}
              <p className="text-xs text-game-text-secondary">Cost: $20M/month</p>
            </div>
            {game.player.nuclearStage !== 'operational' && (
              <button
                className={`${
                  game.player.turnActions.fundedNuclear
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                onClick={() => fundNuclear(!game.player.turnActions.fundedNuclear)}
              >
                {game.player.turnActions.fundedNuclear ? 'Funding' : 'Fund Program'}
              </button>
            )}
            {game.player.nuclearStage === 'operational' && (
              <span className="px-3 py-1 bg-yellow-600 text-white rounded text-sm">
                Ready
              </span>
            )}
          </div>
        </div>

        {/* Troop Deployment */}
        <div className="card">
          <h3 className="font-bold text-game-text-primary mb-2">Border Deployment</h3>
          <p className="text-sm text-game-text-secondary mb-3">
            <span className="text-blue-400">{availableBrigades}</span> of{' '}
            <span className="text-blue-400">{totalBrigades}</span> Infantry Brigades
            available
          </p>
          <div className="space-y-2">
            {NEIGHBOR_BORDERS.map((country) => {
              const deployed = game.player.deployedTroops[country] || 0;
              const countryState = game.countries[country];
              const isAtWar = countryState.relationship === 'war';

              return (
                <div
                  key={country}
                  className={`flex items-center justify-between p-2 rounded ${
                    isAtWar ? 'bg-red-900/20' : 'bg-gray-800'
                  }`}
                >
                  <span className="text-game-text-primary">
                    {COUNTRY_NAMES[country]}
                    {isAtWar && (
                      <span className="text-red-400 text-xs ml-2">AT WAR</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
                      onClick={() => handleDeploymentChange(country, -1)}
                      disabled={deployed === 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-game-text-primary font-medium">
                      {deployed}
                    </span>
                    <button
                      className="w-8 h-8 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
                      onClick={() => handleDeploymentChange(country, 1)}
                      disabled={availableBrigades === 0}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-game-text-secondary mt-3 italic">
            Deploy troops to borders to enable war declaration
          </p>
        </div>

        {/* Airstrike Operations */}
        <div className="card mt-6">
          <h3 className="font-bold text-game-text-primary mb-3">Airstrike Operations</h3>

          {/* Available Fighters */}
          <div className="flex justify-between items-center mb-3 text-sm">
            <span className="text-game-text-secondary">Available Fighters</span>
            <span className={`font-medium ${
              (game.player.arsenal.fighter_aircraft || 0) > 0 ? 'text-blue-400' : 'text-red-400'
            }`}>
              {game.player.arsenal.fighter_aircraft || 0}
            </span>
          </div>

          {/* Target Selection */}
          <div className="mb-3">
            <label className="text-xs text-game-text-secondary uppercase tracking-wide block mb-2">
              Target Country
            </label>
            <div className="flex flex-wrap gap-2">
              {AIRSTRIKE_TARGETS.filter(c => !game.countries[c].isDefeated).map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => setSelectedAirstrikeCountry(country)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    selectedAirstrikeCountry === country
                      ? 'bg-game-accent text-white'
                      : 'bg-game-bg-dark text-game-text-secondary hover:bg-gray-700'
                  }`}
                >
                  {COUNTRY_NAMES[country]}
                </button>
              ))}
            </div>
          </div>

          {/* Strike Type Selection */}
          <div className="mb-4">
            <label className="text-xs text-game-text-secondary uppercase tracking-wide block mb-2">
              Strike Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AIRSTRIKE_TARGET_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedAirstrikeType(type.id)}
                  className={`p-2 rounded text-left transition-colors ${
                    selectedAirstrikeType === type.id
                      ? type.id === 'nuclear' || type.id === 'civilian'
                        ? 'bg-red-900/50 border border-red-700'
                        : 'bg-game-accent'
                      : 'bg-game-bg-dark hover:bg-gray-700'
                  }`}
                >
                  <div className={`font-medium text-sm ${
                    selectedAirstrikeType === type.id ? 'text-white' : 'text-game-text-primary'
                  }`}>
                    {type.name}
                  </div>
                  <div className={`text-xs ${
                    selectedAirstrikeType === type.id ? 'text-white/70' : 'text-game-text-secondary'
                  }`}>
                    {type.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Warning for risky strikes */}
          {(selectedAirstrikeType === 'nuclear' || selectedAirstrikeType === 'civilian') && (
            <div className="mb-3 p-2 bg-red-900/20 border border-red-800 rounded text-xs text-red-400">
              {AIRSTRIKE_TARGET_TYPES.find(t => t.id === selectedAirstrikeType)?.warning}
            </div>
          )}

          {/* Order Button */}
          <button
            type="button"
            onClick={() => orderAirstrike(selectedAirstrikeCountry, selectedAirstrikeType)}
            disabled={(game.player.arsenal.fighter_aircraft || 0) === 0}
            className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded font-medium transition-colors"
          >
            {(game.player.arsenal.fighter_aircraft || 0) === 0
              ? 'No Fighters Available'
              : `Order Airstrike on ${COUNTRY_NAMES[selectedAirstrikeCountry]}`
            }
          </button>
        </div>

        {/* Queued Airstrikes */}
        {game.player.turnActions.airstrikes.length > 0 && (
          <div className="card mt-4 border border-red-900/50">
            <h3 className="font-bold text-red-400 mb-2">
              Queued Airstrikes ({game.player.turnActions.airstrikes.length})
            </h3>
            <div className="space-y-2">
              {game.player.turnActions.airstrikes.map((strike, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-red-900/20 rounded"
                >
                  <div>
                    <span className="text-game-text-primary font-medium">
                      {COUNTRY_NAMES[strike.target]}
                    </span>
                    <span className="text-game-text-secondary text-sm ml-2">
                      ({strike.type})
                    </span>
                    <span className="text-blue-400 text-xs ml-2">
                      {strike.fightersUsed} fighters
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancelAirstrike(index)}
                    className="text-red-400 hover:text-red-300 text-sm px-2"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-game-text-secondary mt-2 italic">
              Airstrikes will be executed at end of turn
            </p>
          </div>
        )}

        {/* Pending Deliveries */}
        {game.player.pendingDeliveries.length > 0 && (
          <div className="card mt-6">
            <h3 className="font-bold text-game-text-primary mb-2">
              Pending Deliveries
            </h3>
            <div className="space-y-2">
              {game.player.pendingDeliveries.map((delivery, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-game-text-secondary">
                    {delivery.quantity}x {delivery.weaponId.replace('_', ' ')}
                  </span>
                  <span className="text-yellow-400">
                    {delivery.turnsRemaining} turn{delivery.turnsRemaining > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-red-900/30 text-red-400 rounded text-xs">
            Military Phase - End Turn to Execute Actions
          </span>
        </div>
      </div>
    </GameLayout>
  );
}
