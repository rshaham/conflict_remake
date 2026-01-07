// ============================================
// Scoring Engine - Win/Lose and Scoring
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  EndState,
  EndConditionType,
  CountryId,
  NeighborCountryId,
} from '../types/game';

// The four neighbors that must be defeated to win
const NEIGHBOR_COUNTRIES: NeighborCountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

// Prestige level names
const PRESTIGE_LEVELS = [
  { min: 0, name: 'None' },
  { min: 1, name: 'Low' },
  { min: 3, name: 'Rising' },
  { min: 5, name: 'High' },
  { min: 7, name: 'Respected' },
  { min: 9, name: 'Legendary' },
];

// Leadership styles based on game stats
const LEADERSHIP_STYLES = [
  {
    id: 'warmonger',
    name: 'Warmonger',
    description: 'Achieved victory through overwhelming military force.',
    conditions: { minWarsWon: 4, minViolencePoints: 20 },
  },
  {
    id: 'hawk',
    name: 'Hawk',
    description: 'Preferred military solutions but maintained some restraint.',
    conditions: { minWarsWon: 2, minViolencePoints: 10 },
  },
  {
    id: 'diplomat',
    name: 'Diplomatic',
    description: 'Master negotiator who achieved peace through diplomacy.',
    conditions: { maxViolencePoints: 5, palestinianHomeland: true },
  },
  {
    id: 'popular',
    name: 'Popular',
    description: 'Beloved by the people for balancing security and peace.',
    conditions: { maxViolencePoints: 10, minPrestige: 5 },
  },
  {
    id: 'ruthless',
    name: 'Ruthless',
    description: 'Did whatever it took to ensure survival.',
    conditions: { minViolencePoints: 15 },
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Against all odds, Israel endured.',
    conditions: {}, // Default
  },
];

/**
 * Handles win/lose conditions and final scoring
 */
export const ScoringEngine = {
  /**
   * Check for end game conditions
   */
  checkEndConditions: (state: GameState): EndConditionType | null => {
    // Victory: All 4 neighbors defeated
    const allNeighborsDefeated = NEIGHBOR_COUNTRIES.every(
      (id) => state.countries[id].isDefeated
    );
    if (allNeighborsDefeated) {
      return 'total_victory';
    }

    // Defeat: Player government collapse (would be tracked separately)
    // For now, check knesset disapproval
    if (state.player.knessetDisapproval >= 10) {
      return 'impeachment';
    }

    // Nuclear holocaust (checked in CombatEngine when nuclear strike is used)
    if (state.endState?.condition === 'nuclear_holocaust') {
      return 'nuclear_holocaust';
    }

    // Assassination (checked in IntelligenceEngine)
    if (state.endState?.condition === 'assassination') {
      return 'assassination';
    }

    // Military defeat - if Israel loses a war (no longer has military capacity)
    const totalForces = Object.values(state.player.arsenal).reduce((a, b) => a + b, 0);
    if (totalForces === 0 && state.wars.length > 0) {
      return 'military_defeat';
    }

    return null;
  },

  /**
   * Calculate final score
   */
  calculateScore: (state: GameState): number => {
    let score = 0;

    // Base score for surviving
    score += state.turn * 2;

    // Countries defeated (25 points each for neighbors, 10 for others)
    for (const country of Object.values(state.countries)) {
      if (country.isDefeated && country.defeatedBy === 'israel') {
        if (NEIGHBOR_COUNTRIES.includes(country.id as NeighborCountryId)) {
          score += 25;
        } else {
          score += 10;
        }
      }
    }

    // Prestige bonus
    score += state.player.prestige * 5;

    // US attitude bonus/penalty
    score += Math.floor(state.player.usAttitude / 2);

    // Knesset approval bonus
    score += (10 - state.player.knessetDisapproval) * 2;

    // Violence points penalty
    score -= state.player.violencePoints;

    // Nuclear capability bonus
    if (state.player.nuclearStage === 'operational') {
      score += 20;
    }

    // Budget bonus (millions)
    score += Math.floor(state.player.budget / 10000000);

    // Wars won bonus
    const warsWon = Object.values(state.countries).filter(
      (c) => c.isDefeated && c.defeatedBy === 'israel'
    ).length;
    score += warsWon * 10;

    return Math.max(0, score);
  },

  /**
   * Determine leadership style based on game stats
   */
  determineLeadershipStyle: (state: GameState): string => {
    const warsWon = Object.values(state.countries).filter(
      (c) => c.isDefeated && c.defeatedBy === 'israel'
    ).length;

    for (const style of LEADERSHIP_STYLES) {
      const { conditions } = style;
      let matches = true;

      if (conditions.minWarsWon !== undefined && warsWon < conditions.minWarsWon) {
        matches = false;
      }
      if (conditions.minViolencePoints !== undefined &&
          state.player.violencePoints < conditions.minViolencePoints) {
        matches = false;
      }
      if (conditions.maxViolencePoints !== undefined &&
          state.player.violencePoints > conditions.maxViolencePoints) {
        matches = false;
      }
      if (conditions.palestinianHomeland !== undefined &&
          state.player.palestinianHomeland !== conditions.palestinianHomeland) {
        matches = false;
      }
      if (conditions.minPrestige !== undefined &&
          state.player.prestige < conditions.minPrestige) {
        matches = false;
      }

      if (matches) {
        return style.name;
      }
    }

    return 'Survivor';
  },

  /**
   * Generate complete end state
   */
  generateEndState: (
    state: GameState,
    condition: EndConditionType
  ): EndState => {
    const isVictory = condition === 'total_victory';
    const finalScore = ScoringEngine.calculateScore(state);
    const leadershipStyle = ScoringEngine.determineLeadershipStyle(state);

    // Calculate statistics
    const countriesDefeated = Object.entries(state.countries)
      .filter(([, country]) => country.isDefeated && country.defeatedBy === 'israel')
      .map(([id]) => id as CountryId);

    const totalWeaponsPurchased = Object.values(state.player.vendorPurchases).reduce(
      (a, b) => a + b,
      0
    );

    const statistics = {
      turnsPlayed: state.turn,
      warsWon: countriesDefeated.length,
      warsLost: isVictory ? 0 : 1,
      countriesDefeated,
      totalWeaponsPurchased,
      totalAirstrikes: state.player.violencePoints, // Approximation
      peakPrestige: state.player.prestige,
      peakKnessetDisapproval: state.player.knessetDisapproval,
    };

    // Generate narrative based on condition
    let narrative = '';
    switch (condition) {
      case 'total_victory':
        narrative = `Under your leadership, Israel achieved complete regional dominance. Through a combination of ${leadershipStyle.toLowerCase()} tactics, you systematically neutralized each neighboring threat. History will remember you as the Prime Minister who secured Israel's future for generations to come.`;
        break;
      case 'military_defeat':
        narrative = `Israel's military forces were overwhelmed. Despite your efforts, the combined strength of your enemies proved too great. The nation falls to foreign invasion.`;
        break;
      case 'nuclear_holocaust':
        narrative = `Your decision to use nuclear weapons triggered a devastating response. Both nations lie in ruins. There are no winners in nuclear war.`;
        break;
      case 'impeachment':
        narrative = `The Knesset has lost confidence in your leadership. Amid growing public outrage and political opposition, you have been removed from office. A new Prime Minister will inherit the challenges you leave behind.`;
        break;
      case 'assassination':
        narrative = `Your aggressive policies made you many enemies. An assassin's bullet has ended your tenure. Israel must find new leadership in these troubled times.`;
        break;
      default:
        narrative = `Your time as Prime Minister has come to an end.`;
    }

    return {
      type: isVictory ? 'victory' : 'defeat',
      condition,
      finalScore,
      leadershipStyle,
      narrative,
      statistics,
    };
  },

  /**
   * Get prestige level name from numeric value
   */
  getPrestigeLevel: (value: number): string => {
    for (let i = PRESTIGE_LEVELS.length - 1; i >= 0; i--) {
      if (value >= PRESTIGE_LEVELS[i].min) {
        return PRESTIGE_LEVELS[i].name;
      }
    }
    return 'None';
  },

  /**
   * Check if all neighbors are defeated (victory condition)
   */
  checkVictory: (state: GameState): boolean => {
    return NEIGHBOR_COUNTRIES.every((id) => state.countries[id].isDefeated);
  },

  /**
   * Get defeated neighbor count
   */
  getDefeatedNeighborCount: (state: GameState): number => {
    return NEIGHBOR_COUNTRIES.filter((id) => state.countries[id].isDefeated).length;
  },
};
