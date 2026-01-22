// ============================================
// Diplomacy Engine - Relationship Management
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  CountryId,
  DiplomaticAction,
  RelationshipLevel,
  DiplomaticStance,
} from '../types/game';
import type { EnumsData } from '../types/data';

// Fallback relationship levels in order from best to worst
const RELATIONSHIP_ORDER: RelationshipLevel[] = [
  'military_pact',
  'profitable',
  'beneficial',
  'favourable',
  'satisfactory',
  'cool',
  'lamentable',
  'hostile',
  'war',
];

// Get relationship order - use YAML if available, otherwise fallback
const getRelationshipOrder = (enumsData?: EnumsData): RelationshipLevel[] => {
  if (enumsData?.relationshipLevels) {
    // Extract ordered list from YAML relationshipLevels
    return Object.keys(enumsData.relationshipLevels) as RelationshipLevel[];
  }
  return RELATIONSHIP_ORDER;
};

// Get numeric index for a relationship level
const getRelationshipIndex = (level: RelationshipLevel, enumsData?: EnumsData): number => {
  const order = getRelationshipOrder(enumsData);
  return order.indexOf(level);
};

// Get relationship level from index (clamped to valid range)
const getRelationshipFromIndex = (index: number, enumsData?: EnumsData): RelationshipLevel => {
  const order = getRelationshipOrder(enumsData);
  const clampedIndex = Math.max(0, Math.min(index, order.length - 1));
  return order[clampedIndex];
};

/**
 * Handles all diplomatic operations
 */
export const DiplomacyEngine = {
  /**
   * Apply player's diplomatic actions for the turn
   */
  applyPlayerActions: (state: GameState): GameState => {
    const newState = { ...state };
    const newCountries = { ...state.countries };
    const actions = state.player.turnActions.diplomaticActions;

    for (const [countryIdStr, action] of Object.entries(actions)) {
      const countryId = countryIdStr as CountryId;
      if (!action || countryId === 'israel') continue;

      const country = newCountries[countryId];
      if (!country || country.isDefeated) continue;

      const currentLevel = country.relationship;
      const targetStance = country.stance;

      // Calculate the relationship change
      const change = DiplomacyEngine.calculateActionEffect(currentLevel, action, targetStance);

      if (change !== 0) {
        const currentIndex = getRelationshipIndex(currentLevel);
        const newIndex = currentIndex + change;
        const newLevel = getRelationshipFromIndex(newIndex);

        newCountries[countryId] = {
          ...country,
          relationship: newLevel,
        };
      }
    }

    newState.countries = newCountries;
    return newState;
  },

  /**
   * Update relationships based on stances (natural drift)
   * Aggressive countries tend to worsen relations, friendly tend to improve
   */
  updateRelationships: (state: GameState): GameState => {
    const newState = { ...state };
    const newCountries = { ...state.countries };

    for (const [countryIdStr, country] of Object.entries(state.countries)) {
      const countryId = countryIdStr as CountryId;
      if (countryId === 'israel' || country.isDefeated) continue;

      // Check for natural drift based on stance
      const currentIndex = getRelationshipIndex(country.relationship);
      let drift = 0;

      // Aggressive countries naturally worsen relations (10% chance per turn)
      if (country.stance === 'aggressive' && Math.random() < 0.1) {
        drift = 1; // Positive index = worse relationship
      }
      // Friendly countries naturally improve relations (10% chance per turn)
      else if (country.stance === 'friendly' && Math.random() < 0.1) {
        drift = -1; // Negative index = better relationship
      }

      // Don't drift into or out of war/military_pact automatically
      const newIndex = currentIndex + drift;
      if (newIndex >= 0 && newIndex < RELATIONSHIP_ORDER.length - 1 && // Don't auto-drift to war
          newIndex > 0 && // Don't auto-drift to military_pact
          drift !== 0) {
        const newLevel = getRelationshipFromIndex(newIndex);
        newCountries[countryId] = {
          ...country,
          relationship: newLevel,
        };
      }
    }

    newState.countries = newCountries;
    return newState;
  },

  /**
   * Check if player can request a military pact
   */
  canRequestPact: (state: GameState, country: CountryId): boolean => {
    const countryState = state.countries[country];
    if (!countryState || countryState.isDefeated) return false;

    // Can only request pact at "profitable" level
    return countryState.relationship === 'profitable';
  },

  /**
   * Process military pact request
   * AI may accept based on leader personality and game state
   */
  requestPact: (state: GameState, country: CountryId): { state: GameState; accepted: boolean } => {
    if (!DiplomacyEngine.canRequestPact(state, country)) {
      return { state, accepted: false };
    }

    const countryState = state.countries[country];

    // Calculate acceptance probability based on:
    // - Leader aggression (dovish more likely to accept)
    // - Current stance
    // - Player prestige
    let acceptChance = 0.3; // Base chance

    if (countryState.leader.aggression === 'dovish') {
      acceptChance += 0.3;
    } else if (countryState.leader.aggression === 'hawkish') {
      acceptChance -= 0.2;
    }

    if (countryState.stance === 'friendly') {
      acceptChance += 0.2;
    } else if (countryState.stance === 'aggressive') {
      acceptChance -= 0.3;
    }

    // Prestige bonus
    acceptChance += state.player.prestige * 0.02;

    const accepted = Math.random() < acceptChance;

    if (accepted) {
      const newCountries = {
        ...state.countries,
        [country]: {
          ...countryState,
          relationship: 'military_pact' as RelationshipLevel,
          stance: 'friendly' as DiplomaticStance,
        },
      };

      return {
        state: { ...state, countries: newCountries },
        accepted: true,
      };
    }

    return { state, accepted: false };
  },

  /**
   * Calculate the effect of a diplomatic action
   * Returns change in relationship index (positive = worse, negative = better)
   */
  calculateActionEffect: (
    currentLevel: RelationshipLevel,
    action: DiplomaticAction,
    targetStance: DiplomaticStance
  ): number => {
    // Base effect
    let effect = 0;

    switch (action) {
      case 'improve':
        effect = -1; // Move toward better relationship (lower index)
        break;
      case 'worsen':
        effect = 1; // Move toward worse relationship (higher index)
        break;
      case 'maintain':
        effect = 0;
        break;
    }

    if (effect === 0) return 0;

    // Stance modifiers
    // Improving relations with aggressive countries is harder
    if (action === 'improve' && targetStance === 'aggressive') {
      // 50% chance improvement fails
      if (Math.random() < 0.5) {
        effect = 0;
      }
    }

    // Improving relations with friendly countries is easier
    if (action === 'improve' && targetStance === 'friendly') {
      // Sometimes get double improvement
      if (Math.random() < 0.3) {
        effect = -2;
      }
    }

    // Can't improve beyond military_pact or worsen beyond hostile (war requires declaration)
    const currentIndex = getRelationshipIndex(currentLevel);
    const newIndex = currentIndex + effect;

    // Clamp to valid range (excluding military_pact at 0 and war at 8)
    if (newIndex <= 0) effect = -currentIndex + 1; // Stop at profitable
    if (newIndex >= 8) effect = 7 - currentIndex; // Stop at hostile

    return effect;
  },

  /**
   * Get the display name for a relationship level
   */
  getRelationshipName: (level: RelationshipLevel): string => {
    const names: Record<RelationshipLevel, string> = {
      military_pact: 'Military Pact',
      profitable: 'Profitable',
      beneficial: 'Beneficial',
      favourable: 'Favourable',
      satisfactory: 'Satisfactory',
      cool: 'Cool',
      lamentable: 'Lamentable',
      hostile: 'Hostile',
      war: 'War',
    };
    return names[level];
  },

  /**
   * Directly improve relationship by one level (used by AI)
   */
  improveRelationship: (state: GameState, from: CountryId, to: CountryId): GameState => {
    const target = to === 'israel' ? from : to;
    const country = state.countries[target];
    if (!country || country.isDefeated) return state;

    const currentIndex = getRelationshipIndex(country.relationship);
    // Can't improve beyond profitable (military pact requires request)
    if (currentIndex <= 1) return state;

    const newLevel = getRelationshipFromIndex(currentIndex - 1);
    return {
      ...state,
      countries: {
        ...state.countries,
        [target]: {
          ...country,
          relationship: newLevel,
        },
      },
    };
  },

  /**
   * Directly worsen relationship by one level (used by AI)
   */
  worsenRelationship: (state: GameState, from: CountryId, to: CountryId): GameState => {
    const target = to === 'israel' ? from : to;
    const country = state.countries[target];
    if (!country || country.isDefeated) return state;

    const currentIndex = getRelationshipIndex(country.relationship);
    // Can't worsen beyond hostile (war requires declaration)
    if (currentIndex >= 7) return state;

    const newLevel = getRelationshipFromIndex(currentIndex + 1);
    return {
      ...state,
      countries: {
        ...state.countries,
        [target]: {
          ...country,
          relationship: newLevel,
        },
      },
    };
  },

  /**
   * Check if war can be declared against a country
   */
  canDeclareWar: (state: GameState, country: CountryId): boolean => {
    const countryState = state.countries[country];
    if (!countryState || countryState.isDefeated) return false;

    // Must be at hostile relationship
    if (countryState.relationship !== 'hostile') return false;

    // Must have troops deployed on border (at least 1 brigade)
    const deployedTroops = state.player.deployedTroops[country] || 0;
    return deployedTroops > 0;
  },

  /**
   * Declare war against a country
   */
  declareWar: (state: GameState, country: CountryId): GameState => {
    if (!DiplomacyEngine.canDeclareWar(state, country)) {
      return state;
    }

    const newCountries = {
      ...state.countries,
      [country]: {
        ...state.countries[country],
        relationship: 'war' as RelationshipLevel,
      },
    };

    // Create new war
    const newWar = {
      id: `war_${state.turn}_${country}`,
      attacker: 'israel' as CountryId,
      defender: country,
      startTurn: state.turn,
      progress: 0,
      attackerLosses: {},
      defenderLosses: {},
    };

    return {
      ...state,
      countries: newCountries,
      wars: [...state.wars, newWar],
    };
  },
};
