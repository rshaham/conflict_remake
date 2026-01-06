---
description: Validate all YAML data files against their schemas
allowed-tools: Read, Bash, Glob
---

# Validate YAML

Validate all YAML data files in the `data/` directory for correctness and consistency.

## Validation Steps

### 1. Syntax Check
Run YAML linter on all files:

```bash
npx yaml-lint data/*.yaml
```

### 2. Schema Validation

Check each file against its expected schema:

#### countries.yaml
```yaml
# Required fields per country
- id: string (one of: israel, egypt, syria, jordan, lebanon, iraq, iran, libya)
- name: string
- capital: string
- borders: string[] (valid country IDs)
- startingStability: string (stability level)
- startingLeader: object
- nuclearCapable: boolean
- isNeighbor: boolean (true for egypt, syria, jordan, lebanon)
```

#### weapons.yaml
```yaml
# Required fields per weapon
- id: string (lowercase_snake_case)
- name: string
- vendor: string (usa, uk, france, soviet, israel)
- category: string (infantry, light_armor, main_battle_tank, attack_helicopter, sam_battery, fighter, sead)
- unlockRequirement: number (0-25)
- cost: number (positive)
- combatValue: number (1-5)
- counters: string[] (valid weapon IDs)
- counteredBy: string[] (valid weapon IDs)
- stats: object with armor, firepower, speed, range (0-100 each)
```

#### enums.yaml
```yaml
# Must contain all enum definitions
- relationshipLevels: 9 levels in order
- stabilityLevels: 6 levels in order
- weaponCategories: 7 categories
- eventCategories: 6 categories
- leaderTraits: all defined traits
```

### 3. Cross-Reference Validation

Check referential integrity:

```
□ All country IDs in borders[] exist in countries.yaml
□ All weapon IDs in counters[] exist in weapons.yaml
□ All weapon IDs in counteredBy[] exist in weapons.yaml
□ All event triggers reference valid country IDs
□ All leader traits reference valid trait definitions
□ Counter relationships are symmetric where expected
```

### 4. Balance Checks

Flag potential balance issues:

```
□ Weapons in same category have reasonable cost spread
□ No weapon has 0 for all stats
□ Counter chains don't create unbeatable units
□ Starting equipment is affordable with starting budget
□ Event trigger probabilities sum reasonably per turn
```

### 5. Completeness Checks

Ensure nothing is missing:

```
□ All 8 countries defined
□ All 26 weapons from design doc present
□ All vendors have at least one weapon per unlock tier
□ All event categories have at least one event
□ All countries have valid starting leaders
```

### 6. Output Report

Generate validation report:

```
YAML Validation Report
======================

✅ Syntax: All files valid
✅ Schema: All files match expected schema
⚠️  Cross-ref: 2 warnings
   - weapons.yaml: "f4g_wild_weasel" counters "s300pmu" but s300pmu doesn't list it in counteredBy
   - events.yaml: "coup_attempt" references country "iraq" not in relatedCountries
✅ Balance: No issues
✅ Completeness: All required entries present

Files checked: 11
Errors: 0
Warnings: 2
```

### 7. Auto-Fix Option

If `--fix` is specified, attempt to auto-fix:
- Add missing symmetric counter relationships
- Sort arrays alphabetically
- Normalize casing
- Add missing optional fields with defaults
