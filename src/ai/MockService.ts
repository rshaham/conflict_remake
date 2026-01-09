// ============================================
// Mock AI Service - Offline Fallback
// ============================================
// Provides pre-generated/template content when AI is disabled.
// Used as fallback when API is unavailable or for offline play.

import type {
  IAIService,
  ImageGenerationOptions,
  ImageResult,
  GameContext,
  GeneratedHeadline,
  GeneratedEvent,
  GeneratedNarrative,
} from './AIService';
import { COUNTRY_NAMES } from '../utils/countryData';
import type { CountryId } from '../types/game';

// ============================================
// Pre-Generated Content Paths
// ============================================

const IMAGE_PATHS = {
  // Generic news images
  news_war: '/images/news/news_war.png',
  news_peace: '/images/news/news_peace.png',
  news_nuclear: '/images/news/news_nuclear.png',
  news_palestinian: '/images/news/news_palestinian.png',
  news_diplomatic: '/images/news/news_diplomatic.png',
  news_economic: '/images/news/news_economic.png',
  news_victory: '/images/news/news_victory.png',
  news_defeat: '/images/news/news_defeat.png',

  // Country-specific news
  news_egypt: '/images/news/news_egypt.png',
  news_syria: '/images/news/news_syria.png',
  news_jordan: '/images/news/news_jordan.png',
  news_lebanon: '/images/news/news_lebanon.png',
  news_iraq: '/images/news/news_iraq.png',
  news_iran: '/images/news/news_iran.png',
  news_libya: '/images/news/news_libya.png',

  // Event headers
  event_crisis: '/images/events/event_crisis.png',
  event_opportunity: '/images/events/event_opportunity.png',
  event_diplomatic: '/images/events/event_diplomatic.png',
  event_military: '/images/events/event_military.png',
  event_internal: '/images/events/event_internal.png',
  event_international: '/images/events/event_international.png',

  // Endgame
  endgame_victory: '/images/endgame/endgame_victory.png',
  endgame_military_defeat: '/images/endgame/endgame_military_defeat.png',
  endgame_nuclear: '/images/endgame/endgame_nuclear.png',
  endgame_impeachment: '/images/endgame/endgame_impeachment.png',
  endgame_assassination: '/images/endgame/endgame_assassination.png',

  // Default fallback
  default: '/images/news/news_diplomatic.png',
};

// ============================================
// Template Headlines
// ============================================

const HEADLINE_TEMPLATES = {
  diplomatic: [
    'Regional diplomatic talks continue amid tensions',
    'Foreign ministers meet to discuss bilateral relations',
    'International community urges restraint in the region',
    'Diplomatic channels remain open despite setbacks',
    'Peace negotiations enter new phase',
  ],
  military: [
    'Defense forces maintain high alert status',
    'Military exercises conducted near border regions',
    'Arms procurement discussions underway',
    'Security situation assessed as stable',
    'Border patrols increased in response to activity',
  ],
  economic: [
    'Treasury reviews defense budget allocations',
    'Economic advisors recommend fiscal prudence',
    'Trade relations under review amid regional tensions',
    'Foreign aid package being negotiated',
    'Infrastructure spending priorities debated',
  ],
  internal: [
    'Knesset debates national security policy',
    'Coalition partners discuss policy alignment',
    'Public opinion polls show mixed sentiment',
    'Government faces questions on regional strategy',
    'Parliamentary committee reviews intelligence reports',
  ],
  international: [
    'UN Security Council monitors regional developments',
    'International observers present in the region',
    'Global powers issue joint statement',
    'World leaders express concern over situation',
    'International community calls for dialogue',
  ],
};

// ============================================
// Template Events
// ============================================

const EVENT_TEMPLATES: GeneratedEvent[] = [
  {
    title: 'Diplomatic Overture Received',
    description:
      'A neighboring country has made an unexpected diplomatic overture. Your advisors are divided on how to respond to this development.',
    category: 'diplomatic',
    urgency: 'pressing',
    options: [
      {
        label: 'Accept Meeting',
        description: 'Agree to diplomatic talks to explore possibilities.',
        effects: { usAttitude: 5 },
      },
      {
        label: 'Cautious Response',
        description: 'Respond diplomatically but maintain current positions.',
        effects: {},
      },
      {
        label: 'Decline',
        description: 'Politely decline the overture at this time.',
        effects: { usAttitude: -5 },
      },
    ],
    advisorOpinions: {
      defense: 'We should be cautious. This could be a delaying tactic.',
      foreign: 'Dialogue is always preferable to conflict.',
      intelligence: 'Our sources indicate this may be genuine.',
    },
  },
  {
    title: 'Border Incident Reported',
    description:
      'Military observers have reported suspicious activity near the border. The situation requires your attention.',
    category: 'military',
    urgency: 'immediate',
    options: [
      {
        label: 'Increase Patrols',
        description: 'Deploy additional forces to monitor the situation.',
        effects: { budget: -5000000 },
      },
      {
        label: 'Diplomatic Protest',
        description: 'File a formal complaint through diplomatic channels.',
        effects: { usAttitude: 5 },
      },
      {
        label: 'Monitor Situation',
        description: 'Continue observation without escalation.',
        effects: {},
      },
    ],
    advisorOpinions: {
      defense: 'We should respond with force to deter future incidents.',
      foreign: 'A diplomatic response would be more appropriate.',
      intelligence: 'We need more information before acting.',
    },
  },
  {
    title: 'Economic Pressure Mounts',
    description:
      'International economic pressure is affecting the national budget. Difficult decisions may be necessary.',
    category: 'economic',
    urgency: 'routine',
    options: [
      {
        label: 'Seek Foreign Aid',
        description: 'Request additional support from allies.',
        effects: { usAttitude: -10, budget: 50000000 },
      },
      {
        label: 'Reduce Spending',
        description: 'Implement austerity measures across departments.',
        effects: { budget: 20000000 },
      },
      {
        label: 'Maintain Course',
        description: 'Continue current economic policies.',
        effects: {},
      },
    ],
    advisorOpinions: {
      defense: 'Defense spending must be protected at all costs.',
      foreign: 'Our allies may be willing to help if we ask.',
      intelligence: 'Economic weakness could be exploited by adversaries.',
    },
  },
  {
    title: 'Intelligence Report',
    description:
      'Mossad has delivered a critical intelligence briefing regarding activities in a neighboring country.',
    category: 'military',
    urgency: 'pressing',
    options: [
      {
        label: 'Covert Action',
        description: 'Authorize intelligence operations to address the threat.',
        effects: { budget: -10000000 },
      },
      {
        label: 'Share with Allies',
        description: 'Coordinate response with allied intelligence services.',
        effects: { usAttitude: 10 },
      },
      {
        label: 'Continue Monitoring',
        description: 'Gather more intelligence before acting.',
        effects: {},
      },
    ],
    advisorOpinions: {
      defense: 'We should be prepared for any military contingency.',
      foreign: 'Sharing intelligence strengthens our alliances.',
      intelligence: 'Covert action carries risks but may be necessary.',
    },
  },
  {
    title: 'Parliamentary Challenge',
    description:
      'Opposition members in the Knesset are challenging your government\'s regional policy.',
    category: 'internal',
    urgency: 'routine',
    options: [
      {
        label: 'Defend Policy',
        description: 'Vigorously defend current approach in parliament.',
        effects: {},
      },
      {
        label: 'Offer Compromise',
        description: 'Work with opposition to find common ground.',
        effects: { usAttitude: 5 },
      },
      {
        label: 'Call for Debate',
        description: 'Request a formal parliamentary debate on the matter.',
        effects: {},
      },
    ],
    advisorOpinions: {
      defense: 'We cannot appear weak in the face of opposition.',
      foreign: 'Domestic unity strengthens our diplomatic position.',
      intelligence: 'Our sources indicate opposition support is limited.',
    },
  },
];

// ============================================
// Narrative Templates
// ============================================

const NARRATIVE_TEMPLATES: Record<string, GeneratedNarrative> = {
  total_victory: {
    title: 'Total Victory Achieved',
    summary:
      'Through strategic brilliance and decisive leadership, you achieved what many thought impossible. ' +
      'Israel\'s enemies have been vanquished, and the nation stands secure for a generation. ' +
      'Your name will be remembered alongside the great military leaders of history.',
    leadershipStyle: 'The Conqueror',
    historicalComparison: 'Alexander the Great',
  },
  military_defeat: {
    title: 'Military Defeat',
    summary:
      'Despite your best efforts, the military situation proved insurmountable. ' +
      'Your forces fought bravely, but in the end, superior numbers and unfavorable circumstances led to defeat. ' +
      'History will debate whether different decisions might have changed the outcome.',
    leadershipStyle: 'The Overwhelmed',
    historicalComparison: 'Custer at Little Bighorn',
  },
  nuclear_holocaust: {
    title: 'Nuclear Catastrophe',
    summary:
      'The nuclear option was exercised, with consequences that will echo through eternity. ' +
      'Millions perished in the fire, and the world will never be the same. ' +
      'History will record this as one of humanity\'s darkest moments.',
    leadershipStyle: 'The Destroyer',
    historicalComparison: 'Oppenheimer\'s nightmare realized',
  },
  impeachment: {
    title: 'Political Downfall',
    summary:
      'The Knesset lost confidence in your leadership, and your government fell. ' +
      'Political rivals and opposition forces combined to end your tenure. ' +
      'Perhaps with different choices, the outcome might have been different.',
    leadershipStyle: 'The Compromised',
    historicalComparison: 'Nixon after Watergate',
  },
  assassination: {
    title: 'Tragic End',
    summary:
      'Your leadership was cut short by an assassin\'s violence. ' +
      'The nation mourns, and your legacy remains contested by historians. ' +
      'Some call you a martyr for peace; others blame your policies for your fate.',
    leadershipStyle: 'The Martyr',
    historicalComparison: 'Lincoln or Rabin',
  },
};

// ============================================
// Mock Service Class
// ============================================

export class MockAIService implements IAIService {
  readonly name = 'MockAI';

  isAvailable(): boolean {
    return true; // Mock service is always available
  }

  /**
   * Return a pre-generated image based on prompt keywords
   */
  async generateImage(
    prompt: string,
    _options?: ImageGenerationOptions
  ): Promise<ImageResult> {
    const imagePath = this.matchImagePath(prompt);

    return {
      url: imagePath,
      fromCache: false,
      isFallback: true,
    };
  }

  /**
   * Match prompt to a pre-generated image path
   */
  private matchImagePath(prompt: string): string {
    const promptLower = prompt.toLowerCase();

    // Check for specific keywords
    const keywordMap: Array<[string[], string]> = [
      [['war', 'combat', 'battle', 'attack', 'military action'], 'news_war'],
      [['peace', 'calm', 'treaty', 'ceasefire'], 'news_peace'],
      [['nuclear', 'atomic', 'radiation'], 'news_nuclear'],
      [['palestinian', 'territories', 'occupation'], 'news_palestinian'],
      [['diplomatic', 'ambassador', 'talks', 'negotiation'], 'news_diplomatic'],
      [['economic', 'budget', 'money', 'trade'], 'news_economic'],
      [['victory', 'triumph', 'win'], 'news_victory'],
      [['defeat', 'loss', 'failed'], 'news_defeat'],
      [['egypt', 'cairo', 'nile'], 'news_egypt'],
      [['syria', 'damascus'], 'news_syria'],
      [['jordan', 'amman'], 'news_jordan'],
      [['lebanon', 'beirut'], 'news_lebanon'],
      [['iraq', 'baghdad'], 'news_iraq'],
      [['iran', 'tehran'], 'news_iran'],
      [['libya', 'tripoli'], 'news_libya'],
      [['crisis', 'emergency', 'urgent'], 'event_crisis'],
      [['opportunity', 'chance'], 'event_opportunity'],
      [['international', 'un', 'global'], 'event_international'],
      [['internal', 'knesset', 'parliament'], 'event_internal'],
    ];

    for (const [keywords, imageKey] of keywordMap) {
      if (keywords.some((kw) => promptLower.includes(kw))) {
        return IMAGE_PATHS[imageKey as keyof typeof IMAGE_PATHS] || IMAGE_PATHS.default;
      }
    }

    return IMAGE_PATHS.default;
  }

  /**
   * Generate mock headlines based on game state
   */
  async generateHeadlines(
    context: GameContext,
    count: number = 3
  ): Promise<GeneratedHeadline[]> {
    const headlines: GeneratedHeadline[] = [];
    const categories = Object.keys(HEADLINE_TEMPLATES) as Array<
      keyof typeof HEADLINE_TEMPLATES
    >;

    // Generate contextual headlines if game state available
    if (context.game) {
      // War headlines
      if (context.game.wars && context.game.wars.length > 0) {
        const war = context.game.wars[0];
        const enemyId = war.attacker === 'israel' ? war.defender : war.attacker;
        const enemyName = COUNTRY_NAMES[enemyId as keyof typeof COUNTRY_NAMES];

        headlines.push({
          text: `Conflict with ${enemyName} continues as military operations proceed`,
          category: 'military',
          relatedCountries: [enemyId as CountryId],
        });
      }

      // Budget headlines
      if (context.game.player && context.game.player.budget < 50000000) {
        headlines.push({
          text: 'Treasury warns of budget constraints affecting operations',
          category: 'economic',
        });
      }
    }

    // Fill remaining slots with random templates
    while (headlines.length < count) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const templates = HEADLINE_TEMPLATES[category];
      const template = templates[Math.floor(Math.random() * templates.length)];

      // Avoid duplicates
      if (!headlines.some((h) => h.text === template)) {
        headlines.push({
          text: template,
          category,
        });
      }
    }

    return headlines.slice(0, count);
  }

  /**
   * Return a random template event
   */
  async generateEvent(
    _context: GameContext,
    _triggerType?: string
  ): Promise<GeneratedEvent> {
    const event =
      EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    return { ...event };
  }

  /**
   * Return template narrative based on end condition
   */
  async generateNarrative(
    _context: GameContext,
    endCondition: string
  ): Promise<GeneratedNarrative> {
    const narrative = NARRATIVE_TEMPLATES[endCondition];

    if (narrative) {
      return { ...narrative };
    }

    return {
      title: 'The End',
      summary:
        'Your time as Prime Minister has come to an end. ' +
        'History will be the final judge of your decisions and their consequences.',
      leadershipStyle: 'Unknown',
    };
  }

  /**
   * No cache to clear for mock service
   */
  clearCache(): void {
    // No-op for mock service
  }
}
