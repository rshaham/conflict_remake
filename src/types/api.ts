// ============================================
// AI Service and API Types
// ============================================

import type { GameEvent, GameState, EndConditionType } from './game';
import type { EventContext, HeadlineContext } from './events';

// === AI Service Interface ===

export interface AIService {
  generateEvent(context: EventContext): Promise<GameEvent>;
  generateHeadlines(context: HeadlineContext): Promise<string[]>;
  generateConsequenceNarrative(event: GameEvent, choice: string): Promise<string>;
  generateEndGameNarrative(state: GameState, endCondition: EndConditionType): Promise<string>;
}

// === AI Provider Types ===

export type AIProvider = 'claude' | 'openai' | 'mock';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  maxRetries: number;
  timeout: number;
}

// === AI Response Types ===

export interface AIEventResponse {
  title: string;
  description: string;
  category: string;
  urgency: string;
  relatedCountries: string[];
  options: AIEventOption[];
  advisorOpinions?: {
    defense?: string;
    foreign?: string;
    intelligence?: string;
  };
}

export interface AIEventOption {
  id: string;
  text: string;
  detailedText?: string;
  consequences: Record<string, unknown>;
}

export interface AIHeadlinesResponse {
  headlines: string[];
}

export interface AINarrativeResponse {
  narrative: string;
}

// === Error Types ===

export class AIServiceError extends Error {
  readonly provider: AIProvider;
  readonly retryable: boolean;

  constructor(message: string, provider: AIProvider, retryable: boolean = true) {
    super(message);
    this.name = 'AIServiceError';
    this.provider = provider;
    this.retryable = retryable;
  }
}

export class AIValidationError extends Error {
  readonly field: string;
  readonly value: unknown;

  constructor(message: string, field: string, value: unknown) {
    super(message);
    this.name = 'AIValidationError';
    this.field = field;
    this.value = value;
  }
}
