// ============================================
// Arms Screen - Weapon Procurement
// ============================================
// Purchase weapons from international vendors
// Redesigned with GameShell for consistent navigation

import { GameShell } from '../components/layout/GameShell';
import { useGameStore } from '../store/gameStore';
import { useUIStore } from '../store/uiStore';
import { EconomyEngine } from '../engine/EconomyEngine';
import { GameImage } from '../components/ui/GameImage';
import type { VendorId, WeaponId } from '../types/game';

const VENDORS: { id: VendorId; name: string; flag: string; country: string }[] = [
  { id: 'usa', name: 'USA', flag: '🇺🇸', country: 'United States' },
  { id: 'uk', name: 'UK', flag: '🇬🇧', country: 'United Kingdom' },
  { id: 'france', name: 'FRA', flag: '🇫🇷', country: 'France' },
  { id: 'black_market', name: 'BLK', flag: '🏴', country: 'Black Market' },
];

const CATEGORY_NAMES: Record<string, string> = {
  light_armor: 'ARMOR',
  main_battle_tank: 'MBT',
  attack_helicopter: 'HELO',
  sam_battery: 'SAM',
  fighter_aircraft: 'AIR',
  sead_aircraft: 'SEAD',
  infantry: 'INF',
};

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export function ArmsScreen() {
  const { game, gameData, purchaseWeapon } = useGameStore();
  const selectedVendor = useUIStore((state) => state.selectedVendor);
  const selectVendor = useUIStore((state) => state.selectVendor);

  if (!game) {
    return null;
  }

  const currentVendor = selectedVendor || 'usa';
  const vendorWeapons = EconomyEngine.getVendorWeapons(game, currentVendor, gameData?.weapons);
  const isVendorEmbargoed = game.player.embargoedBy.includes(currentVendor);

  const handlePurchase = (weaponId: WeaponId, quantity: number) => {
    purchaseWeapon(currentVendor, weaponId, quantity);
  };

  const budgetM = Math.floor(game.player.budget / 1000000);

  // Status override for header - show budget prominently
  const statusOverride = (
    <div className="text-right">
      <div className="font-mono text-[10px] text-white/60">AVAILABLE</div>
      <div className="font-pixel text-lg text-green-400">${budgetM}M</div>
    </div>
  );

  return (
    <GameShell statusOverride={statusOverride}>
      {/* Vendor Tabs */}
      <div className="bg-gray-100 border-b-2 border-black p-2">
        <div className="flex gap-1">
          {VENDORS.map((vendor) => {
            const isEmbargoed = game.player.embargoedBy.includes(vendor.id);
            const isSelected = currentVendor === vendor.id;
            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => selectVendor(vendor.id)}
                disabled={isEmbargoed}
                className={`flex-1 px-2 py-3 border-2 font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? 'border-black bg-white shadow-[2px_2px_0_0_#000]'
                    : isEmbargoed
                    ? 'border-red-300 bg-red-50 text-red-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{vendor.flag}</span>
                  <span>{vendor.name}</span>
                  {isEmbargoed && <span className="text-[8px] text-red-500">EMBARGO</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Embargo Warning */}
        {isVendorEmbargoed && (
          <div className="p-4 bg-red-100 border-2 border-red-600 text-red-800">
            <div className="font-mono font-bold text-sm mb-1">EMBARGO IN EFFECT</div>
            <div className="font-mono text-xs">
              This vendor has suspended arms sales to Israel. Use the Black Market for unrestricted access.
            </div>
          </div>
        )}

        {/* Weapon Catalog */}
        <div className="space-y-3">
          {vendorWeapons.map(({ weapon, price, available, reason, weaponData }) => {
            const canPurchase = available && !isVendorEmbargoed;
            const categoryName = CATEGORY_NAMES[weaponData.category] || weaponData.category.toUpperCase();
            const owned = game.player.arsenal[weapon] || 0;

            return (
              <div
                key={weapon}
                className={`bg-white border-2 ${canPurchase ? 'border-black' : 'border-gray-300'} p-3`}
              >
                <div className="flex gap-3">
                  {/* Weapon Image */}
                  <div className="shrink-0 w-20">
                    <GameImage
                      src={weaponData.image}
                      alt={weaponData.name}
                      className="w-full"
                      width={80}
                      height={56}
                      retroBorder
                      fallback={
                        <div className="w-full h-14 bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                          <span className="font-mono text-[8px] text-gray-500">{categoryName}</span>
                        </div>
                      }
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name & Category */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-mono font-bold text-sm leading-tight">
                          {weaponData.name}
                        </div>
                        <div className="font-mono text-[10px] text-gray-500">{categoryName}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-green-700">{formatCurrency(price)}</div>
                        <div className="font-mono text-[10px] text-blue-600">OWNED: {owned}</div>
                      </div>
                    </div>

                    {/* Combat Value */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] text-gray-500">POWER:</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 ${
                              i < weaponData.combatValue
                                ? 'bg-amber-500 border-amber-600'
                                : 'bg-gray-200 border-gray-300'
                            } border`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Purchase buttons or reason */}
                    {canPurchase ? (
                      <div className="flex gap-2">
                        {[1, 5, 10].map((qty) => (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => handlePurchase(weapon, qty)}
                            className="flex-1 py-2 font-mono font-bold text-xs bg-amber-100 border-2 border-amber-600 text-amber-800 hover:bg-amber-200 active:translate-y-0.5 transition-all"
                          >
                            BUY {qty}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-2 px-3 bg-gray-100 border border-gray-300 font-mono text-[10px] text-gray-600 text-center">
                        {isVendorEmbargoed ? 'Embargo in effect' : reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pending Deliveries */}
        {game.player.pendingDeliveries.length > 0 && (
          <div className="bg-white border-2 border-black p-4">
            <div className="font-mono font-bold text-xs uppercase mb-3 pb-2 border-b border-gray-300">
              PENDING DELIVERIES
            </div>
            <div className="space-y-2">
              {game.player.pendingDeliveries.map((delivery, index) => {
                const weaponInfo = EconomyEngine.getWeaponData(delivery.weaponId);
                const name = weaponInfo?.name || delivery.weaponId;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200"
                  >
                    <div className="font-mono text-xs">
                      <span className="font-bold">{delivery.quantity}x</span> {name}
                    </div>
                    <div className="font-mono text-xs text-amber-700 font-bold">
                      {delivery.turnsRemaining} TURN{delivery.turnsRemaining > 1 ? 'S' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Arsenal Summary */}
        <div className="bg-white border-2 border-black p-4">
          <div className="font-mono font-bold text-xs uppercase mb-3 pb-2 border-b border-gray-300">
            CURRENT ARSENAL
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-green-50 border border-green-200 text-center">
              <div className="font-pixel text-2xl text-green-700">${budgetM}M</div>
              <div className="font-mono text-[9px] text-green-600 uppercase">Budget</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 text-center">
              <div className="font-pixel text-2xl text-blue-700">
                {Object.values(game.player.arsenal).reduce((a, b) => a + b, 0)}
              </div>
              <div className="font-mono text-[9px] text-blue-600 uppercase">Total Units</div>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
