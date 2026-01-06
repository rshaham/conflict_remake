---
description: Add a new weapon to the game with full specifications
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Add Weapon: $ARGUMENTS

Add a new weapon to the Conflict game. The argument should be the weapon name (e.g., "M48 Patton" or "Tornado ADV").

## Steps

### 1. Gather Information
First, search the web for the weapon to understand:
- Official designation and variants
- Primary operators (especially Middle East nations)
- Combat history (1970s-1990s era preferred)
- Key specifications (weight, armament, speed, range)
- Wikipedia URL

### 2. Determine Category
Assign to one of these categories based on role:
- `infantry` - Ground troops
- `light_armor` - Older/lighter tanks (M60, T-62, Chieftain)
- `main_battle_tank` - Modern MBTs (M1A1, Leclerc, T-72)
- `attack_helicopter` - Anti-armor rotorcraft
- `sam_battery` - Surface-to-air missiles
- `fighter` - Air superiority aircraft
- `sead` - Suppression of Enemy Air Defenses

### 3. Assign Vendor
- `usa` - American equipment (can be embargoed)
- `uk` - British equipment (can be embargoed)
- `france` - French equipment (no embargo)
- `soviet` - Black market Soviet gear (delivery delays)
- `israel` - Domestic production (starting equipment only)

### 4. Add to weapons.yaml

Add entry to `data/weapons.yaml` following this schema:

```yaml
  {weapon_id}:
    id: "{weapon_id}"
    name: "{Display Name}"
    vendor: "{vendor}"
    category: "{category}"
    unlockRequirement: {0-25}  # Relationship level with vendor
    cost: {price_in_dollars}
    combatValue: {1-5}
    counters: []  # List of weapon IDs this counters
    counteredBy: []  # List of weapon IDs that counter this
    deliveryDelay: {0-3}  # Months, only for soviet
    model3d: "models/{weapon_id}.glb"
    icon: "icons/weapons/{weapon_id}.svg"
    wikipediaUrl: "https://en.wikipedia.org/wiki/{page}"
    summary: |
      2-3 paragraph historical summary covering:
      - Development and introduction
      - Combat history and operators
      - Significance to the region/era
    specs:
      weight: "{X} tonnes"
      mainGun: "{caliber} {type}"  # or armament for aircraft
      engine: "{power} {manufacturer}"
      maxSpeed: "{X} km/h"
      range: "{X} km"  # operational range
      crew: {number}
    stats:
      armor: {0-100}
      firepower: {0-100}
      speed: {0-100}
      range: {0-100}
```

### 5. Balance Check
Compare stats with existing weapons in same category:
- Light armor: combat value 1-2, cost $600K-$1.5M
- MBT: combat value 3-4, cost $1.8M-$5.5M
- Attack heli: combat value 2-3, cost $6M-$15M
- SAM: combat value 2-3, cost $2.5M-$8M
- Fighter: combat value 3-5, cost $12M-$30M
- SEAD: combat value 3-4, cost $18M-$25M

### 6. Update Counters
Check if this weapon should:
- Counter existing weapons (add to `counters`)
- Be countered by existing weapons (add to `counteredBy`)
- Require updates to other weapons' counter lists

### 7. Create Placeholder Assets
```bash
# Create placeholder icon
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="#333" width="48" height="48"/><text x="24" y="28" text-anchor="middle" fill="#fff" font-size="8">TODO</text></svg>' > public/icons/weapons/{weapon_id}.svg
```

### 8. Validate
Run the type checker to ensure YAML is valid:
```bash
npm run typecheck
```

### 9. Summary
Output a summary of what was added:
- Weapon name and ID
- Category and vendor
- Cost and unlock requirement
- Counter relationships
- Files modified
