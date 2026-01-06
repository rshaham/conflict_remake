# Conflict: Middle East Political Simulator — Technical Specification

**Version:** 1.0  
**Last Updated:** January 2026  
**Reference:** conflict-remake-gdd-v2.md

---

## 1. Technology Stack

### 1.1 Core Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React | 18.x | UI components and state |
| Language | TypeScript | 5.x | Type safety |
| Build | Vite | 5.x | Fast builds, HMR |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State | Zustand | 4.x | Lightweight state management |
| Data Fetching | TanStack Query | 5.x | AI API calls, caching |
| Routing | React Router | 6.x | Screen navigation |
| Data | js-yaml | 4.x | YAML parsing |
| Testing | Vitest + RTL | - | Unit and component tests |
| E2E Testing | Playwright | - | End-to-end tests |

### 1.2 Optional/Future

| Technology | Purpose | When to Add |
|------------|---------|-------------|
| Three.js / R3F | 3D map visualization | Phase 3+ |
| Howler.js | Sound/music system | Phase 2 |
| WebLLM | Client-side AI inference | Phase 4 (production) |

### 1.3 AI Integration

**Development Phase:**
- Anthropic Claude API (claude-3-5-sonnet or claude-3-haiku)
- Fallback: OpenAI GPT-4o-mini

**Production Options:**
1. **Cloud API** (simplest): Continue using Claude/OpenAI
2. **Self-hosted**: Ollama with Llama 3 / Mistral
3. **Client-side**: WebLLM with quantized model (Phi-3, Gemma 2B)

---

## 2. Project Structure

```
conflict-remake/
├── public/
│   ├── favicon.ico
│   └── assets/
│       ├── flags/           # Country flag SVGs
│       ├── icons/           # UI icons
│       └── sounds/          # Audio files (Phase 2)
│
├── src/
│   ├── main.tsx            # Entry point
│   ├── App.tsx             # Root component with routing
│   ├── index.css           # Tailwind imports
│   │
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic UI (Button, Card, Modal, etc.)
│   │   ├── game/           # Game-specific components
│   │   │   ├── CountryCard.tsx
│   │   │   ├── RelationshipBar.tsx
│   │   │   ├── MiniMap.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── AdvisorPanel.tsx
│   │   │   ├── WeaponCatalog.tsx
│   │   │   ├── WarProgressBar.tsx
│   │   │   └── ...
│   │   └── layout/         # Layout components
│   │       ├── StatusBar.tsx
│   │       ├── ActionBar.tsx
│   │       └── NavBar.tsx
│   │
│   ├── screens/            # Full-screen views
│   │   ├── TitleScreen.tsx
│   │   ├── NewsScreen.tsx
│   │   ├── DiplomaticScreen.tsx
│   │   ├── IntelligenceScreen.tsx
│   │   ├── MilitaryScreen.tsx
│   │   ├── PalestinianScreen.tsx
│   │   ├── WarScreen.tsx
│   │   ├── UNSummitScreen.tsx
│   │   └── GameOverScreen.tsx
│   │
│   ├── store/              # Zustand stores
│   │   ├── gameStore.ts    # Main game state
│   │   ├── uiStore.ts      # UI state (modals, selections)
│   │   └── settingsStore.ts # User preferences
│   │
│   ├── engine/             # Game logic (no React dependencies)
│   │   ├── GameEngine.ts   # Turn resolution orchestrator
│   │   ├── DiplomacyEngine.ts
│   │   ├── CombatEngine.ts
│   │   ├── IntelligenceEngine.ts
│   │   ├── EconomyEngine.ts
│   │   ├── AIOpponent.ts   # Rule-based opponent AI
│   │   ├── EventEngine.ts  # Event trigger evaluation
│   │   └── ScoringEngine.ts
│   │
│   ├── ai/                 # AI integration
│   │   ├── AIService.ts    # API abstraction layer
│   │   ├── prompts.ts      # Prompt templates
│   │   ├── eventGenerator.ts
│   │   ├── headlineGenerator.ts
│   │   ├── narrativeGenerator.ts
│   │   └── schemas.ts      # Zod schemas for AI outputs
│   │
│   ├── data/               # Game data loading
│   │   ├── loader.ts       # YAML loading and parsing
│   │   ├── types.ts        # TypeScript types from YAML schemas
│   │   └── validation.ts   # Runtime data validation
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useGame.ts      # Game state access
│   │   ├── useAI.ts        # AI generation hooks
│   │   ├── useSound.ts     # Sound system (Phase 2)
│   │   └── useTurn.ts      # Turn flow management
│   │
│   ├── utils/              # Utility functions
│   │   ├── format.ts       # Number/date formatting
│   │   ├── random.ts       # Deterministic random for replays
│   │   └── logger.ts       # Debug logging
│   │
│   └── types/              # Global TypeScript types
│       ├── game.ts         # Game state types
│       ├── events.ts       # Event types
│       └── api.ts          # API response types
│
├── data/                   # YAML data files (copied to public at build)
│   ├── settings.yaml
│   ├── countries.yaml
│   ├── enums.yaml
│   ├── weapons.yaml
│   ├── nuclear.yaml
│   ├── palestinian.yaml
│   ├── scoring.yaml
│   ├── leaders.yaml
│   ├── combat.yaml
│   ├── ai_decisions.yaml
│   ├── events.yaml
│   ├── prompts.yaml
│   └── scenarios/
│       └── classic_1997.yaml
│
├── tests/
│   ├── unit/               # Engine unit tests
│   ├── components/         # Component tests
│   └── e2e/               # Playwright tests
│
├── .env.example           # Environment variables template
├── .env.local             # Local env (not committed)
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 3. Core Types

```typescript
// src/types/game.ts

// === Enums (derived from YAML) ===

type RelationshipLevel = 
  | 'military_pact' | 'profitable' | 'beneficial' | 'favourable'
  | 'satisfactory' | 'cool' | 'lamentable' | 'hostile' | 'war';

type StabilityLevel = 
  | 'very_solid' | 'solid' | 'good' | 'weak' | 'critical' | 'collapse';

type InsurgencyLevel = 
  | 'none' | 'scattered' | 'organized' | 'armed' | 'guerilla_force' | 'open_revolt';

type DiplomaticStance = 'friendly' | 'neutral' | 'aggressive';

type DiplomaticAction = 'improve' | 'maintain' | 'worsen';

type IntelligenceAction = 'support_insurgents' | 'disrupt_insurgents' | 'do_nothing';

type NuclearStage = 'none' | 'research' | 'development' | 'testing' | 'operational';

type PalestinianLevel = 'calm' | 'unrest' | 'protests' | 'violence' | 'intifada';

type PolicingTactic = 'none' | 'soft' | 'hard';

type GamePhase = 
  | 'news' | 'events' | 'diplomatic' | 'intelligence' 
  | 'military' | 'palestinian' | 'resolution' | 'un_summit' | 'game_over';

type LeaderStrength = 'weak' | 'moderate' | 'strong';
type LeaderAggression = 'dovish' | 'pragmatic' | 'hawkish';
type LeaderRiskTolerance = 'cautious' | 'calculated' | 'reckless';

type CountryId = 'israel' | 'egypt' | 'syria' | 'jordan' | 'lebanon' | 'iraq' | 'iran' | 'libya';
type VendorId = 'usa' | 'uk' | 'france' | 'black_market';
type WeaponId = 'light_tank' | 'main_battle_tank' | 'anti_tank_helicopter' | 'sam_battery' | 'fighter_aircraft' | 'anti_sam_helicopter' | 'infantry_brigade';

// === Core State ===

interface GameState {
  // Meta
  gameId: string;
  turn: number;
  month: number;      // 1-12
  year: number;       // Starts 1997
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

interface PlayerState {
  budget: number;
  gdpDefensePercent: number;
  usAttitude: number;
  prestige: number;          // 0-10 maps to prestige level
  knessetDisapproval: number; // 0-10
  violencePoints: number;
  
  // Flags
  palestinianHomeland: boolean;
  armyLimitAgreement: boolean;
  
  // Palestinian situation
  palestinianLevel: PalestinianLevel;
  policingTactic: PolicingTactic;
  
  // Military
  arsenal: Record<WeaponId, number>;
  nuclearStage: NuclearStage;
  nuclearProgress: number;   // Months of progress in current stage
  deployedTroops: Record<CountryId, number>; // Brigades on each border
  
  // Vendor relationships
  vendorPurchases: Record<VendorId, number>;
  embargoedBy: VendorId[];
  pendingDeliveries: PendingDelivery[];
  
  // Turn actions (reset each turn)
  turnActions: {
    diplomaticActions: Record<CountryId, DiplomaticAction>;
    intelligenceActions: Record<CountryId, IntelligenceAction>;
    weaponPurchases: WeaponPurchase[];
    fundedNuclear: boolean;
    airstrikes: Airstrike[];
  };
}

interface CountryState {
  id: CountryId;
  stability: StabilityLevel;
  insurgency: InsurgencyLevel;
  leader: LeaderState;
  nuclearStage: NuclearStage;
  nuclearProgress: number;
  
  // Military (simplified for AI countries)
  militaryStrength: number;   // Abstract combat power
  
  // Relationship with Israel
  relationship: RelationshipLevel;
  stance: DiplomaticStance;
  
  // Status
  isDefeated: boolean;
  defeatedBy?: CountryId;
  defeatedOnTurn?: number;
}

interface LeaderState {
  name: string;
  strength: LeaderStrength;
  aggression: LeaderAggression;
  riskTolerance: LeaderRiskTolerance;
}

interface War {
  id: string;
  attacker: CountryId;
  defender: CountryId;
  startTurn: number;
  progress: number;          // -10 to +10 (defender to attacker advantage)
  attackerLosses: Record<WeaponId, number>;
  defenderLosses: Record<WeaponId, number>;
}

interface GameEvent {
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

interface EventOption {
  id: string;
  text: string;
  detailedText?: string;
  consequences: EventConsequences;
}

interface EventConsequences {
  usAttitude?: number;
  prestige?: number;
  knessetDisapproval?: number;
  violencePoints?: number;
  budget?: number;
  relationships?: Record<CountryId, { change?: number; newStance?: DiplomaticStance }>;
  stability?: Record<CountryId, number>;
  insurgency?: Record<CountryId, number>;
  palestinian?: number;
  followUpEvent?: string;
}

interface GameHistory {
  // Last N turns of data for AI context
  recentActions: PlayerAction[];   // Last 10 actions
  recentEvents: HistoricalEvent[]; // Last 5 events with outcomes
  headlines: string[];             // Last 20 headlines
}

interface EndState {
  type: 'victory' | 'defeat';
  condition: string;            // Which win/lose condition
  finalScore: number;
  leadershipStyle: string;
  narrative: string;            // AI-generated summary
  statistics: GameStatistics;
}
```

---

## 4. State Management

### 4.1 Game Store (Zustand)

```typescript
// src/store/gameStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface GameStore {
  // State
  game: GameState | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  newGame: (difficulty: DifficultyId, scenario: ScenarioId) => Promise<void>;
  loadGame: (saveData: string) => void;
  saveGame: () => string;
  
  // Phase actions
  setDiplomaticAction: (country: CountryId, action: DiplomaticAction) => void;
  setIntelligenceAction: (country: CountryId, action: IntelligenceAction) => void;
  attemptExtremeMeasure: (country: CountryId, type: 'assassination' | 'coup') => void;
  purchaseWeapon: (vendor: VendorId, weapon: WeaponId, quantity: number) => void;
  fundNuclear: (fund: boolean) => void;
  deployTroops: (country: CountryId, brigades: number) => void;
  orderAirstrike: (country: CountryId, target: AirstrikeTarget) => void;
  setPolicingTactic: (tactic: PolicingTactic) => void;
  
  // Event handling
  respondToEvent: (eventId: string, optionId: string) => void;
  
  // Turn flow
  advancePhase: () => void;
  endTurn: () => Promise<void>;  // Async for AI generation
  
  // War actions
  offerCeasefire: (warId: string) => void;
  launchNuclearStrike: (warId: string) => void;
  
  // UN Summit
  acceptProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      game: null,
      isLoading: false,
      error: null,
      
      newGame: async (difficulty, scenario) => {
        set({ isLoading: true, error: null });
        try {
          const initialState = await initializeGame(difficulty, scenario);
          set({ game: initialState, isLoading: false });
        } catch (e) {
          set({ error: e.message, isLoading: false });
        }
      },
      
      // ... implementation of all actions
    })),
    {
      name: 'conflict-save',
      partialize: (state) => ({ game: state.game }),
    }
  )
);
```

### 4.2 UI Store

```typescript
// src/store/uiStore.ts

interface UIStore {
  // Selected items
  selectedCountry: CountryId | null;
  selectedVendor: VendorId;
  
  // Modals
  activeModal: ModalType | null;
  modalData: unknown;
  
  // Actions
  selectCountry: (country: CountryId | null) => void;
  selectVendor: (vendor: VendorId) => void;
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
}
```

---

## 5. Game Engine

### 5.1 Turn Resolution Flow

```typescript
// src/engine/GameEngine.ts

export class GameEngine {
  constructor(
    private diplomacy: DiplomacyEngine,
    private combat: CombatEngine,
    private intelligence: IntelligenceEngine,
    private economy: EconomyEngine,
    private aiOpponent: AIOpponent,
    private eventEngine: EventEngine,
    private scoring: ScoringEngine,
  ) {}

  async resolveTurn(state: GameState): Promise<GameState> {
    let newState = { ...state };
    
    // 1. Apply player diplomatic actions
    newState = this.diplomacy.applyPlayerActions(newState);
    
    // 2. Apply player intelligence actions
    newState = this.intelligence.applyPlayerActions(newState);
    
    // 3. Apply player military actions (already committed)
    newState = this.economy.processPurchases(newState);
    newState = this.economy.processDeliveries(newState);
    
    // 4. Process airstrikes
    newState = this.combat.processAirstrikes(newState);
    
    // 5. AI countries take their turns
    for (const countryId of getActiveCountries(newState)) {
      newState = this.aiOpponent.takeTurn(newState, countryId);
    }
    
    // 6. Resolve active wars
    for (const war of newState.wars) {
      newState = this.combat.resolveWarTurn(newState, war.id);
    }
    
    // 7. Update relationships based on actions
    newState = this.diplomacy.updateRelationships(newState);
    
    // 8. Update stability and insurgency
    newState = this.intelligence.updateStability(newState);
    
    // 9. Update Palestinian situation
    newState = this.updatePalestinian(newState);
    
    // 10. Progress nuclear programs
    newState = this.progressNuclearPrograms(newState);
    
    // 11. Check for country collapses
    newState = this.checkCollapses(newState);
    
    // 12. Check win/lose conditions
    const endCondition = this.scoring.checkEndConditions(newState);
    if (endCondition) {
      newState.endState = await this.scoring.generateEndState(newState, endCondition);
      newState.phase = 'game_over';
      return newState;
    }
    
    // 13. Advance turn
    newState.turn += 1;
    newState.month = (newState.month % 12) + 1;
    if (newState.month === 1) {
      newState.year += 1;
    }
    
    // 14. Check for annual events
    if (newState.month === 12) {
      newState.phase = 'un_summit';
    } else {
      newState.phase = 'news';
    }
    
    // 15. Clear turn actions
    newState.player.turnActions = createEmptyTurnActions();
    
    return newState;
  }
}
```

### 5.2 Combat Engine

```typescript
// src/engine/CombatEngine.ts

export class CombatEngine {
  resolveWarTurn(state: GameState, warId: string): GameState {
    const war = state.wars.find(w => w.id === warId);
    if (!war) return state;
    
    const attacker = war.attacker === 'israel' ? state.player : state.countries[war.attacker];
    const defender = war.defender === 'israel' ? state.player : state.countries[war.defender];
    
    // Calculate combat phases
    const phases = ['air_superiority', 'sead', 'close_air', 'ground'];
    let attackerTotalDamage = 0;
    let defenderTotalDamage = 0;
    
    for (const phase of phases) {
      const result = this.resolvePhase(phase, attacker, defender);
      attackerTotalDamage += result.attackerDamage;
      defenderTotalDamage += result.defenderDamage;
      // Apply losses...
    }
    
    // Update war progress
    const progressChange = this.calculateProgressChange(attackerTotalDamage, defenderTotalDamage);
    war.progress = Math.max(-10, Math.min(10, war.progress + progressChange));
    
    // Check for war end
    if (war.progress >= 10) {
      return this.resolveVictory(state, war, war.attacker);
    } else if (war.progress <= -10) {
      return this.resolveVictory(state, war, war.defender);
    }
    
    return state;
  }
  
  private resolvePhase(phase: string, attacker: Forces, defender: Forces): PhaseResult {
    // Implementation based on combat.yaml rules
    // Apply counter relationships, random variance, etc.
  }
}
```

### 5.3 AI Opponent

```typescript
// src/engine/AIOpponent.ts

export class AIOpponent {
  takeTurn(state: GameState, countryId: CountryId): GameState {
    const country = state.countries[countryId];
    const leader = country.leader;
    
    // Evaluate decision tree from ai_decisions.yaml
    const decisions = this.evaluateDecisionTree(state, country);
    
    // Wildcard check - occasionally do something unexpected
    if (Math.random() < this.getWildcardChance(leader)) {
      decisions.push(this.generateWildcard(state, country));
    }
    
    // Execute decisions
    for (const decision of decisions) {
      state = this.executeDecision(state, countryId, decision);
    }
    
    return state;
  }
  
  private evaluateDecisionTree(state: GameState, country: CountryState): Decision[] {
    const decisions: Decision[] = [];
    
    // Priority 1: Survival
    if (country.stability <= 'weak' && this.isAtWar(state, country.id)) {
      decisions.push({ type: 'seek_ceasefire' });
      return decisions; // Survival overrides everything
    }
    
    // Priority 2: Active war management
    if (this.isAtWar(state, country.id)) {
      decisions.push({ type: 'maximize_military_spending' });
      
      // Consider nuclear strike if desperate
      if (this.isDesperate(state, country)) {
        decisions.push({ type: 'consider_nuclear' });
      }
      return decisions;
    }
    
    // Priority 3: Opportunistic war
    const warTarget = this.findOpportunisticTarget(state, country);
    if (warTarget && this.shouldDeclareWar(state, country, warTarget)) {
      decisions.push({ type: 'declare_war', target: warTarget });
      return decisions;
    }
    
    // ... continue with other priorities
    
    return decisions;
  }
  
  private shouldDeclareWar(state: GameState, country: CountryState, target: CountryId): boolean {
    const leader = country.leader;
    const factors = this.calculateWarFactors(state, country, target);
    const threshold = this.getWarThreshold(leader.aggression);
    
    return factors.weightedScore > threshold;
  }
}
```

---

## 6. AI Integration

### 6.1 AI Service

```typescript
// src/ai/AIService.ts

export interface AIService {
  generateEvent(context: EventContext): Promise<GameEvent>;
  generateHeadlines(context: HeadlineContext): Promise<string[]>;
  generateConsequenceNarrative(event: GameEvent, choice: string): Promise<string>;
  generateEndGameNarrative(state: GameState, endCondition: EndCondition): Promise<string>;
}

export class ClaudeAIService implements AIService {
  private client: Anthropic;
  
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }
  
  async generateEvent(context: EventContext): Promise<GameEvent> {
    const prompt = buildEventPrompt(context);
    
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: EVENT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    
    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');
    
    // Parse and validate with Zod
    const parsed = JSON.parse(content.text);
    return eventSchema.parse(parsed);
  }
  
  // ... other methods
}

// Mock service for development without API
export class MockAIService implements AIService {
  async generateEvent(context: EventContext): Promise<GameEvent> {
    // Return random event from template pool
    return getRandomTemplateEvent(context.category);
  }
  
  async generateHeadlines(context: HeadlineContext): Promise<string[]> {
    return [
      `Tensions rise in ${context.mostTenseCountry}`,
      'Regional stability concerns grow',
      'UN calls for restraint',
      'Analysts warn of escalation',
    ];
  }
}
```

### 6.2 Prompt Builder

```typescript
// src/ai/prompts.ts

export const EVENT_SYSTEM_PROMPT = `You are the game master for a political simulation game set in the Middle East.
Your role is to generate realistic, consequential events that create interesting
decisions for the player (Prime Minister of Israel).

RULES:
1. Events must be plausible for the 1997 Middle East setting
2. Events should reference the current game state provided
3. Every option should have meaningful trade-offs - no obviously correct answers
4. Consequences should be proportional and logical
5. Use specific names, places, and details for immersion
6. Maintain a serious, realistic tone (not satirical)
7. Events should sometimes connect to previous events or player actions
8. Balance crisis events with opportunities

OUTPUT:
Return valid JSON matching this schema:
{
  "title": "string (max 60 chars)",
  "description": "string (max 500 chars, 2-3 paragraphs)",
  "category": "crisis|opportunity|diplomatic|military|internal|international",
  "urgency": "immediate|pressing|routine",
  "relatedCountries": ["country_id", ...],
  "options": [
    {
      "id": "string",
      "text": "string (max 100 chars)",
      "detailedText": "string (max 200 chars)",
      "consequences": {
        "usAttitude": number,
        "prestige": number,
        "knessetDisapproval": number,
        "violencePoints": number,
        "budget": number,
        "relationships": { "country_id": { "change": number } },
        "stability": { "country_id": number },
        "insurgency": { "country_id": number },
        "palestinian": number
      }
    }
  ],
  "advisorOpinions": {
    "defense": "string (max 150 chars)",
    "foreign": "string (max 150 chars)",
    "intelligence": "string (max 150 chars)"
  }
}

Do not include markdown formatting. Return only valid JSON.`;

export function buildEventPrompt(context: EventContext): string {
  return `Generate a ${context.category} event for month ${context.month}/${context.year}.

CURRENT GAME STATE:

Relationships:
${context.relationships.map(r => `- ${r.country}: ${r.level} (${r.stance} stance)`).join('\n')}

Active Wars: ${context.wars.length > 0 ? context.wars.join(', ') : 'None'}

Neighbor Stability:
${context.neighbors.map(n => `- ${n.country}: ${n.stability} stability, ${n.insurgency} insurgency`).join('\n')}

Palestinian Situation: ${context.palestinianLevel}

Player Status:
- US Attitude: ${context.usAttitude}
- Prestige: ${context.prestige}
- Knesset Disapproval: ${context.knessetDisapproval}/10
- Nuclear Program: ${context.nuclearStage}
- Budget: $${(context.budget / 1000000).toFixed(0)}M
- Violence Points: ${context.violencePoints}

Recent Player Actions (last 3 turns):
${context.recentActions.map(a => `- ${a}`).join('\n')}

Recent Events (last 3):
${context.recentEvents.map(e => `- ${e.title}: Player chose "${e.chosenOption}"`).join('\n')}

${context.specificTrigger ? `SPECIFIC TRIGGER: ${context.specificTrigger}` : ''}

Generate a compelling ${context.category} event with 3 options.`;
}
```

### 6.3 Validation Schemas

```typescript
// src/ai/schemas.ts

import { z } from 'zod';

export const eventConsequencesSchema = z.object({
  usAttitude: z.number().optional(),
  prestige: z.number().optional(),
  knessetDisapproval: z.number().optional(),
  violencePoints: z.number().optional(),
  budget: z.number().optional(),
  relationships: z.record(z.object({
    change: z.number().optional(),
    newStance: z.enum(['friendly', 'neutral', 'aggressive']).optional(),
  })).optional(),
  stability: z.record(z.number()).optional(),
  insurgency: z.record(z.number()).optional(),
  palestinian: z.number().optional(),
  followUpEvent: z.string().optional(),
});

export const eventOptionSchema = z.object({
  id: z.string(),
  text: z.string().max(100),
  detailedText: z.string().max(200).optional(),
  consequences: eventConsequencesSchema,
});

export const eventSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(500),
  category: z.enum(['crisis', 'opportunity', 'diplomatic', 'military', 'internal', 'international']),
  urgency: z.enum(['immediate', 'pressing', 'routine']),
  relatedCountries: z.array(z.string()),
  options: z.array(eventOptionSchema).min(2).max(4),
  advisorOpinions: z.object({
    defense: z.string().max(150).optional(),
    foreign: z.string().max(150).optional(),
    intelligence: z.string().max(150).optional(),
  }).optional(),
});

export type AIGeneratedEvent = z.infer<typeof eventSchema>;
```

---

## 7. Milestones

### Phase 1: Foundation (Week 1-2)

**Goal:** Project setup and core data structures

**Tasks:**
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Set up Zustand stores (empty implementation)
- [ ] Create all TypeScript types from GDD
- [ ] Implement YAML loader and data validation
- [ ] Create all YAML data files from GDD
- [ ] Set up basic routing between screens
- [ ] Create layout components (StatusBar, NavBar, ActionBar)
- [ ] Create placeholder screens for all game phases

**Deliverable:** App that loads data, displays placeholder screens, navigates between them

**Verification:**
- `npm run dev` starts app
- All routes accessible
- YAML data loads without errors
- Types compile without errors

---

### Phase 2: Core Game Loop (Week 2-3)

**Goal:** Playable turn cycle without AI

**Tasks:**
- [ ] Implement GameEngine orchestrator
- [ ] Implement DiplomacyEngine (relationship changes)
- [ ] Implement basic EconomyEngine (budget, purchases)
- [ ] Implement CombatEngine (war resolution)
- [ ] Implement IntelligenceEngine (insurgency changes)
- [ ] Implement basic AIOpponent (rule-based decisions)
- [ ] Implement ScoringEngine (win/lose detection)
- [ ] Connect engines to Zustand store
- [ ] Build DiplomaticScreen with country cards
- [ ] Build MilitaryScreen with weapon catalog
- [ ] Build basic WarScreen
- [ ] Implement turn advancement

**Deliverable:** Can play through multiple turns, buy weapons, go to war, win or lose

**Verification:**
- Can start new game
- Can change diplomatic stance
- Can purchase weapons
- War triggers when conditions met
- War resolves over turns
- Game ends on win/lose condition

---

### Phase 3: Full Gameplay (Week 3-4)

**Goal:** Complete game mechanics

**Tasks:**
- [ ] Implement IntelligenceScreen with extreme measures
- [ ] Implement PalestinianScreen
- [ ] Implement UN Summit screen
- [ ] Implement nuclear program mechanics
- [ ] Implement airstrikes (all types)
- [ ] Implement full AIOpponent decision tree
- [ ] Implement ceasefire mechanics
- [ ] Implement alliance (military pact) mechanics
- [ ] Implement embargoes
- [ ] Implement scoring and leadership styles
- [ ] Build GameOverScreen with full breakdown
- [ ] Implement save/load

**Deliverable:** Complete game, all mechanics functional, no AI generation

**Verification:**
- All screens implemented
- Nuclear program works
- AI countries behave reasonably
- Score calculates correctly
- Save/load works

---

### Phase 4: AI Integration (Week 4-5)

**Goal:** AI-generated events and narratives

**Tasks:**
- [ ] Implement AIService interface
- [ ] Implement ClaudeAIService
- [ ] Implement MockAIService for fallback
- [ ] Implement EventEngine (trigger evaluation)
- [ ] Integrate event generation into turn flow
- [ ] Build EventCard component with options
- [ ] Implement consequence narration
- [ ] Implement headline generation
- [ ] Build NewsScreen with generated headlines
- [ ] Implement end-game narrative generation
- [ ] Add retry logic and error handling for AI calls
- [ ] Add loading states during generation

**Deliverable:** AI generates contextual events each turn, responds to player choices

**Verification:**
- Events generate based on game state
- Events have meaningful consequences
- Headlines reflect game events
- End-game narrative generated
- Graceful fallback if AI fails

---

### Phase 5: Polish & Mobile (Week 5-6)

**Goal:** Production-ready UI

**Tasks:**
- [ ] Mobile-first responsive design pass
- [ ] Touch-friendly interactions
- [ ] Bottom sheet components for details
- [ ] Animations and transitions
- [ ] MiniMap component
- [ ] RelationshipBar component polish
- [ ] Sound system implementation (Howler.js)
- [ ] Adaptive music based on game state
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Performance optimization
- [ ] PWA configuration (offline capable)

**Deliverable:** Polished, mobile-friendly game with sound

**Verification:**
- Works well on mobile viewport
- Touch targets are large enough
- Sound plays appropriately
- Smooth animations
- No performance issues

---

### Phase 6: Testing & Launch (Week 6-7)

**Goal:** Tested, deployable game

**Tasks:**
- [ ] Unit tests for all engines
- [ ] Component tests for key UI
- [ ] E2E tests for critical paths
- [ ] Playtesting and balance adjustments
- [ ] YAML data tuning based on playtests
- [ ] AI prompt refinement
- [ ] Documentation (README, how to play)
- [ ] Deploy to hosting (Vercel/Netlify)
- [ ] Analytics setup (optional)

**Deliverable:** Deployed, tested game

**Verification:**
- Tests pass
- Deployed and accessible
- No critical bugs
- Balance feels right

---

## 8. Environment Variables

```bash
# .env.example

# AI Provider (claude | openai | mock)
VITE_AI_PROVIDER=claude

# Anthropic API Key (if using Claude)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# OpenAI API Key (if using OpenAI)
VITE_OPENAI_API_KEY=sk-...

# AI Model Override (optional)
VITE_AI_MODEL=claude-3-5-sonnet-20241022

# Debug Mode
VITE_DEBUG=false
```

---

## 9. API Contracts

### 9.1 Internal Engine Interface

```typescript
// All engines follow this pattern

interface Engine {
  // Pure function: state in, new state out
  // No side effects, no async (except AI calls)
}

interface DiplomacyEngine {
  applyPlayerActions(state: GameState): GameState;
  updateRelationships(state: GameState): GameState;
  canRequestPact(state: GameState, country: CountryId): boolean;
  requestPact(state: GameState, country: CountryId): GameState;
}

interface CombatEngine {
  canDeclareWar(state: GameState, target: CountryId): boolean;
  declareWar(state: GameState, target: CountryId): GameState;
  resolveWarTurn(state: GameState, warId: string): GameState;
  processAirstrikes(state: GameState): GameState;
  offerCeasefire(state: GameState, warId: string): GameState;
}

interface IntelligenceEngine {
  applyPlayerActions(state: GameState): GameState;
  updateStability(state: GameState): GameState;
  canAttemptExtremeMeasure(state: GameState, country: CountryId): boolean;
  attemptExtremeMeasure(state: GameState, country: CountryId, type: 'assassination' | 'coup'): GameState;
}

interface EconomyEngine {
  calculateBudget(state: GameState): number;
  processPurchases(state: GameState): GameState;
  processDeliveries(state: GameState): GameState;
  canPurchase(state: GameState, vendor: VendorId, weapon: WeaponId, quantity: number): boolean;
}

interface AIOpponent {
  takeTurn(state: GameState, country: CountryId): GameState;
}

interface EventEngine {
  evaluateTriggers(state: GameState): EventTrigger[];
  shouldGenerateEvent(state: GameState): boolean;
  getEventCategory(state: GameState): EventCategory;
}

interface ScoringEngine {
  checkEndConditions(state: GameState): EndCondition | null;
  calculateScore(state: GameState): number;
  determineLeadershipStyle(state: GameState): string;
  generateEndState(state: GameState, condition: EndCondition): Promise<EndState>;
}
```

### 9.2 AI Service Interface

```typescript
interface AIService {
  generateEvent(context: EventContext): Promise<GameEvent>;
  generateHeadlines(context: HeadlineContext): Promise<string[]>;
  generateConsequenceNarrative(event: GameEvent, choice: string): Promise<string>;
  generateEndGameNarrative(state: GameState, endCondition: EndCondition): Promise<string>;
}

interface EventContext {
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
  recentEvents: HistoricalEvent[];
  specificTrigger?: string;
}

interface HeadlineContext {
  month: number;
  year: number;
  events: string[];  // Descriptions of what happened
  mostTenseCountry: string;
  overallMood: 'peaceful' | 'tense' | 'crisis';
}
```

---

## 10. Testing Strategy

### 10.1 Unit Tests (Vitest)

```typescript
// tests/unit/DiplomacyEngine.test.ts

describe('DiplomacyEngine', () => {
  describe('applyPlayerActions', () => {
    it('should improve relationship when player chooses improve and no blockers', () => {
      const state = createMockState({
        countries: {
          egypt: { relationship: 'cool', stance: 'neutral' }
        },
        player: {
          turnActions: {
            diplomaticActions: { egypt: 'improve' }
          }
        }
      });
      
      const result = diplomacyEngine.applyPlayerActions(state);
      
      expect(result.countries.egypt.relationship).toBe('satisfactory');
    });
    
    it('should not improve relationship when troops on border', () => {
      const state = createMockState({
        countries: {
          egypt: { relationship: 'cool', stance: 'neutral' }
        },
        player: {
          deployedTroops: { egypt: 1 },
          turnActions: {
            diplomaticActions: { egypt: 'improve' }
          }
        }
      });
      
      const result = diplomacyEngine.applyPlayerActions(state);
      
      expect(result.countries.egypt.relationship).toBe('cool'); // Unchanged
    });
  });
});
```

### 10.2 Component Tests (React Testing Library)

```typescript
// tests/components/CountryCard.test.tsx

describe('CountryCard', () => {
  it('should display country name and relationship', () => {
    render(<CountryCard countryId="egypt" />);
    
    expect(screen.getByText('Egypt')).toBeInTheDocument();
    expect(screen.getByText('Cool')).toBeInTheDocument();
  });
  
  it('should open detail sheet on tap', async () => {
    render(<CountryCard countryId="egypt" />);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### 10.3 E2E Tests (Playwright)

```typescript
// tests/e2e/gameplay.spec.ts

test('complete game flow', async ({ page }) => {
  await page.goto('/');
  
  // Start new game
  await page.click('text=New Game');
  await page.click('text=Prime Minister'); // Normal difficulty
  await page.click('text=Start');
  
  // Should be on news screen
  await expect(page.locator('h1')).toContainText('January 1997');
  
  // Continue through first turn
  await page.click('text=Continue');
  
  // Should be on diplomatic screen
  await expect(page.locator('[data-testid="phase"]')).toContainText('Diplomatic');
  
  // ... continue testing flow
});
```

---

## 11. Deployment

### 11.1 Build Configuration

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Conflict: Middle East Political Simulator',
        short_name: 'Conflict',
        theme_color: '#1a1a2e',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: true,
  },
});
```

### 11.2 Deployment Options

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Deploy dist/ folder
```

**Self-hosted:**
```bash
npm run build
# Serve dist/ with any static file server
```

---

## 12. Future Considerations

1. **Client-side AI:** Evaluate WebLLM with Phi-3 or Gemma 2B for offline play
2. **Multiplayer:** WebSocket server for hot-seat or async multiplayer
3. **Scenarios:** Additional YAML files for different time periods
4. **Modding:** UI for creating custom scenarios
5. **Achievements:** Track and display accomplishments
6. **Leaderboards:** Optional score submission

---

*End of Technical Specification v1.0*
