// ============================================
// Core Game Types - Conflict: Middle East Political Simulator
// ============================================

// === Enums as Union Types ===

export type RelationshipLevel =
  | 'military_pact'
  | 'profitable'
  | 'beneficial'
  | 'favourable'
  | 'satisfactory'
  | 'cool'
  | 'lamentable'
  | 'hostile'
  | 'war';

export type StabilityLevel =
  | 'very_solid'
  | 'solid'
  | 'good'
  | 'weak'
  | 'critical'
  | 'collapse';

export type InsurgencyLevel =
  | 'none'
  | 'scattered'
  | 'organized'
  | 'armed'
  | 'guerilla_force'
  | 'open_revolt';

export type DiplomaticStance = 'friendly' | 'neutral' | 'aggressive';

export type DiplomaticAction = 'improve' | 'maintain' | 'worsen';

export type IntelligenceAction = 'support_insurgents' | 'disrupt_insurgents' | 'do_nothing';

export type NuclearStage = 'none' | 'research' | 'development' | 'testing' | 'operational';

export type PalestinianLevel = 'calm' | 'unrest' | 'protests' | 'violence' | 'intifada';

export type PolicingTactic = 'none' | 'soft' | 'hard';

export type GamePhase =
  | 'news'
  | 'events'
  | 'diplomatic'
  | 'intelligence'
  | 'military'
  | 'palestinian'
  | 'resolution'
  | 'un_summit'
  | 'game_over';

export type LeaderStrength = 'weak' | 'moderate' | 'strong';
export type LeaderAggression = 'dovish' | 'pragmatic' | 'hawkish';
export type LeaderRiskTolerance = 'cautious' | 'calculated' | 'reckless';

// === ID Types ===

export type CountryId =
  | 'israel'
  | 'egypt'
  | 'syria'
  | 'jordan'
  | 'lebanon'
  | 'iraq'
  | 'iran'
  | 'libya';

export type NeighborCountryId = 'egypt' | 'syria' | 'jordan' | 'lebanon';

export type VendorId = 'usa' | 'uk' | 'france' | 'black_market';

// All 26 specific weapons from the catalog + legacy generic types
export type WeaponId =
  // USA Vendor (7)
  | 'm60a3_patton'
  | 'm1a1_abrams'
  | 'ah64_apache'
  | 'mim104_patriot'
  | 'f15c_eagle'
  | 'f16c_falcon'
  | 'f4g_wild_weasel'
  // UK Vendor (5)
  | 'chieftain_mk11'
  | 'challenger_1'
  | 'lynx_ah7'
  | 'rapier_fsc'
  | 'tornado_gr1'
  // France Vendor (6)
  | 'amx30b2'
  | 'leclerc'
  | 'gazelle_hot'
  | 'crotale_ng'
  | 'mirage_2000c'
  | 'mirage_f1'
  // Black Market / Soviet (6)
  | 't62m'
  | 't72m'
  | 'mi24v_hind'
  | 's300pmu'
  | 'mig29_fulcrum'
  | 'su24_fencer'
  // Israeli Domestic (2)
  | 'merkava_mk3'
  | 'iai_kfir'
  // Legacy generic types (for combat calculations and starting arsenals)
  | 'light_tank'
  | 'main_battle_tank'
  | 'anti_tank_helicopter'
  | 'sam_battery'
  | 'fighter_aircraft'
  | 'anti_sam_helicopter'
  | 'infantry_brigade';

export type WeaponCategory =
  | 'light_armor'
  | 'main_battle_tank'
  | 'attack_helicopter'
  | 'sam_battery'
  | 'fighter_aircraft'
  | 'sead_aircraft'
  | 'infantry';

export type DifficultyId = 'easy' | 'normal' | 'hard' | 'impossible';

export type ScenarioId = 'classic_1997';

export type AirstrikeTarget = 'military' | 'civilian' | 'industrial' | 'nuclear';

export type ExtremeMeasureType = 'assassination' | 'coup';

// === Core State Interfaces ===

export interface GameState {
  // Meta
  gameId: string;
  turn: number;
  month: number; // 1-12
  year: number; // Starts 1997
  phase: GamePhase;
  difficulty: DifficultyId;
  scenario: ScenarioId;

  // Player (Israel)
  player: PlayerState;

  // World
  countries: Record<CountryId, CountryState>;

  // Active conflicts
  wars: War[];

  // Current turn events
  pendingEvents: GameEvent[];

  // History for AI context
  history: GameHistory;

  // End state (if game over)
  endState?: EndState;
}

export interface PlayerState {
  budget: number;
  gdpDefensePercent: number;
  usAttitude: number;
  prestige: number; // 0-10 maps to prestige level
  knessetDisapproval: number; // 0-10
  violencePoints: number;

  // Flags
  palestinianHomeland: boolean;
  armyLimitAgreement: boolean;

  // Palestinian situation
  palestinianLevel: PalestinianLevel;
  policingTactic: PolicingTactic;

  // Military
  arsenal: Partial<Record<WeaponId, number>>;
  nuclearStage: NuclearStage;
  nuclearProgress: number; // Months of progress in current stage
  deployedTroops: Record<CountryId, number>; // Brigades on each border

  // Vendor relationships
  vendorPurchases: Record<VendorId, number>;
  embargoedBy: VendorId[];
  pendingDeliveries: PendingDelivery[];

  // Turn actions (reset each turn)
  turnActions: TurnActions;
}

export interface TurnActions {
  diplomaticActions: Partial<Record<CountryId, DiplomaticAction>>;
  intelligenceActions: Partial<Record<CountryId, IntelligenceAction>>;
  weaponPurchases: WeaponPurchase[];
  fundedNuclear: boolean;
  airstrikes: Airstrike[];
}

export interface CountryState {
  id: CountryId;
  stability: StabilityLevel;
  insurgency: InsurgencyLevel;
  leader: LeaderState;
  nuclearStage: NuclearStage;
  nuclearProgress: number;

  // Military (simplified for AI countries)
  militaryStrength: number; // Abstract combat power

  // Relationship with Israel
  relationship: RelationshipLevel;
  stance: DiplomaticStance;

  // Status
  isDefeated: boolean;
  defeatedBy?: CountryId;
  defeatedOnTurn?: number;
}

export interface LeaderState {
  name: string;
  strength: LeaderStrength;
  aggression: LeaderAggression;
  riskTolerance: LeaderRiskTolerance;
}

export interface War {
  id: string;
  attacker: CountryId;
  defender: CountryId;
  startTurn: number;
  progress: number; // -10 to +10 (defender to attacker advantage)
  attackerLosses: Partial<Record<WeaponId, number>>;
  defenderLosses: Partial<Record<WeaponId, number>>;
}

export interface PendingDelivery {
  weaponId: WeaponId;
  quantity: number;
  vendor: VendorId;
  turnsRemaining: number;
}

export interface WeaponPurchase {
  weaponId: WeaponId;
  vendor: VendorId;
  quantity: number;
  totalCost: number;
}

export interface Airstrike {
  target: CountryId;
  type: AirstrikeTarget;
  fightersUsed: number;
}

// === Event Types (forward declaration - detailed in events.ts) ===

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  urgency: 'immediate' | 'pressing' | 'routine';
  relatedCountries: CountryId[];
  options: EventOption[];
  advisorOpinions?: {
    defense?: string;
    foreign?: string;
    intelligence?: string;
  };
  // After player chooses
  chosenOption?: string;
  consequence?: string;
}

export type EventCategory =
  | 'crisis'
  | 'opportunity'
  | 'diplomatic'
  | 'military'
  | 'internal'
  | 'international';

export interface EventOption {
  id: string;
  text: string;
  detailedText?: string;
  consequences: EventConsequences;
}

export interface EventConsequences {
  usAttitude?: number;
  prestige?: number;
  knessetDisapproval?: number;
  violencePoints?: number;
  budget?: number;
  relationships?: Partial<Record<CountryId, { change?: number; newStance?: DiplomaticStance }>>;
  stability?: Partial<Record<CountryId, number>>;
  insurgency?: Partial<Record<CountryId, number>>;
  palestinian?: number;
  followUpEvent?: string;
}

// === History Types ===

export interface GameHistory {
  // Last N turns of data for AI context
  recentActions: PlayerAction[];   // Last 10 actions
  recentEvents: HistoricalEvent[]; // Last 5 events with outcomes
  headlines: string[];             // Last 20 headlines
}

export interface PlayerAction {
  turn: number;
  type: string;
  description: string;
  target?: CountryId;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  turn: number;
  chosenOption: string;
  consequences: string;
}

// === End State Types ===

export type EndConditionType =
  | 'total_victory'
  | 'military_defeat'
  | 'nuclear_holocaust'
  | 'impeachment'
  | 'assassination';

export interface EndState {
  type: 'victory' | 'defeat';
  condition: EndConditionType;
  finalScore: number;
  leadershipStyle: string;
  narrative: string; // AI-generated summary
  statistics: GameStatistics;
}

export interface GameStatistics {
  turnsPlayed: number;
  warsWon: number;
  warsLost: number;
  countriesDefeated: CountryId[];
  totalWeaponsPurchased: number;
  totalAirstrikes: number;
  peakPrestige: number;
  peakKnessetDisapproval: number;
}
