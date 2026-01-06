# Conflict: Middle East Political Simulator — Weapons Detail Design

**Version:** 1.0  
**Last Updated:** January 2026  
**Purpose:** Detailed weapon specifications, 3D asset requirements, and educational content

---

## 1. 3D Turntable Display System

### 1.1 Concept Overview

When purchasing weapons, players see a full 3D rotating display of the actual weapon system. This serves multiple purposes:
- **Visual appeal** — Modern, premium feel
- **Educational value** — Learn about real military hardware
- **Differentiation** — Clearly distinguish between weapon types
- **Immersion** — Feel the weight of military decisions

### 1.2 Turntable UI Layout (Portrait Mode)

```
┌─────────────────────────────────────┐
│  VENDOR TAB BAR                     │
│  [USA] [UK] [France] [Black Market] │
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────────────┐     │
│     │                         │     │
│     │    3D MODEL VIEWPORT    │     │
│     │    (Touch to rotate)    │     │
│     │                         │     │
│     │   [Auto-rotate: ON]     │     │
│     └─────────────────────────┘     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ F-15C Eagle                 │    │
│  │ ★★★★☆ Combat Rating         │    │
│  │ $12,000,000 per unit        │    │
│  │ [ℹ️ Learn More]             │    │
│  └─────────────────────────────┘    │
│                                     │
│  STATS BAR:                         │
│  Air-Air: ████████░░ 80%            │
│  Air-Gnd: ██████░░░░ 60%            │
│  Speed:   █████████░ 90%            │
│  Range:   ███████░░░ 70%            │
│                                     │
│  QUANTITY: [-] 2 [+]                │
│  TOTAL: $24,000,000                 │
│                                     │
│  [PURCHASE]                         │
│                                     │
│  ──────────────────────────────     │
│  WEAPON CAROUSEL (horizontal)       │
│  [Tank][Tank][Heli][SAM][Jet]       │
└─────────────────────────────────────┘
```

### 1.3 3D Viewport Specifications

| Property | Value |
|----------|-------|
| Viewport Size | Full width × 300px (portrait) |
| Background | Gradient: #1a1a2e → #0f3460 |
| Lighting | 3-point: Key, Fill, Rim |
| Ground | Subtle circular platform with vendor logo |
| Camera | Perspective, 45° FOV |
| Auto-rotate | 0.5 RPM, clockwise |
| Touch Control | Drag to orbit, pinch to zoom |
| Model Scale | Fit to 80% of viewport |

### 1.4 Technical Implementation

**Option A: Three.js / React Three Fiber**
```typescript
// Example component structure
<Canvas>
  <PresentationControls>
    <Stage environment="city" intensity={0.5}>
      <WeaponModel url={`/models/${weaponId}.glb`} />
    </Stage>
  </PresentationControls>
  <OrbitControls autoRotate autoRotateSpeed={0.5} />
</Canvas>
```

**Option B: Pre-rendered Sprite Sheets**
- 36 frames per weapon (10° increments)
- CSS animation for rotation
- Lower quality but faster loading
- Fallback for low-end devices

**Recommended:** Three.js with GLTF models, fallback to sprite sheets

### 1.5 "Learn More" Modal

When player taps "Learn More":

```
┌─────────────────────────────────────┐
│  ← Back                             │
├─────────────────────────────────────┤
│                                     │
│     [3D MODEL - smaller]            │
│                                     │
├─────────────────────────────────────┤
│  F-15C EAGLE                        │
│  Air Superiority Fighter            │
│                                     │
│  The F-15 Eagle is an American      │
│  twin-engine, all-weather tactical  │
│  fighter designed to gain and       │
│  maintain air superiority...        │
│  [Read more: 2-3 paragraphs]        │
│                                     │
│  ─────────────────────────────      │
│  SPECIFICATIONS                     │
│  • Max Speed: Mach 2.5              │
│  • Range: 3,450 mi                  │
│  • Armament: AIM-7, AIM-9, AIM-120  │
│  • First Flight: 1972               │
│  • In Service: 1976-present         │
│                                     │
│  ─────────────────────────────      │
│  IN-GAME STATS                      │
│  • Combat Value: 8                  │
│  • Counters: Helicopters, MiGs      │
│  • Countered by: SAM batteries      │
│                                     │
│  [🔗 Wikipedia Article]             │
│  [CLOSE]                            │
└─────────────────────────────────────┘
```

---

## 2. Weapon Categories

### 2.1 Category Overview

| Category | Role | Example |
|----------|------|---------|
| Light Armor | Cheap, fast, expendable | M60 Patton |
| Main Battle Tank | Heavy armor, firepower | Merkava Mk.3 |
| Attack Helicopter | Tank killer | AH-64 Apache |
| Air Defense | Anti-aircraft | MIM-104 Patriot |
| Fighter Aircraft | Air superiority, strikes | F-15 Eagle |
| SEAD Aircraft | Destroy enemy SAMs | F-4G Wild Weasel |
| Infantry | Occupation, policing | Brigade |

---

## 3. USA Vendor Weapons

### 3.1 M60A3 Patton (Light Tank Category)

**In-Game Role:** Entry-level tank, cheap and available

```yaml
weapon:
  id: "m60a3_patton"
  name: "M60A3 Patton"
  vendor: "usa"
  category: "light_armor"
  unlockRequirement: 0  # Always available
  
  cost: 1200000  # $1.2M per unit
  combatValue: 2
  
  counters: []
  counteredBy: ["t72", "ah64_apache", "main_battle_tank"]
  
  stats:
    armor: 40
    firepower: 50
    speed: 60
    range: 40
```

**Historical Summary:**
> The M60 Patton is an American second-generation main battle tank that entered service in 1960. By the 1990s, the M60A3 variant remained in widespread use, featuring improved fire control, thermal sights, and laser rangefinder. While superseded in US service by the M1 Abrams, the M60 remained a capable and cost-effective option for export customers. Israel operated modified M60s (Magach) extensively through the 1990s.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 52 tonnes |
| Main Gun | 105mm M68 rifled |
| Engine | 750 hp Continental AVDS-1790 |
| Max Speed | 48 km/h |
| Range | 500 km |
| Crew | 4 |

**Wikipedia:** https://en.wikipedia.org/wiki/M60_tank

**3D Model Requirements:**
- Poly count: 15,000-25,000
- Texture: 2K diffuse, normal, roughness
- Details: Reactive armor blocks, commander's cupola, thermal sleeve

---

### 3.2 M1A1 Abrams (Main Battle Tank Category)

**In-Game Role:** Premium US tank, best protection

```yaml
weapon:
  id: "m1a1_abrams"
  name: "M1A1 Abrams"
  vendor: "usa"
  category: "main_battle_tank"
  unlockRequirement: 10  # After 10 USA purchases
  
  cost: 4500000  # $4.5M per unit
  combatValue: 6
  
  counters: ["light_armor", "t72"]
  counteredBy: ["ah64_apache", "atgm"]
  
  stats:
    armor: 95
    firepower: 90
    speed: 75
    range: 50
```

**Historical Summary:**
> The M1 Abrams is America's premier main battle tank, first entering service in 1980. The M1A1 variant (1985) introduced the 120mm smoothbore gun and improved armor incorporating depleted uranium. Its gas turbine engine provides exceptional power but high fuel consumption. The M1A1 proved devastating in the 1991 Gulf War, dominating Iraqi T-72s. By 1997, it represented the pinnacle of Western tank technology.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 57 tonnes |
| Main Gun | 120mm M256 smoothbore |
| Engine | 1,500 hp Honeywell AGT1500 |
| Max Speed | 67 km/h |
| Range | 426 km |
| Crew | 4 |

**Wikipedia:** https://en.wikipedia.org/wiki/M1_Abrams

**3D Model Requirements:**
- Poly count: 20,000-30,000
- Texture: 2K with desert camo variant
- Details: Reactive armor, external fuel drums, mine plow mount points

---

### 3.3 AH-64A Apache (Attack Helicopter Category)

**In-Game Role:** Tank destroyer, signature US attack helicopter

```yaml
weapon:
  id: "ah64_apache"
  name: "AH-64A Apache"
  vendor: "usa"
  category: "attack_helicopter"
  unlockRequirement: 15  # After 15 USA purchases
  hebrewName: "Peten"  # Israeli designation
  
  cost: 15000000  # $15M per unit
  combatValue: 7
  
  counters: ["light_armor", "main_battle_tank", "apc"]
  counteredBy: ["sam_battery", "fighter_aircraft", "manpads"]
  
  stats:
    armor: 30
    firepower: 85
    speed: 65
    range: 60
```

**Historical Summary:**
> The AH-64 Apache is the US Army's primary attack helicopter, designed specifically to destroy armor in all weather conditions. Israel was the first country outside the US to receive Apaches, with deliveries beginning September 1990. Israeli Apaches (designated "Peten" - Cobra) saw extensive use in Lebanon against Hezbollah. Armed with Hellfire missiles, the Apache can destroy tanks from beyond their engagement range.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | 293 km/h |
| Range | 476 km |
| Ceiling | 6,400 m |
| Armament | 30mm M230 chain gun, 16× AGM-114 Hellfire, 76× Hydra 70 rockets |
| Crew | 2 (Pilot, Co-pilot/Gunner) |
| Engine | 2× GE T700-GE-701 (1,690 shp each) |

**Wikipedia:** https://en.wikipedia.org/wiki/Boeing_AH-64_Apache

**3D Model Requirements:**
- Poly count: 25,000-35,000
- Texture: 2K with olive drab and desert variants
- Details: Rotor animation, Hellfire missiles, target acquisition system

---

### 3.4 MIM-104 Patriot (SAM Battery Category)

**In-Game Role:** Primary air defense system

```yaml
weapon:
  id: "mim104_patriot"
  name: "MIM-104 Patriot"
  vendor: "usa"
  category: "sam_battery"
  unlockRequirement: 12
  
  cost: 4000000  # $4M per battery (includes launcher + missiles)
  combatValue: 5
  
  counters: ["fighter_aircraft", "attack_helicopter", "cruise_missile"]
  counteredBy: ["sead_aircraft", "anti_radiation_missile"]
  
  stats:
    armor: 10
    firepower: 75
    speed: 0  # Static
    range: 95
```

**Historical Summary:**
> The MIM-104 Patriot is a surface-to-air missile system that gained fame during the 1991 Gulf War for its role against Iraqi Scud missiles. Israel received Patriot batteries during the Gulf War to defend against Scud attacks. While its anti-ballistic missile effectiveness was later questioned, the Patriot remains highly effective against aircraft. The system uses phased-array radar for tracking multiple targets simultaneously.

**Specifications:**
| Spec | Value |
|------|-------|
| Range | 70-160 km (depending on variant) |
| Altitude | 24 km |
| Speed | Mach 5 |
| Guidance | Track-via-missile |
| Missiles per Launcher | 4 |
| Reload Time | 30 minutes |

**Wikipedia:** https://en.wikipedia.org/wiki/MIM-104_Patriot

**3D Model Requirements:**
- Poly count: 20,000-30,000 (launcher + radar vehicle)
- Texture: 2K olive drab
- Details: Rotating radar array, missile canisters, support vehicles

---

### 3.5 F-15C Eagle (Fighter Aircraft Category)

**In-Game Role:** Air superiority fighter, can conduct strikes

```yaml
weapon:
  id: "f15c_eagle"
  name: "F-15C Eagle"
  vendor: "usa"
  category: "fighter_aircraft"
  unlockRequirement: 20  # Premium unlock
  hebrewName: "Baz"  # Israeli designation
  
  cost: 30000000  # $30M per unit
  combatValue: 9
  canAirstrike: true
  
  counters: ["fighter_aircraft", "attack_helicopter", "mig29"]
  counteredBy: ["sam_battery", "s300"]
  
  stats:
    armor: 20
    firepower: 95
    speed: 100
    range: 85
```

**Historical Summary:**
> The F-15 Eagle is a twin-engine air superiority fighter with an undefeated air-to-air combat record (104 kills, 0 losses). Israel has operated F-15s since 1976 (designated "Baz" - Falcon) and has achieved more kills with the type than any other nation. The F-15 excels in beyond-visual-range combat with its powerful APG-63 radar. Israeli F-15s conducted the 1981 strike on Iraq's Osirak nuclear reactor.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 2.5 (2,665 km/h) |
| Range | 5,550 km (ferry) |
| Ceiling | 20,000 m |
| Armament | 20mm M61 Vulcan, 8× AIM-7/AIM-120, 4× AIM-9 |
| Crew | 1 |
| Engine | 2× P&W F100-PW-220 (23,770 lbf each) |

**Wikipedia:** https://en.wikipedia.org/wiki/McDonnell_Douglas_F-15_Eagle

**3D Model Requirements:**
- Poly count: 30,000-40,000
- Texture: 2K with IAF gray camo
- Details: Conformal fuel tanks, missile loadout, afterburner glow effect

---

### 3.6 F-16C Fighting Falcon (Fighter Aircraft - Multirole)

**In-Game Role:** Versatile fighter-bomber, best value

```yaml
weapon:
  id: "f16c_falcon"
  name: "F-16C Fighting Falcon"
  vendor: "usa"
  category: "fighter_aircraft"
  unlockRequirement: 8
  hebrewName: "Barak"  # Israeli designation
  
  cost: 18000000  # $18M per unit
  combatValue: 7
  canAirstrike: true
  
  counters: ["attack_helicopter", "light_armor"]
  counteredBy: ["sam_battery", "f15c_eagle"]
  
  stats:
    armor: 15
    firepower: 80
    speed: 90
    range: 70
```

**Historical Summary:**
> The F-16 Fighting Falcon is the world's most successful fourth-generation fighter, with over 4,600 built. Israel operates the largest F-16 fleet outside the US (designated "Barak" - Lightning), using them extensively for ground attack missions. The F-16's fly-by-wire controls and bubble canopy give exceptional maneuverability and visibility. Israeli F-16s destroyed Iraq's Osirak reactor in 1981 and Syria's Al-Kibar reactor in 2007.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 2.0 (2,120 km/h) |
| Range | 4,220 km (ferry) |
| Ceiling | 15,240 m |
| Armament | 20mm M61 Vulcan, 6× AIM-120, 2× AIM-9, various bombs |
| Crew | 1 |
| Engine | 1× GE F110-GE-100 (28,984 lbf) |

**Wikipedia:** https://en.wikipedia.org/wiki/General_Dynamics_F-16_Fighting_Falcon

**3D Model Requirements:**
- Poly count: 25,000-35,000
- Texture: 2K with Israeli desert camo
- Details: Conformal fuel tanks, targeting pod, full weapons loadout

---

### 3.7 F-4G Wild Weasel (SEAD Aircraft Category)

**In-Game Role:** Suppression of Enemy Air Defenses

```yaml
weapon:
  id: "f4g_wild_weasel"
  name: "F-4G Wild Weasel"
  vendor: "usa"
  category: "sead_aircraft"
  unlockRequirement: 25  # Late-game unlock
  
  cost: 22000000  # $22M per unit
  combatValue: 6
  canAirstrike: true
  
  counters: ["sam_battery", "radar_site", "s300"]
  counteredBy: ["fighter_aircraft"]
  
  bonusVsSAM: 2.0  # Double effectiveness vs air defense
  
  stats:
    armor: 25
    firepower: 70
    speed: 85
    range: 75
```

**Historical Summary:**
> The F-4G Wild Weasel is a specialized variant of the F-4 Phantom designed to locate and destroy enemy radar and SAM sites using anti-radiation missiles. The "Wild Weasel" mission is among the most dangerous in aerial warfare, requiring crews to deliberately fly toward enemy air defenses. Israel operated F-4E Phantoms but developed similar SEAD capabilities. The F-4G was retired in 1996 but represents the pinnacle of dedicated SEAD aircraft.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 2.2 |
| Range | 2,600 km |
| Armament | AGM-88 HARM, AGM-78 Standard ARM, AIM-7 |
| Crew | 2 |
| Special Equipment | APR-38/47 radar warning receiver |

**Wikipedia:** https://en.wikipedia.org/wiki/McDonnell_Douglas_F-4_Phantom_II#F-4G_Wild_Weasel_V

**3D Model Requirements:**
- Poly count: 25,000-35,000
- Texture: 2K Southeast Asia camo
- Details: HARM missiles, distinctive antenna arrays

---

## 4. UK Vendor Weapons

### 4.1 Chieftain Mk.11 (Light Tank Category)

**In-Game Role:** Reliable, well-armored budget tank

```yaml
weapon:
  id: "chieftain_mk11"
  name: "Chieftain Mk.11"
  vendor: "uk"
  category: "light_armor"
  unlockRequirement: 0
  
  cost: 1000000  # $1M per unit
  combatValue: 2
  
  counters: []
  counteredBy: ["main_battle_tank", "attack_helicopter"]
  
  stats:
    armor: 55
    firepower: 45
    speed: 35
    range: 35
```

**Historical Summary:**
> The Chieftain was Britain's main battle tank from the 1960s to the 1990s, renowned for its powerful 120mm rifled gun and heavy armor. While slower than contemporaries, its firepower was unmatched until the Leopard 2 and M1 Abrams arrived. Iran and Jordan operated Chieftains extensively. By 1997, surplus Chieftains were available at reduced prices as nations upgraded to Challenger 2.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 55 tonnes |
| Main Gun | 120mm L11A5 rifled |
| Engine | 750 hp Leyland L60 |
| Max Speed | 48 km/h |
| Range | 400 km |
| Crew | 4 |

**Wikipedia:** https://en.wikipedia.org/wiki/Chieftain_(tank)

---

### 4.2 Challenger 1 (Main Battle Tank Category)

**In-Game Role:** Heavy British tank, excellent protection

```yaml
weapon:
  id: "challenger_1"
  name: "Challenger 1"
  vendor: "uk"
  category: "main_battle_tank"
  unlockRequirement: 8
  
  cost: 4000000  # $4M per unit
  combatValue: 5
  
  counters: ["light_armor", "t72"]
  counteredBy: ["ah64_apache"]
  
  stats:
    armor: 90
    firepower: 85
    speed: 55
    range: 45
```

**Historical Summary:**
> The Challenger 1 was developed from the Iranian Shir 2 project after the 1979 revolution canceled that order. Entering British service in 1983, it featured Chobham composite armor, making it one of the best-protected tanks of its era. Challenger 1s saw action in the 1991 Gulf War, achieving the longest tank-on-tank kill in history (4.7 km). Jordan purchased Challenger 1s, designating them Al-Hussein.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 62 tonnes |
| Main Gun | 120mm L11A5 rifled |
| Engine | 1,200 hp Perkins CV12 |
| Max Speed | 56 km/h |
| Range | 450 km |
| Crew | 4 |

**Wikipedia:** https://en.wikipedia.org/wiki/Challenger_1

---

### 4.3 Westland Lynx AH.7 (Attack Helicopter Category)

**In-Game Role:** Light anti-tank helicopter

```yaml
weapon:
  id: "lynx_ah7"
  name: "Westland Lynx AH.7"
  vendor: "uk"
  category: "attack_helicopter"
  unlockRequirement: 10
  
  cost: 8000000  # $8M per unit
  combatValue: 4
  
  counters: ["light_armor", "apc"]
  counteredBy: ["sam_battery", "fighter_aircraft", "manpads"]
  
  stats:
    armor: 20
    firepower: 60
    speed: 80
    range: 50
```

**Historical Summary:**
> The Westland Lynx is a versatile British helicopter used in both army and naval variants. The AH.7 variant carries TOW anti-tank missiles and was used extensively by British forces. Smaller and more agile than the Apache, the Lynx excels in the European theater but has shorter range. Several Middle Eastern nations have operated Lynx variants.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | 324 km/h (world record holder) |
| Range | 528 km |
| Armament | 8× TOW missiles, 20mm cannon |
| Crew | 2 |

**Wikipedia:** https://en.wikipedia.org/wiki/Westland_Lynx

---

### 4.4 Rapier FSC (SAM Battery Category)

**In-Game Role:** Point defense SAM system

```yaml
weapon:
  id: "rapier_fsc"
  name: "Rapier FSC"
  vendor: "uk"
  category: "sam_battery"
  unlockRequirement: 6
  
  cost: 2500000  # $2.5M per battery
  combatValue: 3
  
  counters: ["attack_helicopter", "low_flying_aircraft"]
  counteredBy: ["sead_aircraft", "standoff_weapons"]
  
  stats:
    armor: 5
    firepower: 55
    speed: 0
    range: 60
```

**Historical Summary:**
> The Rapier is a British short-range surface-to-air missile system designed to defend high-value targets from low-flying aircraft. The FSC (Field Standard C) variant added improved tracking and all-weather capability. Used by British forces in the Falklands War with mixed results. Iran, Oman, and other Middle Eastern nations operate Rapier systems.

**Specifications:**
| Spec | Value |
|------|-------|
| Range | 8 km |
| Altitude | 3 km |
| Speed | Mach 2.5 |
| Missiles per Launcher | 4 |

**Wikipedia:** https://en.wikipedia.org/wiki/Rapier_(missile)

---

### 4.5 Panavia Tornado GR.1 (Fighter Aircraft Category)

**In-Game Role:** Strike aircraft, ground attack specialist

```yaml
weapon:
  id: "tornado_gr1"
  name: "Panavia Tornado GR.1"
  vendor: "uk"
  category: "fighter_aircraft"
  unlockRequirement: 15
  
  cost: 25000000  # $25M per unit
  combatValue: 6
  canAirstrike: true
  
  counters: ["ground_targets", "infrastructure"]
  counteredBy: ["sam_battery", "fighter_aircraft"]
  
  bonusVsGround: 1.5  # Excellent ground attack
  
  stats:
    armor: 25
    firepower: 85
    speed: 85
    range: 80
```

**Historical Summary:**
> The Panavia Tornado is a multinational (UK, Germany, Italy) swing-wing combat aircraft. The GR.1 variant is optimized for low-level strike missions, using terrain-following radar to penetrate enemy defenses. Tornados conducted the most dangerous missions of the 1991 Gulf War, attacking Iraqi airfields at extremely low altitude. Saudi Arabia operates a large Tornado fleet.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 2.2 |
| Range | 3,890 km |
| Armament | 2× 27mm Mauser, JP233, Paveway LGBs, ALARM |
| Crew | 2 |

**Wikipedia:** https://en.wikipedia.org/wiki/Panavia_Tornado

---

## 5. France Vendor Weapons

*Note: France historically has no embargo policy and will sell to any buyer*

### 5.1 AMX-30B2 (Light Tank Category)

**In-Game Role:** Affordable French tank

```yaml
weapon:
  id: "amx30b2"
  name: "AMX-30B2"
  vendor: "france"
  category: "light_armor"
  unlockRequirement: 0
  
  cost: 1100000  # $1.1M per unit
  combatValue: 2
  
  counters: []
  counteredBy: ["main_battle_tank", "attack_helicopter"]
  
  stats:
    armor: 35
    firepower: 55
    speed: 65
    range: 45
```

**Historical Summary:**
> The AMX-30 was France's main battle tank from 1966, designed with mobility and firepower prioritized over armor. The B2 variant (1982) added improved fire control and thermal imaging. Lighter than NATO contemporaries, the AMX-30 excels in desert conditions. Saudi Arabia, UAE, Qatar, and other Gulf states have operated AMX-30s extensively.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 36 tonnes |
| Main Gun | 105mm CN-105-F1 |
| Engine | 720 hp Hispano-Suiza HS-110 |
| Max Speed | 65 km/h |
| Range | 600 km |

**Wikipedia:** https://en.wikipedia.org/wiki/AMX-30

---

### 5.2 Leclerc (Main Battle Tank Category)

**In-Game Role:** Modern French MBT, autoloader

```yaml
weapon:
  id: "leclerc"
  name: "AMX-56 Leclerc"
  vendor: "france"
  category: "main_battle_tank"
  unlockRequirement: 5
  
  cost: 5500000  # $5.5M per unit
  combatValue: 6
  
  counters: ["light_armor", "t72"]
  counteredBy: ["ah64_apache"]
  
  stats:
    armor: 85
    firepower: 90
    speed: 80
    range: 55
```

**Historical Summary:**
> The Leclerc is France's third-generation main battle tank, entering service in 1992. Distinguished by its autoloader (reducing crew to 3) and advanced electronics, the Leclerc was the most modern Western tank of the 1990s. UAE became the primary export customer. The Leclerc's GIAT 120mm gun can fire both NATO standard rounds and French-specific munitions.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 56 tonnes |
| Main Gun | 120mm CN120-26 smoothbore |
| Engine | 1,500 hp SACM V8X-1500 |
| Max Speed | 71 km/h |
| Rate of Fire | 12 rounds/minute (autoloader) |
| Crew | 3 |

**Wikipedia:** https://en.wikipedia.org/wiki/Leclerc_tank

---

### 5.3 Eurocopter Tiger HAP (Attack Helicopter Category)

**In-Game Role:** Modern European attack helicopter

```yaml
weapon:
  id: "tiger_hap"
  name: "Eurocopter Tiger HAP"
  vendor: "france"
  category: "attack_helicopter"
  unlockRequirement: 8
  
  cost: 12000000  # $12M per unit
  combatValue: 5
  
  counters: ["light_armor", "attack_helicopter"]
  counteredBy: ["sam_battery", "fighter_aircraft"]
  
  stats:
    armor: 25
    firepower: 70
    speed: 75
    range: 55
```

**Historical Summary:**
> The Eurocopter Tiger is a Franco-German attack helicopter that began development in 1984 and entered service in 2003. The HAP (Hélicoptère d'Appui Protection) variant focuses on fire support and escort missions. While not available in 1997, the Tiger represents France's commitment to independent helicopter capability. For game purposes, represents advanced French rotorcraft.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | 290 km/h |
| Range | 800 km |
| Armament | 30mm GIAT cannon, Mistral AAMs, HOT ATGMs |
| Crew | 2 |

**Wikipedia:** https://en.wikipedia.org/wiki/Eurocopter_Tiger

---

### 5.4 Crotale NG (SAM Battery Category)

**In-Game Role:** Mobile French SAM

```yaml
weapon:
  id: "crotale_ng"
  name: "Crotale NG"
  vendor: "france"
  category: "sam_battery"
  unlockRequirement: 4
  
  cost: 3000000  # $3M per battery
  combatValue: 4
  
  counters: ["attack_helicopter", "cruise_missile", "low_flying_aircraft"]
  counteredBy: ["sead_aircraft"]
  
  stats:
    armor: 10
    firepower: 65
    speed: 50  # Mobile
    range: 70
```

**Historical Summary:**
> The Crotale is a French all-weather short-range SAM system, designed to counter low-flying threats. The NG (Nouvelle Génération) variant introduced in the 1990s features improved missiles and radar. South Africa developed a variant called Umkhonto. Saudi Arabia, UAE, and other Gulf states operate Crotale systems. Its mobility makes it difficult to suppress.

**Specifications:**
| Spec | Value |
|------|-------|
| Range | 11 km |
| Altitude | 6 km |
| Speed | Mach 3.5 |
| Missiles per Vehicle | 8 |

**Wikipedia:** https://en.wikipedia.org/wiki/Crotale_(missile)

---

### 5.5 Dassault Mirage 2000C (Fighter Aircraft Category)

**In-Game Role:** Versatile delta-wing fighter

```yaml
weapon:
  id: "mirage_2000c"
  name: "Dassault Mirage 2000C"
  vendor: "france"
  category: "fighter_aircraft"
  unlockRequirement: 3  # Low unlock - France sells easily
  
  cost: 23000000  # $23M per unit
  combatValue: 7
  canAirstrike: true
  
  counters: ["attack_helicopter", "older_fighters"]
  counteredBy: ["f15c_eagle", "sam_battery"]
  
  stats:
    armor: 15
    firepower: 80
    speed: 95
    range: 65
```

**Historical Summary:**
> The Mirage 2000 is Dassault's fourth-generation delta-wing fighter, entering service in 1984. It combines the classic Mirage delta-wing design with fly-by-wire controls and modern avionics. The "C" variant is optimized for air defense. India, UAE, Greece, Taiwan, and Egypt all operate Mirage 2000s. France's willingness to sell without political strings made the Mirage popular with nations unable to purchase American aircraft.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 2.2 |
| Range | 3,335 km |
| Armament | 2× 30mm DEFA, Super 530, Magic 2, various bombs |
| Crew | 1 |
| Engine | SNECMA M53-P2 (21,400 lbf) |

**Wikipedia:** https://en.wikipedia.org/wiki/Dassault_Mirage_2000

---

### 5.6 Dassault Mirage F1 (Fighter Aircraft - Budget)

**In-Game Role:** Older but affordable fighter

```yaml
weapon:
  id: "mirage_f1"
  name: "Dassault Mirage F1"
  vendor: "france"
  category: "fighter_aircraft"
  unlockRequirement: 0  # Always available
  
  cost: 12000000  # $12M per unit (older aircraft, cheaper)
  combatValue: 5
  canAirstrike: true
  
  counters: ["older_fighters"]
  counteredBy: ["f15c_eagle", "f16c_falcon", "mig29"]
  
  stats:
    armor: 15
    firepower: 65
    speed: 85
    range: 55
```

**Historical Summary:**
> The Mirage F1 broke from Dassault's delta-wing tradition with a conventional swept wing, improving low-speed handling and reducing runway requirements. Entering service in 1973, it was exported to over a dozen nations including Iraq (which used them against Iran), Libya, Morocco, and Jordan. By 1997, the F1 was aging but remained effective and affordable. Iraq's Mirage F1s famously attacked USS Stark in 1987.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 2.2 |
| Range | 2,150 km |
| Armament | 2× 30mm DEFA, R.530/Super 530, Magic |
| Crew | 1 |

**Wikipedia:** https://en.wikipedia.org/wiki/Dassault_Mirage_F1

---

## 6. Black Market (Soviet) Vendor Weapons

*Note: Soviet equipment via third-party dealers (historically South Africa, Eastern Europe). Slower delivery, no political strings*

### 6.1 T-62M (Light Tank Category)

**In-Game Role:** Cheap Soviet tank, available immediately

```yaml
weapon:
  id: "t62m"
  name: "T-62M"
  vendor: "black_market"
  category: "light_armor"
  unlockRequirement: 0
  deliveryDelay: 1  # 1 month delay
  
  cost: 600000  # $600K per unit - very cheap
  combatValue: 2
  
  counters: []
  counteredBy: ["m1a1_abrams", "ah64_apache", "main_battle_tank"]
  
  stats:
    armor: 45
    firepower: 50
    speed: 50
    range: 40
```

**Historical Summary:**
> The T-62 was the Soviet Union's main battle tank from 1961, introducing the world's first smoothbore tank gun (115mm). The "M" variant added appliqué armor and improved fire control. Exported massively to Soviet allies, T-62s served with Egypt, Syria, Iraq, and Libya. While obsolete against modern Western tanks, the T-62 remains effective against infantry and light vehicles. Huge stockpiles make them extremely cheap on the black market.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 40 tonnes |
| Main Gun | 115mm U-5TS smoothbore |
| Engine | 580 hp V-55 diesel |
| Max Speed | 50 km/h |
| Crew | 4 |

**Wikipedia:** https://en.wikipedia.org/wiki/T-62

---

### 6.2 T-72M (Main Battle Tank Category)

**In-Game Role:** Export Soviet MBT, best black market tank

```yaml
weapon:
  id: "t72m"
  name: "T-72M"
  vendor: "black_market"
  category: "main_battle_tank"
  unlockRequirement: 5
  deliveryDelay: 2  # 2 month delay
  
  cost: 1800000  # $1.8M per unit
  combatValue: 4
  
  counters: ["light_armor", "apc"]
  counteredBy: ["m1a1_abrams", "challenger_1", "ah64_apache"]
  
  stats:
    armor: 70
    firepower: 75
    speed: 60
    range: 40
```

**Historical Summary:**
> The T-72 is the most-produced post-WWII tank, with over 25,000 built. The "M" export variant features downgraded armor and fire control compared to Soviet Army versions (the "monkey model" phenomenon). T-72Ms performed poorly in the 1991 Gulf War against M1 Abrams tanks, but remain effective against older armor. Syria, Iraq, and Libya all operated large T-72 fleets.

**Specifications:**
| Spec | Value |
|------|-------|
| Weight | 41 tonnes |
| Main Gun | 125mm 2A46 smoothbore |
| Engine | 780 hp V-46-6 diesel |
| Max Speed | 60 km/h |
| Autoloader | Yes (3 crew) |

**Wikipedia:** https://en.wikipedia.org/wiki/T-72

---

### 6.3 Mi-24V Hind (Attack Helicopter Category)

**In-Game Role:** Heavily armored gunship

```yaml
weapon:
  id: "mi24v_hind"
  name: "Mi-24V Hind"
  vendor: "black_market"
  category: "attack_helicopter"
  unlockRequirement: 8
  deliveryDelay: 2
  
  cost: 6000000  # $6M per unit
  combatValue: 4
  
  counters: ["light_armor", "infantry"]
  counteredBy: ["sam_battery", "fighter_aircraft", "ah64_apache"]
  
  stats:
    armor: 40  # Most armored helicopter
    firepower: 65
    speed: 55
    range: 45
```

**Historical Summary:**
> The Mi-24 "Hind" is the Soviet Union's iconic attack helicopter, nicknamed "flying tank" for its heavy armor. Unlike Western attack helicopters, the Mi-24 can carry 8 troops in addition to its weapons. It saw extensive combat in Afghanistan, where its armor proved resistant to machine gun fire. Iraq, Syria, and Libya all operated Mi-24s. While less agile than the Apache, the Hind is extremely rugged.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | 335 km/h |
| Range | 450 km |
| Armament | 12.7mm YakB-12.7, 9M114 Shturm ATGMs, rocket pods |
| Troop Capacity | 8 soldiers |
| Crew | 3 |

**Wikipedia:** https://en.wikipedia.org/wiki/Mil_Mi-24

---

### 6.4 S-300PMU (SAM Battery Category)

**In-Game Role:** Advanced Soviet SAM, extremely dangerous

```yaml
weapon:
  id: "s300pmu"
  name: "S-300PMU"
  vendor: "black_market"
  category: "sam_battery"
  unlockRequirement: 15  # Hard to obtain
  deliveryDelay: 3  # 3 month delay
  
  cost: 8000000  # $8M per battery
  combatValue: 8
  
  counters: ["fighter_aircraft", "cruise_missile", "ballistic_missile"]
  counteredBy: ["sead_aircraft", "stealth_aircraft"]
  
  stats:
    armor: 15
    firepower: 95
    speed: 30  # Semi-mobile
    range: 100
```

**Historical Summary:**
> The S-300 is the Soviet Union's premier long-range SAM system, comparable to the US Patriot. The PMU export variant can engage aircraft at over 150km range and ballistic missiles. Its capability against low-flying cruise missiles and aircraft makes it a game-changer for air defense. Russia has attempted to sell S-300s to Syria and Iran, causing major diplomatic tensions with Israel and the US.

**Specifications:**
| Spec | Value |
|------|-------|
| Range | 150 km (aircraft), 40 km (ballistic missiles) |
| Altitude | 27 km |
| Speed | Mach 6 |
| Missiles per Launcher | 4 |
| Simultaneous Targets | 6 |

**Wikipedia:** https://en.wikipedia.org/wiki/S-300_missile_system

---

### 6.5 MiG-29 Fulcrum (Fighter Aircraft Category)

**In-Game Role:** Agile Soviet dogfighter

```yaml
weapon:
  id: "mig29_fulcrum"
  name: "MiG-29 Fulcrum"
  vendor: "black_market"
  category: "fighter_aircraft"
  unlockRequirement: 10
  deliveryDelay: 2
  
  cost: 22000000  # $22M per unit
  combatValue: 7
  canAirstrike: false  # Air-to-air focused
  
  counters: ["attack_helicopter", "older_fighters"]
  counteredBy: ["f15c_eagle", "sam_battery"]
  
  stats:
    armor: 15
    firepower: 80
    speed: 95
    range: 50  # Short range
```

**Historical Summary:**
> The MiG-29 was designed as the Soviet answer to the F-15 and F-16, optimized for air superiority in the European theater. Its helmet-mounted sight and R-73 missile give exceptional close-range capability. However, limited range and avionics made it inferior to US aircraft in beyond-visual-range combat. Syria sought MiG-29s in the 1990s, and Iraq operated a small number that fled to Iran during the Gulf War.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 2.25 |
| Range | 1,430 km |
| Armament | 30mm GSh-30-1, R-27, R-73 |
| Crew | 1 |
| Engine | 2× Klimov RD-33 (18,300 lbf each) |

**Wikipedia:** https://en.wikipedia.org/wiki/Mikoyan_MiG-29

---

### 6.6 Su-24 Fencer (Fighter Aircraft - Strike)

**In-Game Role:** Soviet strike aircraft

```yaml
weapon:
  id: "su24_fencer"
  name: "Su-24M Fencer"
  vendor: "black_market"
  category: "fighter_aircraft"
  unlockRequirement: 12
  deliveryDelay: 2
  
  cost: 18000000  # $18M per unit
  combatValue: 5
  canAirstrike: true
  
  counters: ["ground_targets", "infrastructure"]
  counteredBy: ["f15c_eagle", "sam_battery"]
  
  bonusVsGround: 1.4
  
  stats:
    armor: 20
    firepower: 75
    speed: 80
    range: 70
```

**Historical Summary:**
> The Su-24 is the Soviet equivalent to the F-111, a variable-geometry strike aircraft designed for low-level penetration bombing. It can carry a massive bomb load and features terrain-following radar. Syria, Libya, and Iraq all operated Su-24s. Russian Su-24s have been used extensively in Syria since 2015. The Fencer is an excellent ground attack platform but vulnerable in air combat.

**Specifications:**
| Spec | Value |
|------|-------|
| Max Speed | Mach 1.35 (low level) |
| Range | 2,775 km |
| Armament | 23mm GSh-6-23, 8,000 kg of bombs/missiles |
| Crew | 2 |

**Wikipedia:** https://en.wikipedia.org/wiki/Sukhoi_Su-24

---

## 7. Israeli Domestic Weapons (Special)

*These weapons represent Israel's domestic production and cannot be purchased - they are the baseline arsenal*

### 7.1 Merkava Mk.3 (Starting Tank)

```yaml
weapon:
  id: "merkava_mk3"
  name: "Merkava Mk.3"
  vendor: "israel_domestic"
  category: "main_battle_tank"
  hebrewName: "Merkava"
  
  cost: 0  # Cannot be purchased
  combatValue: 6
  
  stats:
    armor: 90
    firepower: 85
    speed: 60
    range: 45
```

**Historical Summary:**
> The Merkava ("Chariot") is Israel's indigenous main battle tank, designed with crew survival as the top priority. Unique features include a front-mounted engine (protecting crew), rear door for infantry or casualties, and advanced fire control. The Mk.3 variant (1989) introduced a 120mm gun and improved armor. The Merkava is specifically designed for Israel's defense needs and represents decades of combat experience.

**Wikipedia:** https://en.wikipedia.org/wiki/Merkava

---

### 7.2 IAI Kfir (Starting Fighter)

```yaml
weapon:
  id: "iai_kfir"
  name: "IAI Kfir C.7"
  vendor: "israel_domestic"
  category: "fighter_aircraft"
  hebrewName: "Kfir"  # "Lion Cub"
  
  cost: 0  # Cannot be purchased
  combatValue: 5
  canAirstrike: true
```

**Historical Summary:**
> The Kfir is an Israeli-built fighter based on the Mirage 5 airframe (which France embargoed after 1967) with a US J79 engine. It represents Israel's determination for defense independence. While aging by 1997, the Kfir's upgrade potential kept it relevant. Colombia, Ecuador, and Sri Lanka have operated Kfirs. The aircraft demonstrates Israel's ability to develop indigenous combat aircraft.

**Wikipedia:** https://en.wikipedia.org/wiki/IAI_Kfir

---

## 8. 3D Asset Specifications

### 8.1 Model Requirements Summary

| Weapon | Poly Count | Texture Res | Priority |
|--------|------------|-------------|----------|
| M60A3 Patton | 15K-25K | 2K | High |
| M1A1 Abrams | 20K-30K | 2K | High |
| AH-64 Apache | 25K-35K | 2K | High |
| MIM-104 Patriot | 20K-30K | 2K | Medium |
| F-15C Eagle | 30K-40K | 2K | High |
| F-16C Falcon | 25K-35K | 2K | High |
| F-4G Wild Weasel | 25K-35K | 2K | Low |
| Chieftain | 15K-25K | 2K | Medium |
| Challenger 1 | 20K-30K | 2K | Medium |
| Lynx AH.7 | 20K-30K | 2K | Low |
| Rapier FSC | 15K-20K | 2K | Low |
| Tornado GR.1 | 25K-35K | 2K | Medium |
| AMX-30B2 | 15K-25K | 2K | Medium |
| Leclerc | 20K-30K | 2K | Medium |
| Tiger HAP | 25K-35K | 2K | Low |
| Crotale NG | 15K-20K | 2K | Low |
| Mirage 2000C | 25K-35K | 2K | High |
| Mirage F1 | 20K-30K | 2K | Medium |
| T-62M | 15K-20K | 1K | High |
| T-72M | 18K-25K | 2K | High |
| Mi-24V Hind | 25K-35K | 2K | High |
| S-300PMU | 20K-30K | 2K | Medium |
| MiG-29 | 25K-35K | 2K | High |
| Su-24 Fencer | 25K-35K | 2K | Medium |
| Merkava Mk.3 | 25K-35K | 2K | High |
| IAI Kfir | 20K-30K | 2K | Medium |

### 8.2 3D Asset Sources

**Free/Open Source:**
- Sketchfab (CC licensed models)
- TurboSquid (some free military models)
- CGTrader (occasional free assets)

**Paid:**
- TurboSquid Premium ($50-500 per model)
- CGTrader ($30-300 per model)
- Hum3D military collection

**Custom Commission:**
- Typical cost: $200-1000 per vehicle
- Ensure correct licensing for game use

### 8.3 LOD (Level of Detail) Requirements

Each model should have 3 LOD levels:
- **LOD0** (Full): 100% poly count, for turntable view
- **LOD1** (Medium): 50% poly count, for map icons
- **LOD2** (Low): 25% poly count, for distant view / mobile fallback

---

## 9. Weapon Data File (YAML)

```yaml
# data/weapons.yaml

weapons:
  # === USA VENDOR ===
  
  m60a3_patton:
    id: "m60a3_patton"
    name: "M60A3 Patton"
    vendor: "usa"
    category: "light_armor"
    unlockRequirement: 0
    cost: 1200000
    combatValue: 2
    counters: []
    counteredBy: ["t72", "ah64_apache", "main_battle_tank"]
    model3d: "models/m60a3.glb"
    icon: "icons/m60a3.svg"
    wikipediaUrl: "https://en.wikipedia.org/wiki/M60_tank"
    summary: "Second-generation American MBT, reliable and cost-effective..."
    specs:
      weight: "52 tonnes"
      mainGun: "105mm M68"
      engine: "750 hp Continental"
      maxSpeed: "48 km/h"
      crew: 4
    stats:
      armor: 40
      firepower: 50
      speed: 60
      range: 40
      
  # ... (continue for all weapons)
```

---

## 10. Links Reference Table

| Weapon | Wikipedia URL |
|--------|---------------|
| M60A3 Patton | https://en.wikipedia.org/wiki/M60_tank |
| M1A1 Abrams | https://en.wikipedia.org/wiki/M1_Abrams |
| AH-64 Apache | https://en.wikipedia.org/wiki/Boeing_AH-64_Apache |
| MIM-104 Patriot | https://en.wikipedia.org/wiki/MIM-104_Patriot |
| F-15 Eagle | https://en.wikipedia.org/wiki/McDonnell_Douglas_F-15_Eagle |
| F-16 Falcon | https://en.wikipedia.org/wiki/General_Dynamics_F-16_Fighting_Falcon |
| F-4G Wild Weasel | https://en.wikipedia.org/wiki/McDonnell_Douglas_F-4_Phantom_II |
| Chieftain | https://en.wikipedia.org/wiki/Chieftain_(tank) |
| Challenger 1 | https://en.wikipedia.org/wiki/Challenger_1 |
| Westland Lynx | https://en.wikipedia.org/wiki/Westland_Lynx |
| Rapier | https://en.wikipedia.org/wiki/Rapier_(missile) |
| Tornado | https://en.wikipedia.org/wiki/Panavia_Tornado |
| AMX-30 | https://en.wikipedia.org/wiki/AMX-30 |
| Leclerc | https://en.wikipedia.org/wiki/Leclerc_tank |
| Tiger | https://en.wikipedia.org/wiki/Eurocopter_Tiger |
| Crotale | https://en.wikipedia.org/wiki/Crotale_(missile) |
| Mirage 2000 | https://en.wikipedia.org/wiki/Dassault_Mirage_2000 |
| Mirage F1 | https://en.wikipedia.org/wiki/Dassault_Mirage_F1 |
| T-62 | https://en.wikipedia.org/wiki/T-62 |
| T-72 | https://en.wikipedia.org/wiki/T-72 |
| Mi-24 Hind | https://en.wikipedia.org/wiki/Mil_Mi-24 |
| S-300 | https://en.wikipedia.org/wiki/S-300_missile_system |
| MiG-29 | https://en.wikipedia.org/wiki/Mikoyan_MiG-29 |
| Su-24 | https://en.wikipedia.org/wiki/Sukhoi_Su-24 |
| Merkava | https://en.wikipedia.org/wiki/Merkava |
| IAI Kfir | https://en.wikipedia.org/wiki/IAI_Kfir |

---

*End of Weapons Detail Design v1.0*
