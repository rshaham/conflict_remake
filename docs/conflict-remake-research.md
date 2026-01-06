# Conflict: Middle East Political Simulator — Research & Design Decisions

**Version:** 1.0  
**Last Updated:** January 2026  
**Purpose:** Document all research, key design decisions, and resources for future reference

---

## 1. Original Game Research

### 1.1 Game Overview

**Conflict: Middle East Political Simulator** (1990)
- **Developer:** PSI Software
- **Designer:** David J. Eastman (Programming)
- **Graphics & Sound:** Shahid Ahmad
- **Publisher:** Virgin Mastertronic
- **Platforms:** MS-DOS, Atari ST, Amiga (with extended graphics)
- **Release:** 1990
- **Setting:** Hypothetical 1997 (starts with PM assassination)

**Historical Note:** The game eerily predicted the 1995 assassination of Israeli Prime Minister Yitzhak Rabin, having been made in 1990. The cover art for the European version was painted by renowned comic artist Simon Bisley.

### 1.2 Core Mechanics (From Research)

**Turn Structure:**
- Each turn = 1 month
- Phases: News Headlines → Diplomatic Policy → Intelligence/Espionage → Military Actions → End Turn
- Point of no return: Once you enter Military phase, cannot go back

**Win Condition:**
- Defeat all four bordering states (Egypt, Syria, Jordan, Lebanon)
- Victory via military conquest OR political destabilization (government collapse)

**Lose Conditions:**
- Military defeat (Israel conquered)
- Nuclear holocaust (mutual destruction)
- Impeachment (Knesset disapproval too high)
- Assassination (prolonged instability)

**Countries:**
| Country | Borders Israel | Can Develop Nukes | Notes |
|---------|---------------|-------------------|-------|
| Egypt | Yes | Yes | Major power, south |
| Syria | Yes | Yes | Major power, north, often aggressive |
| Jordan | Yes | No | Weaker, often neutral |
| Lebanon | Yes | No | Weakest, often unstable |
| Iraq | No | Yes | Far enemy, can't invade directly |
| Iran | No | Yes | Far enemy, hostile |
| Libya | No | Yes | Far enemy, unpredictable |

### 1.3 Detailed Mechanics (From GameFAQs Guide)

**Nuclear Program:**
- Cost: ~$20M/month to fund
- Progress chance based on remaining budget:
  - >$15M: 40% chance to advance
  - $6-14M: 30% chance
  - $1-5M: 20% chance
  - $0 or negative: 0% chance

**Violence Points (Never Decrease):**
- Airstrike on nuclear installation: +4
- Airstrike on military/civilian: +2
- Invasion: +6
- Nuclear strike: +10
- Each use of hard Palestinian tactics: +3

**Leadership Styles (Evaluated in Order, Last Match Wins):**
1. Dull (default)
2. Violent (11+ violence points)
3. Fascist (21+ violence points)
4. Extreme (complex conditions)
5. Soft (0 violence, good US attitude)
6. Liberal (low violence, various peace indicators)
7. Popular (1-7 violence, high prestige, no concessions)
8. Diplomatic (low violence, Palestinian homeland, army agreement)

**Scoring System:**
- Neighbor defeated: +50-100 points
- Prestige levels: +16 to +160 points
- Months played: +4 per month
- US attitude penalties: -5 to -100 per negative action
- Knesset disapproval: -8 per level

### 1.4 Arms Vendors (From Research)

| Vendor | Will Embargo | Notes |
|--------|-------------|-------|
| USA | Yes | Best equipment, need to build relationship |
| UK | Yes | Good equipment |
| France | No | "Will trade with anyone" |
| Black Market | No | Soviet equipment via South Africa, slower delivery |

- Must buy cheaper items first to unlock better weapons
- Heavy purchases from one vendor can lock out others (except France)

### 1.5 Relationship Levels (Best to Worst)

1. Military Pact
2. Profitable
3. Beneficial
4. Favourable
5. Satisfactory
6. Cool
7. Lamentable
8. Hostile
9. War

Special: "Attack Means Disaster" (MAD state when multiple powers have nukes)

### 1.6 Original Game Interface Elements

From screenshots and descriptions:
- Newspaper headlines screen at turn start
- Country selection menu
- Diplomatic menu (improve/maintain/worsen)
- Intelligence menu (insurgency support)
- Military menu with weapon purchase screen
- War progress display
- UN Summit annual event

**Visual Style (DOS/Amiga):**
- Simple EGA/VGA graphics
- Menu-driven interface
- No music, minimal sound (noted as a weakness in reviews)
- Map showing countries with borders

---

## 2. 2009 Remake Analysis

### 2.1 Overview

A freeware remake by Marco Fera with David Eastman's permission.

**Development Blog:** http://ilfera.blogspot.com/ (may be defunct)

### 2.2 Changes from Original

**Kept:**
- Core turn-based political/military gameplay
- Same region and countries
- Diplomatic, intelligence, military phases

**Changed:**
| Aspect | Original | Remake |
|--------|----------|--------|
| Win Condition | Defeat all neighbors | Get re-elected |
| Military | Buy from vendors + annual brigades | All units produced domestically |
| Electoral | None | Campaign promises, constituency management |
| Leader Personalities | Simple | Strength trait affects behavior |
| Diplomacy | Direct effects | Ripple effects to allies/enemies |

### 2.3 Ideas Worth Borrowing

**✓ Leader Strength/Personality Trait:**
- Weak leaders: erratic, reactive to public opinion, 40% policy flip chance
- Moderate leaders: balanced
- Strong leaders: consistent, hard to influence, 5% policy flip chance

**✓ Diplomatic Ripple Effects:**
- Actions against one country affect relations with their allies/enemies
- More realistic web of consequences

### 2.4 Ideas Rejected

**✗ Re-election Win Condition:**
- Changes tone from survival to popularity contest
- Dilutes the original's realpolitik tension
- User specifically rejected this direction

**✗ Domestic Production:**
- Loses geopolitical tension of vendor relationships
- Embargoes become meaningless
- Less strategic depth

**✗ Electoral Promises / Constituency Management:**
- Adds complexity without matching original's vision
- Shifts focus from external threats to internal politics

---

## 3. Key Design Decisions

### 3.1 Vision Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Win Condition** | Defeat all 4 neighbors (original) | Preserves survival tension |
| **Playable Nation** | Israel only | Focused experience, original design |
| **Time Period** | 1997 default, data-driven scenarios | Flexible for future expansion |
| **Tone** | Serious realpolitik | Matches original, not satirical |
| **Platform** | Web (React), mobile-first portrait | Maximum accessibility |

### 3.2 AI Integration Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Event Generation** | AI-driven (high value) | Emergent narrative, replayability |
| **Opponent Decisions** | Rule-based + 20% AI wildcard | Predictable core with surprises |
| **News Headlines** | Start with templates, AI later | Lower priority, can template |
| **Diplomatic Calculations** | Pure math, no AI | Deterministic is better |
| **Combat Resolution** | Deterministic + dice | Fast, no latency needed |
| **End-Game Narrative** | AI-generated | High value, one-time generation |

**AI Development Pipeline:**
1. Bootstrap training data with Claude/GPT-4
2. Curate best outputs during playtesting
3. Fine-tune smaller model (7B-13B) for production
4. Options: WebLLM (client-side), Ollama (self-hosted), or continue cloud API

### 3.3 Gameplay Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Leader Personalities** | Borrowed from remake | Adds depth without changing core |
| **Difficulty Levels** | 4 levels (Easy to Impossible) | Accessibility + challenge |
| **Multiple Scenarios** | Data-driven YAML | Future expansion ready |
| **Multiplayer** | Not in v1, hotseat possible later | Focus on single-player first |
| **Save System** | Auto-save + export JSON | Simple, browser-friendly |

### 3.4 Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | React 18 + TypeScript | Modern, well-supported |
| **State Management** | Zustand | Lightweight, simple |
| **Data Format** | YAML files | Human-readable, easy to edit |
| **Styling** | Tailwind CSS | Rapid development |
| **Game Logic** | Pure TypeScript (no React deps) | Testable, portable |
| **AI Integration** | Anthropic Claude API initially | Quality, then optimize |

### 3.5 UI/UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Orientation** | Portrait-first | Mobile-friendly |
| **Navigation** | Bottom tab bar | Thumb-friendly |
| **Country Interaction** | Card-based with bottom sheet | Mobile pattern |
| **Map** | Simplified vector map | Performance, clarity |
| **Sound** | Adaptive music + sfx | Immersion, atmosphere |

---

## 4. Open Questions (Resolved)

| Question | Decision | Date |
|----------|----------|------|
| Keep election mechanic from remake? | No, survival focus | Session 1 |
| AI for opponent decisions? | Hybrid: rules + wildcard | Session 1 |
| Client-side or server-side AI? | Start server, migrate to client | Session 1 |
| Multiple playable nations? | No, Israel only | Session 1 |
| Multiplayer? | Future consideration, hotseat | Session 1 |
| Mobile support? | Yes, portrait-first | Session 1 |
| Sound design? | Yes, adaptive atmosphere | Session 1 |

---

## 5. Reference Links

### 5.1 Original Game Resources

| Resource | URL | Content |
|----------|-----|---------|
| Wikipedia | https://en.wikipedia.org/wiki/Conflict:_Middle_East_Political_Simulator | Overview, mechanics |
| MobyGames | https://www.mobygames.com/game/837/conflict/ | Screenshots, reviews, trivia |
| MobyGames Screenshots | https://www.mobygames.com/game/conflict/screenshots | Visual reference |
| GameFAQs Mechanics Guide | https://gamefaqs.gamespot.com/pc/376993-conflict-the-middle-east-simulator/faqs/80181 | Detailed mechanics |
| Internet Archive (Playable) | https://archive.org/details/conflict_201509 | Play in browser |
| Internet Archive (Amiga) | https://archive.org/details/Conflict_Middle_East_Political_Simulator_1990_Virgin_Mastertronic_cr_TRSI | Amiga version, screenshots |
| PlayClassic.games | https://playclassic.games/games/turn-based-strategy-dos-games-online/play-conflict-middle-east-political-simulator-online/ | Play online |
| My Abandonware | https://www.myabandonware.com/game/conflict-uy | Download, reviews |
| Old-Games.com | https://www.old-games.com/download/4202/conflict-middle-east-political-simulator | Download, review |
| TV Tropes | https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/ConflictMiddleEastPoliticalSimulator | Mechanics analysis, tropes |
| Lemon Amiga | https://www.lemonamiga.com/games/details.php?id=1885 | Amiga version info |

### 5.2 2009 Remake Resources

| Resource | URL | Content |
|----------|-----|---------|
| MobyGames (Remake) | https://www.mobygames.com/game/46037/conflict-middle-east-political-simulator/ | Remake overview |
| GameFront Download | https://www.gamefront.com/games/conflict-middle-east-political-simulator/file/conflict-m-e-p-s | Remake download |
| Development Blog | http://ilfera.blogspot.com/ | Dev diary (may be defunct) |
| PCGamingWiki | https://www.pcgamingwiki.com/wiki/Conflict:_Middle_East_Political_Simulator_(2009) | Technical info |

### 5.3 Blog/Analysis Articles

| Resource | URL | Content |
|----------|-----|---------|
| Just Well Mixed | https://jasonlefkowitz.net/2014/11/playing-machiavelli-in-the-middle-east-in-conflict-middle-east-political-simulator/ | Excellent analysis |
| Spring RTS Forum | https://springrts.com/phpbb/viewtopic.php?t=25283 | Player discussion |

### 5.4 Design Reference Resources

| Resource | URL | Content |
|----------|-----|---------|
| Game UI Database | https://www.gameuidatabase.com/ | UI screenshot reference |
| Interface In Game | https://interfaceingame.com/ | Game UI examples |
| Game Developer (UI Article) | https://www.gamedeveloper.com/design/ui-strategy-game-design-dos-and-don-ts | Strategy UI best practices |
| Toptal Game UI Guide | https://www.toptal.com/designers/ui/game-ui | Game UI principles |
| Medium (Strategy UI) | https://medium.com/@treeform/strategy-game-battle-ui-3b313ffd3769 | Strategy UI evolution |
| Justinmind (Game UI) | https://www.justinmind.com/ui-design/game | Game UI design guide |
| ArtStation (Grand Strategy UI) | https://www.artstation.com/artwork/JvvRKm | Visual reference |

### 5.5 Technical Resources

| Resource | URL | Content |
|----------|-----|---------|
| React | https://react.dev/ | Framework docs |
| Zustand | https://github.com/pmndrs/zustand | State management |
| Tailwind CSS | https://tailwindcss.com/ | Styling |
| TanStack Query | https://tanstack.com/query | Data fetching |
| Vite | https://vitejs.dev/ | Build tool |
| js-yaml | https://github.com/nodeca/js-yaml | YAML parsing |
| Anthropic API | https://docs.anthropic.com/ | AI integration |
| Zod | https://zod.dev/ | Schema validation |

### 5.6 Asset Resources

| Resource | URL | Content |
|----------|-----|---------|
| Lucide Icons | https://lucide.dev/ | Icon library |
| Flagpack | https://flagpack.xyz/ | Country flags |
| Google Fonts | https://fonts.google.com/ | Typography |
| Freesound | https://freesound.org/ | Sound effects |
| Incompetech | https://incompetech.com/ | Royalty-free music |

---

## 6. Quotes & Insights

### From Original Reviews

> "Conflict is not striving to be a realistic simulation. It is meant to be an amusing exercise in cold war politics set in a futuristic Middle East environment. It is fast playing, easy to learn, entertaining and not to be taken too seriously."
> — Alan Emrich, Computer Gaming World (1990)

> "The cover art of the European version was painted by renowned comic artist Simon Bisley. Virgin Mastertronic manager Andrew Wright later came to regret releasing this as a straight-to-budget title, as it became one of his favorites, and he decided it could've been a success if released at full-price and marketed correctly."
> — MobyGames Trivia

> "Playing Conflict puts you into the Israeli mindset like no newspaper article can. You're surrounded by the potentially hostile Arab states of Syria, Lebanon, Jordan and Egypt, each of which could invade Israel and end your game in a second if you lower your guard."
> — Old-Games.com Review

### From Analysis Articles

> "The beauty of Conflict is the way a simple design and set of rules interact to create real, compelling stories each time you play. Maybe in one game you build up a public image as a man of peace... while quietly overthrowing all your neighbors via covert action."
> — Jason Lefkowitz, Just Well Mixed

> "As you may have deduced from the description above, Conflict's worldview is unapologetically driven by Realpolitik. There is no room in this game for peaceful co-existence between Israel and its neighbors; they may get along for a time, but that is generally only to provide a breathing space in which they can rest and re-arm before going for the jugular once again."
> — Jason Lefkowitz, Just Well Mixed

---

## 7. Historical Context

### 7.1 1990 Context (When Game Was Made)

- Cold War ending (Berlin Wall fell 1989)
- First Gulf War about to begin (1990-1991)
- Israel had not yet signed peace treaties with Jordan or PLO
- Rabin assassination would occur in 1995 (game predicted)

### 7.2 1997 Setting (Game's Hypothetical Future)

The game imagines 1997 as:
- More volatile than reality turned out
- No Oslo Accords
- Continued regional hostility
- Nuclear proliferation concerns

### 7.3 Sensitivity Notes

The game deals with real geopolitical conflicts. For the remake:
- Maintain serious, respectful tone
- Avoid caricatures or stereotypes
- Present as strategy simulation, not political commentary
- AI-generated content should be reviewed for sensitivity
- Consider content warnings for nuclear themes

---

## 8. Future Expansion Ideas

### 8.1 Scenario Ideas (Data Files)

| Scenario | Era | Notes |
|----------|-----|-------|
| Classic 1997 | 1997 | Original setting |
| Six Day War | 1967 | Historical |
| Yom Kippur | 1973 | Historical |
| First Intifada | 1987 | Historical |
| Modern Day | 2024+ | Updated countries, Iran focus |
| Alternate History | Various | What-if scenarios |
| Cold War Europe | 1980s | Different region entirely |

### 8.2 Feature Ideas

- **Fog of War:** Uncertain intelligence about enemy forces
- **Advisor Personalities:** Different advisors with conflicting advice
- **Media Management:** Spin and propaganda mechanics
- **Economic System:** Deeper budget/GDP modeling
- **Espionage Expanded:** Double agents, intelligence failures
- **Diplomatic Summit Mini-game:** Actual negotiation mechanics

### 8.3 Multiplayer Ideas

- **Hot Seat:** Pass and play locally
- **Async Multiplayer:** Take turns over days
- **Competitive:** Multiple players as different countries
- **Cooperative:** Shared control of Israel

---

## 9. Document Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial document |

---

*End of Research & Design Decisions Document v1.0*
