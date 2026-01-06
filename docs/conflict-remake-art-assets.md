# Conflict: Middle East Political Simulator — Art Assets Specification

**Version:** 1.0  
**Last Updated:** January 2026  
**Art Direction:** Modern minimalist with period-appropriate touches (1990s geopolitical aesthetic)

---

## 1. Art Direction Overview

### 1.1 Visual Style

The game should blend:
- **Clean modern UI** — Flat design, clear typography, mobile-friendly touch targets
- **1990s news aesthetic** — Newspaper textures, broadcast graphics feel, Cold War tension
- **Serious tone** — Not cartoonish, but not photorealistic. Think infographics meet strategy game
- **Color-coded clarity** — Relationships and states immediately readable through color

**Reference Games:**
- Crusader Kings 3 (painterly portraits, clean UI)
- Plague Inc. (world map, clean mobile UI)
- Reigns (card-based mobile political game)
- 80 Days (narrative game with illustrated style)

**Reference Non-Games:**
- 1990s CNN/BBC news graphics
- The Economist magazine infographics
- Cold War era propaganda posters (for event imagery)

### 1.2 Color Palette

```
Primary Colors:
- Background Dark:    #1a1a2e (Deep navy)
- Background Medium:  #16213e (Midnight blue)
- Surface:            #0f3460 (Dark slate)
- Accent:             #e94560 (Alert red)
- Text Primary:       #ffffff
- Text Secondary:     #94a3b8

Relationship Spectrum (Green to Red):
- Military Pact:      #22c55e (Bright green)
- Profitable:         #4ade80
- Beneficial:         #86efac
- Favourable:         #fef08a (Yellow)
- Satisfactory:       #fde047
- Cool:               #fdba74 (Orange)
- Lamentable:         #fb923c
- Hostile:            #f87171 (Red)
- War:                #dc2626 (Deep red)

Status Colors:
- Positive:           #22c55e
- Negative:           #ef4444
- Neutral:            #94a3b8
- Warning:            #f59e0b
- Nuclear:            #a855f7 (Purple)
```

---

## 2. UI Components

### 2.1 Core UI Elements

| Asset | Size (px) | Format | Variants | Notes |
|-------|-----------|--------|----------|-------|
| App Icon | 1024×1024 | PNG | iOS, Android, Web | Star of David + mushroom cloud silhouette |
| Splash Screen | 1080×1920 | PNG | Portrait | Game title, atmospheric background |
| Loading Spinner | 64×64 | SVG/Lottie | - | Animated, theme-appropriate |

### 2.2 Navigation & Layout

| Asset | Size | Format | Variants | Notes |
|-------|------|--------|----------|-------|
| Nav Bar Background | Full width × 64 | SVG | - | Subtle gradient or solid |
| Nav Tab Icons | 24×24 | SVG | Active, Inactive × 5 tabs | News, Diplomacy, Intel, Military, Menu |
| Status Bar Background | Full width × 48 | SVG | - | Budget, date display area |
| Action Bar Background | Full width × 56 | SVG | - | Bottom action buttons area |
| Phase Indicator | Variable | SVG | 6 phases | Visual turn progress |

### 2.3 Buttons

| Asset | Size | Format | Variants | Notes |
|-------|------|--------|----------|-------|
| Primary Button | Variable × 48 | SVG | Normal, Pressed, Disabled | Main actions (End Turn, Continue) |
| Secondary Button | Variable × 40 | SVG | Normal, Pressed, Disabled | Secondary actions |
| Danger Button | Variable × 48 | SVG | Normal, Pressed | Destructive actions (Declare War, Nuclear) |
| Icon Button | 44×44 | SVG | Normal, Pressed | Circular icon buttons |
| Toggle Switch | 52×28 | SVG | On, Off | For settings |
| Radio Button | 24×24 | SVG | Selected, Unselected | Policy selection |
| Checkbox | 24×24 | SVG | Checked, Unchecked | Multiple selection |

### 2.4 Cards & Containers

| Asset | Size | Format | Variants | Notes |
|-------|------|--------|----------|-------|
| Country Card | 160×200 | SVG | Normal, Selected, Defeated | Main country display |
| Event Card Background | Full width × 70% | SVG | Crisis, Opportunity, etc. | 6 category variants |
| Weapon Card | 120×160 | SVG | Available, Locked, Purchased | Arms catalog items |
| Bottom Sheet Handle | 40×4 | SVG | - | Drag indicator |
| Modal Background | Full screen | SVG | - | Semi-transparent overlay |
| Tooltip Container | Variable | SVG | - | Info popups |

### 2.5 Progress & Status

| Asset | Size | Format | Variants | Notes |
|-------|------|--------|----------|-------|
| Relationship Bar | 200×8 | SVG | 9 colors | Segmented or gradient |
| Stability Meter | 100×100 | SVG | 6 states | Circular gauge |
| Insurgency Meter | 100×100 | SVG | 6 states | Different visual from stability |
| War Progress Bar | Full width × 24 | SVG | -10 to +10 range | Centered bar |
| Budget Display | Variable | SVG | - | Currency display |
| Nuclear Progress | 120×20 | SVG | 5 stages | Stage indicator |
| Palestinian Unrest | Variable | SVG | 5 levels | Visual thermometer |

---

## 3. Icons

### 3.1 System Icons (24×24 SVG)

**Navigation:**
- `icon-news` — Newspaper
- `icon-diplomacy` — Handshake
- `icon-intelligence` — Eye / Spy
- `icon-military` — Tank / Shield
- `icon-menu` — Hamburger / Gear
- `icon-back` — Left arrow
- `icon-close` — X
- `icon-settings` — Gear

**Actions:**
- `icon-improve` — Arrow up / Plus
- `icon-maintain` — Equals / Horizontal line
- `icon-worsen` — Arrow down / Minus
- `icon-attack` — Crosshair / Target
- `icon-deploy` — Soldiers / Formation
- `icon-purchase` — Shopping cart / Dollar
- `icon-fund` — Money / Coins

**Status:**
- `icon-war` — Crossed swords
- `icon-peace` — Dove / Olive branch
- `icon-pact` — Linked rings
- `icon-nuclear` — Radiation symbol
- `icon-nuclear-ready` — Mushroom cloud
- `icon-unstable` — Warning triangle
- `icon-defeated` — Skull / X
- `icon-embargo` — Blocked / Ban

**Misc:**
- `icon-calendar` — Calendar (turn indicator)
- `icon-budget` — Dollar sign
- `icon-prestige` — Star
- `icon-knesset` — Building / Parliament
- `icon-us-attitude` — US flag simplified
- `icon-un` — UN logo simplified
- `icon-info` — i in circle
- `icon-help` — Question mark

### 3.2 Weapon Icons (48×48 SVG)

Each weapon needs clear silhouette:

| Weapon | Icon Description |
|--------|------------------|
| `weapon-light-tank` | Small tank silhouette, side view |
| `weapon-main-battle-tank` | Larger tank, more detailed |
| `weapon-anti-tank-helicopter` | Attack helicopter silhouette |
| `weapon-sam-battery` | Missile launcher on truck |
| `weapon-fighter-aircraft` | Jet fighter, top-down or side |
| `weapon-anti-sam-helicopter` | Helicopter with missiles |
| `weapon-infantry-brigade` | Soldier silhouettes grouped |
| `weapon-nuclear` | Warhead or mushroom cloud |

### 3.3 Airstrike Target Icons (32×32 SVG)

| Target | Icon Description |
|--------|------------------|
| `target-military` | Tank with crosshair |
| `target-civilian` — City buildings (use cautiously) |
| `target-industrial` — Factory |
| `target-nuclear` — Reactor / Cooling tower |

### 3.4 Diplomatic Stance Icons (24×24 SVG)

| Stance | Icon |
|--------|------|
| `stance-friendly` | Smiling face / Heart |
| `stance-neutral` | Neutral face / Dash |
| `stance-aggressive` | Angry face / Sword |

### 3.5 Leader Trait Icons (20×20 SVG)

For personality display:

| Trait | Icon |
|-------|------|
| `trait-weak` | Wilting plant |
| `trait-moderate` | Balance scale |
| `trait-strong` | Flexed arm |
| `trait-dovish` | Dove |
| `trait-pragmatic` | Chess piece |
| `trait-hawkish` | Hawk/Eagle |
| `trait-cautious` | Shield |
| `trait-calculated` | Calculator / Brain |
| `trait-reckless` | Lightning bolt |

---

## 4. Country Assets

### 4.1 Flags (SVG, multiple sizes)

Required sizes: 16×12, 24×18, 48×36, 96×72

| Country | Notes |
|---------|-------|
| `flag-israel` | Standard flag |
| `flag-egypt` | Standard flag |
| `flag-syria` | Standard flag |
| `flag-jordan` | Standard flag |
| `flag-lebanon` | Standard flag |
| `flag-iraq` | Standard flag |
| `flag-iran` | Standard flag |
| `flag-libya` | Green flag (1977-2011 version for 1997 setting) |
| `flag-usa` | For US relations display |
| `flag-uk` | For arms vendor |
| `flag-france` | For arms vendor |
| `flag-un` | For UN summit |
| `flag-unknown` | Placeholder / defeated |

**Source:** Consider using open-source flag libraries like `flagpack` or `country-flag-icons`

### 4.2 Leader Portraits

**Style Options (choose one):**

**Option A: AI-Generated Portraits**
- Use Midjourney/DALL-E/Stable Diffusion
- Consistent art style across all leaders
- 256×256 base size, displayed smaller
- Style prompt: "Portrait of Middle Eastern political leader, 1990s, painterly, serious expression, [nationality] features, diplomatic setting, official portrait style"

**Option B: Illustrated Portraits**
- Commission artist for consistent style
- Similar to Crusader Kings 3 character art
- Each leader needs: Neutral, Pleased, Angry expressions (optional)

**Option C: Silhouette + Badge**
- Generic human silhouette
- Country badge/icon overlay
- Cheapest option, less immersive

**Required Portraits:**
| Portrait | Description |
|----------|-------------|
| `portrait-egypt-leader` | Egyptian president type |
| `portrait-syria-leader` | Syrian president type |
| `portrait-jordan-leader` | Jordanian king type |
| `portrait-lebanon-leader` | Lebanese PM type |
| `portrait-iraq-leader` | Iraqi dictator type |
| `portrait-iran-leader` | Iranian leader type |
| `portrait-libya-leader` | Libyan leader type |
| `portrait-player` | Israeli PM (optional, for game over) |
| `portrait-us-ambassador` | American diplomat |
| `portrait-un-secretary` | UN official |
| `portrait-advisor-defense` | Israeli defense minister |
| `portrait-advisor-foreign` | Israeli foreign minister |
| `portrait-advisor-intelligence` | Mossad chief |

Size: 256×256 PNG (can be displayed smaller)

### 4.3 Country Shields/Emblems (Optional)

For a more stylized look instead of or alongside flags:
- 64×64 SVG emblems
- Simplified national symbols

---

## 5. Map Assets

### 5.1 Regional Map

**Main Map (SVG, vector for scaling):**

The map should show the Middle East region with:
- Israel (central, small)
- Egypt (southwest)
- Jordan (east)
- Syria (northeast)
- Lebanon (north)
- Iraq (far east, partial)
- Iran (far east, partial)
- Libya (far west, partial)

**Map Variants:**
| Asset | Description |
|-------|-------------|
| `map-base` | Neutral colored territories |
| `map-borders` | Just country outlines |
| `map-terrain` | Optional: terrain features (desert, mountains) |
| `map-cities` | Capital city markers |

**Color System:**
- Countries dynamically colored by relationship level
- Defeated countries grayed out or X'd
- Pulsing indicator for active events
- Troop icons on borders

### 5.2 Map Markers (SVG, 24×24 or scalable)

| Marker | Description |
|--------|-------------|
| `marker-capital` | Star or circle for capital |
| `marker-troops` | Soldier icon for deployed brigade |
| `marker-nuclear` | Radiation symbol (if nuclear program) |
| `marker-mushroom` | Mushroom cloud (if operational nukes) |
| `marker-war` | Crossed swords (active war) |
| `marker-explosion` | For airstrike indicator |
| `marker-defeated` | Skull or X |

### 5.3 Mini Map (Optional)

Simplified version for status bar:
- 120×80 or similar
- Just country shapes with colors
- Current selection highlighted

---

## 6. Event & Narrative Art

### 6.1 Event Category Headers (Full width × 200px)

Atmospheric illustrations for event cards:

| Category | Art Description |
|----------|-----------------|
| `event-header-crisis` | Dark, tense — explosions, smoke, urgent red tones |
| `event-header-opportunity` | Hopeful — sunrise, opening door, golden tones |
| `event-header-diplomatic` | Formal — flags, handshakes, conference rooms |
| `event-header-military` | Action — tanks, jets, soldiers, battlefield |
| `event-header-internal` | Political — Knesset, protests, Israeli imagery |
| `event-header-international` | Global — UN building, world leaders, globe |

**Style:** Could be:
- Illustrated (consistent with portraits)
- Photographic with heavy filters/effects
- Abstract/geometric patterns
- Collage style (newspaper clippings aesthetic)

### 6.2 Advisor Portraits (128×128 PNG)

Smaller portraits for advisor opinions:
| Advisor | Character |
|---------|-----------|
| `advisor-defense` | Stern military type |
| `advisor-foreign` | Diplomatic, refined |
| `advisor-intelligence` | Mysterious, shadowy |

**Expression Variants (optional):**
- Neutral (default)
- Approving
- Disapproving
- Concerned

### 6.3 News Screen Elements

| Asset | Description |
|-------|-------------|
| `newspaper-masthead` | "The Jerusalem Chronicle" or similar |
| `newspaper-texture` | Paper texture overlay |
| `newspaper-border` | Decorative frame |
| `headline-bullet` | Small decorative element |

---

## 7. Animations (Lottie JSON or CSS)

### 7.1 UI Animations

| Animation | Description | Duration |
|-----------|-------------|----------|
| `anim-loading` | Spinning globe or radar sweep | Loop |
| `anim-turn-advance` | Calendar flip or clock tick | 1s |
| `anim-button-press` | Scale down and up | 0.15s |
| `anim-card-flip` | 3D flip for reveals | 0.3s |
| `anim-slide-up` | Bottom sheet entrance | 0.25s |
| `anim-fade-in` | General fade entrance | 0.2s |
| `anim-shake` | Error shake | 0.3s |
| `anim-pulse` | Attention pulse (for alerts) | Loop |

### 7.2 Game Animations

| Animation | Description | Duration |
|-----------|-------------|----------|
| `anim-explosion` | For airstrikes/battles | 1s |
| `anim-nuclear` | Mushroom cloud | 2s |
| `anim-relationship-change` | Bar shifting color | 0.5s |
| `anim-stability-drop` | Meter draining | 0.5s |
| `anim-war-progress` | Progress bar movement | 0.5s |
| `anim-country-defeat` | Territory graying out | 1s |
| `anim-victory` | Celebration effect | 2s |
| `anim-defeat` | Somber effect | 2s |

### 7.3 Map Animations

| Animation | Description |
|-----------|-------------|
| `anim-troops-march` | Small movement on deploy |
| `anim-border-flash` | Tension indicator |
| `anim-nuclear-pulse` | Radiation warning |

---

## 8. Audio Assets

### 8.1 Music Tracks

**Adaptive Music System:**
Music changes based on game state (tension level).

| Track | Mood | Duration | Notes |
|-------|------|----------|-------|
| `music-peaceful-1` | Calm, ambient Middle Eastern | 3-4 min | Oud, soft percussion |
| `music-peaceful-2` | Calm variant | 3-4 min | Different instrumentation |
| `music-tense-1` | Building tension | 3-4 min | Darker, minor key |
| `music-tense-2` | Tense variant | 3-4 min | More percussion |
| `music-wartime-1` | Active conflict | 3-4 min | Urgent, drums |
| `music-wartime-2` | War variant | 3-4 min | Orchestral elements |
| `music-critical-1` | Dire straits | 3-4 min | Ominous, sparse |

**Style References:**
- Homeland TV series soundtrack
- Argo film soundtrack
- Zero Dark Thirty soundtrack
- Traditional Middle Eastern instruments with modern production

### 8.2 Stingers (Short Musical Cues)

| Stinger | Duration | Trigger |
|---------|----------|---------|
| `stinger-war-declared` | 3-5s | War starts |
| `stinger-victory` | 5-7s | War won |
| `stinger-defeat` | 5-7s | War lost |
| `stinger-nuclear` | 5-7s | Nuclear event |
| `stinger-assassination` | 3-5s | Leader killed |
| `stinger-treaty` | 3-5s | Pact signed |
| `stinger-collapse` | 3-5s | Country collapses |
| `stinger-new-turn` | 1-2s | Month advances |

### 8.3 Sound Effects

**UI Sounds:**
| Sound | Description |
|-------|-------------|
| `sfx-button-click` | Standard button press |
| `sfx-button-confirm` | Confirmation/positive action |
| `sfx-button-cancel` | Cancel/back action |
| `sfx-menu-open` | Panel/sheet opening |
| `sfx-menu-close` | Panel/sheet closing |
| `sfx-notification` | Alert/event notification |
| `sfx-error` | Error/blocked action |
| `sfx-toggle` | Switch toggle |
| `sfx-purchase` | Money/transaction |

**Game Sounds:**
| Sound | Description |
|-------|-------------|
| `sfx-airstrike` | Jets, explosions (short) |
| `sfx-troops-deploy` | Marching, military |
| `sfx-war-start` | Dramatic hit |
| `sfx-battle` | Distant combat sounds |
| `sfx-explosion` | Impact, explosion |
| `sfx-nuclear-alarm` | Warning siren |
| `sfx-nuclear-explosion` | Massive explosion |
| `sfx-relationship-up` | Positive chime |
| `sfx-relationship-down` | Negative tone |
| `sfx-stability-drop` | Crumbling/falling |
| `sfx-victory` | Triumphant |
| `sfx-defeat` | Somber |

**Ambient (Optional):**
| Sound | Description |
|-------|-------------|
| `ambient-office` | Subtle office/political atmosphere |
| `ambient-tension` | Low rumble for tense moments |

---

## 9. Typography

### 9.1 Font Families

**Primary Font (UI):**
- **Inter** — Clean, modern, excellent readability
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Free, open source

**Secondary Font (Headlines/Display):**
- **Playfair Display** — Serif, newspaper feel
- Or **Libre Baskerville** — Classic serif
- For newspaper headlines, event titles

**Monospace (Numbers/Data):**
- **JetBrains Mono** or **Fira Code**
- For budget displays, statistics

### 9.2 Type Scale

```
Display:    32px / 40px line-height  (Game title, major headers)
Headline:   24px / 32px              (Screen titles, event titles)
Title:      20px / 28px              (Section headers)
Body:       16px / 24px              (Main content)
Caption:    14px / 20px              (Secondary info)
Label:      12px / 16px              (Small labels, metadata)
```

---

## 10. Asset Delivery Specifications

### 10.1 File Formats

| Asset Type | Format | Notes |
|------------|--------|-------|
| Icons | SVG | Vector, scalable |
| UI Components | SVG | Vector, can be implemented in CSS |
| Flags | SVG | Vector |
| Portraits | PNG | 256×256 base, with transparency |
| Event Headers | PNG/WebP | Compressed, 2x for retina |
| Map | SVG | Vector, interactive |
| Animations | Lottie JSON | Or CSS animations |
| Music | MP3/OGG | 128-192kbps |
| Sound Effects | MP3/OGG/WAV | Short files |

### 10.2 Naming Convention

```
[category]-[name]-[variant].[ext]

Examples:
icon-war-active.svg
flag-egypt-48.svg
portrait-syria-leader-neutral.png
event-header-crisis.png
music-tense-1.mp3
sfx-button-click.mp3
```

### 10.3 Directory Structure

```
assets/
├── icons/
│   ├── nav/
│   ├── actions/
│   ├── status/
│   └── misc/
├── weapons/
├── flags/
├── portraits/
│   ├── leaders/
│   └── advisors/
├── ui/
│   ├── buttons/
│   ├── cards/
│   └── progress/
├── map/
├── events/
├── animations/
├── audio/
│   ├── music/
│   ├── stingers/
│   └── sfx/
└── fonts/
```

---

## 11. Asset Sourcing Options

### 11.1 Free/Open Source Resources

**Icons:**
- Lucide Icons (https://lucide.dev) — MIT license
- Heroicons (https://heroicons.com) — MIT license
- Tabler Icons (https://tabler-icons.io) — MIT license

**Flags:**
- Flagpack (https://flagpack.xyz) — MIT license
- Country Flags (https://github.com/hampusborgos/country-flags) — Public domain

**Fonts:**
- Google Fonts (https://fonts.google.com) — Open Font License
- Font Squirrel (https://fontsquirrel.com) — Various licenses

**Sound Effects:**
- Freesound (https://freesound.org) — Various CC licenses
- Zapsplat (https://zapsplat.com) — Free with attribution

**Music:**
- Incompetech (https://incompetech.com) — CC BY
- Free Music Archive — Various licenses

### 11.2 Paid/Premium Resources

**Icons & UI Kits:**
- Noun Project — Icon subscription
- Iconfinder — Premium icons
- UI8 — UI kits

**Portraits (AI Generation):**
- Midjourney — $10/month
- DALL-E 3 — Pay per use
- Stable Diffusion — Free (self-hosted)

**Music:**
- Artlist — Subscription
- Epidemic Sound — Subscription
- AudioJungle — Per track

**Sound Effects:**
- Soundsnap — Subscription
- Pond5 — Per track

### 11.3 Custom Commission

For consistent quality, consider commissioning:
- **Portrait artist** — $50-200 per portrait
- **Icon designer** — $20-50 per icon set
- **Composer** — $200-500 per track
- **Sound designer** — $100-300 for full SFX pack

---

## 12. Priority & Phases

### Phase 1 (MVP)
Essential assets only:
- [ ] Core UI icons (nav, actions, status)
- [ ] Flags (all countries)
- [ ] Basic UI components (buttons, cards)
- [ ] Placeholder portraits (silhouettes OK)
- [ ] Basic map (country shapes, colors)
- [ ] Essential sound effects (clicks, notifications)

### Phase 2 (Polish)
Enhanced visuals:
- [ ] Leader portraits (AI or illustrated)
- [ ] Event header illustrations
- [ ] Weapon icons
- [ ] Animations (basic)
- [ ] Ambient music (2-3 tracks)

### Phase 3 (Complete)
Full experience:
- [ ] Advisor portraits with expressions
- [ ] Full animation set
- [ ] Complete music system (all moods)
- [ ] All stingers
- [ ] Map polish (terrain, details)

---

*End of Art Assets Specification v1.0*
