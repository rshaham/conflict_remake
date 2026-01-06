// ============================================
// Military Screen - Arms and Combat
// ============================================

import { GameLayout } from '../components/layout/GameLayout';
import { useUIStore } from '../store/uiStore';

const VENDORS = [
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
  { id: 'uk', name: 'UK', flag: '🇬🇧' },
  { id: 'france', name: 'France', flag: '🇫🇷' },
  { id: 'black_market', name: 'Black Market', flag: '🏴' },
];

const WEAPONS = [
  { id: 'light_tank', name: 'Light Tank', price: '$1M', owned: 20 },
  { id: 'main_battle_tank', name: 'Main Battle Tank', price: '$2M', owned: 15 },
  { id: 'fighter_aircraft', name: 'Fighter Aircraft', price: '$10M', owned: 25 },
  { id: 'sam_battery', name: 'SAM Battery', price: '$3M', owned: 10 },
];

export function MilitaryScreen() {
  const selectedVendor = useUIStore((state) => state.selectedVendor);
  const selectVendor = useUIStore((state) => state.selectVendor);

  return (
    <GameLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold text-game-text-primary mb-4">
          Military Command
        </h2>

        {/* Budget Display */}
        <div className="card mb-4">
          <div className="flex justify-between items-center">
            <span className="text-game-text-secondary">Available Budget</span>
            <span className="text-green-400 font-bold text-lg">$100M</span>
          </div>
        </div>

        {/* Vendor Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {VENDORS.map((vendor) => (
            <button
              key={vendor.id}
              onClick={() => selectVendor(vendor.id as 'usa' | 'uk' | 'france' | 'black_market')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap ${
                selectedVendor === vendor.id
                  ? 'bg-game-accent text-white'
                  : 'bg-game-bg-card text-game-text-secondary'
              }`}
            >
              <span>{vendor.flag}</span>
              <span className="text-sm">{vendor.name}</span>
            </button>
          ))}
        </div>

        {/* Weapon Catalog */}
        <div className="space-y-3 mb-6">
          {WEAPONS.map((weapon) => (
            <div key={weapon.id} className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-game-bg-dark rounded flex items-center justify-center">
                <span className="text-2xl">🎖️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-game-text-primary">
                  {weapon.name}
                </h3>
                <p className="text-sm text-game-text-secondary">
                  Owned: {weapon.owned} | {weapon.price}
                </p>
              </div>
              <button className="btn-primary text-sm px-3 py-1">
                Buy
              </button>
            </div>
          ))}
        </div>

        {/* Nuclear Program */}
        <div className="card mb-6">
          <h3 className="font-bold text-game-text-primary mb-2">
            Nuclear Program
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-game-text-secondary">Status: No Program</p>
              <p className="text-xs text-game-text-secondary">Cost: $20M/month</p>
            </div>
            <button className="btn-secondary">
              Fund Program
            </button>
          </div>
        </div>

        {/* Troop Deployment */}
        <div className="card">
          <h3 className="font-bold text-game-text-primary mb-2">
            Border Deployment
          </h3>
          <p className="text-sm text-game-text-secondary mb-3">
            8 Infantry Brigades available
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-secondary text-sm">Egypt: 0</button>
            <button className="btn-secondary text-sm">Syria: 0</button>
            <button className="btn-secondary text-sm">Jordan: 0</button>
            <button className="btn-secondary text-sm">Lebanon: 0</button>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-game-text-secondary">
            Military Phase - Placeholder Screen
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
