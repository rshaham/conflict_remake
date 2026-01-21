# Game Flow & Combat System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix broken game flow with strict linear phases, fix combat system bugs, add arsenal overlay and turn resolution feedback.

**Architecture:** Replace free navigation HubScreen with enforced linear phase flow (News → Diplomatic → Intelligence → Military → End Turn). Add PhaseGuard to routing, track turn resolution results, display feedback via interstitial screens.

**Tech Stack:** React 18, TypeScript 5, Zustand 4, React Router DOM, Tailwind CSS 3

---

## Task 1: Add Turn Result Types

**Files:**
- Modify: `src/types/game.ts`

**Step 1: Add the new result type interfaces after the existing types**

Add these types after line 363 (after GameStatistics):

```typescript
// === Turn Resolution Result Types ===

export interface AirstrikeResult {
  target: CountryId;
  type: AirstrikeTarget;
  success: boolean;
  damage: string;
  fightersLost: number;
  fightersUsed: number;
}

export interface WarTurnResult {
  warId: string;
  enemy: CountryId;
  progressChange: number;
  newProgress: number;
  playerLosses: Partial<Record<WeaponId, number>>;
  enemyDamage: number;
  outcome: 'ongoing' | 'victory' | 'defeat' | 'ceasefire';
}

export interface EconomyChanges {
  startingBudget: number;
  income: number;
  expenses: number;
  endingBudget: number;
  details: string[];
}

export interface DiplomaticShift {
  country: CountryId;
  from: RelationshipLevel;
  to: RelationshipLevel;
}

export interface TurnResults {
  airstrikes: AirstrikeResult[];
  wars: WarTurnResult[];
  economy: EconomyChanges;
  diplomaticShifts: DiplomaticShift[];
  nuclearProgress?: { stage: NuclearStage; monthsComplete: number; monthsRequired: number };
  palestinianChange?: { from: PalestinianLevel; to: PalestinianLevel };
}
```

**Step 2: Update GameState interface to include lastTurnResults**

Modify the GameState interface (around line 137) to add:

```typescript
export interface GameState {
  // ... existing fields ...

  // End state (if game over)
  endState?: EndState;

  // Results from last turn resolution (for display)
  lastTurnResults?: TurnResults;
}
```

**Step 3: Add 'war' phase to GamePhase type**

Modify GamePhase (around line 46) to add 'war' phase:

```typescript
export type GamePhase =
  | 'news'
  | 'events'
  | 'diplomatic'
  | 'intelligence'
  | 'military'
  | 'war'
  | 'palestinian'
  | 'resolution'
  | 'airstrike_report'
  | 'war_report'
  | 'monthly_summary'
  | 'un_summit'
  | 'game_over';
```

**Step 4: Verify TypeScript compiles**

Run: `cd /c/Users/ronen/Documents/GitHub/conflict_remake && npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/types/game.ts
git commit -m "feat: add turn result types for resolution feedback"
```

---

## Task 2: Create PhaseGuard Component

**Files:**
- Create: `src/components/game/PhaseGuard.tsx`

**Step 1: Create the PhaseGuard component**

```typescript
// ============================================
// PhaseGuard - Enforces current game phase routing
// ============================================

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { GamePhase } from '../../types/game';

// Map phases to their routes
const PHASE_ROUTES: Record<GamePhase, string> = {
  news: '/game/news',
  events: '/game/events',
  diplomatic: '/game/diplomatic',
  intelligence: '/game/intelligence',
  military: '/game/military',
  war: '/game/war',
  palestinian: '/game/territories',
  resolution: '/game/resolution',
  airstrike_report: '/game/airstrike-report',
  war_report: '/game/war-report',
  monthly_summary: '/game/monthly-summary',
  un_summit: '/game/summit',
  game_over: '/game/over',
};

// Map routes back to phases (for validation)
const ROUTE_PHASES: Record<string, GamePhase> = Object.entries(PHASE_ROUTES).reduce(
  (acc, [phase, route]) => ({ ...acc, [route]: phase as GamePhase }),
  {} as Record<string, GamePhase>
);

interface PhaseGuardProps {
  children: React.ReactNode;
}

export function PhaseGuard({ children }: PhaseGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGameStore((state) => state.game);

  useEffect(() => {
    // No game in progress - redirect to title
    if (!game) {
      if (location.pathname.startsWith('/game')) {
        navigate('/', { replace: true });
      }
      return;
    }

    // Get expected route for current phase
    const expectedRoute = PHASE_ROUTES[game.phase];
    const currentPath = location.pathname;

    // Allow arsenal overlay routes (they don't change phase)
    if (currentPath === '/game/arsenal') {
      return;
    }

    // If on a game route but wrong phase, redirect
    if (currentPath.startsWith('/game') && currentPath !== expectedRoute) {
      navigate(expectedRoute, { replace: true });
    }
  }, [game, game?.phase, location.pathname, navigate]);

  return <>{children}</>;
}

export { PHASE_ROUTES, ROUTE_PHASES };
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/game/PhaseGuard.tsx
git commit -m "feat: add PhaseGuard component for phase routing enforcement"
```

---

## Task 3: Update App.tsx Routing

**Files:**
- Modify: `src/App.tsx`

**Step 1: Import PhaseGuard and add new routes**

Replace the entire App.tsx content:

```typescript
// ============================================
// App - Root Component with Routing
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import { PhaseGuard } from './components/game/PhaseGuard';

// Screens
import { TitleScreen } from './screens/TitleScreen';
import { NewsScreen } from './screens/NewsScreen';
import { DiplomaticScreen } from './screens/DiplomaticScreen';
import { IntelligenceScreen } from './screens/IntelligenceScreen';
import { MilitaryScreen } from './screens/MilitaryScreen';
import { ArmsScreen } from './screens/ArmsScreen';
import { NuclearScreen } from './screens/NuclearScreen';
import { PalestinianScreen } from './screens/PalestinianScreen';
import { WarScreen } from './screens/WarScreen';
import { UNSummitScreen } from './screens/UNSummitScreen';
import { GameOverScreen } from './screens/GameOverScreen';
// New screens will be added as we create them
// import { EventsScreen } from './screens/EventsScreen';
// import { AirstrikeReportScreen } from './screens/AirstrikeReportScreen';
// import { WarReportScreen } from './screens/WarReportScreen';
// import { MonthlySummaryScreen } from './screens/MonthlySummaryScreen';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PhaseGuard>
          <Routes>
            {/* Title / Main Menu */}
            <Route path="/" element={<TitleScreen />} />

            {/* Linear Phase Flow */}
            <Route path="/game/news" element={<NewsScreen />} />
            {/* <Route path="/game/events" element={<EventsScreen />} /> */}
            <Route path="/game/diplomatic" element={<DiplomaticScreen />} />
            <Route path="/game/intelligence" element={<IntelligenceScreen />} />
            <Route path="/game/military" element={<MilitaryScreen />} />
            <Route path="/game/war" element={<WarScreen />} />

            {/* Resolution Interstitials */}
            {/* <Route path="/game/airstrike-report" element={<AirstrikeReportScreen />} /> */}
            {/* <Route path="/game/war-report" element={<WarReportScreen />} /> */}
            {/* <Route path="/game/monthly-summary" element={<MonthlySummaryScreen />} /> */}

            {/* Special Phases */}
            <Route path="/game/summit" element={<UNSummitScreen />} />
            <Route path="/game/territories" element={<PalestinianScreen />} />
            <Route path="/game/over" element={<GameOverScreen />} />

            {/* Sub-screens (accessible from phases, don't change phase) */}
            <Route path="/game/arms" element={<ArmsScreen />} />
            <Route path="/game/nuclear" element={<NuclearScreen />} />

            {/* Fallback - redirect to title */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhaseGuard>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

**Step 2: Verify app compiles**

Run: `npx tsc --noEmit`
Expected: No errors (some routes commented out for now)

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update routing with PhaseGuard for linear phase flow"
```

---

## Task 4: Update GameEngine Phase Transitions

**Files:**
- Modify: `src/engine/GameEngine.ts`

**Step 1: Replace the advancePhase function**

Find the `advancePhase` function (around line 116) and replace it:

```typescript
  /**
   * Advance to the next phase in the turn flow
   * Flow: news → events? → diplomatic → intelligence → military → war? → resolution...
   */
  advancePhase: (state: GameState): GameState => {
    const currentPhase = state.phase;

    // Determine next phase based on current phase and game state
    let nextPhase: GamePhase;

    switch (currentPhase) {
      case 'news':
        // Check for pending events
        nextPhase = state.pendingEvents.length > 0 ? 'events' : 'diplomatic';
        break;

      case 'events':
        nextPhase = 'diplomatic';
        break;

      case 'diplomatic':
        nextPhase = 'intelligence';
        break;

      case 'intelligence':
        nextPhase = 'military';
        break;

      case 'military':
        // Military is point of no return - don't auto-advance
        // End turn button handles resolution flow
        return state;

      case 'war':
        // After war management, continue to resolution
        nextPhase = 'airstrike_report';
        break;

      case 'airstrike_report':
        // If there were wars, show war report
        nextPhase = state.wars.length > 0 || (state.lastTurnResults?.wars?.length ?? 0) > 0
          ? 'war_report'
          : 'monthly_summary';
        break;

      case 'war_report':
        nextPhase = 'monthly_summary';
        break;

      case 'monthly_summary':
        // Check for UN Summit (December)
        nextPhase = state.month === 12 ? 'un_summit' : 'news';
        break;

      case 'un_summit':
        nextPhase = 'news';
        break;

      case 'game_over':
        // No advancement from game over
        return state;

      default:
        nextPhase = 'news';
    }

    return {
      ...state,
      phase: nextPhase,
    };
  },

  /**
   * Start the end-of-turn resolution flow
   * Called when player clicks "End Turn" in military phase
   */
  startResolution: (state: GameState): GameState => {
    // If there are active wars, go to war phase first
    if (state.wars.length > 0) {
      return {
        ...state,
        phase: 'war',
      };
    }

    // Otherwise skip to airstrike report (or further if no airstrikes)
    const hasAirstrikes = state.player.turnActions.airstrikes.length > 0;
    return {
      ...state,
      phase: hasAirstrikes ? 'airstrike_report' : 'monthly_summary',
    };
  },
```

**Step 2: Update resolveTurn to track results**

Find the `resolveTurn` function (around line 40) and add result tracking. Add before the return statement at the end:

```typescript
  resolveTurn: (state: GameState): GameState => {
    let newState = { ...state };

    // Track starting values for summary
    const startingBudget = newState.player.budget;
    const startingRelationships: Record<string, RelationshipLevel> = {};
    for (const [id, country] of Object.entries(newState.countries)) {
      if (id !== 'israel') {
        startingRelationships[id] = country.relationship;
      }
    }

    // 1. Apply player diplomatic actions
    newState = DiplomacyEngine.applyPlayerActions(newState);

    // 2. Apply player intelligence actions
    newState = IntelligenceEngine.applyPlayerActions(newState);

    // 3. Process weapon purchases and deliveries
    newState = EconomyEngine.processPurchases(newState);
    newState = EconomyEngine.processDeliveries(newState);

    // 4. Process airstrikes (now returns results)
    const airstrikeResults: AirstrikeResult[] = [];
    for (const airstrike of state.player.turnActions.airstrikes) {
      const result = CombatEngine.executeAirstrikeWithResult(newState, airstrike);
      newState = result.state;
      airstrikeResults.push(result.result);
    }

    // 5. Resolve active wars
    const warResults: WarTurnResult[] = [];
    for (const war of newState.wars) {
      const result = CombatEngine.resolveWarTurnWithResult(newState, war.id);
      newState = result.state;
      warResults.push(result.result);
    }

    // 6. Update relationships (natural drift from stances)
    newState = DiplomacyEngine.updateRelationships(newState);

    // 7. Update stability based on insurgency
    newState = IntelligenceEngine.updateStability(newState);

    // 8. Check for country collapses
    newState = IntelligenceEngine.checkForCollapse(newState);

    // 9. Add monthly income
    newState = EconomyEngine.addMonthlyIncome(newState);

    // 10. Resolve Palestinian situation
    newState = PalestinianEngine.resolvePalestinianPhase(newState);

    // 11. Progress nuclear programs (simplified)
    newState = GameEngine.progressNuclearPrograms(newState);

    // 12. Check win/lose conditions
    const endCondition = ScoringEngine.checkEndConditions(newState);
    if (endCondition) {
      newState = {
        ...newState,
        endState: ScoringEngine.generateEndState(newState, endCondition),
        phase: 'game_over',
      };
      return newState;
    }

    // Track diplomatic shifts
    const diplomaticShifts: DiplomaticShift[] = [];
    for (const [id, country] of Object.entries(newState.countries)) {
      if (id !== 'israel' && startingRelationships[id] !== country.relationship) {
        diplomaticShifts.push({
          country: id as CountryId,
          from: startingRelationships[id],
          to: country.relationship,
        });
      }
    }

    // 13. Store turn results for display
    const turnResults: TurnResults = {
      airstrikes: airstrikeResults,
      wars: warResults,
      economy: {
        startingBudget,
        income: newState.player.budget - startingBudget +
          state.player.turnActions.weaponPurchases.reduce((sum, p) => sum + p.totalCost, 0),
        expenses: state.player.turnActions.weaponPurchases.reduce((sum, p) => sum + p.totalCost, 0) +
          (state.player.turnActions.fundedNuclear ? 20000000 : 0),
        endingBudget: newState.player.budget,
        details: [],
      },
      diplomaticShifts,
    };

    // 14. Advance turn counter and reset turn actions
    newState = {
      ...newState,
      turn: newState.turn + 1,
      month: newState.month >= 12 ? 1 : newState.month + 1,
      year: newState.month >= 12 ? newState.year + 1 : newState.year,
      phase: 'airstrike_report', // Start resolution flow
      lastTurnResults: turnResults,
      player: {
        ...newState.player,
        turnActions: createEmptyTurnActions(),
      },
    };

    // Skip to appropriate resolution phase if no results to show
    if (airstrikeResults.length === 0) {
      if (warResults.length === 0) {
        newState.phase = 'monthly_summary';
      } else {
        newState.phase = 'war_report';
      }
    }

    return newState;
  },
```

**Step 3: Add imports for new types at top of file**

```typescript
import type {
  // ... existing imports ...
  AirstrikeResult,
  WarTurnResult,
  DiplomaticShift,
  TurnResults,
} from '../types/game';
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Errors about missing CombatEngine functions (we'll add those next)

**Step 5: Commit**

```bash
git add src/engine/GameEngine.ts
git commit -m "feat: update GameEngine with proper phase transitions and result tracking"
```

---

## Task 5: Fix CombatEngine and Add Result Tracking

**Files:**
- Modify: `src/engine/CombatEngine.ts`

**Step 1: Add executeAirstrikeWithResult function**

Add after the existing `executeAirstrike` function (keep the original for backwards compatibility):

```typescript
  /**
   * Execute a single airstrike and return result
   */
  executeAirstrikeWithResult: (state: GameState, airstrike: Airstrike): { state: GameState; result: AirstrikeResult } => {
    const target = state.countries[airstrike.target];
    if (!target || target.isDefeated) {
      return {
        state,
        result: {
          target: airstrike.target,
          type: airstrike.type,
          success: false,
          damage: 'Target not available',
          fightersLost: 0,
          fightersUsed: airstrike.fightersUsed,
        },
      };
    }

    // Check if we have enough fighters
    const fighters = state.player.arsenal.fighter_aircraft || 0;
    if (fighters < airstrike.fightersUsed) {
      return {
        state,
        result: {
          target: airstrike.target,
          type: airstrike.type,
          success: false,
          damage: 'Insufficient aircraft',
          fightersLost: 0,
          fightersUsed: airstrike.fightersUsed,
        },
      };
    }

    const newCountries = { ...state.countries };
    const newPlayer = { ...state.player };
    const newArsenal = { ...state.player.arsenal };

    // Calculate losses (based on enemy SAMs)
    const enemySAMs = target.militaryStrength * 0.1;
    const lossChance = 0.1 + (enemySAMs * 0.05);
    let fighterLosses = 0;
    for (let i = 0; i < airstrike.fightersUsed; i++) {
      if (Math.random() < lossChance) {
        fighterLosses++;
      }
    }
    newArsenal.fighter_aircraft = Math.max(0, fighters - fighterLosses);

    let success = true;
    let damage = '';

    // Apply airstrike effects
    switch (airstrike.type) {
      case 'military': {
        const damageAmount = 5 + Math.floor(Math.random() * 10);
        newCountries[airstrike.target] = {
          ...target,
          militaryStrength: Math.max(0, target.militaryStrength - damageAmount),
        };
        newPlayer.violencePoints += 2;
        damage = `Enemy military strength reduced by ${damageAmount}`;
        break;
      }

      case 'civilian': {
        const currentStabilityIndex = STABILITY_ORDER.indexOf(target.stability);
        const newStabilityIndex = Math.min(STABILITY_ORDER.length - 1, currentStabilityIndex + 1);
        newCountries[airstrike.target] = {
          ...target,
          stability: STABILITY_ORDER[newStabilityIndex],
        };
        newPlayer.violencePoints += 2;
        newPlayer.usAttitude = Math.max(-100, newPlayer.usAttitude - 10);
        damage = `Enemy stability reduced to ${STABILITY_ORDER[newStabilityIndex]}`;
        break;
      }

      case 'industrial': {
        newCountries[airstrike.target] = {
          ...target,
          militaryStrength: Math.max(0, Math.floor(target.militaryStrength * 0.8)),
        };
        newPlayer.violencePoints += 2;
        damage = 'Industrial capacity damaged, military strength reduced by 20%';
        break;
      }

      case 'nuclear': {
        if (target.nuclearStage !== 'none' && target.nuclearStage !== 'operational') {
          success = Math.random() < 0.65;
          if (success) {
            newCountries[airstrike.target] = {
              ...target,
              nuclearStage: 'none',
              nuclearProgress: 0,
            };
            damage = 'Nuclear program destroyed';
          } else {
            damage = 'Strike failed to destroy nuclear facilities';
          }
        } else if (target.nuclearStage === 'operational') {
          success = false;
          damage = 'Nuclear program already operational - strike ineffective';
        } else {
          success = false;
          damage = 'No nuclear program to target';
        }
        newPlayer.violencePoints += 4;
        newPlayer.usAttitude = Math.max(-100, newPlayer.usAttitude - 20);
        break;
      }
    }

    newPlayer.arsenal = newArsenal;

    return {
      state: {
        ...state,
        countries: newCountries,
        player: newPlayer,
      },
      result: {
        target: airstrike.target,
        type: airstrike.type,
        success,
        damage,
        fightersLost,
        fightersUsed: airstrike.fightersUsed,
      },
    };
  },
```

**Step 2: Add resolveWarTurnWithResult function**

Add after the existing `resolveWarTurn` function:

```typescript
  /**
   * Resolve one turn of an active war and return result
   */
  resolveWarTurnWithResult: (state: GameState, warId: string): { state: GameState; result: WarTurnResult } => {
    const warIndex = state.wars.findIndex(w => w.id === warId);
    if (warIndex === -1) {
      return {
        state,
        result: {
          warId,
          enemy: 'israel', // placeholder
          progressChange: 0,
          newProgress: 0,
          playerLosses: {},
          enemyDamage: 0,
          outcome: 'ongoing',
        },
      };
    }

    const war = state.wars[warIndex];
    const isPlayerAttacker = war.attacker === 'israel';
    const enemyId = isPlayerAttacker ? war.defender : war.attacker;
    const enemy = state.countries[enemyId];

    // Get forces for both sides
    const playerArsenal = state.player.arsenal;
    const enemyStrength = enemy.militaryStrength;

    // Calculate total combat for each phase
    let totalPlayerDamageDealt = 0;
    let totalPlayerDamageTaken = 0;
    const playerLosses: Partial<Record<WeaponId, number>> = {};
    let enemyDamage = 0;

    for (const phase of COMBAT_PHASES) {
      const phaseResult = CombatEngine.resolveCombatPhase(
        playerArsenal,
        enemyStrength,
        phase.attackers,
        phase.defenders,
        isPlayerAttacker
      );

      totalPlayerDamageDealt += phaseResult.playerDamageDealt;
      totalPlayerDamageTaken += phaseResult.playerDamageTaken;
      enemyDamage += phaseResult.enemyDamage;

      // Apply player losses
      for (const [weapon, loss] of Object.entries(phaseResult.playerLosses)) {
        playerLosses[weapon as WeaponId] = (playerLosses[weapon as WeaponId] || 0) + loss;
      }
    }

    // Calculate war progress change
    let progressChange = 0;
    const damageRatio = totalPlayerDamageDealt / Math.max(1, totalPlayerDamageTaken);

    if (damageRatio > 5) progressChange = isPlayerAttacker ? 3 : -3;
    else if (damageRatio > 2) progressChange = isPlayerAttacker ? 2 : -2;
    else if (damageRatio > 1) progressChange = isPlayerAttacker ? 1 : -1;
    else if (damageRatio > 0.5) progressChange = 0;
    else if (damageRatio > 0.2) progressChange = isPlayerAttacker ? -1 : 1;
    else progressChange = isPlayerAttacker ? -2 : 2;

    const newProgress = Math.max(DEFEAT_THRESHOLD, Math.min(VICTORY_THRESHOLD, war.progress + progressChange));

    // Apply losses to player arsenal
    const newArsenal = { ...playerArsenal };
    for (const [weapon, loss] of Object.entries(playerLosses)) {
      const weaponId = weapon as WeaponId;
      newArsenal[weaponId] = Math.max(0, (newArsenal[weaponId] || 0) - loss);
    }

    // Reduce enemy military strength
    const newEnemyStrength = Math.max(0, enemy.militaryStrength - enemyDamage);

    // Determine outcome
    let outcome: 'ongoing' | 'victory' | 'defeat' | 'ceasefire' = 'ongoing';
    let newWars = [...state.wars];
    const newCountries = { ...state.countries };
    let newPlayer = { ...state.player, arsenal: newArsenal };

    if (newProgress >= VICTORY_THRESHOLD) {
      if (isPlayerAttacker) {
        // Player wins as attacker - enemy defeated
        newCountries[enemyId] = {
          ...enemy,
          militaryStrength: newEnemyStrength,
          stability: 'critical' as StabilityLevel,
          isDefeated: true,
          defeatedBy: 'israel',
          defeatedOnTurn: state.turn,
          relationship: 'hostile' as RelationshipLevel,
        };
        newPlayer.prestige = Math.min(10, newPlayer.prestige + 2);
        outcome = 'victory';
      } else {
        // Player wins as defender - attacker defeated
        newCountries[enemyId] = {
          ...enemy,
          stability: 'critical' as StabilityLevel,
          isDefeated: true,
          defeatedBy: 'israel',
          defeatedOnTurn: state.turn,
          relationship: 'hostile' as RelationshipLevel,
        };
        newPlayer.prestige = Math.min(10, newPlayer.prestige + 2);
        outcome = 'victory';
      }
      newWars = newWars.filter(w => w.id !== warId);
    } else if (newProgress <= DEFEAT_THRESHOLD) {
      if (isPlayerAttacker) {
        // Player loses as attacker
        newPlayer.knessetDisapproval = Math.min(10, newPlayer.knessetDisapproval + 3);
        outcome = 'defeat';
      } else {
        // Player loses as defender - this is game over territory
        outcome = 'defeat';
      }
      newWars = newWars.filter(w => w.id !== warId);
    } else {
      // War continues - update progress
      const updatedWar: War = {
        ...war,
        progress: newProgress,
        attackerLosses: isPlayerAttacker
          ? { ...war.attackerLosses, ...playerLosses }
          : war.attackerLosses,
        defenderLosses: !isPlayerAttacker
          ? { ...war.defenderLosses, ...playerLosses }
          : war.defenderLosses,
      };
      newWars[warIndex] = updatedWar;
      newCountries[enemyId] = {
        ...enemy,
        militaryStrength: newEnemyStrength,
      };
    }

    return {
      state: {
        ...state,
        wars: newWars,
        countries: newCountries,
        player: newPlayer,
      },
      result: {
        warId,
        enemy: enemyId,
        progressChange,
        newProgress,
        playerLosses,
        enemyDamage,
        outcome,
      },
    };
  },
```

**Step 3: Add imports for new types**

Add to the imports at the top:

```typescript
import type {
  GameState,
  CountryId,
  War,
  WeaponId,
  Airstrike,
  StabilityLevel,
  RelationshipLevel,
  AirstrikeResult,
  WarTurnResult,
} from '../types/game';
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add src/engine/CombatEngine.ts
git commit -m "feat: add result-tracking versions of combat functions"
```

---

## Task 6: Create Arsenal Overlay Component

**Files:**
- Create: `src/components/game/ArsenalOverlay.tsx`

**Step 1: Create the ArsenalOverlay component**

```typescript
// ============================================
// Arsenal Overlay - Always-accessible force viewer
// ============================================

import { useGameStore } from '../../store/gameStore';
import { COUNTRY_NAMES } from '../../utils/countryData';
import type { CountryId, NuclearStage } from '../../types/game';

interface ArsenalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NUCLEAR_STAGE_INFO: Record<NuclearStage, { name: string; months: number }> = {
  none: { name: 'No Program', months: 0 },
  research: { name: 'Research', months: 12 },
  development: { name: 'Development', months: 18 },
  testing: { name: 'Testing', months: 6 },
  operational: { name: 'Operational', months: 0 },
};

const NEIGHBOR_BORDERS: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

export function ArsenalOverlay({ isOpen, onClose }: ArsenalOverlayProps) {
  const game = useGameStore((state) => state.game);

  if (!isOpen || !game) return null;

  const { arsenal, deployedTroops, nuclearStage, nuclearProgress, budget } = game.player;
  const nuclearInfo = NUCLEAR_STAGE_INFO[nuclearStage];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50 max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-black p-3 flex justify-between items-center">
          <h2 className="font-pixel text-lg">ARSENAL</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white font-mono font-bold hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="p-3 space-y-4">
          {/* Ground Forces */}
          <div>
            <div className="font-mono text-[10px] font-bold text-gray-500 uppercase mb-2">
              Ground Forces
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border-2 border-black p-2 bg-gray-50">
                <div className="font-mono text-lg font-bold">{arsenal.light_tank || 0}</div>
                <div className="font-mono text-[8px] text-gray-500">Light Tank</div>
              </div>
              <div className="border-2 border-black p-2 bg-gray-50">
                <div className="font-mono text-lg font-bold">{arsenal.main_battle_tank || 0}</div>
                <div className="font-mono text-[8px] text-gray-500">Main Battle Tank</div>
              </div>
              <div className="border-2 border-black p-2 bg-gray-50">
                <div className="font-mono text-lg font-bold">{arsenal.infantry_brigade || 0}</div>
                <div className="font-mono text-[8px] text-gray-500">Infantry Brigade</div>
              </div>
            </div>
          </div>

          {/* Air Forces */}
          <div>
            <div className="font-mono text-[10px] font-bold text-gray-500 uppercase mb-2">
              Air Forces
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border-2 border-black p-2 bg-gray-50">
                <div className="font-mono text-lg font-bold">{arsenal.fighter_aircraft || 0}</div>
                <div className="font-mono text-[8px] text-gray-500">Fighter Aircraft</div>
              </div>
              <div className="border-2 border-black p-2 bg-gray-50">
                <div className="font-mono text-lg font-bold">{arsenal.anti_tank_helicopter || 0}</div>
                <div className="font-mono text-[8px] text-gray-500">AT Helicopter</div>
              </div>
              <div className="border-2 border-black p-2 bg-gray-50">
                <div className="font-mono text-lg font-bold">{arsenal.anti_sam_helicopter || 0}</div>
                <div className="font-mono text-[8px] text-gray-500">SEAD Helicopter</div>
              </div>
            </div>
          </div>

          {/* Air Defense */}
          <div>
            <div className="font-mono text-[10px] font-bold text-gray-500 uppercase mb-2">
              Air Defense
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border-2 border-black p-2 bg-gray-50">
                <div className="font-mono text-lg font-bold">{arsenal.sam_battery || 0}</div>
                <div className="font-mono text-[8px] text-gray-500">SAM Battery</div>
              </div>
            </div>
          </div>

          {/* Nuclear Program */}
          <div>
            <div className="font-mono text-[10px] font-bold text-gray-500 uppercase mb-2">
              Nuclear Program
            </div>
            <div className={`border-2 p-2 ${
              nuclearStage === 'operational'
                ? 'border-yellow-500 bg-yellow-50'
                : nuclearStage !== 'none'
                ? 'border-orange-500 bg-orange-50'
                : 'border-black bg-gray-50'
            }`}>
              <div className="font-mono font-bold text-sm">{nuclearInfo.name}</div>
              {nuclearStage !== 'none' && nuclearStage !== 'operational' && (
                <div className="font-mono text-[10px] text-gray-600">
                  Progress: {nuclearProgress}/{nuclearInfo.months} months
                </div>
              )}
              {nuclearStage === 'operational' && (
                <div className="font-mono text-[10px] text-yellow-700">
                  ☢️ Nuclear Deterrent Active
                </div>
              )}
            </div>
          </div>

          {/* Deployed Troops */}
          <div>
            <div className="font-mono text-[10px] font-bold text-gray-500 uppercase mb-2">
              Deployed Troops
            </div>
            <div className="grid grid-cols-2 gap-2">
              {NEIGHBOR_BORDERS.map((country) => {
                const deployed = deployedTroops[country] || 0;
                return (
                  <div key={country} className="border-2 border-black p-2 bg-gray-50 flex justify-between items-center">
                    <span className="font-mono text-[10px]">{COUNTRY_NAMES[country]}</span>
                    <span className={`font-mono font-bold ${deployed > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      {deployed}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div className="border-t-2 border-dashed border-black pt-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">Budget</span>
              <span className="font-mono font-bold text-lg text-green-700">
                ${Math.floor(budget / 1000000)}M
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

**Step 2: Create ArsenalButton component**

Create file `src/components/game/ArsenalButton.tsx`:

```typescript
// ============================================
// Arsenal Button - Floating button to open arsenal overlay
// ============================================

interface ArsenalButtonProps {
  onClick: () => void;
}

export function ArsenalButton({ onClick }: ArsenalButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-20 right-4 w-12 h-12 bg-black text-white border-2 border-black rounded-full shadow-lg flex items-center justify-center font-mono text-xl hover:bg-gray-800 active:translate-y-0.5 z-30"
      title="View Arsenal"
    >
      🛡️
    </button>
  );
}
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/game/ArsenalOverlay.tsx src/components/game/ArsenalButton.tsx
git commit -m "feat: add arsenal overlay and floating button components"
```

---

## Task 7: Create GameLayout Wrapper with Arsenal

**Files:**
- Create: `src/components/game/GameLayout.tsx`

**Step 1: Create GameLayout component**

```typescript
// ============================================
// GameLayout - Common layout wrapper for game screens
// ============================================

import { useState } from 'react';
import { Scanlines } from '../ui/Scanlines';
import { ArsenalOverlay } from './ArsenalOverlay';
import { ArsenalButton } from './ArsenalButton';
import { useGameStore } from '../../store/gameStore';

interface GameLayoutProps {
  children: React.ReactNode;
  /** Hide the arsenal button (e.g., on resolution screens) */
  hideArsenal?: boolean;
}

export function GameLayout({ children, hideArsenal = false }: GameLayoutProps) {
  const [arsenalOpen, setArsenalOpen] = useState(false);
  const game = useGameStore((state) => state.game);

  // Don't show arsenal button if no game
  const showArsenalButton = !hideArsenal && game !== null;

  return (
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />
      {children}

      {showArsenalButton && (
        <>
          <ArsenalButton onClick={() => setArsenalOpen(true)} />
          <ArsenalOverlay isOpen={arsenalOpen} onClose={() => setArsenalOpen(false)} />
        </>
      )}
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/game/GameLayout.tsx
git commit -m "feat: add GameLayout wrapper with arsenal button integration"
```

---

## Task 8: Update NewsScreen with Continue Button

**Files:**
- Modify: `src/screens/NewsScreen.tsx`

**Step 1: Update NewsScreen to use GameLayout and add Continue button**

Replace the imports and the main return structure. Key changes:
- Import GameLayout
- Replace Scanlines with GameLayout wrapper
- Change "PROCEED TO COMMAND CENTER" button to call `advancePhase()` instead of navigating to hub

Find and replace the button onClick handler:

```typescript
// Old:
const handleProceed = () => {
  navigate('/game/hub');
};

// New:
const handleProceed = () => {
  advancePhase();
};
```

Add advancePhase to the useGameStore hook:

```typescript
const advancePhase = useGameStore((state) => state.advancePhase);
```

Update imports:

```typescript
import { GameLayout } from '../components/game/GameLayout';
```

Replace the outer div and Scanlines:

```typescript
// Old:
return (
  <div className="min-h-screen flex flex-col bg-retro-bg">
    <Scanlines />
    ...
  </div>
);

// New:
return (
  <GameLayout>
    ...rest of content without the outer div and Scanlines...
  </GameLayout>
);
```

Remove the navigate import if no longer needed.

**Step 2: Update the button text**

Change the button text from "PROCEED TO COMMAND CENTER" to "CONTINUE →"

**Step 3: Verify app compiles and runs**

Run: `npm run dev`
Expected: App starts, NewsScreen shows with Continue button

**Step 4: Commit**

```bash
git add src/screens/NewsScreen.tsx
git commit -m "feat: update NewsScreen with Continue button and GameLayout"
```

---

## Task 9: Update DiplomaticScreen with Continue Button

**Files:**
- Modify: `src/screens/DiplomaticScreen.tsx`

**Step 1: Add Continue button and GameLayout**

Update imports:

```typescript
import { GameLayout } from '../components/game/GameLayout';
```

Add advancePhase:

```typescript
const { game, setDiplomaticAction, advancePhase } = useGameStore();
```

Replace the back button with a Continue button at the bottom. Remove the handleBack function.

Add footer before the closing GameLayout:

```typescript
{/* Footer with Continue */}
<div className="shrink-0 p-3 bg-white border-t-2 border-black">
  <button
    type="button"
    onClick={() => advancePhase()}
    className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
  >
    CONTINUE → INTELLIGENCE
  </button>
</div>
```

Remove the back button from the header.

Wrap content in GameLayout instead of plain div.

**Step 2: Verify app compiles**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/screens/DiplomaticScreen.tsx
git commit -m "feat: update DiplomaticScreen with Continue button"
```

---

## Task 10: Update IntelligenceScreen with Continue Button

**Files:**
- Modify: `src/screens/IntelligenceScreen.tsx`

**Step 1: Same pattern as DiplomaticScreen**

- Import GameLayout
- Add advancePhase to store hook
- Remove back button
- Add Continue footer: "CONTINUE → MILITARY"
- Wrap in GameLayout

**Step 2: Commit**

```bash
git add src/screens/IntelligenceScreen.tsx
git commit -m "feat: update IntelligenceScreen with Continue button"
```

---

## Task 11: Update MilitaryScreen with End Turn and Declare War

**Files:**
- Modify: `src/screens/MilitaryScreen.tsx`

**Step 1: Add End Turn button**

Import GameLayout and add to store hook:

```typescript
const { game, deployTroops, orderAirstrike, cancelAirstrike, declareWar, endTurn } = useGameStore();
```

**Step 2: Add Declare War button to border deployment section**

In the border deployment map, after the brigade controls, add:

```typescript
{/* Declare War Button */}
{countryState.relationship === 'hostile' && deployed > 0 && (
  <button
    type="button"
    onClick={() => handleDeclareWar(country)}
    className="mt-2 w-full py-2 bg-red-600 text-white font-mono font-bold text-[10px] uppercase border-2 border-black retro-shadow-sm hover:bg-red-700"
  >
    ⚔️ DECLARE WAR
  </button>
)}
```

Add the handler:

```typescript
const [showWarConfirm, setShowWarConfirm] = useState<CountryId | null>(null);

const handleDeclareWar = (country: CountryId) => {
  setShowWarConfirm(country);
};

const confirmDeclareWar = () => {
  if (showWarConfirm) {
    declareWar(showWarConfirm);
    setShowWarConfirm(null);
  }
};
```

**Step 3: Add confirmation dialog**

```typescript
{/* War Confirmation Dialog */}
{showWarConfirm && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white border-4 border-red-600 p-4 max-w-sm w-full">
      <h3 className="font-pixel text-lg text-red-700 mb-3">DECLARE WAR?</h3>
      <p className="font-mono text-[11px] mb-4">
        This will begin military operations against {COUNTRY_NAMES[showWarConfirm]}.
        This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowWarConfirm(null)}
          className="flex-1 py-2 border-2 border-black bg-white font-mono font-bold text-xs"
        >
          CANCEL
        </button>
        <button
          type="button"
          onClick={confirmDeclareWar}
          className="flex-1 py-2 border-2 border-red-600 bg-red-600 text-white font-mono font-bold text-xs"
        >
          DECLARE WAR
        </button>
      </div>
    </div>
  </div>
)}
```

**Step 4: Replace footer with End Turn button**

```typescript
{/* Footer */}
<div className="shrink-0 p-3 bg-white border-t-2 border-black">
  <button
    type="button"
    onClick={() => endTurn()}
    className="w-full py-3 bg-red-700 text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-red-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
  >
    ⚠️ END TURN — RESOLVE ACTIONS
  </button>
  <p className="font-mono text-[8px] text-center text-red-600 mt-2 uppercase">
    Point of no return — All actions will be executed
  </p>
</div>
```

**Step 5: Fix the Force Overview unit types**

Replace the UNIT_TYPES array with correct weapon IDs:

```typescript
const UNIT_TYPES: { id: string; name: string; icon: string }[] = [
  { id: 'infantry_brigade', name: 'Infantry', icon: '🚶' },
  { id: 'light_tank', name: 'Lt Tank', icon: '🛡️' },
  { id: 'main_battle_tank', name: 'MBT', icon: '🛡️' },
  { id: 'fighter_aircraft', name: 'Fighters', icon: '✈️' },
  { id: 'anti_tank_helicopter', name: 'AT Helo', icon: '🚁' },
  { id: 'anti_sam_helicopter', name: 'SEAD', icon: '🚁' },
  { id: 'sam_battery', name: 'SAM', icon: '🚀' },
];
```

**Step 6: Commit**

```bash
git add src/screens/MilitaryScreen.tsx
git commit -m "feat: add Declare War button and End Turn to MilitaryScreen"
```

---

## Task 12: Update gameStore with advancePhase and endTurn

**Files:**
- Modify: `src/store/gameStore.ts`

**Step 1: Update advancePhase action**

```typescript
advancePhase: () => {
  const { game } = get();
  if (!game) return;

  const newState = GameEngine.advancePhase(game);
  set({ game: newState });
},
```

**Step 2: Update endTurn to use resolution flow**

```typescript
endTurn: async () => {
  const { game } = get();
  if (!game) return;

  set({ isLoading: true });

  try {
    // Resolve the turn using GameEngine
    const newState = GameEngine.resolveTurn(game);
    set({ game: newState, isLoading: false });
  } catch (e) {
    set({ error: (e as Error).message, isLoading: false });
  }
},
```

**Step 3: Commit**

```bash
git add src/store/gameStore.ts
git commit -m "feat: update gameStore advancePhase and endTurn actions"
```

---

## Task 13: Create Airstrike Report Screen

**Files:**
- Create: `src/screens/AirstrikeReportScreen.tsx`

**Step 1: Create the screen**

```typescript
// ============================================
// Airstrike Report Screen - Show airstrike results
// ============================================

import { GameLayout } from '../components/game/GameLayout';
import { useGameStore } from '../store/gameStore';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../utils/countryData';

export function AirstrikeReportScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);

  if (!game || !game.lastTurnResults) {
    return (
      <GameLayout hideArsenal>
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-gray-500">No results to display</p>
        </div>
      </GameLayout>
    );
  }

  const { airstrikes } = game.lastTurnResults;

  return (
    <GameLayout hideArsenal>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-xl">AIRSTRIKE REPORT</h1>
        <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">
          Operation Results
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {airstrikes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✈️</div>
            <p className="font-mono text-gray-500">No airstrikes conducted this turn</p>
          </div>
        ) : (
          airstrikes.map((strike, index) => (
            <div
              key={index}
              className={`border-2 p-3 ${
                strike.success
                  ? 'border-green-600 bg-green-50'
                  : 'border-red-600 bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{COUNTRY_FLAGS[strike.target]}</span>
                <div>
                  <div className="font-mono font-bold text-xs">
                    TARGET: {COUNTRY_NAMES[strike.target].toUpperCase()}
                  </div>
                  <div className="font-mono text-[10px] text-gray-600 uppercase">
                    {strike.type} Installation
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-400 pt-2 mt-2">
                <div className={`font-mono font-bold text-sm ${
                  strike.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {strike.success ? '✓ SUCCESS' : '✗ FAILED'}
                </div>
                <p className="font-mono text-[10px] text-gray-700 mt-1">
                  {strike.damage}
                </p>
                {strike.fightersLost > 0 && (
                  <p className="font-mono text-[10px] text-red-600 mt-1">
                    Aircraft Lost: {strike.fightersLost} of {strike.fightersUsed} fighters
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={() => advancePhase()}
          className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          CONTINUE
        </button>
      </div>
    </GameLayout>
  );
}
```

**Step 2: Add to App.tsx routes**

Uncomment the import and route for AirstrikeReportScreen.

**Step 3: Commit**

```bash
git add src/screens/AirstrikeReportScreen.tsx src/App.tsx
git commit -m "feat: add AirstrikeReportScreen for airstrike results"
```

---

## Task 14: Create War Report Screen

**Files:**
- Create: `src/screens/WarReportScreen.tsx`

**Step 1: Create the screen**

```typescript
// ============================================
// War Report Screen - Show war combat results
// ============================================

import { GameLayout } from '../components/game/GameLayout';
import { useGameStore } from '../store/gameStore';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../utils/countryData';

export function WarReportScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);

  if (!game || !game.lastTurnResults) {
    return (
      <GameLayout hideArsenal>
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-gray-500">No results to display</p>
        </div>
      </GameLayout>
    );
  }

  const { wars } = game.lastTurnResults;

  return (
    <GameLayout hideArsenal>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-xl text-red-700">WAR REPORT</h1>
        <div className="font-mono text-[8px] text-red-500 uppercase tracking-wider">
          Combat Results
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {wars.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">☮️</div>
            <p className="font-mono text-gray-500">No active military operations</p>
          </div>
        ) : (
          wars.map((war) => (
            <div
              key={war.warId}
              className="border-2 border-red-600 bg-white p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{COUNTRY_FLAGS[war.enemy]}</span>
                  <div className="font-mono font-bold text-xs">
                    {COUNTRY_NAMES[war.enemy].toUpperCase()} FRONT
                  </div>
                </div>
                <span className={`px-2 py-1 font-mono text-[10px] font-bold border-2 ${
                  war.outcome === 'victory'
                    ? 'border-green-600 bg-green-100 text-green-700'
                    : war.outcome === 'defeat'
                    ? 'border-red-600 bg-red-100 text-red-700'
                    : war.progressChange > 0
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : war.progressChange < 0
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-yellow-600 bg-yellow-50 text-yellow-700'
                }`}>
                  {war.outcome === 'victory' ? 'VICTORY!' :
                   war.outcome === 'defeat' ? 'DEFEAT' :
                   war.progressChange > 0 ? 'ADVANCING' :
                   war.progressChange < 0 ? 'RETREATING' : 'STALEMATE'}
                </span>
              </div>

              {/* Progress Bar */}
              {war.outcome === 'ongoing' && (
                <div className="mb-3">
                  <div className="font-mono text-[8px] text-gray-500 mb-1">FRONT LINE</div>
                  <div className="relative h-4 border-2 border-black bg-gray-100">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-10" />
                    <div
                      className="absolute top-0 bottom-0 transition-all"
                      style={{
                        left: ((war.newProgress + 10) / 20) * 100 < 50
                          ? `${((war.newProgress + 10) / 20) * 100}%`
                          : '50%',
                        width: `${Math.abs(((war.newProgress + 10) / 20) * 100 - 50)}%`,
                        backgroundColor: war.newProgress > 0 ? '#22c55e' : '#ef4444',
                      }}
                    />
                  </div>
                  <div className="font-mono text-[10px] text-center mt-1">
                    {war.progressChange > 0 ? '+' : ''}{war.progressChange} this turn
                  </div>
                </div>
              )}

              {/* Losses */}
              <div className="grid grid-cols-2 gap-2 border-t border-dashed border-gray-400 pt-2">
                <div>
                  <div className="font-mono text-[8px] text-green-700 font-bold mb-1">YOUR LOSSES</div>
                  {Object.entries(war.playerLosses).length > 0 ? (
                    Object.entries(war.playerLosses).map(([weapon, count]) => (
                      <div key={weapon} className="font-mono text-[9px] text-gray-600">
                        {count}x {weapon.replace(/_/g, ' ')}
                      </div>
                    ))
                  ) : (
                    <div className="font-mono text-[9px] text-gray-400">None</div>
                  )}
                </div>
                <div>
                  <div className="font-mono text-[8px] text-red-700 font-bold mb-1">ENEMY DAMAGE</div>
                  <div className="font-mono text-[9px] text-gray-600">
                    ~{Math.round(war.enemyDamage)} strength destroyed
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={() => advancePhase()}
          className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          CONTINUE
        </button>
      </div>
    </GameLayout>
  );
}
```

**Step 2: Add to App.tsx routes**

**Step 3: Commit**

```bash
git add src/screens/WarReportScreen.tsx src/App.tsx
git commit -m "feat: add WarReportScreen for combat results"
```

---

## Task 15: Create Monthly Summary Screen

**Files:**
- Create: `src/screens/MonthlySummaryScreen.tsx`

**Step 1: Create the screen**

```typescript
// ============================================
// Monthly Summary Screen - Turn resolution summary
// ============================================

import { GameLayout } from '../components/game/GameLayout';
import { useGameStore } from '../store/gameStore';
import { COUNTRY_NAMES } from '../utils/countryData';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function MonthlySummaryScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);

  if (!game) {
    return (
      <GameLayout hideArsenal>
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-gray-500">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const results = game.lastTurnResults;
  const monthName = MONTH_NAMES[game.month - 1];

  return (
    <GameLayout hideArsenal>
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <h1 className="font-pixel text-xl">MONTHLY SUMMARY</h1>
        <div className="font-mono text-[10px] text-gray-500">
          {monthName} {game.year}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Treasury */}
        {results?.economy && (
          <div className="border-2 border-black bg-white p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Treasury
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Starting:</span>
                <span>${Math.floor(results.economy.startingBudget / 1000000)}M</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Income:</span>
                <span>+${Math.floor(results.economy.income / 1000000)}M</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Expenses:</span>
                <span>-${Math.floor(results.economy.expenses / 1000000)}M</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                <span>Ending:</span>
                <span className="text-green-700">${Math.floor(results.economy.endingBudget / 1000000)}M</span>
              </div>
            </div>
          </div>
        )}

        {/* Diplomatic Shifts */}
        {results?.diplomaticShifts && results.diplomaticShifts.length > 0 && (
          <div className="border-2 border-black bg-white p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Diplomatic Shifts
            </div>
            <div className="space-y-1">
              {results.diplomaticShifts.map((shift) => (
                <div key={shift.country} className="font-mono text-[11px] flex justify-between">
                  <span>{COUNTRY_NAMES[shift.country]}:</span>
                  <span>
                    <span className="text-gray-500">{shift.from}</span>
                    {' → '}
                    <span className={shift.to === 'war' ? 'text-red-600 font-bold' : ''}>
                      {shift.to}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Overview */}
        <div className="border-2 border-black bg-white p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Status Overview
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">US ATTITUDE</div>
              <div className={`font-mono font-bold ${
                game.player.usAttitude >= 0 ? 'text-green-700' : 'text-red-600'
              }`}>
                {game.player.usAttitude > 0 ? '+' : ''}{game.player.usAttitude}
              </div>
            </div>
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">PRESTIGE</div>
              <div className="font-mono font-bold">{game.player.prestige}</div>
            </div>
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">KNESSET</div>
              <div className={`font-mono font-bold ${
                game.player.knessetDisapproval >= 7 ? 'text-red-600' : ''
              }`}>
                {game.player.knessetDisapproval}/10 disapproval
              </div>
            </div>
            <div className="border border-gray-300 p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500">PALESTINIAN</div>
              <div className="font-mono font-bold capitalize">{game.player.palestinianLevel}</div>
            </div>
          </div>
        </div>

        {/* Active Wars */}
        {game.wars.length > 0 && (
          <div className="border-2 border-red-600 bg-red-50 p-3">
            <div className="font-mono font-bold text-xs uppercase text-red-700 mb-2">
              ⚔️ Active Wars: {game.wars.length}
            </div>
            {game.wars.map((war) => {
              const enemy = war.attacker === 'israel' ? war.defender : war.attacker;
              return (
                <div key={war.id} className="font-mono text-[11px]">
                  {COUNTRY_NAMES[enemy]} — Progress: {war.progress}/10
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={() => advancePhase()}
          className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          {game.month === 12 ? 'CONTINUE → UN SUMMIT' : 'CONTINUE → NEXT MONTH'}
        </button>
      </div>
    </GameLayout>
  );
}
```

**Step 2: Add to App.tsx routes**

**Step 3: Commit**

```bash
git add src/screens/MonthlySummaryScreen.tsx src/App.tsx
git commit -m "feat: add MonthlySummaryScreen for turn resolution"
```

---

## Task 16: Create Force Comparison Component

**Files:**
- Create: `src/components/game/ForceComparison.tsx`

**Step 1: Create the component**

```typescript
// ============================================
// Force Comparison - Shows forces with counter relationships
// ============================================

import { useGameStore } from '../../store/gameStore';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../../utils/countryData';
import type { CountryId } from '../../types/game';

interface ForceComparisonProps {
  enemyId: CountryId;
  isOpen: boolean;
  onClose: () => void;
}

const COMBAT_PHASES = [
  {
    name: 'Air Superiority',
    playerUnits: ['fighter_aircraft', 'sam_battery'],
    counters: ['SAM counters Fighters & Helicopters', 'Fighters counter Helicopters'],
  },
  {
    name: 'Air Defense Suppression',
    playerUnits: ['anti_sam_helicopter'],
    counters: ['SEAD Helicopter counters SAM'],
  },
  {
    name: 'Close Air Support',
    playerUnits: ['anti_tank_helicopter', 'fighter_aircraft'],
    counters: ['AT Helicopter counters Tanks', 'Fighters provide support'],
  },
  {
    name: 'Ground Battle',
    playerUnits: ['main_battle_tank', 'light_tank', 'infantry_brigade'],
    counters: ['MBT counters Light Tank', 'Infantry holds ground'],
  },
];

const UNIT_NAMES: Record<string, string> = {
  fighter_aircraft: 'Fighters',
  sam_battery: 'SAM',
  anti_sam_helicopter: 'SEAD Helo',
  anti_tank_helicopter: 'AT Helo',
  main_battle_tank: 'MBT',
  light_tank: 'Light Tank',
  infantry_brigade: 'Infantry',
};

export function ForceComparison({ enemyId, isOpen, onClose }: ForceComparisonProps) {
  const game = useGameStore((state) => state.game);

  if (!isOpen || !game) return null;

  const enemy = game.countries[enemyId];
  const { arsenal } = game.player;

  // Calculate total player strength
  const playerStrength = Object.entries(arsenal).reduce((sum, [_, count]) => sum + (count || 0) * 2, 0);
  const enemyStrength = enemy.militaryStrength;
  const ratio = playerStrength / Math.max(1, enemyStrength);

  let assessment = '';
  let assessmentColor = '';
  if (ratio > 1.5) {
    assessment = 'FAVORABLE';
    assessmentColor = 'text-green-700';
  } else if (ratio > 0.8) {
    assessment = 'EVEN';
    assessmentColor = 'text-yellow-700';
  } else {
    assessment = 'UNFAVORABLE';
    assessmentColor = 'text-red-700';
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-4 bg-white border-4 border-black z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-black p-3 flex justify-between items-center">
          <div>
            <h2 className="font-pixel text-lg">FORCE COMPARISON</h2>
            <div className="font-mono text-[10px] text-gray-500">
              Israel vs {COUNTRY_NAMES[enemyId]}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white font-mono font-bold hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Combat Phases */}
          {COMBAT_PHASES.map((phase) => (
            <div key={phase.name} className="border-2 border-black p-3">
              <div className="font-mono font-bold text-[10px] uppercase mb-2 pb-1 border-b border-gray-300">
                {phase.name}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="font-mono text-[8px] text-green-700 font-bold mb-1">
                    {COUNTRY_FLAGS.israel} ISRAEL
                  </div>
                  {phase.playerUnits.map((unit) => (
                    <div key={unit} className="font-mono text-[10px]">
                      {UNIT_NAMES[unit]}: {arsenal[unit as keyof typeof arsenal] || 0}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-mono text-[8px] text-red-700 font-bold mb-1">
                    {COUNTRY_FLAGS[enemyId]} {COUNTRY_NAMES[enemyId].toUpperCase()}
                  </div>
                  <div className="font-mono text-[10px] text-gray-600">
                    Est. Strength: ~{Math.round(enemyStrength * 0.25)}
                  </div>
                </div>
              </div>

              <div className="text-[9px] font-mono text-gray-500 border-t border-dashed border-gray-300 pt-1">
                {phase.counters.map((counter, i) => (
                  <div key={i}>• {counter}</div>
                ))}
              </div>
            </div>
          ))}

          {/* Overall Assessment */}
          <div className="border-2 border-black p-3 bg-gray-50">
            <div className="font-mono font-bold text-[10px] uppercase mb-2">
              Combat Assessment
            </div>
            <div className={`font-mono font-bold text-lg ${assessmentColor}`}>
              {assessment}
            </div>
            <div className="h-3 bg-gray-200 border border-black mt-2">
              <div
                className={`h-full ${ratio > 1 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, ratio * 50)}%` }}
              />
            </div>
            <div className="font-mono text-[9px] text-gray-600 mt-2">
              {ratio > 1.5
                ? 'You have a significant advantage. Victory likely with minimal losses.'
                : ratio > 0.8
                ? 'Forces are evenly matched. Expect a prolonged conflict with heavy casualties.'
                : 'Enemy has superior forces. Consider building up before engaging.'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

**Step 2: Add to WarScreen and MilitaryScreen**

Add "View Forces" button to WarScreen and "Compare Forces" button to MilitaryScreen for hostile countries.

**Step 3: Commit**

```bash
git add src/components/game/ForceComparison.tsx
git commit -m "feat: add ForceComparison component for combat analysis"
```

---

## Task 17: Delete HubScreen

**Files:**
- Delete: `src/screens/HubScreen.tsx`
- Modify: `src/App.tsx` (remove import and route)

**Step 1: Remove HubScreen import and route from App.tsx**

**Step 2: Delete the file**

```bash
rm src/screens/HubScreen.tsx
```

**Step 3: Verify app still compiles**

Run: `npx tsc --noEmit`

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove HubScreen (replaced by linear phase flow)"
```

---

## Task 18: Final Integration Test

**Step 1: Run the app**

```bash
npm run dev
```

**Step 2: Manual testing checklist**

- [ ] Start new game from TitleScreen
- [ ] NewsScreen shows with Continue button
- [ ] Arsenal button visible, opens overlay
- [ ] Continue advances to DiplomaticScreen
- [ ] DiplomaticScreen has Continue button
- [ ] Continue advances to IntelligenceScreen
- [ ] IntelligenceScreen has Continue button
- [ ] Continue advances to MilitaryScreen
- [ ] MilitaryScreen shows correct unit counts
- [ ] Can deploy troops to borders
- [ ] Declare War button appears for hostile countries with troops
- [ ] End Turn button works
- [ ] Resolution screens appear in sequence
- [ ] Monthly Summary shows, advances to next month's News

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete game flow and combat system overhaul"
```

---

## Summary

This plan implements:

1. **Strict linear phase flow** - News → Diplomatic → Intelligence → Military → Resolution
2. **Arsenal overlay** - Always accessible via floating button
3. **Combat fixes** - Declare War button, result tracking, fixed loss calculations
4. **Turn resolution feedback** - Airstrike Report, War Report, Monthly Summary screens
5. **Force Comparison** - Shows units with counter relationships
6. **Removed HubScreen** - Replaced by linear flow

Total: 18 tasks, ~17 new/modified files
