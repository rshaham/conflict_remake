---
description: Add a new function to a game engine with proper patterns
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Add Engine Function: $ARGUMENTS

Add a new function to one of the game engines. Argument should be like "DiplomacyEngine.calculateTradeBonus" or "CombatEngine.resolveNavalBattle".

## Engine Architecture

All engines in `src/engine/` must be:
- **Pure functions** - No side effects
- **Deterministic** - Same input = same output (except where variance specified)
- **React-free** - No React imports whatsoever
- **Type-safe** - Full TypeScript with explicit types

## Available Engines

| Engine | Purpose | Key Functions |
|--------|---------|---------------|
| `GameEngine` | Turn flow orchestration | `resolveTurn`, `checkWinLose` |
| `DiplomacyEngine` | Relationship management | `shiftRelationship`, `evaluateTreaty` |
| `CombatEngine` | War resolution | `resolveAirSuperiority`, `resolveGroundBattle` |
| `IntelligenceEngine` | Espionage & info | `gatherIntel`, `runCovertOp` |
| `EconomyEngine` | Budget & trade | `calculateIncome`, `processPurchase` |
| `AIOpponent` | AI country decisions | `decideAction`, `evaluateThreats` |
| `EventEngine` | Event triggers | `evaluateTriggers`, `applyEventEffects` |
| `ScoringEngine` | End-game scoring | `calculateScore`, `determineLeadershipStyle` |

## Steps

### 1. Identify Engine and Function

Parse the argument to determine:
- Which engine file: `src/engine/{EngineName}.ts`
- Function name: `{functionName}`
- Purpose and inputs/outputs

### 2. Define Types

First, ensure all needed types exist in `src/types/`:

```typescript
// Input type
interface {FunctionName}Input {
  // All parameters needed
}

// Output type
interface {FunctionName}Result {
  // All values returned
}
```

### 3. Write Function Signature

```typescript
/**
 * {Brief description of what this function does}
 * 
 * @param {input} - {Description of input}
 * @returns {Description of output}
 * 
 * @example
 * const result = {functionName}({exampleInput});
 * // result: {exampleOutput}
 */
export function {functionName}(
  input: {FunctionName}Input
): {FunctionName}Result {
  // Implementation
}
```

### 4. Implement Logic

Follow these patterns:

```typescript
// ✅ GOOD - Pure function
export function calculateDamage(
  attacker: WeaponStats,
  defender: WeaponStats,
  terrain: TerrainType
): DamageResult {
  const baseDamage = attacker.firepower - defender.armor;
  const terrainModifier = TERRAIN_MODIFIERS[terrain];
  
  return {
    damage: Math.max(0, baseDamage * terrainModifier),
    penetrated: baseDamage > defender.armor,
  };
}

// ❌ BAD - Side effects
export function calculateDamage(...) {
  console.log('Calculating damage');  // Side effect!
  gameState.lastDamage = result;      // Mutation!
  return result;
}
```

### 5. Handle Variance (If Needed)

For functions that need randomness:

```typescript
// Accept a random seed or value
export function resolveCombat(
  state: CombatState,
  varianceRoll: number  // 0-1, provided by caller
): CombatResult {
  // Use varianceRoll instead of Math.random()
  const variance = (varianceRoll - 0.5) * 0.2;  // ±10%
  // ...
}
```

### 6. Use YAML Data

Reference game data, don't hardcode:

```typescript
import { loadWeapons } from '../data/loaders';

export function getWeaponStats(weaponId: string): WeaponStats {
  const weapons = loadWeapons();
  const weapon = weapons[weaponId];
  if (!weapon) {
    throw new Error(`Unknown weapon: ${weaponId}`);
  }
  return weapon.stats;
}
```

### 7. Write Unit Tests

Create `src/engine/{EngineName}.test.ts`:

```typescript
import { {functionName} } from './{EngineName}';

describe('{functionName}', () => {
  it('should {expected behavior}', () => {
    const input: {FunctionName}Input = {
      // Test data
    };
    
    const result = {functionName}(input);
    
    expect(result).toEqual({
      // Expected output
    });
  });
  
  it('should handle edge case: {edge case}', () => {
    // Edge case test
  });
  
  it('should be deterministic', () => {
    const input = { /* same input */ };
    const result1 = {functionName}(input);
    const result2 = {functionName}(input);
    expect(result1).toEqual(result2);
  });
});
```

### 8. Export from Engine

Ensure function is exported:

```typescript
// At bottom of engine file
export {
  // ... existing exports
  {functionName},
};
```

### 9. Verify No React Dependencies

```bash
# Should return nothing
grep -r "from 'react'" src/engine/
grep -r "from \"react\"" src/engine/
grep -r "useGameStore" src/engine/
```

### 10. Summary

Output:
- Engine and function name
- Input/output types
- Test file location
- Any YAML data dependencies
