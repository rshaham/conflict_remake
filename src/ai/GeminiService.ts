// ============================================
// Gemini AI Service Implementation
// ============================================
// Implements IAIService using Google Gemini API.
// Used for runtime image generation and AI content.

import type {
  IAIService,
  ImageGenerationOptions,
  ImageResult,
  GameContext,
  GeneratedHeadline,
  GeneratedEvent,
  GeneratedNarrative,
} from './AIService';
import { imageCache } from './ImageCache';
import { COUNTRY_NAMES } from '../utils/countryData';

// ============================================
// Constants
// ============================================

const DEFAULT_MODEL = 'gemini-2.5-flash-image';
const IMAGE_MODEL = 'gemini-2.5-flash-image'; // Model with image capabilities

// Pre-generated image paths for fallback
const FALLBACK_IMAGES = {
  news_war: '/images/news/news_war.png',
  news_peace: '/images/news/news_peace.png',
  news_nuclear: '/images/news/news_nuclear.png',
  news_palestinian: '/images/news/news_palestinian.png',
  news_diplomatic: '/images/news/news_diplomatic.png',
  news_economic: '/images/news/news_economic.png',
  news_victory: '/images/news/news_victory.png',
  news_defeat: '/images/news/news_defeat.png',
  news_egypt: '/images/news/news_egypt.png',
  news_syria: '/images/news/news_syria.png',
  news_jordan: '/images/news/news_jordan.png',
  news_lebanon: '/images/news/news_lebanon.png',
  news_iraq: '/images/news/news_iraq.png',
  news_iran: '/images/news/news_iran.png',
  news_libya: '/images/news/news_libya.png',
};

// ============================================
// Gemini Service Class
// ============================================

export class GeminiAIService implements IAIService {
  readonly name = 'GeminiAI';

  private apiKey: string | undefined;
  private model: string;
  private available: boolean = false;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey;
    this.model = model || DEFAULT_MODEL;
    this.available = !!apiKey;
  }

  isAvailable(): boolean {
    return this.available;
  }

  /**
   * Generate an image using Gemini's image generation capabilities
   */
  async generateImage(
    prompt: string,
    options?: ImageGenerationOptions
  ): Promise<ImageResult> {
    // Check cache first
    if (!options?.skipCache) {
      const cached = imageCache.get(prompt, options as Record<string, unknown>);
      if (cached) {
        return {
          url: cached,
          fromCache: true,
          isFallback: false,
        };
      }
    }

    // If no API key, return fallback
    if (!this.apiKey) {
      return this.getFallbackImage(prompt);
    }

    try {
      // Call Gemini API for image generation
      // Uses responseModalities for image output
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate an image: ${prompt}. Style: ${options?.style || 'retro technical illustration'}. Aspect ratio based on ${options?.width || 512}x${options?.height || 256} dimensions.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ['IMAGE'],
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Extract image data from response
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const dataUrl = `data:${mimeType};base64,${part.inlineData.data}`;

            // Cache the result
            imageCache.set(prompt, dataUrl, options as Record<string, unknown>);

            return {
              url: dataUrl,
              fromCache: false,
              isFallback: false,
            };
          }
        }
      }

      throw new Error('No image data in response');
    } catch (error) {
      console.warn('[GeminiAI] Image generation failed:', error);
      return this.getFallbackImage(prompt);
    }
  }

  /**
   * Get a fallback image when generation fails
   */
  private getFallbackImage(prompt: string): ImageResult {
    // Try to match prompt to a pre-generated image
    const promptLower = prompt.toLowerCase();

    for (const [key, path] of Object.entries(FALLBACK_IMAGES)) {
      if (promptLower.includes(key.replace('news_', '').replace('_', ' '))) {
        return {
          url: path,
          fromCache: false,
          isFallback: true,
        };
      }
    }

    // Default fallback
    return {
      url: '/images/news/news_diplomatic.png',
      fromCache: false,
      isFallback: true,
    };
  }

  /**
   * Generate news headlines based on game state
   */
  async generateHeadlines(
    context: GameContext,
    count: number = 3
  ): Promise<GeneratedHeadline[]> {
    if (!this.apiKey) {
      return this.getMockHeadlines(context, count);
    }

    try {
      const prompt = this.buildHeadlinesPrompt(context, count);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return this.parseHeadlinesResponse(text);
      }

      throw new Error('No text in response');
    } catch (error) {
      console.warn('[GeminiAI] Headlines generation failed:', error);
      return this.getMockHeadlines(context, count);
    }
  }

  /**
   * Build prompt for headline generation
   */
  private buildHeadlinesPrompt(context: GameContext, count: number): string {
    const { game } = context;

    // Build context string
    const contextParts = [
      `Year: ${game.year}`,
      `Month: ${game.month}`,
      `Active wars: ${game.wars.length}`,
      `Budget: $${Math.floor(game.player.budget / 1000000)}M`,
    ];

    // Add relationship info
    const relationships = Object.entries(game.countries)
      .filter(([id]) => id !== 'israel')
      .map(([id, country]) => {
        const name = COUNTRY_NAMES[id as keyof typeof COUNTRY_NAMES];
        return `${name}: ${country.relationship}`;
      })
      .join(', ');

    contextParts.push(`Relations: ${relationships}`);

    return `You are a news headline generator for a 1990s Middle East political simulation game.
Generate ${count} realistic news headlines based on the current game state.

GAME STATE:
${contextParts.join('\n')}

RULES:
- Headlines should be serious and realistic, like actual news
- Reference specific countries or events when relevant
- Mix different categories (diplomatic, military, economic, internal)
- Keep headlines under 80 characters

OUTPUT FORMAT (JSON array):
[
  {"text": "headline text", "category": "diplomatic|military|economic|internal|international", "relatedCountries": ["countryId"]}
]

Generate ${count} headlines:`;
  }

  /**
   * Parse headlines from AI response
   */
  private parseHeadlinesResponse(text: string): GeneratedHeadline[] {
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Ignore parse errors
    }

    return this.getMockHeadlines({ game: {} as GameContext['game'] }, 3);
  }

  /**
   * Get mock headlines when AI is unavailable
   */
  private getMockHeadlines(_context: GameContext, count: number): GeneratedHeadline[] {
    const headlines: GeneratedHeadline[] = [
      { text: 'Regional tensions remain high as diplomatic efforts continue', category: 'diplomatic' },
      { text: 'Military readiness maintained amid border concerns', category: 'military' },
      { text: 'Economic advisors recommend cautious fiscal policy', category: 'economic' },
      { text: 'Parliament debates defense spending allocation', category: 'internal' },
      { text: 'UN observers monitoring situation in the region', category: 'international' },
    ];

    return headlines.slice(0, count);
  }

  /**
   * Generate a dynamic game event
   */
  async generateEvent(
    context: GameContext,
    triggerType?: string
  ): Promise<GeneratedEvent> {
    if (!this.apiKey) {
      return this.getMockEvent(context, triggerType);
    }

    try {
      const prompt = this.buildEventPrompt(context, triggerType);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return this.parseEventResponse(text);
      }

      throw new Error('No text in response');
    } catch (error) {
      console.warn('[GeminiAI] Event generation failed:', error);
      return this.getMockEvent(context, triggerType);
    }
  }

  /**
   * Build prompt for event generation
   */
  private buildEventPrompt(_context: GameContext, triggerType?: string): string {
    return `You are an event generator for a 1990s Middle East political simulation game.
Generate a realistic political event that the player (Israeli PM) must respond to.

TRIGGER TYPE: ${triggerType || 'random'}

RULES:
- Events should have real consequences
- Provide 2-4 response options with different trade-offs
- Include advisor opinions (defense, foreign, intelligence ministers)
- Keep descriptions under 500 characters

OUTPUT FORMAT (JSON):
{
  "title": "event title (max 60 chars)",
  "description": "event description",
  "category": "diplomatic|military|economic|internal|international",
  "urgency": "immediate|pressing|routine",
  "options": [
    {"label": "option name", "description": "what happens", "effects": {"usAttitude": -5, "budget": -10000000}}
  ],
  "advisorOpinions": {
    "defense": "defense minister opinion",
    "foreign": "foreign minister opinion",
    "intelligence": "mossad director opinion"
  }
}

Generate event:`;
  }

  /**
   * Parse event from AI response
   */
  private parseEventResponse(text: string): GeneratedEvent {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Ignore parse errors
    }

    return this.getMockEvent({ game: {} as GameContext['game'] });
  }

  /**
   * Get mock event when AI is unavailable
   */
  private getMockEvent(_context: GameContext, _triggerType?: string): GeneratedEvent {
    return {
      title: 'Diplomatic Situation Develops',
      description: 'A situation has arisen that requires your attention. Your advisors have prepared several response options for your consideration.',
      category: 'diplomatic',
      urgency: 'pressing',
      options: [
        {
          label: 'Cautious Response',
          description: 'Take a measured approach to the situation.',
          effects: { usAttitude: 0 },
        },
        {
          label: 'Strong Response',
          description: 'Take decisive action to address the situation.',
          effects: { usAttitude: -5, prestige: 5 },
        },
      ],
      advisorOpinions: {
        defense: 'We should be prepared for any military implications.',
        foreign: 'Diplomatic channels remain open for negotiation.',
        intelligence: 'Our sources indicate caution is warranted.',
      },
    };
  }

  /**
   * Generate end-game narrative
   */
  async generateNarrative(
    context: GameContext,
    endCondition: string
  ): Promise<GeneratedNarrative> {
    if (!this.apiKey) {
      return this.getMockNarrative(context, endCondition);
    }

    try {
      const prompt = this.buildNarrativePrompt(context, endCondition);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return this.parseNarrativeResponse(text);
      }

      throw new Error('No text in response');
    } catch (error) {
      console.warn('[GeminiAI] Narrative generation failed:', error);
      return this.getMockNarrative(context, endCondition);
    }
  }

  /**
   * Build prompt for narrative generation
   */
  private buildNarrativePrompt(context: GameContext, endCondition: string): string {
    const { game } = context;

    return `You are a narrative writer for a political simulation game.
Write an end-game summary for a player who was Israeli Prime Minister.

END CONDITION: ${endCondition}
YEARS IN OFFICE: ${game.year - 1990}
FINAL SCORE: ${game.endState?.finalScore || 0}

Write a brief, serious narrative summary of their time in office.

OUTPUT FORMAT (JSON):
{
  "title": "brief title",
  "summary": "2-3 paragraph narrative summary",
  "leadershipStyle": "one-word or short phrase describing their leadership",
  "historicalComparison": "optional comparison to real leader or fictional archetype"
}

Generate narrative:`;
  }

  /**
   * Parse narrative from AI response
   */
  private parseNarrativeResponse(text: string): GeneratedNarrative {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Ignore parse errors
    }

    return this.getMockNarrative({ game: {} as GameContext['game'] }, 'unknown');
  }

  /**
   * Get mock narrative when AI is unavailable
   */
  private getMockNarrative(_context: GameContext, endCondition: string): GeneratedNarrative {
    const narratives: Record<string, GeneratedNarrative> = {
      total_victory: {
        title: 'Total Victory',
        summary: 'Your leadership brought unprecedented military success. Through strategic planning and decisive action, Israel achieved total victory over its adversaries.',
        leadershipStyle: 'The Conqueror',
      },
      military_defeat: {
        title: 'Military Defeat',
        summary: 'Despite your efforts, the military situation proved insurmountable. Your tenure ended with Israel facing its greatest military challenge.',
        leadershipStyle: 'The Overwhelmed',
      },
      nuclear_holocaust: {
        title: 'Nuclear Catastrophe',
        summary: 'The nuclear option was exercised with devastating consequences. History will judge this moment as one of humanity\'s darkest hours.',
        leadershipStyle: 'The Destroyer',
      },
      impeachment: {
        title: 'Political Downfall',
        summary: 'The Knesset lost confidence in your leadership. Political pressure mounted until your government could no longer stand.',
        leadershipStyle: 'The Compromised',
      },
      assassination: {
        title: 'Tragic End',
        summary: 'Your leadership was cut short by violence. The nation mourns, but your legacy remains contested.',
        leadershipStyle: 'The Martyr',
      },
    };

    return narratives[endCondition] || {
      title: 'The End',
      summary: 'Your time as Prime Minister has come to an end. History will be the final judge of your actions.',
      leadershipStyle: 'Unknown',
    };
  }

  /**
   * Clear all cached content
   */
  clearCache(): void {
    imageCache.clear();
  }
}
