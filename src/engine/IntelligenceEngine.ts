// ============================================
// Intelligence Engine - Covert Operations
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  CountryId,
  ExtremeMeasureType,
  InsurgencyLevel,
  StabilityLevel,
} from '../types/game';

// Insurgency levels in order from none to worst
const INSURGENCY_ORDER: InsurgencyLevel[] = [
  'none', 'scattered', 'organized', 'armed', 'guerilla_force', 'open_revolt'
];

// Stability levels in order from best to worst
const STABILITY_ORDER: StabilityLevel[] = [
  'very_solid', 'solid', 'good', 'weak', 'critical', 'collapse'
];

// Monthly destabilization per insurgency level
const INSURGENCY_DESTABILIZATION: Record<InsurgencyLevel, number> = {
  none: 0,
  scattered: 0.02,
  organized: 0.05,
  armed: 0.1,
  guerilla_force: 0.15,
  open_revolt: 0.25,
};

/**
 * Handles intelligence and covert operations
 */
export const IntelligenceEngine = {
  /**
   * Apply player's intelligence actions for the turn
   */
  applyPlayerActions: (state: GameState): GameState => {
    const actions = state.player.turnActions.intelligenceActions;
    if (Object.keys(actions).length === 0) return state;

    const newState = { ...state };
    const newCountries = { ...state.countries };

    for (const [countryIdStr, action] of Object.entries(actions)) {
      const countryId = countryIdStr as CountryId;
      if (!action || countryId === 'israel') continue;

      const country = newCountries[countryId];
      if (!country || country.isDefeated) continue;

      switch (action) {
        case 'support_insurgents': {
          // Increase insurgency in target country
          const currentInsurgencyIndex = INSURGENCY_ORDER.indexOf(country.insurgency);
          if (currentInsurgencyIndex < INSURGENCY_ORDER.length - 1) {
            // 40% base chance to increase insurgency
            if (Math.random() < 0.4) {
              newCountries[countryId] = {
                ...country,
                insurgency: INSURGENCY_ORDER[currentInsurgencyIndex + 1],
              };
            }
          }
          break;
        }

        case 'disrupt_insurgents':
          // This would be used in countries where Israel wants stability
          // For now, mostly used for Palestinian territories (handled elsewhere)
          break;

        case 'do_nothing':
          // No action
          break;
      }
    }

    newState.countries = newCountries;
    return newState;
  },

  /**
   * Update country stability based on insurgency
   */
  updateStability: (state: GameState): GameState => {
    const newCountries = { ...state.countries };

    for (const [countryIdStr, country] of Object.entries(state.countries)) {
      const countryId = countryIdStr as CountryId;
      if (countryId === 'israel' || country.isDefeated) continue;

      // Get destabilization rate from insurgency
      const destabilizationRate = INSURGENCY_DESTABILIZATION[country.insurgency];

      if (destabilizationRate > 0 && Math.random() < destabilizationRate) {
        const currentStabilityIndex = STABILITY_ORDER.indexOf(country.stability);
        if (currentStabilityIndex < STABILITY_ORDER.length - 1) {
          newCountries[countryId] = {
            ...country,
            stability: STABILITY_ORDER[currentStabilityIndex + 1],
          };
        }
      }
    }

    return {
      ...state,
      countries: newCountries,
    };
  },

  /**
   * Check if extreme measure is available
   */
  canAttemptExtremeMeasure: (
    state: GameState,
    country: CountryId,
    type: ExtremeMeasureType
  ): boolean => {
    const countryState = state.countries[country];
    if (!countryState || countryState.isDefeated) return false;

    // Target country must be at weak or critical stability
    if (countryState.stability !== 'weak' && countryState.stability !== 'critical') {
      return false;
    }

    // For assassination, leader must not be "strong"
    if (type === 'assassination' && countryState.leader.strength === 'strong') {
      return false;
    }

    // For coup, need organized insurgency or higher
    if (type === 'coup') {
      const insurgencyIndex = INSURGENCY_ORDER.indexOf(countryState.insurgency);
      if (insurgencyIndex < 2) return false; // Need at least "organized"
    }

    return true;
  },

  /**
   * Attempt assassination or coup
   */
  attemptExtremeMeasure: (
    state: GameState,
    country: CountryId,
    type: ExtremeMeasureType
  ): { state: GameState; success: boolean; message: string } => {
    if (!IntelligenceEngine.canAttemptExtremeMeasure(state, country, type)) {
      return { state, success: false, message: 'Conditions not met for extreme measure' };
    }

    const countryState = state.countries[country];
    const successChance = IntelligenceEngine.calculateSuccessChance(
      type,
      countryState.stability,
      countryState.insurgency
    );

    const success = Math.random() < successChance;
    let newState = state;
    let message = '';

    if (success) {
      const newCountries = {
        ...state.countries,
        [country]: {
          ...countryState,
          stability: 'collapse' as StabilityLevel,
          isDefeated: true,
          defeatedBy: 'israel' as CountryId,
          defeatedOnTurn: state.turn,
        },
      };

      // Violence points increase
      const newPlayer = {
        ...state.player,
        violencePoints: state.player.violencePoints + (type === 'assassination' ? 3 : 5),
        usAttitude: Math.max(-100, state.player.usAttitude - 15),
      };

      newState = {
        ...state,
        countries: newCountries,
        player: newPlayer,
      };

      message = type === 'assassination'
        ? `Assassination successful. ${countryState.leader.name} has been eliminated.`
        : `Coup successful. The government of ${country} has collapsed.`;
    } else {
      // Failure has consequences
      const newPlayer = {
        ...state.player,
        usAttitude: Math.max(-100, state.player.usAttitude - 25),
        knessetDisapproval: Math.min(10, state.player.knessetDisapproval + 2),
      };

      newState = {
        ...state,
        player: newPlayer,
      };

      message = type === 'assassination'
        ? 'Assassination attempt failed! International condemnation follows.'
        : 'Coup attempt failed! The plot was discovered.';

      // Small chance of retaliation (assassination attempt on player)
      if (Math.random() < 0.1) {
        // Check if player survives
        if (Math.random() < 0.3) {
          newState = {
            ...newState,
            endState: {
              type: 'defeat',
              condition: 'assassination',
              finalScore: 0,
              leadershipStyle: 'Reckless',
              narrative: 'You were assassinated in retaliation for your failed covert operation.',
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
          message = 'Your failed operation led to a retaliatory assassination. Game over.';
        }
      }
    }

    return { state: newState, success, message };
  },

  /**
   * Calculate success chance for extreme measure
   */
  calculateSuccessChance: (
    type: ExtremeMeasureType,
    targetStability: StabilityLevel,
    targetInsurgency: InsurgencyLevel
  ): number => {
    let baseChance = type === 'assassination' ? 0.3 : 0.25;

    // Stability affects success
    if (targetStability === 'critical') baseChance += 0.2;
    else if (targetStability === 'weak') baseChance += 0.1;

    // Insurgency affects coup success
    if (type === 'coup') {
      const insurgencyIndex = INSURGENCY_ORDER.indexOf(targetInsurgency);
      baseChance += insurgencyIndex * 0.05;
    }

    return Math.min(0.8, baseChance); // Cap at 80%
  },

  /**
   * Check for country collapse due to insurgency
   */
  checkForCollapse: (state: GameState): GameState => {
    const newCountries = { ...state.countries };
    let anyCollapse = false;

    for (const [countryIdStr, country] of Object.entries(state.countries)) {
      const countryId = countryIdStr as CountryId;
      if (countryId === 'israel' || country.isDefeated) continue;

      if (country.stability === 'collapse') {
        newCountries[countryId] = {
          ...country,
          isDefeated: true,
          defeatedOnTurn: state.turn,
        };
        anyCollapse = true;
      }
    }

    if (!anyCollapse) return state;

    return {
      ...state,
      countries: newCountries,
    };
  },

  /**
   * Get insurgency level name
   */
  getInsurgencyName: (level: InsurgencyLevel): string => {
    const names: Record<InsurgencyLevel, string> = {
      none: 'None',
      scattered: 'Scattered',
      organized: 'Organized',
      armed: 'Armed',
      guerilla_force: 'Guerilla Force',
      open_revolt: 'Open Revolt',
    };
    return names[level];
  },
};
