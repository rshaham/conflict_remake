// ============================================
// Palestinian Engine - Territory Management
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  PalestinianLevel,
  PolicingTactic,
  CountryId,
} from '../types/game';

// Palestinian levels in order from calm to worst
const PALESTINIAN_ORDER: PalestinianLevel[] = [
  'calm', 'unrest', 'protests', 'violence', 'intifada'
];

// Monthly Knesset pressure per level
const KNESSET_PRESSURE: Record<PalestinianLevel, number> = {
  calm: 0,
  unrest: 0.5,
  protests: 1,
  violence: 2,
  intifada: 3,
};

// Base escalation chance per level (chance to move to next level)
const BASE_ESCALATION_CHANCE: Record<PalestinianLevel, number> = {
  calm: 0.1,      // 10% base chance to escalate from calm
  unrest: 0.15,   // 15% from unrest
  protests: 0.2,  // 20% from protests
  violence: 0.15, // 15% from violence
  intifada: 0,    // Can't escalate beyond intifada
};

// Policing effectiveness (reduces escalation chance)
const POLICING_EFFECTIVENESS: Record<PolicingTactic, number> = {
  none: 0,
  soft: 0.5,  // 50% reduction
  hard: 1.0,  // 100% reduction (prevents escalation)
};

// Policing costs
const POLICING_BRIGADES: Record<PolicingTactic, number> = {
  none: 0,
  soft: 1,
  hard: 1,
};

const POLICING_US_PENALTY: Record<PolicingTactic, number> = {
  none: 0,
  soft: 0,
  hard: -5, // Monthly penalty while using hard tactics
};

const POLICING_VIOLENCE_POINTS: Record<PolicingTactic, number> = {
  none: 0,
  soft: 0,
  hard: 1, // Monthly violence points while using hard tactics
};

// External influence bonuses
const HOSTILE_NEIGHBOR_BONUS = 0.1;  // +10% per hostile neighbor
const AT_WAR_BONUS = 0.2;            // +20% per active war

// Neighboring countries that can influence Palestinian situation
const NEIGHBORING_COUNTRIES: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

/**
 * Palestinian Engine handles territory management and Knesset pressure
 */
export const PalestinianEngine = {
  /**
   * Resolve Palestinian phase during turn resolution
   */
  resolvePalestinianPhase: (state: GameState): GameState => {
    let newState = { ...state };

    // 1. Apply policing costs (US attitude, violence points)
    newState = PalestinianEngine.applyPolicingCosts(newState);

    // 2. Calculate and apply escalation
    newState = PalestinianEngine.processEscalation(newState);

    // 3. Accumulate Knesset pressure
    newState = PalestinianEngine.accumulateKnessetPressure(newState);

    // 4. Check for assassination risk (at intifada level)
    newState = PalestinianEngine.checkAssassinationRisk(newState);

    return newState;
  },

  /**
   * Apply monthly costs from policing tactic
   */
  applyPolicingCosts: (state: GameState): GameState => {
    const tactic = state.player.policingTactic;

    const newPlayer = {
      ...state.player,
      usAttitude: Math.max(-100, state.player.usAttitude + POLICING_US_PENALTY[tactic]),
      violencePoints: state.player.violencePoints + POLICING_VIOLENCE_POINTS[tactic],
    };

    return {
      ...state,
      player: newPlayer,
    };
  },

  /**
   * Process potential escalation of Palestinian situation
   */
  processEscalation: (state: GameState): GameState => {
    const currentLevel = state.player.palestinianLevel;
    const currentIndex = PALESTINIAN_ORDER.indexOf(currentLevel);

    // Can't escalate beyond intifada
    if (currentIndex >= PALESTINIAN_ORDER.length - 1) {
      return state;
    }

    // Calculate escalation chance
    let escalationChance = BASE_ESCALATION_CHANCE[currentLevel];

    // Add external influence
    const hostileCount = PalestinianEngine.countHostileNeighbors(state);
    const warCount = state.wars.length;

    escalationChance += hostileCount * HOSTILE_NEIGHBOR_BONUS;
    escalationChance += warCount * AT_WAR_BONUS;

    // Reduce by policing effectiveness
    const effectiveness = POLICING_EFFECTIVENESS[state.player.policingTactic];
    escalationChance *= (1 - effectiveness);

    // Roll for escalation
    if (Math.random() < escalationChance) {
      const newLevel = PALESTINIAN_ORDER[currentIndex + 1];
      return {
        ...state,
        player: {
          ...state.player,
          palestinianLevel: newLevel,
        },
      };
    }

    // Check for de-escalation (only with effective policing)
    if (state.player.policingTactic !== 'none' && currentIndex > 0) {
      // 10% chance to de-escalate with soft tactics, 20% with hard
      const deescalationChance = state.player.policingTactic === 'hard' ? 0.2 : 0.1;
      if (Math.random() < deescalationChance) {
        const newLevel = PALESTINIAN_ORDER[currentIndex - 1];
        return {
          ...state,
          player: {
            ...state.player,
            palestinianLevel: newLevel,
          },
        };
      }
    }

    return state;
  },

  /**
   * Accumulate Knesset pressure based on Palestinian level
   */
  accumulateKnessetPressure: (state: GameState): GameState => {
    const pressure = KNESSET_PRESSURE[state.player.palestinianLevel];

    if (pressure === 0) return state;

    const newDisapproval = Math.min(10, state.player.knessetDisapproval + pressure);

    return {
      ...state,
      player: {
        ...state.player,
        knessetDisapproval: newDisapproval,
      },
    };
  },

  /**
   * Check for assassination risk at intifada level
   */
  checkAssassinationRisk: (state: GameState): GameState => {
    // Only at intifada level
    if (state.player.palestinianLevel !== 'intifada') {
      return state;
    }

    // 5% chance of assassination attempt per turn during intifada
    if (Math.random() < 0.05) {
      // 20% chance the attempt succeeds
      if (Math.random() < 0.2) {
        return {
          ...state,
          endState: {
            type: 'defeat',
            condition: 'assassination',
            finalScore: 0,
            leadershipStyle: 'Martyr',
            narrative: 'You were assassinated during the Intifada. The violence you failed to contain claimed your life.',
            statistics: {
              turnsPlayed: state.turn,
              warsWon: 0,
              warsLost: 0,
              countriesDefeated: [],
              totalWeaponsPurchased: 0,
              totalAirstrikes: 0,
              peakPrestige: state.player.prestige,
              peakKnessetDisapproval: state.player.knessetDisapproval,
            },
          },
        };
      }
    }

    return state;
  },

  /**
   * Count hostile neighboring countries
   */
  countHostileNeighbors: (state: GameState): number => {
    return NEIGHBORING_COUNTRIES.filter(countryId => {
      const country = state.countries[countryId];
      return !country.isDefeated &&
             (country.relationship === 'hostile' || country.relationship === 'lamentable');
    }).length;
  },

  /**
   * Check if policing tactic can be set (brigade availability)
   */
  canSetPolicingTactic: (state: GameState, tactic: PolicingTactic): boolean => {
    const requiredBrigades = POLICING_BRIGADES[tactic];
    if (requiredBrigades === 0) return true;

    // Calculate available brigades (not deployed to borders)
    const totalBrigades = state.player.arsenal.infantry_brigade || 0;
    const deployedBrigades = Object.values(state.player.deployedTroops).reduce((a, b) => a + b, 0);
    const availableBrigades = totalBrigades - deployedBrigades;

    return availableBrigades >= requiredBrigades;
  },

  /**
   * Accept Palestinian homeland resolution (at UN Summit)
   */
  acceptPalestinianHomeland: (state: GameState): GameState => {
    // Must be at UN Summit phase
    if (state.phase !== 'un_summit') {
      return state;
    }

    // Must have sufficient US attitude
    if (state.player.usAttitude < 25) {
      return state;
    }

    // Already resolved
    if (state.player.palestinianHomeland) {
      return state;
    }

    return {
      ...state,
      player: {
        ...state.player,
        palestinianHomeland: true,
        palestinianLevel: 'calm',
        policingTactic: 'none',
        prestige: state.player.prestige + 1,
        usAttitude: state.player.usAttitude + 25,
      },
    };
  },

  /**
   * Get display name for Palestinian level
   */
  getLevelName: (level: PalestinianLevel): string => {
    const names: Record<PalestinianLevel, string> = {
      calm: 'Calm',
      unrest: 'Unrest',
      protests: 'Protests',
      violence: 'Violence',
      intifada: 'Intifada',
    };
    return names[level];
  },

  /**
   * Get display name for policing tactic
   */
  getTacticName: (tactic: PolicingTactic): string => {
    const names: Record<PolicingTactic, string> = {
      none: 'No Deployment',
      soft: 'Soft Tactics',
      hard: 'Hard Tactics',
    };
    return names[tactic];
  },

  /**
   * Calculate current escalation risk percentage
   */
  getEscalationRisk: (state: GameState): number => {
    const currentLevel = state.player.palestinianLevel;

    // Already resolved or at max
    if (state.player.palestinianHomeland || currentLevel === 'intifada') {
      return 0;
    }

    let risk = BASE_ESCALATION_CHANCE[currentLevel];

    // Add external factors
    risk += PalestinianEngine.countHostileNeighbors(state) * HOSTILE_NEIGHBOR_BONUS;
    risk += state.wars.length * AT_WAR_BONUS;

    // Reduce by policing
    const effectiveness = POLICING_EFFECTIVENESS[state.player.policingTactic];
    risk *= (1 - effectiveness);

    return Math.min(1, risk); // Cap at 100%
  },

  /**
   * Get brigades required for a tactic
   */
  getBrigadesRequired: (tactic: PolicingTactic): number => {
    return POLICING_BRIGADES[tactic];
  },
};
