// ============================================
// AI Service - Unified AI Interface
// ============================================
// Central hub for ALL AI functionality in the game.
// Supports image generation, event generation, headlines, and narratives.
// Provides fallback to mock/pre-generated content when disabled.

import type { GameState, CountryId } from '../types/game';

// ============================================
// Types
// ============================================

/**
 * Configuration for the AI service
 */
export interface AIConfig {
  /** Enable runtime AI generation (if false, uses pre-generated/mock content) */
  enabled: boolean;
  /** API key for the AI provider */
  apiKey?: string;
  /** Model to use for generation */
  model?: string;
  /** Cache TTL in hours */
  cacheTTLHours: number;
}

/**
 * Options for image generation
 */
export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  style?: string;
  /** Force regeneration even if cached */
  skipCache?: boolean;
}

/**
 * Result of image generation
 */
export interface ImageResult {
  /** URL or data URL of the image */
  url: string;
  /** Whether this came from cache */
  fromCache: boolean;
  /** Whether this is a pre-generated fallback */
  isFallback: boolean;
}

/**
 * Context for generating dynamic content
 */
export interface GameContext {
  game: GameState;
  recentActions?: string[];
  focusCountry?: CountryId;
}

/**
 * Generated news headline
 */
export interface GeneratedHeadline {
  text: string;
  category: 'diplomatic' | 'military' | 'economic' | 'internal' | 'international';
  relatedCountries?: CountryId[];
}

/**
 * Generated game event
 */
export interface GeneratedEvent {
  title: string;
  description: string;
  category: string;
  urgency: 'immediate' | 'pressing' | 'routine';
  options: Array<{
    label: string;
    description: string;
    effects: Record<string, number>;
  }>;
  advisorOpinions?: {
    defense: string;
    foreign: string;
    intelligence: string;
  };
}

/**
 * End-game narrative
 */
export interface GeneratedNarrative {
  title: string;
  summary: string;
  leadershipStyle: string;
  historicalComparison?: string;
}

// ============================================
// AI Service Interface
// ============================================

/**
 * Interface that all AI service implementations must follow
 */
export interface IAIService {
  /** Service name for logging */
  readonly name: string;

  /** Check if the service is available and configured */
  isAvailable(): boolean;

  /**
   * Generate an image based on a prompt
   * @param prompt - Description of the image to generate
   * @param options - Generation options
   * @returns Image result with URL
   */
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResult>;

  /**
   * Generate news headlines based on game state
   * @param context - Current game context
   * @param count - Number of headlines to generate
   * @returns Array of headlines
   */
  generateHeadlines(context: GameContext, count?: number): Promise<GeneratedHeadline[]>;

  /**
   * Generate a dynamic game event
   * @param context - Current game context
   * @param triggerType - What triggered this event
   * @returns Generated event
   */
  generateEvent(context: GameContext, triggerType?: string): Promise<GeneratedEvent>;

  /**
   * Generate end-game narrative
   * @param context - Final game state
   * @param endCondition - How the game ended
   * @returns Narrative summary
   */
  generateNarrative(context: GameContext, endCondition: string): Promise<GeneratedNarrative>;

  /**
   * Clear all cached content
   */
  clearCache(): void;
}

// ============================================
// Service Manager
// ============================================

/**
 * AI Service Manager - singleton that manages the active AI service
 */
class AIServiceManager {
  private service: IAIService | null = null;
  private config: AIConfig = {
    enabled: false,
    cacheTTLHours: 24,
  };

  /**
   * Initialize the AI service with configuration
   */
  async initialize(config: AIConfig): Promise<void> {
    this.config = config;

    if (!config.enabled) {
      // Use mock service when AI is disabled
      const { MockAIService } = await import('./MockService');
      this.service = new MockAIService();
      console.log('[AI] Initialized with MockService (AI disabled)');
      return;
    }

    try {
      // Try to initialize Gemini service
      const { GeminiAIService } = await import('./GeminiService');
      this.service = new GeminiAIService(config.apiKey, config.model);

      if (this.service.isAvailable()) {
        console.log('[AI] Initialized with GeminiService');
      } else {
        throw new Error('GeminiService not available');
      }
    } catch (error) {
      // Fall back to mock service
      console.warn('[AI] Failed to initialize Gemini, falling back to MockService:', error);
      const { MockAIService } = await import('./MockService');
      this.service = new MockAIService();
    }
  }

  /**
   * Get the current AI service instance
   */
  getService(): IAIService {
    if (!this.service) {
      throw new Error('AI Service not initialized. Call initialize() first.');
    }
    return this.service;
  }

  /**
   * Check if AI is enabled and available
   */
  isEnabled(): boolean {
    return this.config.enabled && this.service?.isAvailable() === true;
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfig {
    return { ...this.config };
  }

  /**
   * Update configuration (requires re-initialization)
   */
  async updateConfig(newConfig: Partial<AIConfig>): Promise<void> {
    await this.initialize({ ...this.config, ...newConfig });
  }
}

// Export singleton instance
export const aiService = new AIServiceManager();

// ============================================
// Convenience Functions
// ============================================

/**
 * Generate an image using the active AI service
 */
export async function generateImage(
  prompt: string,
  options?: ImageGenerationOptions
): Promise<ImageResult> {
  return aiService.getService().generateImage(prompt, options);
}

/**
 * Generate headlines using the active AI service
 */
export async function generateHeadlines(
  context: GameContext,
  count?: number
): Promise<GeneratedHeadline[]> {
  return aiService.getService().generateHeadlines(context, count);
}

/**
 * Generate an event using the active AI service
 */
export async function generateEvent(
  context: GameContext,
  triggerType?: string
): Promise<GeneratedEvent> {
  return aiService.getService().generateEvent(context, triggerType);
}

/**
 * Generate end-game narrative using the active AI service
 */
export async function generateNarrative(
  context: GameContext,
  endCondition: string
): Promise<GeneratedNarrative> {
  return aiService.getService().generateNarrative(context, endCondition);
}

/**
 * Clear all AI caches
 */
export function clearAICache(): void {
  aiService.getService().clearCache();
}
