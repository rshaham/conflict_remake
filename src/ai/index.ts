// ============================================
// AI Module - Public Exports
// ============================================
// Central export point for all AI functionality.

// Main service interface and manager
export {
  aiService,
  generateImage,
  generateHeadlines,
  generateEvent,
  generateNarrative,
  clearAICache,
} from './AIService';

// Types
export type {
  AIConfig,
  ImageGenerationOptions,
  ImageResult,
  GameContext,
  GeneratedHeadline,
  GeneratedEvent,
  GeneratedNarrative,
  IAIService,
} from './AIService';

// Individual services (for direct use if needed)
export { GeminiAIService } from './GeminiService';
export { MockAIService } from './MockService';

// Cache utility
export { imageCache, ImageCache } from './ImageCache';
