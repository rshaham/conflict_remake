---
description: Start implementation of a specific milestone task from the tech spec
allowed-tools: Read, Write, Glob, Grep, Bash, Task
---

# Start Task: $ARGUMENTS

Start implementing a task from the tech spec milestones. Argument should be the task name or milestone (e.g., "YAML loader" or "Phase 2 Core Loop").

## Milestones Overview

| Phase | Focus | Duration |
|-------|-------|----------|
| 1 | Foundation | Week 1-2 |
| 2 | Core Game Loop | Week 2-3 |
| 3 | Full Gameplay | Week 3-4 |
| 4 | AI Integration | Week 4-5 |
| 5 | Polish & Mobile | Week 5-6 |
| 6 | Testing & Launch | Week 6-7 |

## Steps

### 1. Identify Task

Parse the argument and find the matching task in `conflict-remake-tech-spec.md`.

### 2. Check Prerequisites

Verify dependencies are complete:
- Required files exist
- Required functions are implemented
- Required types are defined

### 3. Create Implementation Plan

Before coding, outline:

```markdown
## Task: {Task Name}
**Milestone:** Phase {N}
**Estimated Time:** {hours}

### Prerequisites
- [ ] {Dependency 1} ✅
- [ ] {Dependency 2} ✅
- [ ] {Dependency 3} ⏳ (needs implementation)

### Files to Create/Modify
- `{file1}` - {purpose}
- `{file2}` - {purpose}

### Implementation Steps
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Tests Needed
- [ ] {Test 1}
- [ ] {Test 2}

### Definition of Done
- [ ] Code compiles (npm run typecheck)
- [ ] Tests pass (npm run test)
- [ ] No lint errors (npm run lint)
- [ ] Follows project conventions
```

### 4. Spawn Parallel Subagents (if complex)

For large tasks, spawn subagents:

```
Task: "Implement DiplomacyEngine"

Subagent 1: Research similar implementations
Subagent 2: Write type definitions
Subagent 3: Write unit test stubs

Main thread: Implement core logic
```

### 5. Implementation

Follow these patterns:

**For Engine Functions:**
- Pure TypeScript, no React
- Accept all inputs as parameters
- Return new state, don't mutate
- Add JSDoc comments

**For Components:**
- Mobile-first layout
- Connect to Zustand store
- Handle loading/error states
- Under 150 lines

**For Data Loaders:**
- Validate YAML on load
- Type the result
- Cache if needed
- Handle missing files

### 6. Testing

Write tests alongside implementation:

```typescript
// {FeatureName}.test.ts
describe('{FeatureName}', () => {
  describe('{function}', () => {
    it('should {expected behavior}', () => {
      // Arrange
      const input = { ... };
      
      // Act
      const result = featureFunction(input);
      
      // Assert
      expect(result).toEqual({ ... });
    });
  });
});
```

### 7. Verify Completion

Run all checks:

```bash
npm run typecheck
npm run lint
npm run test
```

### 8. Update Progress

Note what was completed:

```markdown
## Completed: {Task Name}

### Files Created
- `src/engine/NewEngine.ts` - Main implementation
- `src/engine/NewEngine.test.ts` - Unit tests

### Files Modified
- `src/types/index.ts` - Added new types

### Next Steps
- {What should be done next}
- {Dependencies now unblocked}
```

## Task Reference (Phase 1-2)

### Phase 1: Foundation
- [ ] Project scaffolding (Vite + React + TS)
- [ ] Tailwind configuration
- [ ] Type definitions
- [ ] YAML loader utility
- [ ] Basic routing
- [ ] Zustand store skeleton

### Phase 2: Core Loop
- [ ] GameEngine.ts
- [ ] DiplomacyEngine.ts
- [ ] CombatEngine.ts
- [ ] Basic AI opponent
- [ ] Turn advancement
- [ ] War resolution
