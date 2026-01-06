---
description: Quick reference for game mechanics, values, and enums
allowed-tools: Read
---

# Quick Reference: $ARGUMENTS

Quick lookup for game mechanics. Argument should be the topic (e.g., "relationships", "weapons", "combat", "countries").

## Available References

### relationships
```yaml
Relationship Levels (best → worst):
1. military_pact   # Can coordinate military, trade bonus
2. profitable      # Trade bonus
3. beneficial      # Minor bonus
4. favourable      # Neutral positive
5. satisfactory    # True neutral (starting with most)
6. cool            # Neutral negative
7. lamentable      # Trade penalty
8. hostile         # War declaration possible
9. war             # Active conflict

Shift Mechanics:
- Diplomatic action: ±1-2 levels
- Events: ±1-3 levels
- War declaration: Instant drop to war
- Victory: Can improve to satisfactory
- Ripple effects: Allies shift sympathetically
```

### stability
```yaml
Stability Levels (best → worst):
1. very_solid  # Maximum stability, no unrest
2. solid       # Normal operations
3. good        # Minor concerns, monitoring needed
4. weak        # Extreme measures available (martial law, etc.)
5. critical    # Collapse imminent, desperate measures
6. collapse    # Country defeated (win condition for neighbors)

Factors Affecting Stability:
- War losses: -1 to -2 per major defeat
- Economic pressure: -1 per sustained embargo
- Internal events: ±1-2 based on handling
- Leader strength: Modifies recovery rate
```

### weapons
```yaml
Categories:
- infantry           # Base unit, always available
- light_armor        # M60, Chieftain, AMX-30, T-62
- main_battle_tank   # M1A1, Challenger, Leclerc, T-72
- attack_helicopter  # Apache, Lynx, Tiger, Hind
- sam_battery        # Patriot, Rapier, Crotale, S-300
- fighter            # F-15, F-16, Mirage 2000, MiG-29
- sead               # F-4G Wild Weasel, Su-24M

Vendors:
- usa     # Can embargo, unlock 0-25
- uk      # Can embargo, unlock 0-15
- france  # No embargo, unlock 0-8
- soviet  # Black market, delivery delays 1-3 months
- israel  # Domestic, starting equipment only

Counter System:
- SAMs → Aircraft
- SEAD → SAMs
- Fighters → SEAD
- Attack Helicopters → Armor
- MBTs → Light Armor
```

### combat
```yaml
Combat Phases:
1. Air Superiority  # Fighters vs fighters
2. SEAD             # Suppress enemy SAMs
3. Close Air Support # Attack helicopters vs ground
4. Ground Battle    # Armor vs armor + infantry

Resolution:
- Compare combat values
- Apply counter bonuses (+50% if countering)
- Apply terrain modifiers
- Add variance (±10%)
- Calculate losses

War Progress: -10 to +10
- < -5: Losing badly
- -5 to 0: Defending
- 0 to +5: Advancing
- > +5: Near victory
- +10: Enemy collapses
```

### countries
```yaml
Countries:
  israel:    # Player controlled
    capital: Jerusalem
    neighbors: [egypt, syria, jordan, lebanon]
    nuclear: yes (potential)
  
  egypt:     # Must defeat
    capital: Cairo
    borders: [israel, libya]
    starting: satisfactory
  
  syria:     # Must defeat
    capital: Damascus
    borders: [israel, jordan, lebanon, iraq]
    starting: hostile
  
  jordan:    # Must defeat
    capital: Amman
    borders: [israel, syria, iraq]
    starting: cool
  
  lebanon:   # Must defeat
    capital: Beirut
    borders: [israel, syria]
    starting: lamentable
  
  iraq:      # Regional power
    capital: Baghdad
    borders: [syria, jordan, iran]
    nuclear: yes (pursuing)
  
  iran:      # Regional power
    capital: Tehran
    borders: [iraq]
    starting: hostile
  
  libya:     # Regional power
    capital: Tripoli
    borders: [egypt]
    starting: hostile
```

### nuclear
```yaml
Nuclear Program Stages:
1. none         # No program
2. research     # $20M/month, 15% advance
3. development  # $20M/month, 20% advance
4. testing      # $20M/month, 25% advance
5. operational  # Can use nuclear weapons

Detection Risk: Increases with each stage
Airstrike: Can set back 1-2 stages
International Response: Severe relationship penalties
```

### palestinian
```yaml
Palestinian Tension Levels:
1. calm           # No issues
2. unrest         # Minor protests
3. demonstrations # Larger protests, media attention
4. riots          # Violence, stability impact
5. intifada       # Full uprising, severe impact

Policing Tactics:
- negotiate      # Slow, low violence points
- contain        # Moderate
- disperse       # Faster, more violence points
- crackdown      # Fast, high violence points
```

### scoring
```yaml
Violence Points: Never decrease
0-10:   Peaceful
11-30:  Moderate
31-60:  Violent
61+:    Extreme

Leadership Styles (based on violence + outcome):
- Dull       # Low violence, slow victory
- Violent    # High violence, any outcome
- Fascist    # Very high violence
- Extreme    # Maximum violence
- Soft       # Low violence, loss
- Liberal    # Moderate violence, good diplomacy
- Popular    # Low violence, decisive victory
- Diplomatic # Minimal violence, efficient victory

Scoring:
+50-100 per neighbor defeated (based on method)
+16-160 prestige (based on relationships)
+4 per month survived
-5 to -100 penalties (nuclear use, assassinations, etc.)
```

### turn
```yaml
Turn Phases:
1. News          # AI-generated headlines
2. Events        # Random/triggered events
3. Diplomatic    # Relationship actions
4. Intelligence  # Espionage, covert ops
5. Military      # Combat, purchases
6. End Turn      # Resolution, AI turns

Monthly Cycle:
- Each turn = 1 month
- Budget replenishes monthly
- Deliveries arrive
- War progress updates
- AI opponents act
```

---

If the requested topic isn't listed, check the design documents or use `/validate-yaml` to inspect the actual data files.
