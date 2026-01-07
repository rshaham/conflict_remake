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

// Weapon data - would normally come from YAML but hardcoded for engine purity
const WEAPON_DATA: Record<WeaponId, {
  name: string;
  costPerUnit: number;
  combatValue: number;
  availability: Partial<Record<VendorId, { minPurchases: number; price: number }>>;
}> = {
  light_tank: {
    name: 'Light Tank',
    costPerUnit: 1000000,
    combatValue: 1,
    availability: {
      usa: { minPurchases: 0, price: 1000000 },
      uk: { minPurchases: 0, price: 1000000 },
      france: { minPurchases: 0, price: 1100000 },
      black_market: { minPurchases: 0, price: 1200000 },
    },
  },
  main_battle_tank: {
    name: 'Main Battle Tank',
    costPerUnit: 2000000,
    combatValue: 3,
    availability: {
      usa: { minPurchases: 5, price: 2000000 },
      uk: { minPurchases: 5, price: 2100000 },
      france: { minPurchases: 3, price: 2200000 },
      black_market: { minPurchases: 0, price: 2400000 },
    },
  },
  anti_tank_helicopter: {
    name: 'Anti-Tank Helicopter',
    costPerUnit: 5000000,
    combatValue: 4,
    availability: {
      usa: { minPurchases: 10, price: 5000000 },
      black_market: { minPurchases: 5, price: 6000000 },
    },
  },
  sam_battery: {
    name: 'SAM Battery',
    costPerUnit: 3000000,
    combatValue: 2,
    availability: {
      usa: { minPurchases: 8, price: 3000000 },
      uk: { minPurchases: 8, price: 3200000 },
      black_market: { minPurchases: 0, price: 3600000 },
    },
  },
  fighter_aircraft: {
    name: 'Fighter Aircraft',
    costPerUnit: 10000000,
    combatValue: 5,
    availability: {
      usa: { minPurchases: 15, price: 10000000 },
      uk: { minPurchases: 12, price: 10500000 },
      france: { minPurchases: 10, price: 11000000 },
      black_market: { minPurchases: 8, price: 12000000 },
    },
  },
  anti_sam_helicopter: {
    name: 'SEAD Helicopter',
    costPerUnit: 8000000,
    combatValue: 3,
    availability: {
      usa: { minPurchases: 20, price: 8000000 },
      black_market: { minPurchases: 15, price: 9600000 },
    },
  },
  infantry_brigade: {
    name: 'Infantry Brigade',
    costPerUnit: 0,
    combatValue: 2,
    availability: {
      usa: { minPurchases: 0, price: 0 },
    },
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
    const vendorAvailability = weaponData.availability[vendor];
    if (!vendorAvailability) {
      return { valid: false, reason: 'Weapon not available from this vendor' };
    }

    // Check minimum purchase requirement
    const currentPurchases = state.player.vendorPurchases[vendor] || 0;
    if (currentPurchases < vendorAvailability.minPurchases) {
      return {
        valid: false,
        reason: `Requires ${vendorAvailability.minPurchases} prior purchases from this vendor`,
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
    const vendorAvailability = weaponData.availability[vendor];

    if (!vendorAvailability) return Infinity;

    let unitPrice = vendorAvailability.price;

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
  ): { weapon: WeaponId; price: number; available: boolean; reason?: string }[] => {
    const result: { weapon: WeaponId; price: number; available: boolean; reason?: string }[] = [];

    for (const [weaponId, weaponData] of Object.entries(WEAPON_DATA)) {
      const vendorAvail = weaponData.availability[vendor as VendorId];
      if (!vendorAvail) continue;

      const canPurchase = EconomyEngine.canPurchase(state, vendor, weaponId as WeaponId, 1);

      result.push({
        weapon: weaponId as WeaponId,
        price: vendorAvail.price,
        available: canPurchase.valid,
        reason: canPurchase.reason,
      });
    }

    return result;
  },
};
