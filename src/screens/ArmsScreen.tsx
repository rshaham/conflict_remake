// ============================================
// Arms Screen - Weapon Procurement
// ============================================
// Purchase weapons from international vendors
// Split from MilitaryScreen for focused experience

import { useNavigate } from 'react-router-dom';
import { Scanlines } from '../components/ui/Scanlines';
import { useGameStore } from '../store/gameStore';
import { useUIStore } from '../store/uiStore';
import { EconomyEngine } from '../engine/EconomyEngine';
import type { VendorId, WeaponId } from '../types/game';

const VENDORS: { id: VendorId; name: string; flag: string; country: string }[] = [
  { id: 'usa', name: 'USA', flag: '🇺🇸', country: 'United States' },
  { id: 'uk', name: 'UK', flag: '🇬🇧', country: 'United Kingdom' },
  { id: 'france', name: 'FRANCE', flag: '🇫🇷', country: 'French Republic' },
  { id: 'black_market', name: 'BLACK MKT', flag: '🏴', country: 'Underground' },
];

// Weapon display info
const WEAPON_INFO: Record<string, { name: string; icon: string; category: string }> = {
  light_tank: { name: 'Light Tank', icon: '🚗', category: 'ARMOR' },
  main_battle_tank: { name: 'Main Battle Tank', icon: '🛡️', category: 'ARMOR' },
  anti_tank_helicopter: { name: 'AT Helicopter', icon: '🚁', category: 'AIR' },
  sam_battery: { name: 'SAM Battery', icon: '🚀', category: 'DEF' },
  fighter_aircraft: { name: 'Fighter Jet', icon: '✈️', category: 'AIR' },
  anti_sam_helicopter: { name: 'SEAD Helo', icon: '🚁', category: 'AIR' },
  infantry_brigade: { name: 'Infantry Brigade', icon: '🚶', category: 'INF' },
  bomber_aircraft: { name: 'Bomber', icon: '💣', category: 'AIR' },
  attack_helicopter: { name: 'Attack Helo', icon: '🚁', category: 'AIR' },
  naval_vessel: { name: 'Naval Vessel', icon: '🚢', category: 'NAVY' },
  artillery: { name: 'Artillery', icon: '💥', category: 'ARTY' },
  armor_brigade: { name: 'Armor Brigade', icon: '🛡️', category: 'ARMOR' },
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

export function ArmsScreen() {
  const navigate = useNavigate();
  const { game, purchaseWeapon } = useGameStore();
  const selectedVendor = useUIStore((state) => state.selectedVendor);
  const selectVendor = useUIStore((state) => state.selectVendor);

  if (!game) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <Scanlines />
        <p className="font-mono text-retro-text-dim">No game in progress</p>
      </div>
    );
  }

  const currentVendor = selectedVendor || 'usa';
  const vendorWeapons = EconomyEngine.getVendorWeapons(game, currentVendor);
  const isVendorEmbargoed = game.player.embargoedBy.includes(currentVendor);

  const handlePurchase = (weaponId: WeaponId, quantity: number) => {
    purchaseWeapon(currentVendor, weaponId, quantity);
  };

  const budgetM = Math.floor(game.player.budget / 1000000);

  return (
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />

      {/* Header with back button */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/game/hub')}
          className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          ←
        </button>
        <div>
          <h1 className="font-pixel text-lg leading-none">ARMS PROCUREMENT</h1>
          <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">Weapons Acquisition</div>
        </div>
      </div>

      {/* Terminal-style budget display */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>BUDGET: ${budgetM}M</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 animate-pulse" />
          PROCUREMENT ACTIVE
        </span>
      </div>

      {/* Vendor Tabs */}
      <div className="shrink-0 p-2 bg-gray-100 border-b-2 border-black">
        <div className="flex gap-1">
          {VENDORS.map((vendor) => {
            const isEmbargoed = game.player.embargoedBy.includes(vendor.id);
            const isSelected = currentVendor === vendor.id;
            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => selectVendor(vendor.id)}
                className={`flex-1 px-2 py-2 border-2 font-mono text-[10px] font-bold transition-all ${
                  isSelected
                    ? 'border-black bg-white retro-shadow-sm'
                    : isEmbargoed
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-gray-300 bg-gray-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{vendor.flag}</span>
                  <span>{vendor.name}</span>
                </div>
                {isEmbargoed && <div className="text-[8px] text-red-600">EMBARGO</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Vendor Info */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{VENDORS.find(v => v.id === currentVendor)?.flag}</span>
            <div>
              <div className="font-mono font-bold text-xs">
                {VENDORS.find(v => v.id === currentVendor)?.country}
              </div>
              <div className="font-mono text-[8px] text-gray-500">
                {currentVendor === 'black_market' ? 'No embargo restrictions' : 'Official arms dealer'}
              </div>
            </div>
          </div>

          {/* Embargo Warning */}
          {isVendorEmbargoed && (
            <div className="p-2 border-2 border-red-600 bg-red-50 font-mono text-[10px] text-red-700">
              ⛔ EMBARGO IN EFFECT — This vendor has suspended arms sales to Israel
            </div>
          )}
        </div>

        {/* Weapon Catalog */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-3 pb-1 border-b border-gray-300">
            Weapon Catalog
          </div>

          <div className="space-y-2">
            {vendorWeapons.map(({ weapon, price, available, reason }) => {
              const info = WEAPON_INFO[weapon] || { name: weapon, icon: '📦', category: '???' };
              const canPurchase = available && !isVendorEmbargoed;

              return (
                <div
                  key={weapon}
                  className={`border-2 ${canPurchase ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} p-2`}
                >
                  <div className="flex items-start gap-2">
                    {/* Icon */}
                    <div className="w-10 h-10 border border-gray-300 bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                      {info.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-mono font-bold text-[10px] truncate">
                          {info.name.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[8px] px-1 py-0.5 bg-gray-200 border border-gray-300">
                            {info.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-[10px] text-green-700 font-bold">
                          {formatCurrency(price)}
                        </span>
                        <span className="font-mono text-[9px] text-gray-500">
                          OWNED: <span className="text-blue-600 font-bold">{game.player.arsenal[weapon] || 0}</span>
                        </span>
                      </div>

                      {/* Purchase buttons or reason */}
                      <div className="mt-2">
                        {canPurchase ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handlePurchase(weapon, 1)}
                              className="flex-1 py-1 font-mono font-bold text-[9px] border-2 border-black bg-white retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                            >
                              BUY 1
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePurchase(weapon, 5)}
                              className="flex-1 py-1 font-mono font-bold text-[9px] border-2 border-gray-400 bg-gray-100 hover:bg-gray-200 active:translate-x-0.5 active:translate-y-0.5"
                            >
                              BUY 5
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePurchase(weapon, 10)}
                              className="flex-1 py-1 font-mono font-bold text-[9px] border-2 border-gray-400 bg-gray-100 hover:bg-gray-200 active:translate-x-0.5 active:translate-y-0.5"
                            >
                              BUY 10
                            </button>
                          </div>
                        ) : (
                          <div className="font-mono text-[9px] text-yellow-700 italic">
                            {isVendorEmbargoed ? 'Vendor embargo in effect' : reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Deliveries */}
        {game.player.pendingDeliveries.length > 0 && (
          <div className="bg-white border-2 border-black retro-shadow p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Pending Deliveries
            </div>
            <div className="space-y-1">
              {game.player.pendingDeliveries.map((delivery, index) => {
                const info = WEAPON_INFO[delivery.weaponId] || { name: delivery.weaponId, icon: '📦' };
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 border border-gray-300 font-mono text-[10px]"
                  >
                    <div className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{delivery.quantity}x {info.name.toUpperCase()}</span>
                    </div>
                    <span className="text-yellow-600 font-bold">
                      {delivery.turnsRemaining} TURN{delivery.turnsRemaining > 1 ? 'S' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 font-mono text-[8px] text-gray-500 italic">
              Deliveries arrive at end of turn
            </div>
          </div>
        )}

        {/* Budget Summary */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Budget Summary
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-gray-50 border border-gray-300 text-center">
              <div className="font-mono text-lg font-bold text-green-700">${budgetM}M</div>
              <div className="font-mono text-[8px] text-gray-500">AVAILABLE</div>
            </div>
            <div className="p-2 bg-gray-50 border border-gray-300 text-center">
              <div className="font-mono text-lg font-bold text-blue-700">
                {Object.values(game.player.arsenal).reduce((a, b) => a + b, 0)}
              </div>
              <div className="font-mono text-[8px] text-gray-500">TOTAL UNITS</div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <div className="font-mono text-[9px] text-center text-gray-500 uppercase">
          Arms Phase — Purchases delivered next turn
        </div>
      </div>
    </div>
  );
}
