// ============================================
// YAML Data File Types
// ============================================

import type {
  CountryId,
  DifficultyId,
  DiplomaticStance,
  InsurgencyLevel,
  LeaderAggression,
  LeaderRiskTolerance,
  LeaderStrength,
  NuclearStage,
  RelationshipLevel,
  ScenarioId,
  StabilityLevel,
  VendorId,
  WeaponCategory,
  WeaponId,
} from './game';

// === Settings Data ===

export interface SettingsData {
  difficulties: Record<DifficultyId, DifficultyConfig>;
  scenarios: Record<ScenarioId, ScenarioConfig>;
}

export interface DifficultyConfig {
  id: DifficultyId;
  name: string;
  description: string;
  startingBudget: number;
  usAttitudeStart: number;
  aiAggressionModifier: number;
  successChanceModifier: number;
  relationshipModifier: number;
}

export interface ScenarioConfig {
  id: ScenarioId;
  name: string;
  description: string;
  startYear: number;
  startMonth: number;
  dataFile: string;
}

// === Countries Data ===

export interface CountriesData {
  countries: Record<CountryId, CountryConfig>;
}

export interface CountryConfig {
  id: CountryId;
  name: string;
  displayName: string;
  isPlayer: boolean;
  canDevelopNukes: boolean;
  canBeInvadedByPlayer?: boolean;
  borders: CountryId[];
  startingState: CountryStartingState;
  leaderTemplate?: LeaderTemplate;
}

export interface CountryStartingState {
  budget?: number;
  gdpDefensePercent?: number;
  stability: StabilityLevel;
  insurgency: InsurgencyLevel;
  nuclearStage: NuclearStage;
  relationWithPlayer?: RelationshipLevel;
  diplomaticStance?: DiplomaticStance;
}

export interface LeaderTemplate {
  strengthRange: LeaderStrength[];
  aggressionRange: LeaderAggression[];
  riskRange: LeaderRiskTolerance[];
}

// === Enums Data ===

export interface EnumsData {
  relationshipLevels: RelationshipLevelConfig[];
  stabilityLevels: StabilityLevelConfig[];
  insurgencyLevels: InsurgencyLevelConfig[];
  diplomaticStances: DiplomaticStanceConfig[];
  playerDiplomaticActions: DiplomaticActionConfig[];
  intelligenceActions: IntelligenceActionConfig[];
  extremeMeasures: ExtremeMeasureConfig[];
}

export interface RelationshipLevelConfig {
  id: RelationshipLevel;
  name: string;
  order: number;
  canRequestPact?: boolean;
  canInvade?: boolean;
  willJoinWars?: boolean;
  canAirstrike?: boolean;
  isAtWar?: boolean;
  improvementCost?: number;
  color: string;
}

export interface StabilityLevelConfig {
  id: StabilityLevel;
  name: string;
  order: number;
  collapseChance: number;
  allowsExtremeMeasures?: boolean;
  isDefeated?: boolean;
  icon: string;
}

export interface InsurgencyLevelConfig {
  id: InsurgencyLevel;
  name: string;
  order: number;
  monthlyDestabilization: number;
  allowsExtremeMeasures?: boolean;
}

export interface DiplomaticStanceConfig {
  id: DiplomaticStance;
  name: string;
  monthlyDrift: number;
  icon: string;
}

export interface DiplomaticActionConfig {
  id: string;
  name: string;
  effect: number;
}

export interface IntelligenceActionConfig {
  id: string;
  name: string;
  description: string;
  monthlyInsurgencyGrowth?: number;
  monthlyInsurgencyReduction?: number;
  costPerMonth: number;
}

export interface ExtremeMeasureConfig {
  id: string;
  name: string;
  description: string;
  baseSuccessChance: number;
  insurgencyBonus: number;
  stabilityBonus: number;
  onSuccess: {
    result: string;
    headline: string;
  };
  onFailure: {
    result: string;
    usAttitudePenalty?: number;
    insurgencyReset?: number;
    headline: string;
  };
}

// === Weapons Data ===

export interface WeaponsData {
  vendors: Record<VendorId, VendorConfig>;
  weapons: Record<WeaponId, WeaponConfig>;
}

export interface VendorConfig {
  id: VendorId;
  name: string;
  flag: string;
  description?: string;
  willEmbargo: boolean;
  embargoTriggers?: string[];
  embargoLiftCondition?: string;
  exclusivityConflict?: string;
  deliveryDelay?: number;
  priceModifier?: number;
  alwaysAvailable?: boolean;
}

export interface WeaponConfig {
  id: WeaponId;
  name: string;
  category: WeaponCategory;
  description: string;
  costPerUnit: number;
  combatValue: number;
  counters?: WeaponId[];
  counteredBy?: WeaponId[];
  canAirstrike?: boolean;
  canOccupy?: boolean;
  canPolice?: boolean;
  availability: Record<VendorId, WeaponAvailability>;
}

export interface WeaponAvailability {
  minPurchases: number;
  price: number;
}

// === Nuclear Data ===

export interface NuclearData {
  nuclearProgram: NuclearProgramConfig;
}

export interface NuclearProgramConfig {
  monthlyFundingCost: number;
  progressChances: Record<string, ProgressChanceConfig>;
  stages: NuclearStageConfig[];
  airstrikeOnInstallation: AirstrikeOnInstallationConfig;
  nuclearStrikeOutcomes: Record<string, NuclearOutcomeConfig>;
}

export interface ProgressChanceConfig {
  minRemainingBudget: number;
  advanceChance: number;
}

export interface NuclearStageConfig {
  id: NuclearStage;
  name: string;
  order: number;
  monthsRequired?: number;
  canBeDestroyed?: boolean;
  icon: string;
  displayIcon?: string;
}

export interface AirstrikeOnInstallationConfig {
  baseSuccessChance: number;
  onSuccess: { stagesSetBack: number; relationshipPenalty: number };
  onFailure: { stagesSetBack: number; relationshipPenalty: number };
}

export interface NuclearOutcomeConfig {
  condition: string;
  result: string;
  endingType?: string;
  consequences?: Record<string, unknown>;
}

// === Palestinian Data ===

export interface PalestinianData {
  palestinianProblem: PalestinianProblemConfig;
}

export interface PalestinianProblemConfig {
  levels: PalestinianLevelConfig[];
  externalInfluence: {
    hostileNeighborBonus: number;
    atWarBonus: number;
  };
  policingOptions: Record<string, PolicingOptionConfig>;
  homelandResolution: {
    availableAt: string;
    usAttitudeBonus: number;
    prestigeBonus: number;
    permanentlyResolves: boolean;
    warTerritoryPenalty: number;
  };
}

export interface PalestinianLevelConfig {
  id: string;
  name: string;
  order: number;
  requiresPolicing: boolean;
  monthlyKnessetPressure: number;
  canCauseAssassination?: boolean;
}

export interface PolicingOptionConfig {
  id: string;
  name: string;
  description?: string;
  effectiveness: number;
  usAttitudePenalty: number;
  violencePoints: number;
  brigadesRequired: number;
  internationalCondemnationChance?: number;
}

// === Scoring Data ===

export interface ScoringData {
  endGameScoring: EndGameScoringConfig;
  violenceTracking: ViolenceTrackingConfig;
  leadershipStyles: LeadershipStyleConfig[];
}

export interface EndGameScoringConfig {
  neighborStatus: Record<string, number>;
  knessetDisapproval: { pointsPerLevel: number };
  prestige: { levels: PrestigeLevelConfig[] };
  monthsPlayed: {
    pointsPerMonth: number;
    minimumMonthsPenalty: number;
    minimumMonths: number;
  };
  usAttitude: { events: Record<string, number> };
}

export interface PrestigeLevelConfig {
  id: string;
  name: string;
  points: number;
  threshold: number;
}

export interface ViolenceTrackingConfig {
  actions: Record<string, number>;
}

export interface LeadershipStyleConfig {
  id: string;
  name: string;
  description: string;
  conditions: LeadershipCondition[];
}

export interface LeadershipCondition {
  field?: string;
  operator?: string;
  value?: string | number | boolean;
  anyOf?: LeadershipCondition[];
}

// === Leaders Data ===

export interface LeadersData {
  leaderTraits: {
    strength: TraitCategory<LeaderStrength>;
    aggression: TraitCategory<LeaderAggression>;
    riskTolerance: TraitCategory<LeaderRiskTolerance>;
  };
}

export interface TraitCategory<T extends string> {
  description: string;
  levels: Record<T, TraitLevel>;
}

export interface TraitLevel {
  id: string;
  name: string;
  description: string;
  [key: string]: unknown; // Additional properties vary by trait type
}

// === Combat Data ===

export interface CombatData {
  warDeclaration: WarDeclarationConfig;
  combatResolution: CombatResolutionConfig;
  airstrikes: AirstrikesConfig;
}

export interface WarDeclarationConfig {
  playerRequirements: { relationshipLevel: string; troopsOnBorder: boolean }[];
  aiDecisionFactors: AIDecisionFactor[];
}

export interface AIDecisionFactor {
  factor: string;
  weight: number;
  calculation: string;
}

export interface CombatResolutionConfig {
  phases: CombatPhase[];
  combatFormula: {
    effectiveness: Record<string, number>;
  };
  warProgress: {
    progressChange: Record<string, number>;
    victoryCondition: number;
    defeatCondition: number;
  };
  warEnd: {
    victory: Record<string, unknown>;
    defeat: Record<string, unknown>;
    ceasefire: Record<string, unknown>;
  };
}

export interface CombatPhase {
  name: string;
  attackers: WeaponId[];
  defenders: WeaponId[];
}

export interface AirstrikesConfig {
  types: Record<string, AirstrikeTypeConfig>;
  requirements: { minimumFighters: number };
  losses: { baseChance: number; samModifier: number };
}

export interface AirstrikeTypeConfig {
  id: string;
  name: string;
  requiresRelation: string;
  violencePoints: number;
  effect: string;
  relationshipPenalty: number;
  relationshipPenaltyFailure?: number;
  usAttitudePenalty?: number;
  internationalCondemnation?: boolean;
  successChance?: number;
}

// === AI Decisions Data ===

export interface AIDecisionsData {
  aiDecisionTree: AIDecisionNode[];
  aiBudgetAllocation: AIBudgetAllocationConfig;
}

export interface AIDecisionNode {
  name: string;
  condition: string;
  evaluation?: string;
  actions: (string | { probability: string })[];
}

export interface AIBudgetAllocationConfig {
  priorities: Record<string, Record<string, number>>;
  weaponPurchasePriorities: {
    targetRatios: Record<WeaponId, number>;
  };
}

// === Events Data ===

export interface EventsData {
  eventCategories: Record<string, EventCategoryConfig>;
}

export interface EventCategoryConfig {
  description: string;
  frequencyPerMonth: number;
  examples: string[];
  triggerConditions: string[];
}

// === Combined Game Data ===

export interface GameData {
  settings: SettingsData;
  countries: CountriesData;
  enums: EnumsData;
  weapons: WeaponsData;
  nuclear: NuclearData;
  palestinian: PalestinianData;
  scoring: ScoringData;
  leaders: LeadersData;
  combat: CombatData;
  aiDecisions: AIDecisionsData;
  events: EventsData;
}
