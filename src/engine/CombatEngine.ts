// ============================================
// Combat Engine - War Resolution
// ============================================
// This is a pure TypeScript module - NO React dependencies allowed

import type {
  GameState,
  CountryId,
  War,
  WeaponId,
  Airstrike,
  StabilityLevel,
  RelationshipLevel,
} from '../types/game';

// Combat value per weapon type (legacy generic types for combat calculations)
const COMBAT_VALUES: Partial<Record<WeaponId, number>> = {
  light_tank: 1,
  main_battle_tank: 3,
  anti_tank_helicopter: 4,
  sam_battery: 2,
  fighter_aircraft: 5,
  anti_sam_helicopter: 3,
  infantry_brigade: 2,
};

// Counter relationships: key counters values in array
const COUNTERS: Partial<Record<WeaponId, WeaponId[]>> = {
  main_battle_tank: ['light_tank'],
  anti_tank_helicopter: ['light_tank', 'main_battle_tank'],
  sam_battery: ['anti_tank_helicopter', 'fighter_aircraft'],
  fighter_aircraft: ['anti_tank_helicopter'],
  anti_sam_helicopter: ['sam_battery'],
};

// Combat phases with participating unit types
const COMBAT_PHASES = [
  {
    name: 'Air Superiority',
    attackers: ['fighter_aircraft'] as WeaponId[],
    defenders: ['fighter_aircraft', 'sam_battery'] as WeaponId[],
  },
  {
    name: 'Air Defense Suppression',
    attackers: ['anti_sam_helicopter'] as WeaponId[],
    defenders: ['sam_battery', 'fighter_aircraft'] as WeaponId[],
  },
  {
    name: 'Close Air Support',
    attackers: ['anti_tank_helicopter', 'fighter_aircraft'] as WeaponId[],
    defenders: ['sam_battery', 'main_battle_tank', 'light_tank'] as WeaponId[],
  },
  {
    name: 'Ground Battle',
    attackers: ['main_battle_tank', 'light_tank', 'infantry_brigade'] as WeaponId[],
    defenders: ['main_battle_tank', 'light_tank', 'infantry_brigade'] as WeaponId[],
  },
];

// War progress thresholds
const VICTORY_THRESHOLD = 10;
const DEFEAT_THRESHOLD = -10;

// Stability levels in order
const STABILITY_ORDER: StabilityLevel[] = [
  'very_solid', 'solid', 'good', 'weak', 'critical', 'collapse'
];

/**
 * Handles all combat operations
 */
export const CombatEngine = {
  /**
   * Check if player can declare war on a country
   */
  canDeclareWar: (state: GameState, target: CountryId): boolean => {
    const country = state.countries[target];
    if (!country || country.isDefeated) return false;

    // Must be at hostile relationship
    if (country.relationship !== 'hostile') return false;

    // Must have troops deployed (at least 1 brigade)
    const deployedTroops = state.player.deployedTroops[target] || 0;
    return deployedTroops > 0;
  },

  /**
   * Declare war on a country
   */
  declareWar: (state: GameState, target: CountryId): GameState => {
    if (!CombatEngine.canDeclareWar(state, target)) {
      return state;
    }

    // Create new war
    const newWar: War = {
      id: `war_${state.turn}_${target}`,
      attacker: 'israel',
      defender: target,
      startTurn: state.turn,
      progress: 0,
      attackerLosses: {},
      defenderLosses: {},
    };

    // Update country relationship to war
    const newCountries = {
      ...state.countries,
      [target]: {
        ...state.countries[target],
        relationship: 'war' as RelationshipLevel,
      },
    };

    return {
      ...state,
      countries: newCountries,
      wars: [...state.wars, newWar],
    };
  },

  /**
   * AI country declares war on Israel
   */
  aiDeclareWar: (state: GameState, attacker: CountryId): GameState => {
    const country = state.countries[attacker];
    if (!country || country.isDefeated) return state;

    // Must be hostile
    if (country.relationship !== 'hostile') return state;

    // Only neighbors can attack Israel directly
    const neighbors: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];
    if (!neighbors.includes(attacker)) return state;

    // Create new war with AI as attacker
    const newWar: War = {
      id: `war_${state.turn}_ai_${attacker}`,
      attacker: attacker,
      defender: 'israel',
      startTurn: state.turn,
      progress: 0,
      attackerLosses: {},
      defenderLosses: {},
    };

    // Update relationship to war
    const newCountries = {
      ...state.countries,
      [attacker]: {
        ...country,
        relationship: 'war' as RelationshipLevel,
      },
    };

    return {
      ...state,
      countries: newCountries,
      wars: [...state.wars, newWar],
    };
  },

  /**
   * AI offers ceasefire to Israel (just records the offer; player must respond)
   */
  aiOfferCeasefire: (state: GameState, warId: string): GameState => {
    // For now, AI ceasefires are auto-evaluated
    // In a full implementation, this would trigger a player prompt
    const war = state.wars.find(w => w.id === warId);
    if (!war) return state;

    // Determine if Israel would accept (based on war progress)
    // Positive progress = Israel winning, less likely to accept
    // Negative progress = Israel losing, more likely to accept
    let acceptChance = 0.5;
    acceptChance -= war.progress * 0.05;

    if (Math.random() < acceptChance) {
      // End war
      const enemy = war.attacker === 'israel' ? war.defender : war.attacker;
      const newCountries = {
        ...state.countries,
        [enemy]: {
          ...state.countries[enemy],
          relationship: 'satisfactory' as RelationshipLevel,
        },
      };

      return {
        ...state,
        wars: state.wars.filter(w => w.id !== warId),
        countries: newCountries,
      };
    }

    return state;
  },

  /**
   * Resolve all active wars for one turn
   */
  resolveAllWars: (state: GameState): GameState => {
    let newState = state;

    for (const war of state.wars) {
      newState = CombatEngine.resolveWarTurn(newState, war.id);
    }

    return newState;
  },

  /**
   * Resolve one turn of an active war
   */
  resolveWarTurn: (state: GameState, warId: string): GameState => {
    const warIndex = state.wars.findIndex(w => w.id === warId);
    if (warIndex === -1) return state;

    const war = state.wars[warIndex];
    const isPlayerAttacker = war.attacker === 'israel';

    // Get forces for both sides
    const playerArsenal = state.player.arsenal;
    const enemyStrength = state.countries[war.defender].militaryStrength;

    // Calculate total combat for each phase
    let totalPlayerDamageDealt = 0;
    let totalPlayerDamageTaken = 0;
    const playerLosses: Partial<Record<WeaponId, number>> = {};
    let enemyDamage = 0;

    for (const phase of COMBAT_PHASES) {
      const phaseResult = CombatEngine.resolveCombatPhase(
        playerArsenal,
        enemyStrength,
        phase.attackers,
        phase.defenders,
        isPlayerAttacker
      );

      totalPlayerDamageDealt += phaseResult.playerDamageDealt;
      totalPlayerDamageTaken += phaseResult.playerDamageTaken;
      enemyDamage += phaseResult.enemyDamage;

      // Apply player losses
      for (const [weapon, loss] of Object.entries(phaseResult.playerLosses)) {
        playerLosses[weapon as WeaponId] = (playerLosses[weapon as WeaponId] || 0) + loss;
      }
    }

    // Calculate war progress change
    let progressChange = 0;
    const damageRatio = totalPlayerDamageDealt / Math.max(1, totalPlayerDamageTaken);

    if (damageRatio > 5) progressChange = isPlayerAttacker ? 3 : -3; // Decisive victory
    else if (damageRatio > 2) progressChange = isPlayerAttacker ? 2 : -2; // Victory
    else if (damageRatio > 1) progressChange = isPlayerAttacker ? 1 : -1; // Pyrrhic
    else if (damageRatio > 0.5) progressChange = 0; // Stalemate
    else if (damageRatio > 0.2) progressChange = isPlayerAttacker ? -1 : 1; // Setback
    else progressChange = isPlayerAttacker ? -2 : 2; // Defeat

    const newProgress = Math.max(DEFEAT_THRESHOLD, Math.min(VICTORY_THRESHOLD, war.progress + progressChange));

    // Apply losses to player arsenal
    const newArsenal = { ...playerArsenal };
    for (const [weapon, loss] of Object.entries(playerLosses)) {
      const weaponId = weapon as WeaponId;
      newArsenal[weaponId] = Math.max(0, (newArsenal[weaponId] || 0) - loss);
    }

    // Reduce enemy military strength
    const enemy = state.countries[war.defender];
    const newEnemyStrength = Math.max(0, enemy.militaryStrength - enemyDamage);

    // Update war
    const updatedWar: War = {
      ...war,
      progress: newProgress,
      attackerLosses: isPlayerAttacker
        ? { ...war.attackerLosses, ...playerLosses }
        : war.attackerLosses,
      defenderLosses: !isPlayerAttacker
        ? { ...war.defenderLosses, ...playerLosses }
        : war.defenderLosses,
    };

    // Check for war end
    let newWars = [...state.wars];
    const newCountries = { ...state.countries };
    let newPlayer = { ...state.player, arsenal: newArsenal };

    if (newProgress >= VICTORY_THRESHOLD) {
      // Player wins (if attacker) or enemy wins
      if (isPlayerAttacker) {
        // Enemy defeated
        newCountries[war.defender] = {
          ...enemy,
          militaryStrength: newEnemyStrength,
          stability: 'critical' as StabilityLevel,
          isDefeated: true,
          defeatedBy: 'israel',
          defeatedOnTurn: state.turn,
          relationship: 'hostile' as RelationshipLevel, // No longer at war, but hostile
        };
        newPlayer = {
          ...newPlayer,
          prestige: Math.min(10, newPlayer.prestige + 2),
        };
      }
      // Remove war
      newWars = newWars.filter(w => w.id !== warId);
    } else if (newProgress <= DEFEAT_THRESHOLD) {
      // Defender wins (player loses if defender, enemy wins if attacker)
      if (!isPlayerAttacker) {
        // Player (defender) wins
        newCountries[war.attacker] = {
          ...state.countries[war.attacker],
          stability: 'critical' as StabilityLevel,
          isDefeated: true,
          defeatedBy: 'israel',
          defeatedOnTurn: state.turn,
          relationship: 'hostile' as RelationshipLevel,
        };
      } else {
        // Player (attacker) loses - knesset disapproval increases
        newPlayer = {
          ...newPlayer,
          knessetDisapproval: Math.min(10, newPlayer.knessetDisapproval + 3),
        };
      }
      // Remove war
      newWars = newWars.filter(w => w.id !== warId);
    } else {
      // War continues
      newWars[warIndex] = updatedWar;
      newCountries[war.defender] = {
        ...enemy,
        militaryStrength: newEnemyStrength,
      };
    }

    return {
      ...state,
      wars: newWars,
      countries: newCountries,
      player: newPlayer,
    };
  },

  /**
   * Calculate combat phase result
   */
  resolveCombatPhase: (
    playerArsenal: Partial<Record<WeaponId, number>>,
    enemyStrength: number,
    attackerWeapons: WeaponId[],
    defenderWeapons: WeaponId[],
    isPlayerAttacker: boolean
  ): {
    playerDamageDealt: number;
    playerDamageTaken: number;
    playerLosses: Partial<Record<WeaponId, number>>;
    enemyDamage: number;
  } => {
    // Calculate player force strength in this phase
    let playerStrength = 0;
    const relevantWeapons = isPlayerAttacker ? attackerWeapons : defenderWeapons;

    for (const weapon of relevantWeapons) {
      const count = playerArsenal[weapon] || 0;
      const combatValue = COMBAT_VALUES[weapon] || 0;
      playerStrength += count * combatValue;
    }

    // Enemy uses fraction of total strength
    const enemyPhaseStrength = enemyStrength * 0.25; // Each phase uses 25% of enemy forces

    // Calculate effectiveness based on counters
    let effectiveness = 1.0;
    // Simplified: check if player has counter advantage
    for (const weapon of relevantWeapons) {
      const counters = COUNTERS[weapon];
      if (counters && counters.length > 0) {
        effectiveness = Math.max(effectiveness, 1.3); // Bonus for having counters
      }
    }

    // Apply random variance (0.8 - 1.2)
    const variance = 0.8 + Math.random() * 0.4;

    // Calculate damage
    const playerDamage = playerStrength * effectiveness * variance;
    const enemyDamage = enemyPhaseStrength * variance;

    // Calculate losses (proportional to damage taken vs total strength)
    const playerLosses: Partial<Record<WeaponId, number>> = {};
    if (playerStrength > 0 && enemyDamage > 0) {
      const lossRatio = Math.min(1, enemyDamage / (playerStrength * 2));
      for (const weapon of relevantWeapons) {
        const count = playerArsenal[weapon] || 0;
        if (count > 0) {
          const loss = Math.floor(count * lossRatio * Math.random());
          if (loss > 0) {
            playerLosses[weapon] = loss;
          }
        }
      }
    }

    return {
      playerDamageDealt: playerDamage,
      playerDamageTaken: enemyDamage,
      playerLosses,
      enemyDamage: playerDamage * 0.1, // Enemy strength reduction
    };
  },

  /**
   * Process airstrike orders
   */
  processAirstrikes: (state: GameState): GameState => {
    const airstrikes = state.player.turnActions.airstrikes;
    if (airstrikes.length === 0) return state;

    let newState = state;

    for (const airstrike of airstrikes) {
      newState = CombatEngine.executeAirstrike(newState, airstrike);
    }

    return newState;
  },

  /**
   * Execute a single airstrike
   */
  executeAirstrike: (state: GameState, airstrike: Airstrike): GameState => {
    const target = state.countries[airstrike.target];
    if (!target || target.isDefeated) return state;

    // Check if we have enough fighters
    const fighters = state.player.arsenal.fighter_aircraft || 0;
    if (fighters < airstrike.fightersUsed) return state;

    const newState = { ...state };
    const newCountries = { ...state.countries };
    const newPlayer = { ...state.player };
    const newArsenal = { ...state.player.arsenal };

    // Calculate losses (based on enemy SAMs)
    const enemySAMs = target.militaryStrength * 0.1; // Estimate SAM strength
    const lossChance = 0.1 + (enemySAMs * 0.05);
    let fighterLosses = 0;
    for (let i = 0; i < airstrike.fightersUsed; i++) {
      if (Math.random() < lossChance) {
        fighterLosses++;
      }
    }
    newArsenal.fighter_aircraft = Math.max(0, fighters - fighterLosses);

    // Apply airstrike effects
    switch (airstrike.type) {
      case 'military':
        // Reduce enemy military strength
        newCountries[airstrike.target] = {
          ...target,
          militaryStrength: Math.max(0, target.militaryStrength - 5 - Math.floor(Math.random() * 10)),
        };
        newPlayer.violencePoints += 2;
        break;

      case 'civilian': {
        // Reduce enemy stability
        const currentStabilityIndex = STABILITY_ORDER.indexOf(target.stability);
        const newStabilityIndex = Math.min(STABILITY_ORDER.length - 1, currentStabilityIndex + 1);
        newCountries[airstrike.target] = {
          ...target,
          stability: STABILITY_ORDER[newStabilityIndex],
        };
        newPlayer.violencePoints += 2;
        newPlayer.usAttitude = Math.max(-100, newPlayer.usAttitude - 10);
        break;
      }

      case 'industrial':
        // Economic damage (represented by reduced military rebuilding)
        newCountries[airstrike.target] = {
          ...target,
          militaryStrength: Math.max(0, target.militaryStrength * 0.8),
        };
        newPlayer.violencePoints += 2;
        break;

      case 'nuclear':
        // Attempt to destroy nuclear program
        if (target.nuclearStage !== 'none' && target.nuclearStage !== 'operational') {
          const success = Math.random() < 0.65;
          if (success) {
            newCountries[airstrike.target] = {
              ...target,
              nuclearStage: 'none',
              nuclearProgress: 0,
            };
          }
        }
        newPlayer.violencePoints += 4;
        // Worsens all relationships
        for (const [countryId, country] of Object.entries(newCountries)) {
          if (countryId !== 'israel' && countryId !== airstrike.target && !country.isDefeated) {
            // Nuclear strikes are universally condemned
            newPlayer.usAttitude = Math.max(-100, newPlayer.usAttitude - 20);
          }
        }
        break;
    }

    newPlayer.arsenal = newArsenal;

    return {
      ...newState,
      countries: newCountries,
      player: newPlayer,
    };
  },

  /**
   * Offer ceasefire in an active war
   */
  offerCeasefire: (state: GameState, warId: string): { state: GameState; accepted: boolean } => {
    const war = state.wars.find(w => w.id === warId);
    if (!war) return { state, accepted: false };

    const enemy = state.countries[war.defender];

    // AI accepts ceasefire based on war progress and leader personality
    let acceptChance = 0.3;

    // More likely to accept if losing
    if (war.progress > 0) acceptChance += war.progress * 0.05;

    // Leader aggression affects acceptance
    if (enemy.leader.aggression === 'dovish') acceptChance += 0.3;
    else if (enemy.leader.aggression === 'hawkish') acceptChance -= 0.2;

    // Weak stability makes them more likely to accept
    if (enemy.stability === 'weak' || enemy.stability === 'critical') {
      acceptChance += 0.3;
    }

    const accepted = Math.random() < acceptChance;

    if (accepted) {
      // End war, reset relationship to satisfactory with aggressive stance
      const newCountries = {
        ...state.countries,
        [war.defender]: {
          ...enemy,
          relationship: 'satisfactory' as RelationshipLevel,
          stance: 'aggressive' as const,
        },
      };

      return {
        state: {
          ...state,
          wars: state.wars.filter(w => w.id !== warId),
          countries: newCountries,
        },
        accepted: true,
      };
    }

    return { state, accepted: false };
  },

  /**
   * Check if player has nuclear capability
   */
  hasNuclearCapability: (state: GameState): boolean => {
    return state.player.nuclearStage === 'operational';
  },

  /**
   * Process nuclear strike (ends game)
   */
  processNuclearStrike: (state: GameState, target: CountryId): GameState => {
    if (!CombatEngine.hasNuclearCapability(state)) return state;

    const targetCountry = state.countries[target];
    if (!targetCountry || targetCountry.isDefeated) return state;

    // Nuclear strike defeats the target
    const newCountries = {
      ...state.countries,
      [target]: {
        ...targetCountry,
        isDefeated: true,
        defeatedBy: 'israel',
        defeatedOnTurn: state.turn,
        stability: 'collapse' as StabilityLevel,
      },
    };

    // Check for nuclear retaliation
    let endState: GameState['endState'] = undefined;

    if (targetCountry.nuclearStage === 'operational') {
      // Mutual destruction - game over
      endState = {
        type: 'defeat',
        condition: 'nuclear_holocaust',
        finalScore: 0,
        leadershipStyle: 'Apocalyptic',
        narrative: 'Nuclear war has destroyed both nations.',
        statistics: {
          turnsPlayed: state.turn,
          warsWon: 0,
          warsLost: 0,
          countriesDefeated: [target],
          totalWeaponsPurchased: 0,
          totalAirstrikes: 0,
          peakPrestige: state.player.prestige,
          peakKnessetDisapproval: state.player.knessetDisapproval,
        },
      };
    }

    // International condemnation
    const newPlayer = {
      ...state.player,
      usAttitude: -100,
      prestige: 0,
      violencePoints: state.player.violencePoints + 100,
    };

    return {
      ...state,
      countries: newCountries,
      player: newPlayer,
      endState,
    };
  },

  /**
   * Get active wars
   */
  getActiveWars: (state: GameState): War[] => {
    return state.wars;
  },

  /**
   * Check if at war with a specific country
   */
  isAtWar: (state: GameState, country: CountryId): boolean => {
    return state.wars.some(
      w => w.attacker === country || w.defender === country
    );
  },
};
