# Game Flow & Combat System Fix — Design Document

**Date:** 2026-01-21
**Status:** Pending Approval
**Scope:** Fix broken game flow, combat system, and add missing UI elements

---

## Problem Summary

The game flow is currently broken with multiple issues:

1. **No phase enforcement** — HubScreen allows free navigation, `game.phase` is ignored
2. **Combat system broken** — No way to declare war, airstrike results silent, loss tracking bugs
3. **No arsenal view** — Can't see your forces at a glance
4. **No turn resolution feedback** — Player doesn't see what happened

---

## Solution Overview

| Area | Fix |
|------|-----|
| Game Flow | Strict linear phases: News → Diplomatic → Intelligence → Military → End Turn |
| Arsenal View | Floating button opens slide-up overlay (accessible any phase) |
| Declare War | Button in MilitaryScreen when conditions met |
| Combat Feedback | Airstrike Report, War Report, Monthly Summary interstitials |
| Force Comparison | New screen showing units + counter relationships |

---

## 1. Strict Linear Phase Flow

### Turn Structure

```
NEWS → DIPLOMATIC → INTELLIGENCE → MILITARY → END TURN
  ↑                                              │
  └──────────── (resolution, next month) ←───────┘

Special phases injected when triggered:
- EVENTS: After News, if pendingEvents exist
- WAR: After Military, if active wars (manage ongoing wars)
- UN_SUMMIT: December, before resolution
```

### Phase Screen Mapping

| Phase | Screen | Notes |
|-------|--------|-------|
| `news` | NewsScreen | Start of turn, shows headlines |
| `events` | EventsScreen (new) | Only if pendingEvents exist |
| `diplomatic` | DiplomaticScreen | Set relations per country |
| `intelligence` | IntelligenceScreen | Covert operations |
| `military` | MilitaryScreen | Arms, deployment, airstrikes, declare war |
| `war` | WarScreen | Only if active wars exist |
| `un_summit` | UNSummitScreen | December only |
| `resolution` | Resolution interstitials | Shows results before next turn |
| `game_over` | GameOverScreen | Win/lose conditions met |

### Navigation Rules

- Each screen has "Continue →" button to advance to next phase
- No "Back" button — phases are one-way
- Arsenal overlay accessible via floating button (doesn't change phase)
- Routing enforces phase — navigating to wrong URL redirects to current phase

### Implementation Changes

**Remove:**
- HubScreen (no longer central navigation)
- Free navigation between game screens

**Modify:**
- App.tsx routing — add phase guard component
- Each screen — add "Continue" button that calls `advancePhase()`
- GameEngine.advancePhase() — implement proper phase transitions

**Add:**
- PhaseGuard component — redirects if URL doesn't match current phase
- EventsScreen — display and respond to pending events

---

## 2. Arsenal Overlay

### Purpose

Always-accessible panel to view current forces without leaving current phase.

### UI Placement

```
┌─────────────────────────────────────┐
│  [Header - current phase]           │
├─────────────────────────────────────┤
│                                     │
│  [Main screen content]              │
│                                     │
│                             [🛡️]   │  ← Floating button (bottom-right)
├─────────────────────────────────────┤
│  [Continue → next phase]            │
└─────────────────────────────────────┘
```

### Panel Contents (60% screen height slide-up)

```
┌─────────────────────────────────────────────────────────┐
│  ARSENAL                                          [X]   │
├─────────────────────────────────────────────────────────┤
│  GROUND FORCES                                          │
│  ├─ Light Tank ................ 10                      │
│  ├─ Main Battle Tank .......... 5                       │
│  └─ Infantry Brigade .......... 8                       │
│                                                         │
│  AIR FORCES                                             │
│  ├─ Fighter Aircraft .......... 10                      │
│  ├─ Anti-Tank Helicopter ...... 2                       │
│  └─ SEAD Helicopter ........... 1                       │
│                                                         │
│  AIR DEFENSE                                            │
│  └─ SAM Battery ............... 5                       │
│                                                         │
│  NUCLEAR PROGRAM                                        │
│  └─ Status: Research (4/12 months)                      │
│                                                         │
│  DEPLOYED TROOPS                                        │
│  ├─ Egypt border .............. 0                       │
│  ├─ Syria border .............. 2                       │
│  ├─ Jordan border ............. 0                       │
│  └─ Lebanon border ............ 1                       │
│                                                         │
│  BUDGET: $95M                                           │
└─────────────────────────────────────────────────────────┘
```

### Implementation

**Add:**
- ArsenalOverlay component
- ArsenalButton component (floating)
- Add to layout wrapper used by all game screens

---

## 3. Combat System Fixes

### 3a. Declare War Button

**Location:** MilitaryScreen, in border deployment section

**Visibility conditions:**
- Country relationship = `hostile`
- Troops deployed to that border > 0

**UI:**

```
┌─────────────────────────────────────────────────────────┐
│ 🇪🇬 EGYPT                                   [-] 2 [+]  │
│    Status: HOSTILE                                      │
│    [⚔️ DECLARE WAR]                                     │
└─────────────────────────────────────────────────────────┘
```

**Flow:**
1. Player clicks "Declare War"
2. Confirmation dialog: "Declare war on Egypt? This cannot be undone."
3. On confirm: call `declareWar(countryId)`
4. Relationship changes to `war`, War object created

### 3b. Airstrike Results Tracking

**Problem:** Airstrikes execute but player never sees results.

**Solution:** Track results during processing, display after turn resolution.

**Data structure:**

```typescript
interface AirstrikeResult {
  target: CountryId;
  type: AirstrikeTarget;
  success: boolean;
  damage: string;  // Description of effect
  fightersLost: number;
  fightersUsed: number;
}

// Add to GameState
lastTurnResults: {
  airstrikes: AirstrikeResult[];
  wars: WarTurnResult[];
  economyChanges: EconomyChanges;
}
```

**Modify:** `CombatEngine.executeAirstrike()` to return result object.

### 3c. Fix War Loss Tracking Bug

**Location:** `CombatEngine.resolveWarTurn()` lines 280-286

**Current bug:** Player losses incorrectly assigned to attacker/defender.

**Fix:** Track both sides' losses correctly based on who is player.

### 3d. War Resolution Results

**Data structure:**

```typescript
interface WarTurnResult {
  warId: string;
  enemy: CountryId;
  progressChange: number;
  newProgress: number;
  playerLosses: Partial<Record<WeaponId, number>>;
  enemyDamage: number;
  outcome: 'ongoing' | 'victory' | 'defeat' | 'ceasefire';
}
```

---

## 4. Force Comparison Screen

### Purpose

Show player's forces vs enemy with counter relationships explained.

### Access Points

- WarScreen: "View Forces" button on each war card
- MilitaryScreen: "Compare Forces" button for hostile countries with troops deployed

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  FORCE COMPARISON: ISRAEL vs SYRIA                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─ AIR SUPERIORITY PHASE ───────────────────────────┐  │
│  │                                                   │  │
│  │  🇮🇱 ISRAEL          🇸🇾 SYRIA (estimated)       │  │
│  │  Fighters: 10        Fighters: ~25               │  │
│  │  SAM: 5              SAM: ~15                    │  │
│  │                                                   │  │
│  │  COUNTERS:                                        │  │
│  │  • SAM → Fighters, Helicopters                   │  │
│  │  • Fighters → Helicopters                        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ AIR DEFENSE SUPPRESSION PHASE ───────────────────┐  │
│  │  🇮🇱 SEAD Helo: 1    🇸🇾 SAM: ~15                │  │
│  │                                                   │  │
│  │  COUNTERS:                                        │  │
│  │  • SEAD Helicopter → SAM                         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ CLOSE AIR SUPPORT PHASE ─────────────────────────┐  │
│  │  🇮🇱 AT Helo: 2      🇸🇾 Armor: ~40              │  │
│  │  🇮🇱 Fighters: 10                                 │  │
│  │                                                   │  │
│  │  COUNTERS:                                        │  │
│  │  • AT Helicopter → Tanks                         │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ GROUND BATTLE PHASE ─────────────────────────────┐  │
│  │  🇮🇱 MBT: 5          🇸🇾 Armor: ~40              │  │
│  │  🇮🇱 Light Tank: 10                               │  │
│  │  🇮🇱 Infantry: 8                                  │  │
│  │                                                   │  │
│  │  COUNTERS:                                        │  │
│  │  • MBT → Light Tank                              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ COMBAT ASSESSMENT ───────────────────────────────┐  │
│  │  Overall Outlook: UNFAVORABLE                     │  │
│  │  ████████░░░░░░░░░░░░  40%                        │  │
│  │                                                   │  │
│  │  "Enemy has superior numbers in all categories.   │  │
│  │   Consider building anti-tank helicopters and     │  │
│  │   SAM batteries before engaging."                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  [CLOSE]                                                │
└─────────────────────────────────────────────────────────┘
```

### Enemy Strength Estimation

Since player doesn't have perfect intel, enemy numbers shown as estimates:
- Base on `country.militaryStrength` value
- Display as "~X" (approximate)
- Could be modified by intelligence actions in future

---

## 5. Turn Resolution Flow

### Sequence After "End Turn"

```
MILITARY PHASE
       ↓ [End Turn clicked]
AIRSTRIKE REPORT (if any airstrikes ordered)
       ↓ [Continue]
WAR REPORT (if any active wars)
       ↓ [Continue]
MONTHLY SUMMARY (always)
       ↓ [Continue]
UN SUMMIT (December only)
       ↓ [Continue]
NEWS SCREEN (next turn)
```

### Airstrike Report Screen

```
┌─────────────────────────────────────────────────────────┐
│  AIRSTRIKE REPORT                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TARGET: Syria — Military Installations                 │
│  ─────────────────────────────────────────────────      │
│  Result: SUCCESS                                        │
│  Damage Inflicted: Enemy military strength reduced      │
│  Aircraft Lost: 1 Fighter (SAM fire)                    │
│                                                         │
│  ─────────────────────────────────────────────────      │
│                                                         │
│  TARGET: Iraq — Nuclear Facility                        │
│  ─────────────────────────────────────────────────      │
│  Result: PARTIAL SUCCESS                                │
│  Damage Inflicted: Nuclear program set back 6 months    │
│  Aircraft Lost: 2 Fighters (heavy SAM presence)         │
│                                                         │
│                                        [CONTINUE]       │
└─────────────────────────────────────────────────────────┘
```

### War Report Screen

```
┌─────────────────────────────────────────────────────────┐
│  WAR REPORT                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  SYRIAN FRONT                                           │
│  ─────────────────────────────────────────────────      │
│  Status: ADVANCING                                      │
│  Progress: ████████████░░░░░░░░ +2 this turn            │
│                                                         │
│  YOUR LOSSES          ENEMY LOSSES                      │
│  2x Light Tank        ~15 military strength             │
│  1x Fighter Aircraft  destroyed                         │
│                                                         │
│  Assessment: Steady progress. Victory in 4-5 turns      │
│  at current rate.                                       │
│                                                         │
│                                        [CONTINUE]       │
└─────────────────────────────────────────────────────────┘
```

### Monthly Summary Screen

```
┌─────────────────────────────────────────────────────────┐
│  MONTHLY SUMMARY — February 1997                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TREASURY                                               │
│  ├─ Starting: $95,000,000                               │
│  ├─ Income:   +$8,000,000 (aid + revenue)               │
│  ├─ Expenses: -$5,000,000 (intel ops, nuclear)          │
│  └─ Ending:   $98,000,000                               │
│                                                         │
│  DIPLOMATIC SHIFTS                                      │
│  ├─ Egypt: Cool → Lamentable (worsening)                │
│  └─ Jordan: Satisfactory (stable)                       │
│                                                         │
│  INTELLIGENCE                                           │
│  └─ Syria: Insurgency growing (Scattered → Organized)   │
│                                                         │
│  NUCLEAR PROGRAM                                        │
│  └─ Research: 5/12 months complete                      │
│                                                         │
│  PALESTINIAN TERRITORIES                                │
│  └─ Status: Unrest (unchanged)                          │
│                                                         │
│                                        [CONTINUE]       │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `src/components/game/ArsenalOverlay.tsx` | Slide-up arsenal panel |
| `src/components/game/ArsenalButton.tsx` | Floating button to open arsenal |
| `src/components/game/ForceComparison.tsx` | Force comparison modal |
| `src/components/game/PhaseGuard.tsx` | Route guard enforcing current phase |
| `src/screens/EventsScreen.tsx` | Display and respond to events |
| `src/screens/AirstrikeReportScreen.tsx` | Show airstrike results |
| `src/screens/WarReportScreen.tsx` | Show war combat results |
| `src/screens/MonthlySummaryScreen.tsx` | Show turn resolution summary |

### Modified Files

| File | Changes |
|------|---------|
| `src/App.tsx` | Add PhaseGuard, update routing |
| `src/engine/GameEngine.ts` | Proper phase transitions, store results |
| `src/engine/CombatEngine.ts` | Fix loss tracking, return results |
| `src/store/gameStore.ts` | Add `lastTurnResults` to state |
| `src/types/game.ts` | Add result types |
| `src/screens/NewsScreen.tsx` | Remove hub navigation, add Continue |
| `src/screens/DiplomaticScreen.tsx` | Add Continue button |
| `src/screens/IntelligenceScreen.tsx` | Add Continue button |
| `src/screens/MilitaryScreen.tsx` | Add Declare War, fix unit types, add Continue |
| `src/screens/WarScreen.tsx` | Add Force Comparison button |

### Removed Files

| File | Reason |
|------|--------|
| `src/screens/HubScreen.tsx` | Replaced by linear phase flow |

---

## 7. Future Work (Not In Scope)

Noted for future design sessions:

- **Intelligence system review** — May have similar issues
- **Arms purchasing** — Potential bugs to investigate
- **Events system** — AI-generated events integration
- **Save/Load** — Proper serialization of new state fields

---

## 8. Implementation Order

Suggested sequence:

1. **Types & State** — Add new types to `game.ts`, update `GameState`
2. **Phase Guard** — Create PhaseGuard, update App.tsx routing
3. **GameEngine** — Fix `advancePhase()` for proper transitions
4. **CombatEngine** — Fix bugs, add result tracking
5. **Arsenal Overlay** — Create components, add to screens
6. **Screen Updates** — Add Continue buttons, remove hub navigation
7. **Declare War** — Add to MilitaryScreen
8. **Resolution Screens** — Create interstitial screens
9. **Force Comparison** — Create comparison modal
10. **Delete HubScreen** — Remove after all else works

---

*End of Design Document*
