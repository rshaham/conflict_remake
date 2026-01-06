// ============================================
// Event-specific Types
// ============================================

import type {
  CountryId,
  DiplomaticStance,
  EventCategory,
  GameEvent,
  NuclearStage,
  PalestinianLevel,
  RelationshipLevel,
  StabilityLevel,
  InsurgencyLevel,
} from './game';

// Re-export game event types for convenience
export type {
  GameEvent,
  EventCategory,
  EventConsequences,
  EventOption,
  GameHistory,
  HistoricalEvent,
  PlayerAction,
} from './game';

// === Event Context for AI Generation ===

export interface EventContext {
  month: number;
  year: number;
  category: EventCategory;
  relationships: RelationshipSummary[];
  wars: string[];
  neighbors: NeighborSummary[];
  palestinianLevel: PalestinianLevel;
  usAttitude: number;
  prestige: string;
  knessetDisapproval: number;
  nuclearStage: NuclearStage;
  budget: number;
  violencePoints: number;
  recentActions: string[];
  recentEvents: EventSummary[];
  specificTrigger?: string;
}

export interface RelationshipSummary {
  country: CountryId;
  level: RelationshipLevel;
  stance: DiplomaticStance;
}

export interface NeighborSummary {
  country: CountryId;
  stability: StabilityLevel;
  insurgency: InsurgencyLevel;
}

export interface EventSummary {
  title: string;
  chosenOption: string;
}

// === Headline Context for AI Generation ===

export interface HeadlineContext {
  month: number;
  year: number;
  events: string[]; // Descriptions of what happened
  mostTenseCountry: string;
  overallMood: 'peaceful' | 'tense' | 'crisis';
}

// === Event Trigger Types ===

export interface EventTrigger {
  id: string;
  category: EventCategory;
  probability: number;
  conditions: TriggerCondition[];
  specificContext?: string;
}

export interface TriggerCondition {
  field: string;
  operator: '==' | '!=' | '>=' | '<=' | '>' | '<';
  value: string | number | boolean;
}

// === Event Chain Types ===

export interface EventChain {
  triggerId: string;
  delay: number; // Turns until follow-up
  outcomes: EventChainOutcome[];
}

export interface EventChainOutcome {
  id: string;
  probability: number;
  condition?: string;
  eventTemplate: Partial<GameEvent>;
}
