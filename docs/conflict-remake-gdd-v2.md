# Conflict: Middle East Political Simulator — Remake GDD

**Version:** 1.0  
**Last Updated:** January 2026  
**Platform:** Web (React), Portrait-first mobile responsive  
**Playable Nation:** Israel only

---

## 1. Vision & Pillars

### Core Vision
A faithful remake of the 1990 classic that captures the brutal realpolitik of the original while using AI to create emergent narratives, dynamic events, and more nuanced opponent behavior. The player experiences the impossible choices of statecraft in a hostile region.

### Design Pillars

1. **Survival, Not Popularity** — Win condition is defeating/destabilizing neighbors before they do it to you. No election mechanics.

2. **Consequential Choices** — Every action ripples through the system. Diplomatic moves affect multiple relationships. Military actions have long-term costs.

3. **AI-Driven Emergence** — Events generated contextually based on game state rather than from fixed scripts. Each playthrough tells a unique story.

4. **Data-Driven & Extensible** — All game data in YAML/JSON. Easy to add countries, scenarios, weapon types, events.

5. **Authentic Tension** — Capture the feeling of the original: you're surrounded, outgunned, and one wrong move from destruction.

6. **Mobile-First** — Portrait orientation, thumb-friendly, card-based interactions.

---

## 2. Game Settings

```yaml
# data/settings.yaml

difficulties:
  easy:
    id: "easy"
    name: "Advisor"
    description: "Forgiving start, less aggressive neighbors"
    startingBudget: 150000000
    usAttitudeStart: 20
    aiAggressionModifier: 0.7
    successChanceModifier: 1.2
    relationshipModifier: 1  # Levels better with neighbors
    
  normal:
    id: "normal"
    name: "Prime Minister"
    description: "The classic experience"
    startingBudget: 100000000
    usAttitudeStart: 0
    aiAggressionModifier: 1.0
    successChanceModifier: 1.0
    relationshipModifier: 0
    
  hard:
    id: "hard"
    name: "Survivalist"
    description: "Hostile region, limited resources"
    startingBudget: 75000000
    usAttitudeStart: -20
    aiAggressionModifier: 1.3
    successChanceModifier: 0.8
    relationshipModifier: -1
    
  impossible:
    id: "impossible"
    name: "Masada"
    description: "The world wants you gone"
    startingBudget: 50000000
    usAttitudeStart: -40
    aiAggressionModifier: 1.5
    successChanceModifier: 0.6
    relationshipModifier: -2

scenarios:
  classic_1997:
    id: "classic_1997"
    name: "1997 - Classic"
    description: "The original scenario. Your predecessor was just assassinated."
    startYear: 1997
    startMonth: 1
    dataFile: "scenarios/classic_1997.yaml"
    
  # Future scenarios - data structure supports these
  # six_day_war:
  #   id: "six_day_war"
  #   name: "1967 - Six Day War"
  #   ...
  # modern_day:
  #   id: "modern_day"
  #   name: "2024 - Modern Day"
  #   ...
```

---

## 3. Core Data Structures

### 3.1 Countries

```yaml
# data/countries.yaml

countries:
  israel:
    id: "israel"
    name: "Israel"
    displayName: "Israel"
    isPlayer: true
    canDevelopNukes: true
    borders:
      - egypt
      - jordan
      - syria
      - lebanon
    startingState:
      budget: 100000000
      gdpDefensePercent: 35
      stability: "solid"
      insurgency: "scattered"  # Palestinian situation
      nuclearStage: "none"
      
  egypt:
    id: "egypt"
    name: "Egypt"
    displayName: "Egypt"
    isPlayer: false
    canDevelopNukes: true
    canBeInvadedByPlayer: true
    borders:
      - israel
      - libya
    startingState:
      stability: "good"
      insurgency: "none"
      nuclearStage: "none"
      relationWithPlayer: "cool"
      diplomaticStance: "neutral"
    leaderTemplate:
      strengthRange: ["moderate", "strong"]
      aggressionRange: ["pragmatic", "hawkish"]
      riskRange: ["cautious", "calculated"]
      
  syria:
    id: "syria"
    name: "Syria"
    displayName: "Syria"
    isPlayer: false
    canDevelopNukes: true
    canBeInvadedByPlayer: true
    borders:
      - israel
      - lebanon
      - jordan
      - iraq
    startingState:
      stability: "solid"
      insurgency: "none"
      nuclearStage: "research"  # Already working on it
      relationWithPlayer: "lamentable"
      diplomaticStance: "aggressive"
    leaderTemplate:
      strengthRange: ["strong"]
      aggressionRange: ["hawkish"]
      riskRange: ["calculated", "reckless"]
      
  jordan:
    id: "jordan"
    name: "Jordan"
    displayName: "Jordan"
    isPlayer: false
    canDevelopNukes: false
    canBeInvadedByPlayer: true
    borders:
      - israel
      - syria
      - iraq
    startingState:
      stability: "good"
      insurgency: "scattered"
      nuclearStage: "none"
      relationWithPlayer: "satisfactory"
      diplomaticStance: "neutral"
    leaderTemplate:
      strengthRange: ["weak", "moderate"]
      aggressionRange: ["dovish", "pragmatic"]
      riskRange: ["cautious"]
      
  lebanon:
    id: "lebanon"
    name: "Lebanon"
    displayName: "Lebanon"
    isPlayer: false
    canDevelopNukes: false
    canBeInvadedByPlayer: true
    borders:
      - israel
      - syria
    startingState:
      stability: "weak"
      insurgency: "organized"
      nuclearStage: "none"
      relationWithPlayer: "cool"
      diplomaticStance: "neutral"
    leaderTemplate:
      strengthRange: ["weak"]
      aggressionRange: ["dovish", "pragmatic"]
      riskRange: ["cautious"]
      
  iraq:
    id: "iraq"
    name: "Iraq"
    displayName: "Iraq"
    isPlayer: false
    canDevelopNukes: true
    canBeInvadedByPlayer: false  # No shared border
    borders:
      - syria
      - jordan
      - iran
    startingState:
      stability: "solid"
      insurgency: "none"
      nuclearStage: "development"
      relationWithPlayer: "hostile"
      diplomaticStance: "aggressive"
    leaderTemplate:
      strengthRange: ["strong"]
      aggressionRange: ["hawkish"]
      riskRange: ["reckless"]
      
  iran:
    id: "iran"
    name: "Iran"
    displayName: "Iran"
    isPlayer: false
    canDevelopNukes: true
    canBeInvadedByPlayer: false
    borders:
      - iraq
    startingState:
      stability: "solid"
      insurgency: "scattered"
      nuclearStage: "research"
      relationWithPlayer: "hostile"
      diplomaticStance: "aggressive"
    leaderTemplate:
      strengthRange: ["strong"]
      aggressionRange: ["hawkish"]
      riskRange: ["calculated"]
      
  libya:
    id: "libya"
    name: "Libya"
    displayName: "Libya"
    isPlayer: false
    canDevelopNukes: true
    canBeInvadedByPlayer: false
    borders:
      - egypt
    startingState:
      stability: "good"
      insurgency: "none"
      nuclearStage: "none"
      relationWithPlayer: "lamentable"
      diplomaticStance: "aggressive"
    leaderTemplate:
      strengthRange: ["moderate", "strong"]
      aggressionRange: ["hawkish"]
      riskRange: ["reckless"]
```

### 3.2 Enums & Constants

```yaml
# data/enums.yaml

relationshipLevels:
  - id: "military_pact"
    name: "Military Pact"
    order: 0
    canRequestPact: false
    canInvade: false
    willJoinWars: true
    color: "#22c55e"  # Green
    
  - id: "profitable"
    name: "Profitable"
    order: 1
    canRequestPact: true
    canInvade: false
    color: "#86efac"
    
  - id: "beneficial"
    name: "Beneficial"
    order: 2
    canRequestPact: false
    canInvade: false
    color: "#bbf7d0"
    
  - id: "favourable"
    name: "Favourable"
    order: 3
    canRequestPact: false
    canInvade: false
    improvementCost: 100000000
    color: "#fef9c3"  # Yellow
    
  - id: "satisfactory"
    name: "Satisfactory"
    order: 4
    canRequestPact: false
    canInvade: false
    color: "#fef08a"
    
  - id: "cool"
    name: "Cool"
    order: 5
    canRequestPact: false
    canInvade: false
    color: "#fed7aa"  # Orange
    
  - id: "lamentable"
    name: "Lamentable"
    order: 6
    canRequestPact: false
    canInvade: false
    color: "#fdba74"
    
  - id: "hostile"
    name: "Hostile"
    order: 7
    canRequestPact: false
    canInvade: true
    canAirstrike: true
    color: "#fca5a5"  # Red
    
  - id: "war"
    name: "War"
    order: 8
    canRequestPact: false
    isAtWar: true
    color: "#ef4444"

stabilityLevels:
  - id: "very_solid"
    name: "Very Solid"
    order: 0
    collapseChance: 0
    icon: "shield-check"
    
  - id: "solid"
    name: "Solid"
    order: 1
    collapseChance: 0
    icon: "shield"
    
  - id: "good"
    name: "Good"
    order: 2
    collapseChance: 0
    icon: "shield-half"
    
  - id: "weak"
    name: "Weak"
    order: 3
    collapseChance: 0.05
    allowsExtremeMeasures: true
    icon: "shield-alert"
    
  - id: "critical"
    name: "Critical"
    order: 4
    collapseChance: 0.15
    allowsExtremeMeasures: true
    icon: "shield-x"
    
  - id: "collapse"
    name: "Collapse"
    order: 5
    isDefeated: true
    icon: "skull"

insurgencyLevels:
  - id: "none"
    name: "None"
    order: 0
    monthlyDestabilization: 0
    
  - id: "scattered"
    name: "Scattered"
    order: 1
    monthlyDestabilization: 0.02
    
  - id: "organized"
    name: "Organized"
    order: 2
    monthlyDestabilization: 0.05
    
  - id: "armed"
    name: "Armed"
    order: 3
    monthlyDestabilization: 0.10
    
  - id: "guerilla_force"
    name: "Guerilla Force"
    order: 4
    monthlyDestabilization: 0.20
    allowsExtremeMeasures: true
    
  - id: "open_revolt"
    name: "Open Revolt"
    order: 5
    monthlyDestabilization: 0.35
    allowsExtremeMeasures: true

diplomaticStances:
  - id: "friendly"
    name: "Friendly"
    monthlyDrift: 1
    icon: "heart"
    
  - id: "neutral"
    name: "Neutral"
    monthlyDrift: 0
    icon: "minus"
    
  - id: "aggressive"
    name: "Aggressive"
    monthlyDrift: -1
    icon: "sword"

playerDiplomaticActions:
  - id: "improve"
    name: "Improve Relations"
    effect: 1
    
  - id: "maintain"
    name: "Maintain Relations"
    effect: 0
    
  - id: "worsen"
    name: "Worsen Relations"
    effect: -1

intelligenceActions:
  - id: "support_insurgents"
    name: "Support Insurgents"
    description: "Fund and arm opposition groups"
    monthlyInsurgencyGrowth: 1
    costPerMonth: 5000000
    
  - id: "disrupt_insurgents"
    name: "Disrupt Insurgents"
    description: "Counter-intelligence operations"
    monthlyInsurgencyReduction: 1
    costPerMonth: 5000000
    
  - id: "do_nothing"
    name: "Do Nothing"
    description: "No covert operations"
    costPerMonth: 0

extremeMeasures:
  - id: "assassination"
    name: "Attempt Assassination"
    description: "Eliminate the country's leader"
    baseSuccessChance: 0.25
    insurgencyBonus: 0.15  # Per level above guerilla_force
    stabilityBonus: 0.10   # Per level below good
    onSuccess:
      result: "country_collapse_delayed"  # Collapse in 1-2 turns
      headline: "{{country}} leader killed in explosion"
    onFailure:
      result: "international_condemnation"
      usAttitudePenalty: -20
      insurgencyReset: 2  # Set back 2 levels
      headline: "Israel condemned for assassination plot"
      
  - id: "coup"
    name: "Trigger Coup"
    description: "Military overthrow of government"
    baseSuccessChance: 0.30
    insurgencyBonus: 0.20
    stabilityBonus: 0.15
    onSuccess:
      result: "country_collapse_immediate"
      headline: "Military coup topples {{country}} government"
    onFailure:
      result: "insurgent_crackdown"
      insurgencyReset: 3
      headline: "Failed coup attempt in {{country}}"
```

### 3.3 Arms & Vendors

```yaml
# data/weapons.yaml

vendors:
  usa:
    id: "usa"
    name: "United States"
    flag: "🇺🇸"
    willEmbargo: true
    embargoTriggers:
      - "unprovoked_invasion"
      - "nuclear_strike"
      - "civilian_airstrike"
    embargoLiftCondition: "next_un_summit"
    exclusivityConflict: "black_market"  # Heavy purchases here lock out black market advanced weapons
    
  uk:
    id: "uk"
    name: "United Kingdom"
    flag: "🇬🇧"
    willEmbargo: true
    embargoTriggers:
      - "unprovoked_invasion"
      - "nuclear_strike"
    embargoLiftCondition: "next_un_summit"
    
  france:
    id: "france"
    name: "France"
    flag: "🇫🇷"
    willEmbargo: false
    
  black_market:
    id: "black_market"
    name: "Black Market"
    flag: "🏴"
    description: "South African dealer with Soviet equipment"
    willEmbargo: false
    deliveryDelay: 2
    priceModifier: 1.2  # 20% markup
    alwaysAvailable: true

weapons:
  light_tank:
    id: "light_tank"
    name: "Light Tank"
    category: "armor"
    description: "Fast, cheap, expendable"
    costPerUnit: 1000000
    combatValue: 1
    counteredBy: ["anti_tank_helicopter", "main_battle_tank"]
    availability:
      usa: { minPurchases: 0, price: 1000000 }
      uk: { minPurchases: 0, price: 1000000 }
      france: { minPurchases: 0, price: 1100000 }
      black_market: { minPurchases: 0, price: 1200000 }
      
  main_battle_tank:
    id: "main_battle_tank"
    name: "Main Battle Tank"
    category: "armor"
    description: "Heavy armor, high firepower"
    costPerUnit: 2000000
    combatValue: 3
    counters: ["light_tank"]
    counteredBy: ["anti_tank_helicopter"]
    availability:
      usa: { minPurchases: 5, price: 2000000 }
      uk: { minPurchases: 5, price: 2100000 }
      france: { minPurchases: 3, price: 2200000 }
      black_market: { minPurchases: 0, price: 2400000 }
      
  anti_tank_helicopter:
    id: "anti_tank_helicopter"
    name: "Anti-Tank Helicopter"
    category: "aircraft"
    description: "Tank killer, vulnerable to AA"
    costPerUnit: 5000000
    combatValue: 4
    counters: ["light_tank", "main_battle_tank"]
    counteredBy: ["sam_battery", "fighter_aircraft"]
    availability:
      usa: { minPurchases: 10, price: 5000000 }
      black_market: { minPurchases: 5, price: 6000000 }
      
  sam_battery:
    id: "sam_battery"
    name: "SAM Battery"
    category: "air_defense"
    description: "Surface-to-air missiles"
    costPerUnit: 3000000
    combatValue: 2
    counters: ["anti_tank_helicopter", "fighter_aircraft"]
    counteredBy: ["anti_sam_helicopter"]
    availability:
      usa: { minPurchases: 8, price: 3000000 }
      uk: { minPurchases: 8, price: 3200000 }
      black_market: { minPurchases: 0, price: 3600000 }
      
  fighter_aircraft:
    id: "fighter_aircraft"
    name: "Fighter Aircraft"
    category: "aircraft"
    description: "Air superiority and strikes"
    costPerUnit: 10000000
    combatValue: 5
    counters: ["anti_tank_helicopter"]
    counteredBy: ["sam_battery", "fighter_aircraft"]
    canAirstrike: true
    availability:
      usa: { minPurchases: 15, price: 10000000 }
      uk: { minPurchases: 12, price: 10500000 }
      france: { minPurchases: 10, price: 11000000 }
      black_market: { minPurchases: 8, price: 12000000 }
      
  anti_sam_helicopter:
    id: "anti_sam_helicopter"
    name: "SEAD Helicopter"
    category: "aircraft"
    description: "Suppression of enemy air defense"
    costPerUnit: 8000000
    combatValue: 3
    counters: ["sam_battery"]
    counteredBy: ["fighter_aircraft"]
    availability:
      usa: { minPurchases: 20, price: 8000000 }
      black_market: { minPurchases: 15, price: 9600000 }

  infantry_brigade:
    id: "infantry_brigade"
    name: "Infantry Brigade"
    category: "infantry"
    description: "Ground troops for occupation"
    costPerUnit: 0  # Comes from annual army expansion
    combatValue: 2
    canOccupy: true
    canPolice: true  # For Palestinian territories
```

### 3.4 Nuclear Program

```yaml
# data/nuclear.yaml

nuclearProgram:
  monthlyFundingCost: 20000000
  
  progressChances:
    high:
      minRemainingBudget: 15000000
      advanceChance: 0.40
    medium:
      minRemainingBudget: 6000000
      advanceChance: 0.30
    low:
      minRemainingBudget: 1000000
      advanceChance: 0.20
    none:
      minRemainingBudget: 0
      advanceChance: 0.00
      
  stages:
    - id: "none"
      name: "No Program"
      order: 0
      icon: "circle-off"
      
    - id: "research"
      name: "Research"
      order: 1
      monthsRequired: 6
      canBeDestroyed: true
      icon: "flask"
      
    - id: "development"
      name: "Development"
      order: 2
      monthsRequired: 8
      canBeDestroyed: true
      icon: "atom"
      
    - id: "testing"
      name: "Testing"
      order: 3
      monthsRequired: 4
      canBeDestroyed: true
      icon: "radiation"
      
    - id: "operational"
      name: "Operational"
      order: 4
      monthsRequired: 0
      canBeDestroyed: false
      icon: "bomb"
      displayIcon: "mushroom_cloud"  # Shows this on map
      
  airstrikeOnInstallation:
    baseSuccessChance: 0.65
    onSuccess:
      stagesSetBack: 99  # Reset to none
      relationshipPenalty: 1
    onFailure:
      stagesSetBack: 0
      relationshipPenalty: 2
      
  nuclearStrikeOutcomes:
    victory:
      condition: "target_has_no_nukes AND no_nuclear_allies"
      result: "instant_war_victory"
      consequences:
        usAttitude: -100
        prestige: -3
        armsEmbargo: "all_except_black_market"
        
    holocaust:
      condition: "target_has_nukes OR nuclear_ally_retaliates"
      result: "game_over"
      endingType: "nuclear_holocaust"
```

### 3.5 Palestinian Problem

```yaml
# data/palestinian.yaml

palestinianProblem:
  levels:
    - id: "calm"
      name: "Calm"
      order: 0
      requiresPolicing: false
      monthlyKnessetPressure: 0
      
    - id: "unrest"
      name: "Unrest"
      order: 1
      requiresPolicing: false
      monthlyKnessetPressure: 0.5
      
    - id: "protests"
      name: "Protests"
      order: 2
      requiresPolicing: true
      monthlyKnessetPressure: 1
      
    - id: "violence"
      name: "Violence"
      order: 3
      requiresPolicing: true
      monthlyKnessetPressure: 2
      
    - id: "intifada"
      name: "Intifada"
      order: 4
      requiresPolicing: true
      monthlyKnessetPressure: 3
      canCauseAssassination: true
      
  externalInfluence:
    # Hostile neighbors can worsen the situation
    hostileNeighborBonus: 0.1  # Per hostile neighbor per month
    atWarBonus: 0.2  # Per country at war with Israel
    
  policingOptions:
    none:
      id: "none"
      name: "No Deployment"
      effectiveness: 0
      usAttitudePenalty: 0
      violencePoints: 0
      brigadesRequired: 0
      
    soft:
      id: "soft"
      name: "Soft Tactics"
      description: "Minimal force, community engagement"
      effectiveness: 0.5
      usAttitudePenalty: 0
      violencePoints: 0
      brigadesRequired: 1
      
    hard:
      id: "hard"
      name: "Hard Tactics"
      description: "Aggressive enforcement, curfews"
      effectiveness: 1.0
      usAttitudePenalty: -15
      violencePoints: 3
      brigadesRequired: 1
      internationalCondemnationChance: 0.3
      
  homelandResolution:
    availableAt: "un_summit"
    usAttitudeBonus: 25
    prestigeBonus: 1
    permanentlyResolves: true
    warTerritoryPenalty: 2  # Disadvantage if war with border country
```

### 3.6 Scoring & Leadership

```yaml
# data/scoring.yaml

endGameScoring:
  neighborStatus:
    allFourDefeated: 100
    egyptOrSyriaOnly: 50
    notControlLebanon: -5
    notControlJordan: -10
    notControlSyria: -25
    
  knessetDisapproval:
    pointsPerLevel: -8
    
  prestige:
    levels:
      - { id: "none", name: "None", points: 0, threshold: 0 }
      - { id: "weak", name: "Weak", points: 16, threshold: 1 }
      - { id: "low", name: "Low", points: 32, threshold: 2 }
      - { id: "moderate", name: "Moderate", points: 64, threshold: 4 }
      - { id: "rising", name: "Rising", points: 80, threshold: 5 }
      - { id: "high", name: "High", points: 96, threshold: 6 }
      - { id: "very_high", name: "Very High", points: 112, threshold: 7 }
      - { id: "dynamic", name: "Dynamic", points: 128, threshold: 8 }
      - { id: "dominant", name: "Dominant", points: 144, threshold: 9 }
      - { id: "unrivalled", name: "Unrivalled", points: 160, threshold: 10 }
      
  monthsPlayed:
    pointsPerMonth: 4
    minimumMonthsPenalty: -20
    minimumMonths: 4
    
  usAttitude:
    events:
      fullDeployment: -5
      skippedSummit: -5
      invasion: -15
      hardTactics: -15
      nuclearStrike: -100
      palestinianHomeland: 25
      armyLimitAgreement: 15
      defenseReduction: 5

violenceTracking:
  actions:
    airstrikeNuclear: 4
    airstrikeMilitary: 2
    airstrikeCivilian: 2
    airstrikeIndustrial: 2
    invasion: 6
    nuclearStrike: 10
    enableHardTactics: 3
  # Violence points never decrease

leadershipStyles:
  # Evaluated in order; last matching style wins
  - id: "dull"
    name: "Dull"
    description: "Unremarkable leadership"
    conditions: []
    
  - id: "violent"
    name: "Violent"
    description: "Rule through force"
    conditions:
      - { field: "violencePoints", operator: ">=", value: 11 }
      
  - id: "fascist"
    name: "Fascist"
    description: "Authoritarian extremist"
    conditions:
      - { field: "violencePoints", operator: ">=", value: 21 }
      
  - id: "extreme"
    name: "Extreme"
    description: "Hardline nationalist"
    conditions:
      - { field: "palestinianHomeland", operator: "==", value: false }
      - { field: "armyLimitAgreement", operator: "==", value: false }
      - { field: "hardTacticsActive", operator: "==", value: true }
      - { field: "violencePoints", operator: ">=", value: 9 }
      - { field: "knessetDisapproval", operator: ">=", value: 5 }
      - { field: "gdpDefensePercent", operator: ">=", value: 35 }
      - { field: "usAttitude", operator: "<=", value: -41 }
      
  - id: "soft"
    name: "Soft"
    description: "Peaceful moderate"
    conditions:
      - { field: "violencePoints", operator: "==", value: 0 }
      - { field: "usAttitude", operator: ">=", value: -9 }
      
  - id: "liberal"
    name: "Liberal"
    description: "Progressive reformer"
    conditions:
      - { field: "violencePoints", operator: "<=", value: 5 }
      - { field: "usAttitude", operator: ">=", value: -29 }
      - { field: "knessetDisapproval", operator: "<=", value: 3 }
      - { field: "gdpDefensePercent", operator: "<=", value: 35 }
      - anyOf:
          - { field: "palestinianHomeland", operator: "==", value: true }
          - { field: "armyLimitAgreement", operator: "==", value: true }
          
  - id: "popular"
    name: "Popular"
    description: "Beloved by the people"
    conditions:
      - { field: "violencePoints", operator: ">=", value: 1 }
      - { field: "violencePoints", operator: "<=", value: 7 }
      - { field: "palestinianHomeland", operator: "==", value: false }
      - { field: "armyLimitAgreement", operator: "==", value: false }
      - { field: "prestige", operator: ">=", value: "rising" }
      
  - id: "diplomatic"
    name: "Diplomatic"
    description: "Master negotiator"
    conditions:
      - { field: "violencePoints", operator: "<=", value: 3 }
      - { field: "palestinianHomeland", operator: "==", value: true }
      - { field: "armyLimitAgreement", operator: "==", value: true }
      - { field: "usAttitude", operator: ">=", value: -29 }
```

### 3.7 Leader Personalities

```yaml
# data/leaders.yaml

leaderTraits:
  strength:
    description: "Policy consistency under pressure"
    levels:
      weak:
        id: "weak"
        name: "Weak"
        policyFlipChance: 0.40
        coupVulnerability: 1.5
        description: "Erratic, reactive to public opinion"
      moderate:
        id: "moderate"
        name: "Moderate"
        policyFlipChance: 0.15
        coupVulnerability: 1.0
        description: "Balances conviction with pragmatism"
      strong:
        id: "strong"
        name: "Strong"
        policyFlipChance: 0.05
        coupVulnerability: 0.7
        description: "Unwavering, possibly to a fault"
        
  aggression:
    description: "Preference for military solutions"
    levels:
      dovish:
        id: "dovish"
        name: "Dovish"
        warDeclarationThreshold: 0.8
        nuclearPriority: 0.2
        alliancePreference: 0.7
        description: "Seeks peace, avoids conflict"
      pragmatic:
        id: "pragmatic"
        name: "Pragmatic"
        warDeclarationThreshold: 0.5
        nuclearPriority: 0.5
        alliancePreference: 0.5
        description: "Uses force when advantageous"
      hawkish:
        id: "hawkish"
        name: "Hawkish"
        warDeclarationThreshold: 0.3
        nuclearPriority: 0.8
        alliancePreference: 0.3
        description: "Aggressive, expansionist"
        
  riskTolerance:
    description: "Willingness to gamble"
    levels:
      cautious:
        id: "cautious"
        name: "Cautious"
        wildcardChance: 0.05
        extremeMeasureChance: 0.1
        firstStrikeChance: 0.1
        description: "Predictable, conservative"
      calculated:
        id: "calculated"
        name: "Calculated"
        wildcardChance: 0.15
        extremeMeasureChance: 0.3
        firstStrikeChance: 0.3
        description: "Takes measured risks"
      reckless:
        id: "reckless"
        name: "Reckless"
        wildcardChance: 0.30
        extremeMeasureChance: 0.6
        firstStrikeChance: 0.5
        description: "Unpredictable, dangerous"
```

---

## 4. Combat & War Resolution

### 4.1 War Declaration

```yaml
# Rules for war initiation

warDeclaration:
  playerRequirements:
    - relationshipLevel: "hostile"  # Must be hostile or worse
    - troopsOnBorder: true          # Must have brigade stationed
    
  aiDecisionFactors:
    # AI evaluates these factors weighted by leader personality
    - factor: "militaryAdvantage"
      weight: 0.3
      calculation: "(myForces - theirForces) / myForces"
      
    - factor: "relationshipLevel"
      weight: 0.2
      calculation: "Maps hostile=0.8, lamentable=0.4, cool=0.1, etc"
      
    - factor: "opportunism"
      weight: 0.2
      calculation: "1.0 if target at war with others, 0.5 if target unstable"
      
    - factor: "leaderAggression"
      weight: 0.2
      calculation: "hawkish=0.8, pragmatic=0.5, dovish=0.2"
      
    - factor: "randomness"
      weight: 0.1
      calculation: "random() * riskTolerance.wildcardChance"
      
  # AI declares war if: sum(factor * weight) > aggression.warDeclarationThreshold
```

### 4.2 Combat Resolution

```yaml
# Per-turn combat during active wars

combatResolution:
  # Each turn, both sides' forces engage
  
  phases:
    - name: "Air Superiority"
      attackers: ["fighter_aircraft"]
      defenders: ["fighter_aircraft", "sam_battery"]
      
    - name: "Air Defense Suppression"
      attackers: ["anti_sam_helicopter"]
      defenders: ["sam_battery", "fighter_aircraft"]
      
    - name: "Close Air Support"
      attackers: ["anti_tank_helicopter", "fighter_aircraft"]
      defenders: ["sam_battery", "main_battle_tank", "light_tank"]
      
    - name: "Ground Battle"
      attackers: ["main_battle_tank", "light_tank", "infantry_brigade"]
      defenders: ["main_battle_tank", "light_tank", "infantry_brigade"]
      
  combatFormula:
    # For each engagement:
    # attackerDamage = attackerUnits * combatValue * effectiveness * random(0.8, 1.2)
    # defenderLosses = attackerDamage / defenderCombatValue
    
    effectiveness:
      counters: 1.5      # Attacker counters defender type
      countered: 0.5     # Attacker is countered by defender
      neutral: 1.0       # No counter relationship
      
  warProgress:
    # War progress bar: -10 (losing badly) to +10 (winning decisively)
    # Changes based on relative losses each turn
    
    progressChange:
      decisiveVictory: 3    # Lost < 10% of what enemy lost
      victory: 2            # Lost < 50% of what enemy lost
      pyrrhic: 1            # Lost < 100% of what enemy lost
      stalemate: 0          # Roughly equal losses
      setback: -1           # Lost > 100% of what enemy lost
      defeat: -2            # Lost > 200% of what enemy lost
      rout: -3              # Lost > 500% of what enemy lost
      
    victoryCondition: 10    # Reach +10 to win
    defeatCondition: -10    # Reach -10 to lose
    
  warEnd:
    victory:
      enemyDefeated: true
      prestigeGain: 2
      enemyStabilitySet: "critical"
      
    defeat:
      playerStabilityDrop: 2
      knessetDisapprovalGain: 3
      
    ceasefire:
      relationshipReset: "satisfactory"
      stanceReset: "aggressive"  # Usually leads to another war
      advantageSideStability: "very_solid"
      disadvantageSideStability: "weak"
```

### 4.3 Airstrikes (Non-War)

```yaml
airstrikes:
  types:
    military:
      id: "military"
      name: "Military Targets"
      requiresRelation: "hostile"
      violencePoints: 2
      effect: "Destroy 5-15 random enemy units"
      relationshipPenalty: 1
      
    civilian:
      id: "civilian"
      name: "Civilian Targets"
      requiresRelation: "hostile"
      violencePoints: 2
      effect: "Reduce enemy stability by 1"
      relationshipPenalty: 2
      usAttitudePenalty: -10
      internationalCondemnation: true
      
    industrial:
      id: "industrial"
      name: "Industrial Targets"
      requiresRelation: "hostile"
      violencePoints: 2
      effect: "Reduce enemy budget by 20% for 3 months"
      relationshipPenalty: 1
      
    nuclear:
      id: "nuclear"
      name: "Nuclear Installation"
      requiresRelation: "any"  # Can strike even friendly nations
      violencePoints: 4
      effect: "Attempt to destroy nuclear program"
      successChance: 0.65
      relationshipPenalty: 1  # On success
      relationshipPenaltyFailure: 2  # On failure
      
  requirements:
    minimumFighters: 5  # Need at least 5 fighter aircraft
    
  losses:
    baseChance: 0.1  # 10% of attacking aircraft lost
    samModifier: 0.05  # +5% per SAM battery target has
```

---

## 5. Opponent AI (Rule-Based)

### 5.1 Decision Tree

```yaml
# AI evaluates these each turn, in order

aiDecisionTree:
  # Priority 1: Survival
  - name: "Survival Check"
    condition: "stability <= weak AND atWar"
    actions:
      - "seekCeasefire"
      - "requestAlliance_withStrongest"
      
  # Priority 2: Active War Management
  - name: "War Management"
    condition: "atWar"
    actions:
      - "allocateAllBudgetToMilitary"
      - "considerNuclearStrike_ifDesperate"
      
  # Priority 3: Opportunistic War
  - name: "Opportunistic Attack"
    condition: "NOT atWar AND targetIsVulnerable"
    evaluation: "warDeclarationFactors"  # See 4.1
    actions:
      - "worsenRelations"
      - "declareWar_ifThresholdMet"
      
  # Priority 4: Nuclear Program
  - name: "Nuclear Development"
    condition: "canDevelopNukes AND nuclearStage != operational"
    actions:
      - "fundNuclearProgram"
      - "probability": "aggression.nuclearPriority"
        
  # Priority 5: Alliance Building
  - name: "Seek Allies"
    condition: "threatened OR leaderAggression == dovish"
    actions:
      - "improveRelations_withPotentialAllies"
      - "requestMilitaryPact_ifProfitable"
      
  # Priority 6: Destabilization
  - name: "Support Insurgents"
    condition: "hasHostileNeighbor AND NOT atWar"
    actions:
      - "supportInsurgents_inHostileCountry"
      
  # Priority 7: Military Buildup
  - name: "Military Buildup"
    condition: "budget > minimumReserve"
    actions:
      - "purchaseWeapons_balancedPortfolio"
      
  # Wildcard: Personality-based surprise (20% of the time)
  - name: "Wildcard"
    condition: "random() < riskTolerance.wildcardChance"
    actions:
      - "generateAIWildcardAction"  # This is where LLM can inject surprises
```

### 5.2 AI Budget Allocation

```yaml
aiBudgetAllocation:
  priorities:
    atWar:
      military: 0.9
      nuclear: 0.1
      reserve: 0.0
      
    threatened:  # Hostile neighbor or unstable
      military: 0.6
      nuclear: 0.3
      reserve: 0.1
      
    peaceful:
      military: 0.3
      nuclear: 0.4
      reserve: 0.3
      
  weaponPurchasePriorities:
    # AI tries to maintain balanced forces
    targetRatios:
      main_battle_tank: 0.3
      light_tank: 0.2
      fighter_aircraft: 0.2
      sam_battery: 0.15
      anti_tank_helicopter: 0.1
      anti_sam_helicopter: 0.05
```

---

## 6. AI Event Generation System

This is the core differentiator from the original game. Instead of a fixed event pool, AI generates contextual crises and opportunities.

### 6.1 Event Structure

```yaml
# Schema for AI-generated events

eventSchema:
  type: "object"
  required: ["id", "title", "description", "category", "options"]
  properties:
    id:
      type: "string"
      description: "Unique identifier (generated)"
      
    title:
      type: "string"
      maxLength: 60
      description: "Short headline"
      
    description:
      type: "string"
      maxLength: 500
      description: "Event narrative, 2-3 paragraphs"
      
    category:
      type: "string"
      enum: ["crisis", "opportunity", "diplomatic", "military", "internal", "international"]
      
    urgency:
      type: "string"
      enum: ["immediate", "pressing", "routine"]
      description: "How quickly player must respond"
      
    relatedCountries:
      type: "array"
      items: { type: "string" }
      description: "Countries involved in this event"
      
    options:
      type: "array"
      minItems: 2
      maxItems: 4
      items:
        type: "object"
        required: ["id", "text", "consequences"]
        properties:
          id:
            type: "string"
          text:
            type: "string"
            maxLength: 100
            description: "Option button text"
          detailedText:
            type: "string"
            maxLength: 200
            description: "Expanded description of this choice"
          consequences:
            type: "object"
            description: "Game state changes"
            properties:
              usAttitude: { type: "integer" }
              prestige: { type: "integer" }
              knessetDisapproval: { type: "integer" }
              violencePoints: { type: "integer" }
              budget: { type: "integer" }
              relationships:
                type: "object"
                additionalProperties:
                  type: "object"
                  properties:
                    change: { type: "integer" }
                    newStance: { type: "string" }
              stability:
                type: "object"
                additionalProperties: { type: "integer" }
              insurgency:
                type: "object"
                additionalProperties: { type: "integer" }
              palestinian: { type: "integer" }
              followUpEvent:
                type: "string"
                description: "ID of event this might trigger later"
                
    advisorOpinions:
      type: "object"
      description: "What each advisor thinks"
      properties:
        defense: { type: "string", maxLength: 150 }
        foreign: { type: "string", maxLength: 150 }
        intelligence: { type: "string", maxLength: 150 }
```

### 6.2 Event Categories & Triggers

```yaml
eventCategories:
  crisis:
    description: "Urgent problems requiring immediate response"
    frequencyPerMonth: 0.4  # 40% chance each month
    examples:
      - "Terrorist attack"
      - "Border incident"
      - "Hostage situation"
      - "Assassination attempt"
      - "Military coup in neighbor"
    triggerConditions:
      - "palestinianLevel >= violence"
      - "anyNeighborRelation <= lamentable"
      - "atWarWithAnyone"
      
  opportunity:
    description: "Chances to gain advantage"
    frequencyPerMonth: 0.2
    examples:
      - "Intelligence windfall"
      - "Defector with secrets"
      - "Enemy internal strife"
      - "Arms deal opportunity"
    triggerConditions:
      - "anyNeighborStability <= weak"
      - "prestige >= rising"
      
  diplomatic:
    description: "International relations events"
    frequencyPerMonth: 0.3
    examples:
      - "Summit invitation"
      - "Treaty proposal"
      - "International criticism"
      - "Alliance offer"
    triggerConditions:
      - "usAttitude changed significantly"
      - "recentAirstrike OR recentInvasion"
      
  military:
    description: "Armed forces matters"
    frequencyPerMonth: 0.2
    examples:
      - "Equipment malfunction"
      - "Training accident"
      - "Intel on enemy positions"
      - "Defecting general"
    triggerConditions:
      - "atWar"
      - "recentMilitaryPurchase"
      
  internal:
    description: "Domestic Israeli politics"
    frequencyPerMonth: 0.3
    examples:
      - "Knesset challenge"
      - "Public protests"
      - "Economic crisis"
      - "Cabinet resignation"
    triggerConditions:
      - "knessetDisapproval >= 5"
      - "palestinianLevel >= protests"
      - "prolongedWar"
      
  international:
    description: "World events affecting the region"
    frequencyPerMonth: 0.15
    examples:
      - "Superpower intervention"
      - "Oil crisis"
      - "UN resolution"
      - "Global arms embargo"
    triggerConditions:
      - "nuclearStrike anywhere"
      - "majorWar ongoing"
```

### 6.3 Prompt Engineering

```yaml
# AI Prompts for Event Generation

prompts:
  system:
    role: "system"
    content: |
      You are the game master for a political simulation game set in the Middle East.
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
      
      STYLE:
      - Write in present tense
      - Be concise but evocative
      - Include sensory details and quotes where appropriate
      - Advisor opinions should reflect their role (Defense = security-focused, 
        Foreign = diplomatic, Intelligence = covert options)
      
      OUTPUT:
      Return valid JSON matching the eventSchema. Do not include markdown formatting.

  eventGeneration:
    role: "user"
    template: |
      Generate a {{category}} event for month {{month}}/{{year}}.
      
      CURRENT GAME STATE:
      
      Relationships:
      {{#each relationships}}
      - {{this.country}}: {{this.level}} ({{this.stance}} stance)
      {{/each}}
      
      Active Wars: {{#if wars}}{{wars}}{{else}}None{{/if}}
      
      Neighbor Stability:
      {{#each neighbors}}
      - {{this.country}}: {{this.stability}} stability, {{this.insurgency}} insurgency
      {{/each}}
      
      Palestinian Situation: {{palestinianLevel}}
      
      Player Status:
      - US Attitude: {{usAttitude}}
      - Prestige: {{prestige}}
      - Knesset Disapproval: {{knessetDisapproval}}/10
      - Nuclear Program: {{nuclearStage}}
      - Budget: ${{budget}}M
      - Violence Points: {{violencePoints}}
      
      Recent Player Actions (last 3 turns):
      {{#each recentActions}}
      - {{this}}
      {{/each}}
      
      Recent Events (last 3):
      {{#each recentEvents}}
      - {{this.title}}: Player chose "{{this.chosenOption}}"
      {{/each}}
      
      {{#if specificTrigger}}
      SPECIFIC TRIGGER: {{specificTrigger}}
      {{/if}}
      
      Generate a compelling {{category}} event with 3 options.

  consequenceNarration:
    role: "user"
    template: |
      The player chose: "{{chosenOption}}"
      
      For the event: {{eventTitle}}
      {{eventDescription}}
      
      Consequences applied:
      {{#each consequences}}
      - {{@key}}: {{this}}
      {{/each}}
      
      Write 2-3 sentences describing what happened as a result of this decision.
      This will be shown as a news item next turn. Be specific and consequential.

  newsHeadlines:
    role: "user" 
    template: |
      Generate 4 news headlines for {{month}}/{{year}}.
      
      Events this turn:
      {{#each events}}
      - {{this}}
      {{/each}}
      
      Return as JSON array of strings. Headlines should be:
      - Mix of regional and international perspectives
      - Terse, punchy newspaper style
      - Reference specific events where relevant
      - Include 1 headline about general regional mood/tensions
```

### 6.4 Example Generated Events

```yaml
# Examples of what the AI should generate

exampleEvents:
  - title: "Hezbollah Rocket Attack on Northern Towns"
    category: "crisis"
    description: |
      Three Katyusha rockets struck the town of Kiryat Shmona early this morning,
      killing two civilians and injuring fourteen. Hezbollah has claimed responsibility,
      calling it retaliation for last month's airstrike on their training camp near Sidon.
      
      Defense Minister Levy is demanding immediate military response. The US Ambassador
      has called urging restraint, noting the fragile ceasefire talks with Syria.
      Intelligence reports suggest the attack was ordered by Damascus to test our resolve.
    options:
      - id: "retaliate"
        text: "Launch retaliatory airstrikes on Hezbollah positions"
        detailedText: "Strike known Hezbollah camps in southern Lebanon. Risk of escalation with Syria."
        consequences:
          violencePoints: 2
          relationships:
            lebanon: { change: -1 }
            syria: { change: -1 }
          usAttitude: -5
          knessetDisapproval: -1
          
      - id: "limited"
        text: "Increase border security, issue stern warning"
        detailedText: "Deploy additional troops to northern border. Diplomatic protest through channels."
        consequences:
          budget: -10000000
          knessetDisapproval: 1
          
      - id: "covert"
        text: "Authorize Mossad targeted response"
        detailedText: "Eliminate Hezbollah commanders responsible. Deniable but effective."
        consequences:
          violencePoints: 1
          relationships:
            lebanon: { change: -1 }
          prestige: 1
          followUpEvent: "covert_operation_result"
          
    advisorOpinions:
      defense: "We cannot let this stand. A measured military response now prevents larger attacks later."
      foreign: "The Americans are watching. Escalation could derail the Syria track."
      intelligence: "We know who ordered this. A quiet solution sends the message without the headlines."

  - title: "Egyptian Back-Channel Peace Proposal"
    category: "opportunity"
    description: |
      Through a trusted intermediary in Cairo, President Mubarak's office has conveyed
      interest in secret negotiations. They propose a comprehensive peace framework
      including normalized trade relations and military coordination against mutual threats.
      
      The catch: Egypt wants a public commitment to Palestinian statehood negotiations
      before any formal talks begin. This would be politically explosive domestically
      but could fundamentally reshape our regional position.
    options:
      - id: "accept"
        text: "Agree to back-channel talks"
        detailedText: "Begin secret negotiations. Must make Palestinian statement within 2 months."
        consequences:
          relationships:
            egypt: { change: 2, newStance: "friendly" }
          usAttitude: 10
          knessetDisapproval: 2
          followUpEvent: "egypt_talks_progress"
          
      - id: "counter"
        text: "Counter-propose talks without preconditions"
        detailedText: "Express interest but reject Palestinian linkage. May stall negotiations."
        consequences:
          relationships:
            egypt: { change: 1 }
          usAttitude: 5
          
      - id: "reject"
        text: "Decline the proposal"
        detailedText: "Too politically risky. Focus on military deterrence instead."
        consequences:
          knessetDisapproval: -1
          prestige: -1
          
    advisorOpinions:
      defense: "Peace with Egypt would free two divisions for the northern front. Worth considering."
      foreign: "This is the opportunity we've been waiting for. The Palestinian issue is manageable."
      intelligence: "Our sources say Mubarak is under pressure from Islamists. He needs this more than we do."
```

### 6.5 Event Chaining

```yaml
# Some events trigger follow-up events

eventChains:
  covert_operation:
    trigger: "player chose covert option"
    delay: 1  # Turns until follow-up
    outcomes:
      success:
        probability: 0.6
        event:
          title: "Operation Success: Hezbollah Commander Eliminated"
          category: "military"
          description: "Mossad operation successful..."
          
      failure:
        probability: 0.3
        event:
          title: "Israeli Operatives Captured in Beirut"
          category: "crisis"
          description: "Two Mossad agents captured..."
          
      blowback:
        probability: 0.1
        event:
          title: "Civilian Casualties in Botched Operation"
          category: "crisis"
          description: "A targeted strike went wrong..."

  egypt_talks:
    trigger: "accepted egypt back-channel"
    delay: 2
    outcomes:
      progress:
        probability: 0.5
        condition: "palestinianLevel < violence"
        event:
          title: "Egypt Talks Showing Promise"
          
      collapse:
        probability: 0.3
        condition: "recentAirstrike OR knessetDisapproval >= 7"
        event:
          title: "Egypt Talks Collapse"
          
      breakthrough:
        probability: 0.2
        condition: "usAttitude >= 0 AND prestige >= moderate"
        event:
          title: "Historic Peace Framework Reached"
```

---

## 7. Sound & Music System

### 7.1 Adaptive Soundtrack

```yaml
musicSystem:
  layers:
    # Base ambient layer - always playing
    ambient:
      peaceful:
        tracks: ["ambient_peaceful_1.mp3", "ambient_peaceful_2.mp3"]
        condition: "noWars AND palestinianLevel <= unrest AND avgRelationship >= satisfactory"
        
      tense:
        tracks: ["ambient_tense_1.mp3", "ambient_tense_2.mp3"]
        condition: "anyRelationship <= lamentable OR palestinianLevel >= protests"
        
      wartime:
        tracks: ["ambient_war_1.mp3", "ambient_war_2.mp3"]
        condition: "atWar"
        
      critical:
        tracks: ["ambient_critical_1.mp3"]
        condition: "playerStability <= weak OR knessetDisapproval >= 8"
        
    # Event stingers - play on specific triggers
    stingers:
      warDeclared: "stinger_war.mp3"
      nuclearLaunch: "stinger_nuclear.mp3"
      victoryAchieved: "stinger_victory.mp3"
      assassination: "stinger_assassination.mp3"
      treatySigned: "stinger_treaty.mp3"
      
    # Phase transitions
    phaseTransitions:
      toDiplomatic: "transition_diplomatic.mp3"
      toMilitary: "transition_military.mp3"
      toNews: "transition_news.mp3"

soundEffects:
  ui:
    buttonClick: "click.mp3"
    menuOpen: "menu_open.mp3"
    menuClose: "menu_close.mp3"
    turnEnd: "turn_end.mp3"
    notification: "notification.mp3"
    
  game:
    airstrikeOrdered: "airstrike.mp3"
    troopsDeployed: "troops.mp3"
    purchaseMade: "purchase.mp3"
    relationshipUp: "relationship_up.mp3"
    relationshipDown: "relationship_down.mp3"
    warProgress: "war_progress.mp3"
```

---

## 8. UI/UX Design (Portrait Mobile)

### 8.1 Screen Structure

```
┌─────────────────────────────────────────┐
│  STATUS BAR (fixed)                     │
│  Month/Year | Budget | Active Alerts    │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│  MAIN CONTENT AREA                      │
│  (scrollable, varies by phase)          │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  ACTION BAR (contextual)                │
│  Primary action buttons for phase       │
├─────────────────────────────────────────┤
│  NAV BAR (fixed)                        │
│  [News] [Diplo] [Intel] [Military] [◉]  │
└─────────────────────────────────────────┘
```

### 8.2 Screen Specifications

```yaml
screens:
  news:
    purpose: "Show results of last turn"
    layout:
      - component: "NewspaperHeader"
        content: "AI-generated newspaper masthead"
      - component: "HeadlinesList"
        content: "4-5 clickable headlines"
      - component: "EventCard"
        content: "If random event triggered, show here"
    actions:
      - "Continue to Diplomatic Phase"
      
  diplomatic:
    purpose: "Set relations with each country"
    layout:
      - component: "MiniMap"
        content: "Simplified region map, countries colored by relationship"
        interaction: "Tap country to open detail card"
      - component: "CountryCards"
        content: "Horizontal scroll of country summary cards"
        interaction: "Tap to expand"
      - component: "CountryDetailSheet"  # Bottom sheet when country selected
        content:
          - "Leader portrait and name"
          - "Relationship status bar"
          - "Their stance indicator"
          - "Your policy selector (Improve/Maintain/Worsen)"
          - "Available actions (Request Pact, etc)"
    actions:
      - "Continue to Intelligence"
      - "Back to News" (if allowed)
      
  intelligence:
    purpose: "Covert operations"
    layout:
      - component: "CountryIntelCards"
        content: "Per-country insurgency status and actions"
        showFor: "Non-defeated countries"
      - component: "ExtremeMeasuresButton"
        content: "Shows when assassination/coup available"
        style: "Dangerous red styling"
    actions:
      - "Continue to Military"
      - "Back to Diplomatic"
      
  military:
    purpose: "Arms and combat"
    pointOfNoReturn: true
    layout:
      - component: "BudgetDisplay"
        content: "Current budget, income sources"
      - component: "ArsenalSummary"
        content: "Current forces by type"
      - component: "VendorTabs"
        content: "Tab bar: USA | UK | France | Black Market"
      - component: "WeaponCatalog"
        content: "Available weapons from selected vendor"
        interaction: "Tap to buy, shows quantity selector"
      - component: "NuclearSection"
        content: "Fund program button, status display"
      - component: "DeploymentSection"
        content: "Station troops on borders"
      - component: "StrikeSection"
        content: "Airstrike targeting (if hostile relations)"
    actions:
      - "End Turn"
      - "Declare War" (if conditions met)
      - "Launch Nuclear Strike" (if at war and have nukes)
      
  palestinian:
    purpose: "Manage internal insurgency"
    layout:
      - component: "SituationMeter"
        content: "Visual gauge of Palestinian unrest"
      - component: "TacticsSelector"
        content: "None / Soft / Hard toggle"
      - component: "ConsequencePreview"
        content: "Show projected effects of each choice"
    actions:
      - "Confirm and End Turn"
      
  war:
    purpose: "Active war management"
    triggeredBy: "Active war exists"
    layout:
      - component: "WarProgressBar"
        content: "Visual bar from -10 to +10"
      - component: "BattleNarrative"
        content: "AI-generated description of recent fighting"
      - component: "ForceComparison"
        content: "Side-by-side unit counts"
      - component: "LossesThisTurn"
        content: "What was destroyed"
    actions:
      - "Continue Fighting"
      - "Offer Ceasefire"
      - "Launch Nuclear Strike" (if available)
      
  unSummit:
    purpose: "Annual diplomatic event"
    triggeredBy: "December turn"
    layout:
      - component: "SummitHeader"
        content: "UN logo, year"
      - component: "ProposalsList"
        content: "Available agreements"
        proposals:
          - "Palestinian Homeland"
          - "Army Size Limit"
          - "Defense Budget Reduction"
      - component: "UsAidDisplay"
        content: "This year's aid amount based on relationship"
    actions:
      - "Accept/Reject each proposal"
      - "Continue"
      
  gameOver:
    purpose: "End game summary"
    layout:
      - component: "OutcomeHeader"
        content: "Victory/Defeat type"
      - component: "NarrativeSummary"
        content: "AI-generated story of your tenure"
      - component: "ScoreBreakdown"
        content: "Points from each category"
      - component: "LeadershipStyle"
        content: "Your determined style"
      - component: "Statistics"
        content: "Turns played, wars won, etc"
    actions:
      - "Play Again"
      - "Main Menu"
```

### 8.3 Visual Components

```yaml
components:
  countryCard:
    size: "compact (fits 4 across in scroll)"
    elements:
      - "Flag icon"
      - "Country name"
      - "Relationship color bar"
      - "Status icons (at war, nukes, unstable)"
    expandedSize: "bottom sheet, 60% screen height"
    expandedElements:
      - "Leader portrait (AI-generated or placeholder)"
      - "Leader name and traits"
      - "Full relationship status"
      - "Stability and insurgency meters"
      - "Action buttons"
      
  relationshipBar:
    style: "Horizontal bar with gradient"
    colors: "Green (pact) to Red (war)"
    animation: "Smooth transition on change"
    
  eventCard:
    size: "Near full-screen modal"
    elements:
      - "Title"
      - "Category icon"
      - "Description text (scrollable)"
      - "Advisor portraits with speech bubbles"
      - "Option buttons (stacked vertically)"
    animation: "Slide up from bottom"
    
  miniMap:
    style: "Simplified vector map"
    features:
      - "Countries as distinct shapes"
      - "Color-coded by relationship"
      - "Pulsing indicators for active events"
      - "Troop icons on borders"
      - "Nuclear symbols where applicable"
    interaction: "Tap country to select"
```

---

## 9. Win/Lose Conditions

```yaml
winConditions:
  totalVictory:
    id: "total_victory"
    name: "Total Victory"
    description: "All four bordering states have been defeated"
    requirements:
      - { type: "countryDefeated", target: "egypt" }
      - { type: "countryDefeated", target: "syria" }
      - { type: "countryDefeated", target: "jordan" }
      - { type: "countryDefeated", target: "lebanon" }
    endingNarrative: "Under your leadership, Israel has achieved complete regional dominance..."

loseConditions:
  militaryDefeat:
    id: "military_defeat"
    name: "Military Defeat"
    description: "Israel has been conquered"
    trigger: "playerStability == collapse"
    endingNarrative: "As enemy forces enter Jerusalem, your government collapses..."
    
  nuclearHolocaust:
    id: "nuclear_holocaust"
    name: "Nuclear Holocaust"
    description: "Mutual nuclear destruction"
    trigger: "nuclearExchange"
    endingNarrative: "As the world is drawn into nuclear holocaust by your actions..."
    
  impeachment:
    id: "impeachment"
    name: "Removed from Office"
    description: "The Knesset has voted to remove you"
    trigger: "knessetDisapproval >= 10"
    endingNarrative: "The Knesset, having lost all confidence in your leadership..."
    
  assassination:
    id: "assassination"  
    name: "Assassinated"
    description: "You have been killed"
    trigger: "prolongedInstability AND random()"
    probability: 0.1  # Per turn when conditions met
    conditions:
      - "palestinianLevel == intifada"
      - "turnsAtIntifada >= 6"
    endingNarrative: "Like your predecessor, you fall to an assassin's bullet..."
```

---

## 10. Data Files Summary

```
data/
├── settings.yaml          # Difficulty levels, scenarios
├── countries.yaml         # All country definitions
├── enums.yaml            # Relationship levels, stances, etc.
├── weapons.yaml          # Arms catalog and vendors
├── nuclear.yaml          # Nuclear program rules
├── palestinian.yaml      # Palestinian problem rules
├── scoring.yaml          # End-game scoring rules
├── leaders.yaml          # Leader personality traits
├── combat.yaml           # War resolution rules
├── ai_decisions.yaml     # Opponent AI decision trees
├── events.yaml           # Event categories and triggers
├── prompts.yaml          # AI prompt templates
├── music.yaml            # Sound system configuration
├── ui.yaml               # UI component specifications
│
└── scenarios/
    ├── classic_1997.yaml # Default scenario starting state
    ├── six_day_1967.yaml # Future: historical scenario
    └── modern_2024.yaml  # Future: modern day scenario
```

---

## 11. Open Design Notes

1. **Save System:** Auto-save each turn to localStorage. Export/import as JSON file for backup.

2. **Tutorial:** First-time players get guided tooltips for first 3 turns. Can be disabled.

3. **Achievements:** Track interesting playthroughs (win without violence, win with only nukes, etc.)

4. **Statistics:** Track across all games - total wars won, countries defeated, etc.

5. **Mod Support:** Since all data is YAML, players can create custom scenarios by providing data files.

---

*End of Game Design Document v1.0*
