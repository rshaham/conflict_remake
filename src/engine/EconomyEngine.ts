// ============================================
// Economy Engine - Budget and Purchases
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  VendorId,
  WeaponId,
  WeaponPurchase,
  PendingDelivery,
} from '../types/game';

// Weapon data - 26 specific weapons from catalog
// Each weapon belongs to a single vendor
interface WeaponData {
  name: string;
  vendor: VendorId;
  category: string;
  cost: number;
  combatValue: number;
  unlockRequirement: number;
  image: string;
}

const WEAPON_DATA: Record<WeaponId, WeaponData> = {
  // USA Vendor (7 weapons)
  m60a3_patton: {
    name: 'M60A3 Patton',
    vendor: 'usa',
    category: 'light_armor',
    cost: 1200000,
    combatValue: 2,
    unlockRequirement: 0,
    image: '/images/weapons/m60a3_patton.png',
  },
  m1a1_abrams: {
    name: 'M1A1 Abrams',
    vendor: 'usa',
    category: 'main_battle_tank',
    cost: 4500000,
    combatValue: 6,
    unlockRequirement: 10,
    image: '/images/weapons/m1a1_abrams.png',
  },
  f15_eagle: {
    name: 'F-15 Eagle',
    vendor: 'usa',
    category: 'fighter_aircraft',
    cost: 30000000,
    combatValue: 9,
    unlockRequirement: 20,
    image: '/images/weapons/f15_eagle.png',
  },
  f16_falcon: {
    name: 'F-16 Falcon',
    vendor: 'usa',
    category: 'fighter_aircraft',
    cost: 18000000,
    combatValue: 7,
    unlockRequirement: 8,
    image: '/images/weapons/f16_falcon.png',
  },
  f4_phantom: {
    name: 'F-4 Phantom',
    vendor: 'usa',
    category: 'fighter_aircraft',
    cost: 12000000,
    combatValue: 5,
    unlockRequirement: 0,
    image: '/images/weapons/f4_phantom.png',
  },
  e2c_hawkeye: {
    name: 'E-2C Hawkeye',
    vendor: 'usa',
    category: 'sead_aircraft',
    cost: 22000000,
    combatValue: 4,
    unlockRequirement: 15,
    image: '/images/weapons/e2c_hawkeye.png',
  },
  m109_howitzer: {
    name: 'M109 Howitzer',
    vendor: 'usa',
    category: 'sam_battery',
    cost: 4000000,
    combatValue: 5,
    unlockRequirement: 5,
    image: '/images/weapons/m109_howitzer.png',
  },

  // UK Vendor (5 weapons)
  chieftain: {
    name: 'Chieftain',
    vendor: 'uk',
    category: 'light_armor',
    cost: 1000000,
    combatValue: 2,
    unlockRequirement: 0,
    image: '/images/weapons/chieftain.png',
  },
  challenger: {
    name: 'Challenger 1',
    vendor: 'uk',
    category: 'main_battle_tank',
    cost: 4000000,
    combatValue: 5,
    unlockRequirement: 8,
    image: '/images/weapons/challenger.png',
  },
  rapier: {
    name: 'Rapier SAM',
    vendor: 'uk',
    category: 'sam_battery',
    cost: 2500000,
    combatValue: 3,
    unlockRequirement: 6,
    image: '/images/weapons/rapier.png',
  },
  tornado: {
    name: 'Panavia Tornado',
    vendor: 'uk',
    category: 'fighter_aircraft',
    cost: 25000000,
    combatValue: 6,
    unlockRequirement: 15,
    image: '/images/weapons/tornado.png',
  },
  jaguar: {
    name: 'SEPECAT Jaguar',
    vendor: 'uk',
    category: 'sead_aircraft',
    cost: 15000000,
    combatValue: 5,
    unlockRequirement: 10,
    image: '/images/weapons/jaguar.png',
  },

  // France Vendor (5 weapons)
  amx30: {
    name: 'AMX-30',
    vendor: 'france',
    category: 'light_armor',
    cost: 900000,
    combatValue: 2,
    unlockRequirement: 0,
    image: '/images/weapons/amx30.png',
  },
  mirage_f1: {
    name: 'Dassault Mirage F1',
    vendor: 'france',
    category: 'fighter_aircraft',
    cost: 15000000,
    combatValue: 5,
    unlockRequirement: 5,
    image: '/images/weapons/mirage_f1.png',
  },
  mirage_2000: {
    name: 'Dassault Mirage 2000',
    vendor: 'france',
    category: 'fighter_aircraft',
    cost: 23000000,
    combatValue: 7,
    unlockRequirement: 10,
    image: '/images/weapons/mirage_2000.png',
  },
  sa321_superfrelon: {
    name: 'SA 321 Super Frelon',
    vendor: 'france',
    category: 'attack_helicopter',
    cost: 8000000,
    combatValue: 4,
    unlockRequirement: 8,
    image: '/images/weapons/sa321_superfrelon.png',
  },
  exocet_system: {
    name: 'Exocet Missile System',
    vendor: 'france',
    category: 'sam_battery',
    cost: 5000000,
    combatValue: 6,
    unlockRequirement: 12,
    image: '/images/weapons/exocet_system.png',
  },

  // Black Market / Soviet (9 weapons)
  t55: {
    name: 'T-55',
    vendor: 'black_market',
    category: 'light_armor',
    cost: 400000,
    combatValue: 1,
    unlockRequirement: 0,
    image: '/images/weapons/t55.png',
  },
  t62: {
    name: 'T-62',
    vendor: 'black_market',
    category: 'light_armor',
    cost: 600000,
    combatValue: 2,
    unlockRequirement: 0,
    image: '/images/weapons/t62.png',
  },
  t72: {
    name: 'T-72',
    vendor: 'black_market',
    category: 'main_battle_tank',
    cost: 1800000,
    combatValue: 4,
    unlockRequirement: 0,
    image: '/images/weapons/t72.png',
  },
  mig21: {
    name: 'MiG-21 Fishbed',
    vendor: 'black_market',
    category: 'fighter_aircraft',
    cost: 8000000,
    combatValue: 3,
    unlockRequirement: 0,
    image: '/images/weapons/mig21.png',
  },
  mig23: {
    name: 'MiG-23 Flogger',
    vendor: 'black_market',
    category: 'fighter_aircraft',
    cost: 12000000,
    combatValue: 4,
    unlockRequirement: 5,
    image: '/images/weapons/mig23.png',
  },
  mig29: {
    name: 'MiG-29 Fulcrum',
    vendor: 'black_market',
    category: 'fighter_aircraft',
    cost: 20000000,
    combatValue: 6,
    unlockRequirement: 8,
    image: '/images/weapons/mig29.png',
  },
  su24: {
    name: 'Su-24 Fencer',
    vendor: 'black_market',
    category: 'sead_aircraft',
    cost: 18000000,
    combatValue: 5,
    unlockRequirement: 12,
    image: '/images/weapons/su24.png',
  },
  sa6_gainful: {
    name: 'SA-6 Gainful',
    vendor: 'black_market',
    category: 'sam_battery',
    cost: 3000000,
    combatValue: 4,
    unlockRequirement: 5,
    image: '/images/weapons/sa6_gainful.png',
  },
  scud_b: {
    name: 'Scud-B Missile',
    vendor: 'black_market',
    category: 'sam_battery',
    cost: 2000000,
    combatValue: 3,
    unlockRequirement: 0,
    image: '/images/weapons/scud_b.png',
  },

  // Legacy generic weapon types (for backwards compatibility with combat system)
  light_tank: {
    name: 'Light Tank',
    vendor: 'usa',
    category: 'light_armor',
    cost: 1000000,
    combatValue: 2,
    unlockRequirement: 999, // Not purchasable - legacy type
    image: '/images/weapons/m60a3_patton.png',
  },
  main_battle_tank: {
    name: 'Main Battle Tank',
    vendor: 'usa',
    category: 'main_battle_tank',
    cost: 3000000,
    combatValue: 5,
    unlockRequirement: 999,
    image: '/images/weapons/m1a1_abrams.png',
  },
  anti_tank_helicopter: {
    name: 'Attack Helicopter',
    vendor: 'usa',
    category: 'attack_helicopter',
    cost: 10000000,
    combatValue: 6,
    unlockRequirement: 999,
    image: '/images/weapons/sa321_superfrelon.png',
  },
  sam_battery: {
    name: 'SAM Battery',
    vendor: 'usa',
    category: 'sam_battery',
    cost: 3000000,
    combatValue: 4,
    unlockRequirement: 999,
    image: '/images/weapons/rapier.png',
  },
  fighter_aircraft: {
    name: 'Fighter Aircraft',
    vendor: 'usa',
    category: 'fighter_aircraft',
    cost: 20000000,
    combatValue: 7,
    unlockRequirement: 999,
    image: '/images/weapons/f15_eagle.png',
  },
  anti_sam_helicopter: {
    name: 'SEAD Aircraft',
    vendor: 'usa',
    category: 'sead_aircraft',
    cost: 15000000,
    combatValue: 5,
    unlockRequirement: 999,
    image: '/images/weapons/jaguar.png',
  },
  infantry_brigade: {
    name: 'Infantry Brigade',
    vendor: 'usa',
    category: 'infantry',
    cost: 0,
    combatValue: 2,
    unlockRequirement: 999,
    image: '/images/weapons/m60a3_patton.png',
  },
};

// Vendor data
const VENDOR_DATA: Record<VendorId, {
  name: string;
  willEmbargo: boolean;
  deliveryDelay?: number;
  priceModifier?: number;
}> = {
  usa: { name: 'United States', willEmbargo: true },
  uk: { name: 'United Kingdom', willEmbargo: true },
  france: { name: 'France', willEmbargo: false },
  black_market: {
    name: 'Black Market',
    willEmbargo: false,
    deliveryDelay: 2,
    priceModifier: 1.2,
  },
};

// Monthly budget calculation constants
const BASE_MONTHLY_INCOME = 8000000; // ~$8M per month base
const GDP_DEFENSE_MULTIPLIER = 3000000; // Per % of GDP to defense

/**
 * Handles economy, budget, and weapon purchases
 */
export const EconomyEngine = {
  /**
   * Calculate monthly budget income
   */
  calculateMonthlyIncome: (state: GameState): number => {
    // Base income + defense % contribution
    const defenseContribution = state.player.gdpDefensePercent * GDP_DEFENSE_MULTIPLIER;
    let income = BASE_MONTHLY_INCOME + defenseContribution;

    // US aid bonus based on attitude
    if (state.player.usAttitude > 0) {
      income += state.player.usAttitude * 100000; // $100k per attitude point
    }

    // Difficulty modifier (not implemented yet, would reduce income on harder difficulties)

    return Math.floor(income);
  },

  /**
   * Add monthly income to budget
   */
  addMonthlyIncome: (state: GameState): GameState => {
    const income = EconomyEngine.calculateMonthlyIncome(state);
    return {
      ...state,
      player: {
        ...state.player,
        budget: state.player.budget + income,
      },
    };
  },

  /**
   * Process weapon purchases from turn actions
   */
  processPurchases: (state: GameState): GameState => {
    const purchases = state.player.turnActions.weaponPurchases;
    if (purchases.length === 0) return state;

    let newBudget = state.player.budget;
    const newPendingDeliveries = [...state.player.pendingDeliveries];
    const newVendorPurchases = { ...state.player.vendorPurchases };
    const newArsenal = { ...state.player.arsenal };

    for (const purchase of purchases) {
      const cost = EconomyEngine.calculatePurchaseCost(
        purchase.vendor,
        purchase.weaponId,
        purchase.quantity
      );

      if (cost > newBudget) continue; // Skip if can't afford

      // Deduct cost
      newBudget -= cost;

      // Update vendor purchase count
      newVendorPurchases[purchase.vendor] =
        (newVendorPurchases[purchase.vendor] || 0) + purchase.quantity;

      // Check for delivery delay
      const vendorData = VENDOR_DATA[purchase.vendor];
      const deliveryDelay = vendorData.deliveryDelay || 0;

      if (deliveryDelay > 0) {
        // Add to pending deliveries
        newPendingDeliveries.push({
          weaponId: purchase.weaponId,
          quantity: purchase.quantity,
          vendor: purchase.vendor,
          turnsRemaining: deliveryDelay,
        });
      } else {
        // Immediate delivery
        newArsenal[purchase.weaponId] =
          (newArsenal[purchase.weaponId] || 0) + purchase.quantity;
      }
    }

    return {
      ...state,
      player: {
        ...state.player,
        budget: newBudget,
        arsenal: newArsenal,
        vendorPurchases: newVendorPurchases,
        pendingDeliveries: newPendingDeliveries,
      },
    };
  },

  /**
   * Process pending deliveries (decrement timers, add to arsenal)
   */
  processDeliveries: (state: GameState): GameState => {
    const pendingDeliveries = state.player.pendingDeliveries;
    if (pendingDeliveries.length === 0) return state;

    const newArsenal = { ...state.player.arsenal };
    const newPendingDeliveries: PendingDelivery[] = [];

    for (const delivery of pendingDeliveries) {
      if (delivery.turnsRemaining <= 1) {
        // Delivery arrives
        newArsenal[delivery.weaponId] =
          (newArsenal[delivery.weaponId] || 0) + delivery.quantity;
      } else {
        // Still pending
        newPendingDeliveries.push({
          ...delivery,
          turnsRemaining: delivery.turnsRemaining - 1,
        });
      }
    }

    return {
      ...state,
      player: {
        ...state.player,
        arsenal: newArsenal,
        pendingDeliveries: newPendingDeliveries,
      },
    };
  },

  /**
   * Check if a weapon purchase is valid
   */
  canPurchase: (
    state: GameState,
    vendor: VendorId,
    weapon: WeaponId,
    quantity: number
  ): { valid: boolean; reason?: string } => {
    // Check vendor availability (embargo)
    if (!EconomyEngine.isVendorAvailable(state, vendor)) {
      return { valid: false, reason: 'Vendor has embargoed you' };
    }

    // Check weapon availability from this vendor
    const weaponData = WEAPON_DATA[weapon];
    if (!weaponData || weaponData.vendor !== vendor) {
      return { valid: false, reason: 'Weapon not available from this vendor' };
    }

    // Check unlock requirement (total purchases from this vendor)
    const currentPurchases = state.player.vendorPurchases[vendor] || 0;
    if (currentPurchases < weaponData.unlockRequirement) {
      return {
        valid: false,
        reason: `Requires ${weaponData.unlockRequirement} prior purchases from this vendor`,
      };
    }

    // Check budget
    const cost = EconomyEngine.calculatePurchaseCost(vendor, weapon, quantity);
    if (cost > state.player.budget) {
      return { valid: false, reason: 'Insufficient budget' };
    }

    // Check army limit agreement
    if (state.player.armyLimitAgreement) {
      return { valid: false, reason: 'Army limit agreement prevents purchases' };
    }

    return { valid: true };
  },

  /**
   * Calculate cost for a weapon purchase
   */
  calculatePurchaseCost: (
    vendor: VendorId,
    weapon: WeaponId,
    quantity: number
  ): number => {
    const weaponData = WEAPON_DATA[weapon];
    if (!weaponData || weaponData.vendor !== vendor) {
      return Infinity;
    }

    let unitPrice = weaponData.cost;

    // Apply vendor price modifier (e.g., black market 1.2x)
    const vendorData = VENDOR_DATA[vendor];
    if (vendorData.priceModifier) {
      unitPrice *= vendorData.priceModifier;
    }

    return Math.floor(unitPrice * quantity);
  },

  /**
   * Check if vendor is available (not embargoed)
   */
  isVendorAvailable: (state: GameState, vendor: VendorId): boolean => {
    return !state.player.embargoedBy.includes(vendor);
  },

  /**
   * Trigger an embargo from a vendor
   */
  triggerEmbargo: (state: GameState, vendor: VendorId): GameState => {
    const vendorData = VENDOR_DATA[vendor];
    if (!vendorData.willEmbargo) return state;

    if (state.player.embargoedBy.includes(vendor)) return state;

    return {
      ...state,
      player: {
        ...state.player,
        embargoedBy: [...state.player.embargoedBy, vendor],
      },
    };
  },

  /**
   * Lift an embargo from a vendor (usually at UN summit)
   */
  liftEmbargo: (state: GameState, vendor: VendorId): GameState => {
    return {
      ...state,
      player: {
        ...state.player,
        embargoedBy: state.player.embargoedBy.filter((v) => v !== vendor),
      },
    };
  },

  /**
   * Create a weapon purchase order
   */
  createPurchaseOrder: (
    vendor: VendorId,
    weaponId: WeaponId,
    quantity: number
  ): WeaponPurchase => {
    const totalCost = EconomyEngine.calculatePurchaseCost(vendor, weaponId, quantity);
    return {
      weaponId,
      vendor,
      quantity,
      totalCost,
    };
  },

  /**
   * Get weapon data
   */
  getWeaponData: (weapon: WeaponId) => WEAPON_DATA[weapon],

  /**
   * Get vendor data
   */
  getVendorData: (vendor: VendorId) => VENDOR_DATA[vendor],

  /**
   * Get all weapons available from a vendor
   */
  getVendorWeapons: (
    state: GameState,
    vendor: VendorId
  ): { weapon: WeaponId; price: number; available: boolean; reason?: string; weaponData: WeaponData }[] => {
    const result: { weapon: WeaponId; price: number; available: boolean; reason?: string; weaponData: WeaponData }[] = [];

    for (const [weaponId, weaponData] of Object.entries(WEAPON_DATA)) {
      // Filter weapons by vendor
      if (weaponData.vendor !== vendor) continue;
      // Skip Israeli domestic weapons (not purchasable)
      if (weaponData.unlockRequirement >= 999) continue;

      const canPurchase = EconomyEngine.canPurchase(state, vendor, weaponId as WeaponId, 1);

      result.push({
        weapon: weaponId as WeaponId,
        price: weaponData.cost,
        available: canPurchase.valid,
        reason: canPurchase.reason,
        weaponData,
      });
    }

    // Sort by unlock requirement (cheaper/easier first)
    result.sort((a, b) => a.weaponData.unlockRequirement - b.weaponData.unlockRequirement);

    return result;
  },
};
