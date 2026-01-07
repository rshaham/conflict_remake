// ============================================
// AI Opponent - Rule-Based Opponent AI
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  CountryId,
  CountryState,
  StabilityLevel,
  LeaderAggression,
  LeaderRiskTolerance,
  RelationshipLevel,
} from '../types/game';
import { CombatEngine } from './CombatEngine';
import { DiplomacyEngine } from './DiplomacyEngine';

// Stability levels in order from best to worst
const STABILITY_ORDER: StabilityLevel[] = [
  'very_solid', 'solid', 'good', 'weak', 'critical', 'collapse'
];

// Relationship levels from best to worst
const RELATIONSHIP_ORDER: RelationshipLevel[] = [
  'military_pact', 'profitable', 'beneficial', 'favourable',
  'satisfactory', 'cool', 'lamentable', 'hostile', 'war'
];

// Leader trait modifiers
const AGGRESSION_THRESHOLDS: Record<LeaderAggression, number> = {
  dovish: 0.8,
  pragmatic: 0.5,
  hawkish: 0.3,
};

const RISK_WILDCARDS: Record<LeaderRiskTolerance, number> = {
  cautious: 0.05,
  calculated: 0.15,
  reckless: 0.30,
};

const NUCLEAR_PRIORITIES: Record<LeaderAggression, number> = {
  dovish: 0.2,
  pragmatic: 0.5,
  hawkish: 0.8,
};

// Countries that are neighbors to Israel (can be directly attacked)
const NEIGHBOR_COUNTRIES: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

// AI countries (excluding Israel)
const AI_COUNTRIES: CountryId[] = [
  'egypt', 'syria', 'jordan', 'lebanon', 'iraq', 'iran', 'libya'
];

/**
 * AI decision-making for non-player countries
 */
export const AIOpponent = {
  /**
   * Execute AI turn for all countries
   */
  takeAllTurns: (state: GameState): GameState => {
    let newState = state;

    for (const countryId of AI_COUNTRIES) {
      const country = newState.countries[countryId];
      if (country.isDefeated) continue;

      newState = AIOpponent.takeTurn(newState, countryId);
    }

    return newState;
  },

  /**
   * Execute AI turn for a single country
   */
  takeTurn: (state: GameState, countryId: CountryId): GameState => {
    const country = state.countries[countryId];
    if (country.isDefeated) return state;

    let newState = state;
    const leader = country.leader;

    // Check if at war with Israel
    const atWarWithIsrael = state.wars.some(
      (w) =>
        (w.attacker === countryId && w.defender === 'israel') ||
        (w.attacker === 'israel' && w.defender === countryId)
    );

    // Priority 1: Survival Check
    if (AIOpponent.needsSurvivalAction(country, atWarWithIsrael)) {
      newState = AIOpponent.executeSurvivalActions(newState, countryId);
    }

    // Priority 2: War Management (if at war)
    if (atWarWithIsrael) {
      newState = AIOpponent.executeWarManagement(newState, countryId);
    }

    // Priority 3: Opportunistic Attack (if not at war)
    if (!atWarWithIsrael && NEIGHBOR_COUNTRIES.includes(countryId)) {
      newState = AIOpponent.evaluateOpportunisticAttack(newState, countryId);
    }

    // Priority 4: Nuclear Development
    if (country.nuclearStage !== 'operational') {
      newState = AIOpponent.evaluateNuclearDevelopment(newState, countryId);
    }

    // Priority 5: Alliance Building
    newState = AIOpponent.evaluateAllianceBuilding(newState, countryId);

    // Priority 6: Support Insurgents (destabilization)
    if (!atWarWithIsrael) {
      newState = AIOpponent.evaluateDestabilization(newState, countryId);
    }

    // Priority 7: Military Buildup
    newState = AIOpponent.executeMilitaryBuildup(newState, countryId);

    // Priority 8: Wildcard Action
    if (Math.random() < RISK_WILDCARDS[leader.riskTolerance]) {
      newState = AIOpponent.executeWildcard(newState, countryId);
    }

    return newState;
  },

  /**
   * Check if country needs survival actions
   */
  needsSurvivalAction: (country: CountryState, atWar: boolean): boolean => {
    const stabilityIndex = STABILITY_ORDER.indexOf(country.stability);
    // Weak or worse (index >= 3) and at war
    return stabilityIndex >= 3 && atWar;
  },

  /**
   * Execute survival actions - seek ceasefire, seek allies
   */
  executeSurvivalActions: (state: GameState, countryId: CountryId): GameState => {
    // Try to offer ceasefire to Israel
    const war = state.wars.find(
      (w) =>
        (w.attacker === countryId && w.defender === 'israel') ||
        (w.attacker === 'israel' && w.defender === countryId)
    );

    if (war) {
      // 50% chance to offer ceasefire when in survival mode
      if (Math.random() < 0.5) {
        // Use AI ceasefire function
        return CombatEngine.aiOfferCeasefire(state, war.id);
      }
    }

    return state;
  },

  /**
   * War management - focus resources on military
   */
  executeWarManagement: (state: GameState, countryId: CountryId): GameState => {
    const country = state.countries[countryId];

    // Increase military strength (abstract representation)
    // In a real implementation, this would trigger weapon purchases
    const newCountries = {
      ...state.countries,
      [countryId]: {
        ...country,
        militaryStrength: country.militaryStrength + 5, // Wartime buildup
      },
    };

    return {
      ...state,
      countries: newCountries,
    };
  },

  /**
   * Evaluate whether to declare war on Israel
   */
  evaluateOpportunisticAttack: (
    state: GameState,
    countryId: CountryId
  ): GameState => {
    const country = state.countries[countryId];
    const leader = country.leader;

    // Can't attack if already at war with Israel
    const alreadyAtWar = state.wars.some(
      (w) =>
        (w.attacker === countryId && w.defender === 'israel') ||
        (w.attacker === 'israel' && w.defender === countryId)
    );

    if (alreadyAtWar) return state;

    // Must have hostile relationship or worse
    const relationshipIndex = RELATIONSHIP_ORDER.indexOf(country.relationship);
    if (relationshipIndex < 7) return state; // Need 'hostile' or 'war' level

    // Calculate war score
    const warScore = AIOpponent.evaluateWarDecision(state, countryId, 'israel');
    const threshold = AGGRESSION_THRESHOLDS[leader.aggression];

    if (warScore > threshold) {
      // AI declares war on Israel
      return CombatEngine.aiDeclareWar(state, countryId);
    }

    // Maybe worsen relations instead
    if (Math.random() < 0.3) {
      return DiplomacyEngine.worsenRelationship(state, countryId, 'israel');
    }

    return state;
  },

  /**
   * Evaluate war declaration factors
   */
  evaluateWarDecision: (
    state: GameState,
    country: CountryId,
    target: CountryId
  ): number => {
    const countryState = state.countries[country];
    const targetState = state.countries[target];
    const leader = countryState.leader;

    let score = 0;

    // Factor 1: Military comparison (weight 0.3)
    const playerStrength =
      target === 'israel'
        ? Object.values(state.player.arsenal).reduce((a, b) => a + b, 0) * 2
        : targetState.militaryStrength;
    const militaryRatio = countryState.militaryStrength / Math.max(1, playerStrength);
    score += Math.min(1, militaryRatio) * 0.3;

    // Factor 2: Target stability (weight 0.2)
    const targetStabilityIndex = STABILITY_ORDER.indexOf(targetState.stability);
    score += (targetStabilityIndex / 5) * 0.2;

    // Factor 3: Relationship (weight 0.2)
    const relationshipIndex = RELATIONSHIP_ORDER.indexOf(countryState.relationship);
    score += (relationshipIndex / 8) * 0.2;

    // Factor 4: Other wars (weight 0.1) - more opportunities if target is busy
    const targetWars = state.wars.filter(
      (w) => w.attacker === target || w.defender === target
    ).length;
    score += Math.min(1, targetWars * 0.25) * 0.1;

    // Factor 5: Own stability (weight 0.1) - don't attack if unstable
    const ownStabilityIndex = STABILITY_ORDER.indexOf(countryState.stability);
    score += ((5 - ownStabilityIndex) / 5) * 0.1;

    // Factor 6: Randomness based on risk tolerance (weight 0.1)
    score += Math.random() * RISK_WILDCARDS[leader.riskTolerance] * 0.1;

    return score;
  },

  /**
   * Evaluate nuclear development
   */
  evaluateNuclearDevelopment: (
    state: GameState,
    countryId: CountryId
  ): GameState => {
    const country = state.countries[countryId];
    const leader = country.leader;

    // Check if country can have nuclear program
    // Only major powers pursue nuclear weapons
    if (!['iraq', 'iran', 'libya'].includes(countryId)) {
      return state;
    }

    // Probability based on aggression
    const nuclearChance = NUCLEAR_PRIORITIES[leader.aggression];

    if (Math.random() < nuclearChance) {
      // Progress nuclear program
      const newProgress = country.nuclearProgress + 1;
      const stageThresholds = {
        none: 6,
        research: 12,
        development: 18,
        testing: 24,
        operational: Infinity,
      };

      let newStage = country.nuclearStage;
      let resetProgress = newProgress;

      if (newProgress >= stageThresholds[country.nuclearStage]) {
        // Advance to next stage
        const stages = ['none', 'research', 'development', 'testing', 'operational'] as const;
        const currentIndex = stages.indexOf(country.nuclearStage);
        if (currentIndex < stages.length - 1) {
          newStage = stages[currentIndex + 1];
          resetProgress = 0;
        }
      }

      const newCountries = {
        ...state.countries,
        [countryId]: {
          ...country,
          nuclearStage: newStage,
          nuclearProgress: resetProgress,
        },
      };

      return {
        ...state,
        countries: newCountries,
      };
    }

    return state;
  },

  /**
   * Evaluate alliance building with other countries
   */
  evaluateAllianceBuilding: (
    state: GameState,
    countryId: CountryId
  ): GameState => {
    const country = state.countries[countryId];
    const leader = country.leader;

    // Dovish leaders seek alliances more
    const allianceChance = leader.aggression === 'dovish' ? 0.3 : 0.1;

    if (Math.random() < allianceChance) {
      // Find potential ally (another AI country with hostile relationship to Israel)
      const potentialAllies = AI_COUNTRIES.filter((id) => {
        if (id === countryId) return false;
        const other = state.countries[id];
        if (other.isDefeated) return false;
        // Look for countries also hostile to Israel
        const relationshipIndex = RELATIONSHIP_ORDER.indexOf(other.relationship);
        return relationshipIndex >= 5; // Cool or worse
      });

      if (potentialAllies.length > 0) {
        // In a full implementation, this would create alliance mechanics
        // For now, just boost the country's strength slightly
        const newCountries = {
          ...state.countries,
          [countryId]: {
            ...country,
            militaryStrength: country.militaryStrength + 2,
          },
        };

        return {
          ...state,
          countries: newCountries,
        };
      }
    }

    return state;
  },

  /**
   * Evaluate destabilization operations against Israel
   */
  evaluateDestabilization: (
    state: GameState,
    countryId: CountryId
  ): GameState => {
    const country = state.countries[countryId];

    // Only hostile countries destabilize
    const relationshipIndex = RELATIONSHIP_ORDER.indexOf(country.relationship);
    if (relationshipIndex < 5) return state; // Need cool or worse

    // 20% chance to support Palestinian insurgency
    if (Math.random() < 0.2) {
      // This would increase Palestinian unrest
      // For now, increase player's violence points indirectly
      const currentLevel = state.player.palestinianLevel;
      const levels = ['calm', 'unrest', 'protests', 'violence', 'intifada'] as const;
      const currentIndex = levels.indexOf(currentLevel);

      if (currentIndex < levels.length - 1 && Math.random() < 0.3) {
        return {
          ...state,
          player: {
            ...state.player,
            palestinianLevel: levels[currentIndex + 1],
          },
        };
      }
    }

    return state;
  },

  /**
   * Execute military buildup
   */
  executeMilitaryBuildup: (
    state: GameState,
    countryId: CountryId
  ): GameState => {
    const country = state.countries[countryId];

    // Abstract military buildup for AI countries
    // Increase strength by 1-3 based on stability
    const stabilityIndex = STABILITY_ORDER.indexOf(country.stability);
    const buildupRate = Math.max(1, 3 - stabilityIndex);

    const newCountries = {
      ...state.countries,
      [countryId]: {
        ...country,
        militaryStrength: country.militaryStrength + buildupRate,
      },
    };

    return {
      ...state,
      countries: newCountries,
    };
  },

  /**
   * Execute wildcard action
   */
  executeWildcard: (state: GameState, countryId: CountryId): GameState => {
    const wildcardActions = [
      'sudden_diplomatic_shift',
      'military_parade',
      'economic_crisis',
      'leader_speech',
      'border_incident',
    ];

    const action = wildcardActions[Math.floor(Math.random() * wildcardActions.length)];

    switch (action) {
      case 'sudden_diplomatic_shift':
        // Random relationship change
        return Math.random() < 0.5
          ? DiplomacyEngine.improveRelationship(state, countryId, 'israel')
          : DiplomacyEngine.worsenRelationship(state, countryId, 'israel');

      case 'military_parade': {
        // Small military boost
        const country = state.countries[countryId];
        return {
          ...state,
          countries: {
            ...state.countries,
            [countryId]: {
              ...country,
              militaryStrength: country.militaryStrength + 5,
            },
          },
        };
      }

      case 'economic_crisis': {
        // Decrease military strength
        const countryEc = state.countries[countryId];
        return {
          ...state,
          countries: {
            ...state.countries,
            [countryId]: {
              ...countryEc,
              militaryStrength: Math.max(10, countryEc.militaryStrength - 10),
            },
          },
        };
      }

      case 'leader_speech':
        // Worsen relations
        return DiplomacyEngine.worsenRelationship(state, countryId, 'israel');

      case 'border_incident':
        // Minor incident - increase player violence points
        return {
          ...state,
          player: {
            ...state.player,
            violencePoints: state.player.violencePoints + 1,
          },
        };

      default:
        return state;
    }
  },

  /**
   * Generate wildcard action description (for logging/display)
   */
  generateWildcard: (state: GameState, country: CountryId): string => {
    const countryState = state.countries[country];
    const wildcards = [
      `${countryState.leader.name} makes unexpected diplomatic overture`,
      `${country} holds massive military parade`,
      `Economic troubles hit ${country}`,
      `${countryState.leader.name} gives fiery speech`,
      `Border incident reported near ${country}`,
    ];

    return wildcards[Math.floor(Math.random() * wildcards.length)];
  },

  /**
   * Decide budget allocation for AI country
   */
  allocateBudget: (
    state: GameState,
    country: CountryId
  ): { military: number; nuclear: number; reserve: number } => {
    const countryState = state.countries[country];

    // Check if at war
    const atWar = state.wars.some(
      (w) => w.attacker === country || w.defender === country
    );

    // Check if threatened (hostile neighbor or unstable)
    const stabilityIndex = STABILITY_ORDER.indexOf(countryState.stability);
    const threatened = stabilityIndex >= 3; // Weak or worse

    if (atWar) {
      return { military: 0.9, nuclear: 0.1, reserve: 0.0 };
    } else if (threatened) {
      return { military: 0.6, nuclear: 0.3, reserve: 0.1 };
    } else {
      return { military: 0.3, nuclear: 0.4, reserve: 0.3 };
    }
  },
};
