// ============================================
// Military Screen - Arms and Combat
// ============================================

import { GameLayout } from '../components/layout/GameLayout';
import { WeaponCard } from '../components/game/WeaponCard';
import { useGameStore } from '../store/gameStore';
import { useUIStore } from '../store/uiStore';
import { EconomyEngine } from '../engine/EconomyEngine';
import { COUNTRY_NAMES } from '../utils/countryData';
import type { VendorId, WeaponId, CountryId } from '../types/game';

const VENDORS: { id: VendorId; name: string; flag: string }[] = [
  { id: 'usa', name: 'USA', flag: '\u{1F1FA}\u{1F1F8}' },
  { id: 'uk', name: 'UK', flag: '\u{1F1EC}\u{1F1E7}' },
  { id: 'france', name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { id: 'black_market', name: 'Black Market', flag: '\u{1F3F4}' },
];

const NEIGHBOR_BORDERS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

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
  const { game, purchaseWeapon, fundNuclear, deployTroops } = useGameStore();
  const selectedVendor = useUIStore((state) => state.selectedVendor);
  const selectVendor = useUIStore((state) => state.selectVendor);

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
