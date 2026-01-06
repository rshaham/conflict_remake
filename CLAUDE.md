# CLAUDE.md — AI Assistant Guide for Conflict Remake

## Project Overview

**Conflict: Middle East Political Simulator** is a web-based remake of the 1990 Virgin Mastertronic political simulation game. The player controls Israel as Prime Minister, managing diplomacy, intelligence, military, and the Palestinian situation to defeat four neighboring states (Egypt, Syria, Jordan, Lebanon) before being destroyed.

**Core Vision:** Faithful remake with modern tech, AI-enhanced events, educational 3D weapon displays, and mobile-first design.

**Target Platform:** Web (React), portrait-first mobile, PWA-capable

**Tone:** Serious realpolitik simulation, not satirical or cartoonish

---

## Document Index

Read these documents in order of relevance to your task:

| Document | Purpose | Read When |
|----------|---------|-----------|
| `conflict-remake-gdd-v2.md` | Complete game design, all systems in YAML | Implementing any game mechanic |
| `conflict-remake-tech-spec.md` | Technical architecture, types, milestones | Setting up project, writing code |
| `conflict-remake-weapons-detail.md` | 26 real weapons, 3D specs, Wikipedia links | Working on military/purchase screens |
| `conflict-remake-art-assets.md` | All visual/audio asset requirements | Creating UI, sourcing assets |
| `conflict-remake-research.md` | Original game research, design decisions | Understanding "why" behind choices |

---

## Tech Stack

```
Frontend:       React 18 + TypeScript 5 + Vite 5
State:          Zustand 4
Data Fetching:  TanStack Query 5 (for AI calls)
Styling:        Tailwind CSS 3
Data:           YAML files (js-yaml)
3D:             Three.js / React Three Fiber (weapon turntables)
Audio:          Howler.js
Testing:        Vitest + React Testing Library + Playwright
AI:             Anthropic Claude API (events, narratives)
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # Buttons, cards, modals, progress bars
│   ├── game/        # CountryCard, WeaponCard, EventCard, MiniMap
│   └── layout/      # NavBar, StatusBar, BottomSheet
├── screens/         # 10 full-screen views (News, Diplomatic, Military, etc.)
├── store/           # Zustand stores (gameStore, uiStore, settingsStore)
├── engine/          # Pure game logic (NO React dependencies)
│   ├── GameEngine.ts
│   ├── DiplomacyEngine.ts
│   ├── CombatEngine.ts
│   ├── IntelligenceEngine.ts
│   ├── EconomyEngine.ts
│   ├── AIOpponent.ts
│   ├── EventEngine.ts
│   └── ScoringEngine.ts
├── ai/              # AI service integration
│   ├── AIService.ts          # Interface
│   ├── ClaudeAIService.ts    # Anthropic implementation
│   └── MockAIService.ts      # Template fallback
├── data/            # YAML loaders and validators
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── types/           # TypeScript type definitions

data/                # YAML data files
├── settings.yaml
├── countries.yaml
├── weapons.yaml
├── enums.yaml
└── ... (11 files total)

public/
├── models/          # GLB/GLTF 3D weapon models
├── icons/           # SVG icons
├── audio/           # Music and SFX
└── flags/           # Country flags
```

---

## Key Design Principles

### 1. Engine Purity
All game logic in `/engine` must be **pure TypeScript** with no React dependencies. Engines are pure functions: `(state, action) => newState`. This enables:
- Easy unit testing
- Potential server-side execution
- Clear separation of concerns

### 2. Data-Driven Design
Game rules live in YAML files, not hardcoded. This allows:
- Easy balancing without code changes
- Future scenario/mod support
- Clear documentation of mechanics

### 3. Mobile-First
Design for portrait phone first, then scale up:
- Bottom navigation (thumb-friendly)
- Bottom sheets instead of modals where possible
- Touch targets minimum 44×44px
- No hover-dependent interactions

### 4. AI Integration Strategy
- **High Value:** Event generation, end-game narrative, consequence narration
- **Medium Value:** Headlines (can template), wildcard AI opponent actions
- **Low Value:** Combat resolution, diplomatic math (keep deterministic)

---

## Important Design Decisions

These decisions are **final** — don't revisit unless explicitly asked:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Win condition | Defeat all 4 neighbors | Original design, survival focus |
| Playable nation | Israel only | Focused experience |
| AI for opponents | Rule-based + 20% wildcard | Predictable core with surprises |
| Arms vendors | USA, UK, France, Black Market | Original design with embargoes |
| Combat resolution | Deterministic + variance | Fast, no API latency |
| Leader personalities | From 2009 remake | Adds depth without complexity |
| 3D weapon display | Three.js turntable | Visual appeal, educational |

---

## Coding Conventions

### TypeScript
```typescript
// Use explicit types, avoid `any`
// Prefer interfaces for objects, types for unions
interface CountryState {
  id: CountryId;
  stability: StabilityLevel;
  leader: LeaderState;
}

type CountryId = 'israel' | 'egypt' | 'syria' | 'jordan' | 'lebanon' | 'iraq' | 'iran' | 'libya';

// Use enums sparingly — prefer union types or const objects
const RELATIONSHIP_LEVELS = ['military_pact', 'profitable', ...] as const;
type RelationshipLevel = typeof RELATIONSHIP_LEVELS[number];
```

### React Components
```typescript
// Functional components only
// Props interface named {ComponentName}Props
interface CountryCardProps {
  country: CountryState;
  onSelect: (id: CountryId) => void;
  isSelected?: boolean;
}

export function CountryCard({ country, onSelect, isSelected = false }: CountryCardProps) {
  // Component logic
}

// Use custom hooks for complex state logic
// Keep components focused — split if >150 lines
```

### Zustand Store
```typescript
// Slice pattern for large stores
interface GameStore {
  // State
  gameState: GameState | null;
  
  // Actions
  newGame: (difficulty: Difficulty, scenario: string) => void;
  advancePhase: () => void;
  endTurn: () => Promise<void>;  // Async for AI calls
}

// Keep actions as thin wrappers around engine functions
endTurn: async () => {
  const newState = GameEngine.resolveTurn(get().gameState);
  set({ gameState: newState });
}
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `CountryCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useGameState.ts`)
- Utils/engines: `PascalCase.ts` (e.g., `GameEngine.ts`)
- Types: `types.ts` or `{domain}.types.ts`
- Tests: `{filename}.test.ts`

---

## Common Tasks

### Adding a New Weapon
1. Add entry to `data/weapons.yaml` following existing schema
2. Add 3D model to `public/models/{weapon_id}.glb`
3. Add icon to `public/icons/weapons/{weapon_id}.svg`
4. Write historical summary and add Wikipedia URL
5. Update `WeaponCard` component if new display logic needed

### Adding a New Event Category
1. Define triggers in `data/events.yaml`
2. Update `EventEngine.evaluateTriggers()` 
3. Add prompt template to `data/prompts.yaml`
4. Update event header art in assets
5. Test with `MockAIService` first

### Modifying Game Balance
1. **First** check if it's data-driven (most things are)
2. Edit relevant YAML file
3. If logic change needed, modify appropriate engine
4. Update GDD document to match
5. Add unit test for new behavior

### Implementing a New Screen
1. Create `screens/{ScreenName}Screen.tsx`
2. Add route in main app
3. Create any needed components in `components/game/`
4. Connect to Zustand store via hooks
5. Follow mobile-first layout patterns from existing screens

---

## AI Event Generation

When working with AI-generated content:

### Event Schema (must validate)
```typescript
interface GameEvent {
  title: string;          // Max 60 chars
  description: string;    // Max 500 chars, 2-3 paragraphs
  category: EventCategory;
  urgency: 'immediate' | 'pressing' | 'routine';
  relatedCountries: CountryId[];
  options: EventOption[];  // 2-4 options
  advisorOpinions: {
    defense: string;      // Max 150 chars
    foreign: string;
    intelligence: string;
  };
}
```

### Prompt Best Practices
- Always include full game state context
- Specify output format explicitly (JSON, no markdown)
- Request specific tone: "serious, realistic, consequential"
- Include recent player actions for continuity
- Use Zod for runtime validation of AI responses

### Fallback Strategy
If AI call fails:
1. Retry once with exponential backoff
2. Fall back to `MockAIService` template
3. Log error for debugging
4. Never block gameplay on AI failure

---

## Testing Strategy

### Unit Tests (Vitest)
- All engine functions
- Utility functions
- Data validators

```typescript
// Example engine test
describe('CombatEngine', () => {
  it('should resolve air superiority phase correctly', () => {
    const state = createMockWarState();
    const result = CombatEngine.resolveAirSuperiority(state);
    expect(result.attackerLosses.fighters).toBeGreaterThanOrEqual(0);
  });
});
```

### Component Tests (RTL)
- Key UI components
- User interactions
- State integration

### E2E Tests (Playwright)
- Full game flow: start → first turn → end turn
- Critical paths: declare war, purchase weapon, respond to event
- Mobile viewport testing

---

## Performance Considerations

### 3D Models
- Use GLTF/GLB format (compressed)
- Implement LOD (Level of Detail) for mobile
- Lazy load models only when weapon screen opens
- Consider sprite sheet fallback for low-end devices

### State Updates
- Use Zustand's shallow equality checks
- Avoid recreating objects in selectors
- Batch related state updates

### AI Calls
- Show loading state immediately
- Cache recent events to avoid regeneration
- Prefetch next likely event during idle time

---

## Environment Variables

```bash
VITE_AI_PROVIDER=claude|openai|mock
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_AI_MODEL=claude-3-5-sonnet-20241022
VITE_DEBUG=false
```

For local development without API key, set `VITE_AI_PROVIDER=mock`.

---

## Milestones Reference

| Phase | Focus | Key Deliverable |
|-------|-------|-----------------|
| 1 | Foundation | Project setup, types, YAML loading |
| 2 | Core Loop | Engines, basic gameplay, war resolution |
| 3 | Full Gameplay | All mechanics, scoring, save/load |
| 4 | AI Integration | Events, headlines, narratives |
| 5 | Polish | Mobile UI, animations, sound |
| 6 | Testing & Launch | Tests, balance, deploy |

See `conflict-remake-tech-spec.md` for detailed milestone tasks.

---

## Quick Reference: Game Mechanics

### Relationship Levels (Best → Worst)
1. Military Pact
2. Profitable
3. Beneficial
4. Favourable
5. Satisfactory
6. Cool
7. Lamentable
8. Hostile
9. War

### Stability Levels (Best → Worst)
1. Very Solid
2. Solid
3. Good
4. Weak (extreme measures available)
5. Critical
6. Collapse (country defeated)

### Turn Phases
1. News (AI headlines)
2. Events (if triggered)
3. Diplomatic
4. Intelligence
5. Military (point of no return)
6. End Turn → Resolution

### Win/Lose
- **Win:** All 4 neighbors defeated
- **Lose:** Collapse, Nuclear Holocaust, Impeachment (Knesset ≥10), Assassination

---

## Getting Help

If you're unsure about something:

1. **Check the GDD** — Most gameplay questions are answered there
2. **Check the Research doc** — Explains "why" behind decisions
3. **Check original game** — Play at archive.org for reference
4. **Ask for clarification** — Better to ask than assume wrong

When in doubt, favor:
- Simplicity over complexity
- Data-driven over hardcoded
- Mobile-first over desktop-first
- Deterministic over random (except where specified)

---

## Sensitive Content Notes

This game deals with real geopolitical conflicts. When generating content or making design decisions:

- Maintain serious, respectful tone
- Avoid caricatures or stereotypes
- Present as strategy simulation, not political commentary
- AI-generated content should be reviewed for sensitivity
- Consider content warnings for nuclear themes
- No glorification of violence

---

*Last Updated: January 2026*
