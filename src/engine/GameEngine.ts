// ============================================
// Game Engine - Turn Resolution Orchestrator
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  GamePhase,
  CountryId,
  CountryState,
  PlayerState,
  DifficultyId,
  ScenarioId,
  TurnActions,
  LeaderState,
  RelationshipLevel,
  StabilityLevel,
  InsurgencyLevel,
  NuclearStage,
  DiplomaticStance,
  TurnResults,
  AirstrikeResult,
  WarTurnResult,
  DiplomaticShift,
  PalestinianLevel,
} from '../types/game';
import type { GameData } from '../types/data';

import { DiplomacyEngine } from './DiplomacyEngine';
import { EconomyEngine } from './EconomyEngine';
import { CombatEngine } from './CombatEngine';
import { IntelligenceEngine } from './IntelligenceEngine';
import { PalestinianEngine } from './PalestinianEngine';
import { ScoringEngine } from './ScoringEngine';

/**
 * Main game engine that orchestrates turn resolution
 * All methods are pure functions: (state, action) => newState
 */
export const GameEngine = {
  /**
   * Resolve a complete turn
   * Called at end of Military phase
   */
  resolveTurn: (state: GameState): GameState => {
    let newState = { ...state };

    // Track results for headlines
    const airstrikeResults: AirstrikeResult[] = [];
    const warResults: WarTurnResult[] = [];
    const diplomaticShifts: DiplomaticShift[] = [];

    // Snapshot relationships before diplomatic actions
    const relationshipsBefore: Record<CountryId, RelationshipLevel> = {} as Record<CountryId, RelationshipLevel>;
    for (const [id, country] of Object.entries(state.countries)) {
      relationshipsBefore[id as CountryId] = country.relationship;
    }

    // Track economy
    const startingBudget = newState.player.budget;
    const economyDetails: string[] = [];

    // 1. Apply player diplomatic actions
    newState = DiplomacyEngine.applyPlayerActions(newState);

    // 2. Apply player intelligence actions
    newState = IntelligenceEngine.applyPlayerActions(newState);

    // 3. Process weapon purchases and deliveries
    const purchasesBefore = [...newState.player.turnActions.weaponPurchases];
    newState = EconomyEngine.processPurchases(newState);
    newState = EconomyEngine.processDeliveries(newState);

    // Track delivered weapons
    for (const purchase of purchasesBefore) {
      economyDetails.push(`Purchased ${purchase.quantity}x ${purchase.weaponId} for $${(purchase.totalCost / 1000000).toFixed(1)}M`);
    }

    // 4. Process airstrikes with results
    const airstrikes = newState.player.turnActions.airstrikes;
    for (const airstrike of airstrikes) {
      const { state: postAirstrikeState, result } = CombatEngine.executeAirstrikeWithResult(newState, airstrike);
      newState = postAirstrikeState;
      airstrikeResults.push(result);
    }

    // 5. Resolve active wars with results
    for (const war of [...newState.wars]) {
      const { state: postWarState, result } = CombatEngine.resolveWarTurnWithResult(newState, war.id);
      newState = postWarState;
      warResults.push(result);
    }

    // 6. Update relationships (natural drift from stances)
    newState = DiplomacyEngine.updateRelationships(newState);

    // Track all diplomatic shifts (from player actions and natural drift)
    for (const [id, country] of Object.entries(newState.countries)) {
      const countryId = id as CountryId;
      if (countryId === 'israel') continue;
      const before = relationshipsBefore[countryId];
      const after = country.relationship;
      if (before !== after) {
        diplomaticShifts.push({ country: countryId, from: before, to: after });
      }
    }

    // 7. Update stability based on insurgency
    newState = IntelligenceEngine.updateStability(newState);

    // 8. Check for country collapses
    newState = IntelligenceEngine.checkForCollapse(newState);

    // 9. Add monthly income
    const incomeAmount = EconomyEngine.calculateMonthlyIncome(newState);
    newState = EconomyEngine.addMonthlyIncome(newState);
    economyDetails.push(`Monthly income: $${(incomeAmount / 1000000).toFixed(1)}M`);

    // 10. Resolve Palestinian situation
    const palestinianBefore = newState.player.palestinianLevel;
    newState = PalestinianEngine.resolvePalestinianPhase(newState);
    const palestinianAfter = newState.player.palestinianLevel;

    // 11. Progress nuclear programs (simplified)
    newState = GameEngine.progressNuclearPrograms(newState);

    // Build turn results
    const turnResults: TurnResults = {
      airstrikes: airstrikeResults,
      wars: warResults,
      economy: {
        startingBudget,
        income: incomeAmount,
        expenses: purchasesBefore.reduce((sum, p) => sum + p.totalCost, 0),
        endingBudget: newState.player.budget,
        details: economyDetails,
      },
      diplomaticShifts,
    };

    // Add nuclear progress if player has a program
    if (newState.player.nuclearStage !== 'none') {
      const requiredMonths = getNuclearStageRequirement(newState.player.nuclearStage);
      turnResults.nuclearProgress = {
        stage: newState.player.nuclearStage,
        monthsComplete: newState.player.nuclearProgress,
        monthsRequired: requiredMonths,
      };
    }

    // Add Palestinian change if it changed
    if (palestinianBefore !== palestinianAfter) {
      turnResults.palestinianChange = {
        from: palestinianBefore as PalestinianLevel,
        to: palestinianAfter as PalestinianLevel,
      };
    }

    // 12. Check win/lose conditions
    const endCondition = ScoringEngine.checkEndConditions(newState);
    if (endCondition) {
      newState = {
        ...newState,
        endState: ScoringEngine.generateEndState(newState, endCondition),
        phase: 'game_over',
        lastTurnResults: turnResults,
      };
      return newState;
    }

    // 13. Advance turn counter and reset turn actions
    newState = {
      ...newState,
      turn: newState.turn + 1,
      month: newState.month >= 12 ? 1 : newState.month + 1,
      year: newState.month >= 12 ? newState.year + 1 : newState.year,
      phase: 'news',
      player: {
        ...newState.player,
        turnActions: createEmptyTurnActions(),
      },
      lastTurnResults: turnResults,
    };

    // 14. Check for UN Summit (December)
    if (newState.month === 12) {
      newState = {
        ...newState,
        phase: 'un_summit',
      };
    }

    return newState;
  },

  /**
   * Advance to the next phase in the turn flow
   * Flow: news → events? → diplomatic → intelligence → military → war? → resolution...
   */
  advancePhase: (state: GameState): GameState => {
    const currentPhase = state.phase;

    // Determine next phase based on current phase and game state
    let nextPhase: GamePhase;

    switch (currentPhase) {
      case 'news':
        // Check for pending events
        nextPhase = state.pendingEvents.length > 0 ? 'events' : 'diplomatic';
        break;

      case 'events':
        nextPhase = 'diplomatic';
        break;

      case 'diplomatic':
        nextPhase = 'intelligence';
        break;

      case 'intelligence':
        nextPhase = 'military';
        break;

      case 'military':
        // Military is point of no return - don't auto-advance
        // End turn button handles resolution flow
        return state;

      case 'war':
        // After war management, continue to resolution
        nextPhase = 'airstrike_report';
        break;

      case 'airstrike_report':
        // If there were wars, show war report
        nextPhase = state.wars.length > 0 || (state.lastTurnResults?.wars?.length ?? 0) > 0
          ? 'war_report'
          : 'monthly_summary';
        break;

      case 'war_report':
        nextPhase = 'monthly_summary';
        break;

      case 'monthly_summary':
        // Check for UN Summit (December)
        nextPhase = state.month === 12 ? 'un_summit' : 'news';
        break;

      case 'un_summit':
        nextPhase = 'news';
        break;

      case 'game_over':
        // No advancement from game over
        return state;

      default:
        nextPhase = 'news';
    }

    return {
      ...state,
      phase: nextPhase,
    };
  },

  /**
   * Start the end-of-turn resolution flow
   * Called when player clicks "End Turn" in military phase
   */
  startResolution: (state: GameState): GameState => {
    // If there are active wars, go to war phase first
    if (state.wars.length > 0) {
      return {
        ...state,
        phase: 'war',
      };
    }

    // Otherwise skip to airstrike report (or further if no airstrikes)
    const hasAirstrikes = state.player.turnActions.airstrikes.length > 0;
    return {
      ...state,
      phase: hasAirstrikes ? 'airstrike_report' : 'monthly_summary',
    };
  },

  /**
   * Initialize a new game from scenario data
   * @param gameData - Optional YAML data (for future data-driven initialization)
   */
  initializeGame: (
    difficulty: DifficultyId,
    scenario: ScenarioId,
    gameData?: GameData
  ): GameState => {
    // Get difficulty settings - use YAML data if available, otherwise use hardcoded
    const difficultySettings = gameData?.settings?.difficulties?.[difficulty]
      ? {
          startingBudget: gameData.settings.difficulties[difficulty].startingBudget,
          usAttitudeStart: gameData.settings.difficulties[difficulty].usAttitudeStart,
          aiAggressionModifier: gameData.settings.difficulties[difficulty].aiAggressionModifier,
          relationshipModifier: gameData.settings.difficulties[difficulty].relationshipModifier,
        }
      : getDifficultySettings(difficulty);

    // Create initial state based on classic 1997 scenario
    const initialState: GameState = {
      gameId: `game_${Date.now()}`,
      turn: 1,
      month: 1,
      year: 1997,
      phase: 'news',
      difficulty,
      scenario,

      player: createInitialPlayerState(difficultySettings),

      countries: createInitialCountries(difficultySettings),

      wars: [],
      pendingEvents: [],

      history: {
        recentActions: [],
        recentEvents: [],
        headlines: ['You have been elected Prime Minister of Israel.'],
      },
    };

    return initialState;
  },

  /**
   * Check if the game should end
   */
  checkGameEnd: (state: GameState): boolean => {
    return state.endState !== undefined || state.phase === 'game_over';
  },

  /**
   * Progress nuclear programs for all countries
   */
  progressNuclearPrograms: (state: GameState): GameState => {
    const newCountries = { ...state.countries };

    // Progress AI country nuclear programs
    for (const [countryIdStr, country] of Object.entries(state.countries)) {
      const countryId = countryIdStr as CountryId;
      if (countryId === 'israel' || country.isDefeated) continue;

      if (country.nuclearStage !== 'none' && country.nuclearStage !== 'operational') {
        // AI countries progress their nuclear programs
        const newProgress = country.nuclearProgress + 1;
        const requiredProgress = getNuclearStageRequirement(country.nuclearStage);

        if (newProgress >= requiredProgress) {
          // Advance to next stage
          newCountries[countryId] = {
            ...country,
            nuclearStage: getNextNuclearStage(country.nuclearStage),
            nuclearProgress: 0,
          };
        } else {
          newCountries[countryId] = {
            ...country,
            nuclearProgress: newProgress,
          };
        }
      }
    }

    // Progress player nuclear program if funded
    let newPlayer = state.player;
    if (state.player.turnActions.fundedNuclear &&
        state.player.nuclearStage !== 'operational') {
      const newProgress = state.player.nuclearProgress + 1;
      const requiredProgress = getNuclearStageRequirement(state.player.nuclearStage);

      if (newProgress >= requiredProgress) {
        newPlayer = {
          ...state.player,
          nuclearStage: getNextNuclearStage(state.player.nuclearStage),
          nuclearProgress: 0,
        };
      } else {
        newPlayer = {
          ...state.player,
          nuclearProgress: newProgress,
        };
      }
    }

    return {
      ...state,
      countries: newCountries,
      player: newPlayer,
    };
  },

  /**
   * Get current phase display name
   */
  getPhaseName: (phase: GamePhase): string => {
    const names: Record<GamePhase, string> = {
      news: 'News',
      hub: 'Command Center',
      events: 'Events',
      diplomatic: 'Diplomatic',
      intelligence: 'Intelligence',
      military: 'Military',
      war: 'War',
      palestinian: 'Palestinian',
      resolution: 'Resolution',
      airstrike_report: 'Airstrike Report',
      war_report: 'War Report',
      monthly_summary: 'Monthly Summary',
      un_summit: 'UN Summit',
      game_over: 'Game Over',
    };
    return names[phase];
  },
};

// Helper functions

function createEmptyTurnActions(): TurnActions {
  return {
    diplomaticActions: {},
    intelligenceActions: {},
    weaponPurchases: [],
    fundedNuclear: false,
    airstrikes: [],
  };
}

function getDifficultySettings(difficulty: DifficultyId) {
  const settings = {
    easy: {
      startingBudget: 150000000,
      usAttitudeStart: 20,
      aiAggressionModifier: 0.7,
      relationshipModifier: 1,
    },
    normal: {
      startingBudget: 100000000,
      usAttitudeStart: 0,
      aiAggressionModifier: 1.0,
      relationshipModifier: 0,
    },
    hard: {
      startingBudget: 75000000,
      usAttitudeStart: -20,
      aiAggressionModifier: 1.3,
      relationshipModifier: -1,
    },
    impossible: {
      startingBudget: 50000000,
      usAttitudeStart: -40,
      aiAggressionModifier: 1.5,
      relationshipModifier: -2,
    },
  };
  return settings[difficulty];
}

function createInitialPlayerState(settings: ReturnType<typeof getDifficultySettings>): PlayerState {
  return {
    budget: settings.startingBudget,
    gdpDefensePercent: 35,
    usAttitude: settings.usAttitudeStart,
    prestige: 3,
    knessetDisapproval: 0,
    violencePoints: 0,

    palestinianHomeland: false,
    armyLimitAgreement: false,

    palestinianLevel: 'calm',
    policingTactic: 'none',

    arsenal: {
      light_tank: 10,
      main_battle_tank: 5,
      anti_tank_helicopter: 2,
      sam_battery: 5,
      fighter_aircraft: 10,
      anti_sam_helicopter: 1,
      infantry_brigade: 8,
    },
    nuclearStage: 'none',
    nuclearProgress: 0,
    deployedTroops: {
      israel: 0,
      egypt: 0,
      syria: 0,
      jordan: 0,
      lebanon: 0,
      iraq: 0,
      iran: 0,
      libya: 0,
    },

    vendorPurchases: {
      usa: 0,
      uk: 0,
      france: 0,
      black_market: 0,
    },
    embargoedBy: [],
    pendingDeliveries: [],

    turnActions: createEmptyTurnActions(),
  };
}

function createInitialCountries(
  settings: ReturnType<typeof getDifficultySettings>
): Record<CountryId, CountryState> {
  const relationshipOffset = settings.relationshipModifier;

  const createCountry = (
    id: CountryId,
    baseRelationship: RelationshipLevel,
    stability: StabilityLevel,
    insurgency: InsurgencyLevel,
    stance: DiplomaticStance,
    nuclearStage: NuclearStage,
    leader: LeaderState,
    militaryStrength: number
  ): CountryState => ({
    id,
    relationship: adjustRelationship(baseRelationship, relationshipOffset),
    stability,
    insurgency,
    stance,
    nuclearStage,
    nuclearProgress: 0,
    leader,
    militaryStrength,
    isDefeated: false,
  });

  return {
    israel: createCountry(
      'israel',
      'military_pact', // Self
      'solid',
      'scattered',
      'neutral',
      'none',
      { name: 'Player', strength: 'moderate', aggression: 'pragmatic', riskTolerance: 'calculated' },
      100
    ),
    egypt: createCountry(
      'egypt',
      'cool',
      'good',
      'none',
      'neutral',
      'none',
      { name: 'Hosni Mubarak', strength: 'strong', aggression: 'pragmatic', riskTolerance: 'cautious' },
      80
    ),
    syria: createCountry(
      'syria',
      'hostile',
      'solid',
      'scattered',
      'aggressive',
      'none',
      { name: 'Hafez al-Assad', strength: 'strong', aggression: 'hawkish', riskTolerance: 'calculated' },
      70
    ),
    jordan: createCountry(
      'jordan',
      'satisfactory',
      'good',
      'none',
      'friendly',
      'none',
      { name: 'King Hussein', strength: 'moderate', aggression: 'dovish', riskTolerance: 'cautious' },
      40
    ),
    lebanon: createCountry(
      'lebanon',
      'cool',
      'weak',
      'organized',
      'neutral',
      'none',
      { name: 'Rafik Hariri', strength: 'weak', aggression: 'dovish', riskTolerance: 'cautious' },
      20
    ),
    iraq: createCountry(
      'iraq',
      'hostile',
      'solid',
      'none',
      'aggressive',
      'development',
      { name: 'Saddam Hussein', strength: 'strong', aggression: 'hawkish', riskTolerance: 'reckless' },
      90
    ),
    iran: createCountry(
      'iran',
      'hostile',
      'solid',
      'scattered',
      'aggressive',
      'research',
      { name: 'Ali Khamenei', strength: 'strong', aggression: 'hawkish', riskTolerance: 'calculated' },
      75
    ),
    libya: createCountry(
      'libya',
      'lamentable',
      'good',
      'none',
      'aggressive',
      'none',
      { name: 'Muammar Gaddafi', strength: 'strong', aggression: 'hawkish', riskTolerance: 'reckless' },
      50
    ),
  };
}

const RELATIONSHIP_ORDER: RelationshipLevel[] = [
  'military_pact', 'profitable', 'beneficial', 'favourable',
  'satisfactory', 'cool', 'lamentable', 'hostile', 'war',
];

function adjustRelationship(base: RelationshipLevel, offset: number): RelationshipLevel {
  const index = RELATIONSHIP_ORDER.indexOf(base);
  const newIndex = Math.max(0, Math.min(RELATIONSHIP_ORDER.length - 2, index - offset));
  return RELATIONSHIP_ORDER[newIndex];
}

function getNuclearStageRequirement(stage: NuclearStage): number {
  const requirements: Record<NuclearStage, number> = {
    none: 0,
    research: 12,      // 12 months
    development: 18,   // 18 months
    testing: 6,        // 6 months
    operational: 0,
  };
  return requirements[stage];
}

function getNextNuclearStage(current: NuclearStage): NuclearStage {
  const order: NuclearStage[] = ['none', 'research', 'development', 'testing', 'operational'];
  const index = order.indexOf(current);
  return index < order.length - 1 ? order[index + 1] : current;
}
