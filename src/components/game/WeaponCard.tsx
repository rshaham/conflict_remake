// ============================================
// Weapon Card - Display Weapon for Purchase
// ============================================

import type { WeaponId, VendorId } from '../../types/game';

interface WeaponInfo {
  name: string;
  description: string;
  category: string;
  icon: string;
}

const WEAPON_INFO: Record<WeaponId, WeaponInfo> = {
  light_tank: {
    name: 'Light Tank',
    description: 'Fast, lightly armored reconnaissance vehicle',
    category: 'Armor',
    icon: '\u{1F699}', // tank emoji alternative
  },
  main_battle_tank: {
    name: 'Main Battle Tank',
    description: 'Heavy armored fighting vehicle',
    category: 'Armor',
    icon: '\u{1F69B}', // truck emoji as placeholder
  },
  anti_tank_helicopter: {
    name: 'Anti-Tank Helicopter',
    description: 'Attack helicopter with anti-armor missiles',
    category: 'Aircraft',
    icon: '\u{1F681}', // helicopter
  },
  sam_battery: {
    name: 'SAM Battery',
    description: 'Surface-to-air missile defense system',
    category: 'Air Defense',
    icon: '\u{1F680}', // rocket
  },
  fighter_aircraft: {
    name: 'Fighter Aircraft',
    description: 'High-performance jet fighter',
    category: 'Aircraft',
    icon: '\u{2708}\u{FE0F}', // airplane
  },
  anti_sam_helicopter: {
    name: 'SEAD Helicopter',
    description: 'Specialized for suppressing air defenses',
    category: 'Aircraft',
    icon: '\u{1F681}', // helicopter
  },
  infantry_brigade: {
    name: 'Infantry Brigade',
    description: 'Ground forces for border deployment',
    category: 'Infantry',
    icon: '\u{1F3C3}', // runner
  },
};

interface WeaponCardProps {
  weaponId: WeaponId;
  vendor: VendorId;
  price: number;
  owned: number;
  available: boolean;
  reason?: string;
  onPurchase: (weaponId: WeaponId, quantity: number) => void;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export function WeaponCard({
  weaponId,
  price,
  owned,
  available,
  reason,
  onPurchase,
}: WeaponCardProps) {
  const info = WEAPON_INFO[weaponId];

  return (
    <div className={`card p-4 ${!available ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-14 h-14 bg-game-bg-dark rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{info.icon}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-game-text-primary truncate">
              {info.name}
            </h3>
            <span className="text-green-400 font-semibold ml-2">
              {formatCurrency(price)}
            </span>
          </div>
          <p className="text-xs text-game-text-secondary mt-1">{info.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-game-text-secondary">
              <span className="text-blue-400">{owned}</span> owned
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-700 rounded">
              {info.category}
            </span>
          </div>
        </div>
      </div>

      {/* Purchase Controls */}
      <div className="mt-3 flex items-center gap-2">
        {available ? (
          <>
            <button
              className="flex-1 btn-primary text-sm py-2"
              onClick={() => onPurchase(weaponId, 1)}
            >
              Buy 1
            </button>
            <button
              className="flex-1 btn-secondary text-sm py-2"
              onClick={() => onPurchase(weaponId, 5)}
            >
              Buy 5
            </button>
            <button
              className="flex-1 btn-secondary text-sm py-2"
              onClick={() => onPurchase(weaponId, 10)}
            >
              Buy 10
            </button>
          </>
        ) : (
          <p className="text-xs text-yellow-500 italic">{reason}</p>
        )}
      </div>
    </div>
  );
}
