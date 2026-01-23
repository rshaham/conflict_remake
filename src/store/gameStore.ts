// ============================================
// Game Store - Main Game State Management
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  DifficultyId,
  ScenarioId,
  CountryId,
  VendorId,
  WeaponId,
  DiplomaticAction,
  IntelligenceAction,
  ExtremeMeasureType,
  PolicingTactic,
  AirstrikeTarget,
  Airstrike,
  RelationshipLevel,
  NuclearStage,
  PalestinianLevel,
} from '../types/game';
import type { GameData } from '../types/data';
import { loadAllGameData } from '../data/loader';
import { GameEngine } from '../engine/GameEngine';
import { EconomyEngine } from '../engine/EconomyEngine';
import { CombatEngine } from '../engine/CombatEngine';
import { IntelligenceEngine } from '../engine/IntelligenceEngine';

interface GameStore {
  // State
  game: GameState | null;
  gameData: GameData | null;
  isLoading: boolean;
  error: string | null;

  // Game Lifecycle
  loadGameData: () => Promise<GameData>;
  newGame: (difficulty: DifficultyId, scenario: ScenarioId) => Promise<void>;
  loadGame: (saveData: string) => void;
  saveGame: () => string;

  // Diplomatic Actions
  setDiplomaticAction: (country: CountryId, action: DiplomaticAction) => void;

  // Intelligence Actions
  setIntelligenceAction: (country: CountryId, action: IntelligenceAction) => void;
  attemptExtremeMeasure: (country: CountryId, type: ExtremeMeasureType) => void;

  // Military Actions
  purchaseWeapon: (vendor: VendorId, weapon: WeaponId, quantity: number) => void;
  fundNuclear: (fund: boolean) => void;
  deployTroops: (country: CountryId, brigades: number) => void;
  orderAirstrike: (country: CountryId, target: AirstrikeTarget) => void;
  cancelAirstrike: (index: number) => void;

  // Palestinian Actions
  setPolicingTactic: (tactic: PolicingTactic) => void;
  acceptPalestinianHomeland: () => void;

  // Event Handling
  respondToEvent: (eventId: string, optionId: string) => void;

  // Turn Flow
  setPhase: (phase: GameState['phase']) => void;
  advancePhase: () => void;
  endTurn: () => Promise<void>;

  // War Actions
  declareWar: (country: CountryId) => void;
  offerCeasefire: (warId: string) => void;
  launchNuclearStrike: (target: CountryId) => void;

  // UN Summit
  acceptProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;

  // Debug Actions (dev mode only)
  debugAddBudget: (amount: number) => void;
  debugSetPrestige: (level: number) => void;
  debugSetKnessetDisapproval: (value: number) => void;
  debugModifyUSAttitude: (delta: number) => void;
  debugAddWeapon: (weaponId: WeaponId, quantity: number) => void;
  debugSetNuclearStage: (stage: NuclearStage) => void;
  debugSetPalestinianLevel: (level: PalestinianLevel) => void;
  debugSetRelationship: (country: CountryId, level: RelationshipLevel) => void;
  debugDefeatCountry: (country: CountryId) => void;
  debugWinWar: (warId: string) => void;
  debugLoseWar: (warId: string) => void;
  debugSkipTurns: (turns: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial State
      game: null,
      gameData: null,
      isLoading: false,
      error: null,

      // Game Lifecycle
      loadGameData: async () => {
        // Return cached data if available
        const existing = get().gameData;
        if (existing) return existing;

        // Load all YAML data files
        const data = await loadAllGameData();
        set({ gameData: data });
        return data;
      },

      newGame: async (difficulty, scenario) => {
        set({ isLoading: true, error: null });
        try {
          // Load game data first
          const gameData = await get().loadGameData();

          // Initialize game state using GameEngine with loaded data
          const initialState = GameEngine.initializeGame(difficulty, scenario, gameData);
          set({ game: initialState, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },

      loadGame: (saveData) => {
        try {
          const game = JSON.parse(saveData) as GameState;
          set({ game, error: null });
        } catch (e) {
          set({ error: `Failed to load game: ${(e as Error).message}` });
        }
      },

      saveGame: () => {
        const { game } = get();
        if (!game) return '';
        return JSON.stringify(game);
      },

      // Diplomatic Actions
      setDiplomaticAction: (country, action) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              turnActions: {
                ...game.player.turnActions,
                diplomaticActions: {
                  ...game.player.turnActions.diplomaticActions,
                  [country]: action,
                },
              },
            },
          },
        });
      },

      // Intelligence Actions
      setIntelligenceAction: (country, action) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              turnActions: {
                ...game.player.turnActions,
                intelligenceActions: {
                  ...game.player.turnActions.intelligenceActions,
                  [country]: action,
                },
              },
            },
          },
        });
      },

      attemptExtremeMeasure: (country, type) => {
        const { game } = get();
        if (!game) return;

        const result = IntelligenceEngine.attemptExtremeMeasure(game, country, type);
        set({ game: result.state });

        // Log the result message for UI to display
        console.log(result.message);
      },

      // Military Actions
      purchaseWeapon: (vendor, weapon, quantity) => {
        const { game, gameData } = get();
        if (!game) return;

        // Validate purchase
        const validation = EconomyEngine.canPurchase(game, vendor, weapon, quantity, gameData?.weapons);
        if (!validation.valid) {
          console.warn(`Cannot purchase: ${validation.reason}`);
          return;
        }

        // Calculate cost - deduct immediately but weapons arrive at end of turn
        const cost = EconomyEngine.calculatePurchaseCost(vendor, weapon, quantity, gameData?.weapons);

        // Create purchase order for end-of-turn processing
        const purchase = EconomyEngine.createPurchaseOrder(vendor, weapon, quantity, gameData?.weapons);

        // Update vendor purchase count and deduct cost immediately
        set({
          game: {
            ...game,
            player: {
              ...game.player,
              budget: game.player.budget - cost,
              vendorPurchases: {
                ...game.player.vendorPurchases,
                [vendor]: (game.player.vendorPurchases[vendor] || 0) + quantity,
              },
              turnActions: {
                ...game.player.turnActions,
                weaponPurchases: [
                  ...game.player.turnActions.weaponPurchases,
                  purchase,
                ],
              },
            },
          },
        });
      },

      fundNuclear: (fund) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              turnActions: {
                ...game.player.turnActions,
                fundedNuclear: fund,
              },
            },
          },
        });
      },

      deployTroops: (country, brigades) => {
        const { game } = get();
        if (!game) return;

        // Validate we have enough infantry brigades
        const availableBrigades = game.player.arsenal.infantry_brigade || 0;
        const currentlyDeployed = Object.values(game.player.deployedTroops).reduce(
          (a, b) => a + b,
          0
        );

        if (brigades > 0 && currentlyDeployed + brigades > availableBrigades) {
          console.warn('Not enough brigades available');
          return;
        }

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              deployedTroops: {
                ...game.player.deployedTroops,
                [country]: Math.max(0, brigades),
              },
            },
          },
        });
      },

      orderAirstrike: (country, target) => {
        const { game } = get();
        if (!game) return;

        // Need at least 1 fighter aircraft
        const fighters = game.player.arsenal.fighter_aircraft || 0;
        if (fighters === 0) {
          console.warn('No fighter aircraft available');
          return;
        }

        const airstrike: Airstrike = {
          target: country,
          type: target,
          fightersUsed: Math.min(5, fighters), // Use up to 5 fighters per strike
        };

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              turnActions: {
                ...game.player.turnActions,
                airstrikes: [...game.player.turnActions.airstrikes, airstrike],
              },
            },
          },
        });
      },

      cancelAirstrike: (index) => {
        const { game } = get();
        if (!game) return;

        const airstrikes = [...game.player.turnActions.airstrikes];
        airstrikes.splice(index, 1);

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              turnActions: {
                ...game.player.turnActions,
                airstrikes,
              },
            },
          },
        });
      },

      // Palestinian Actions
      setPolicingTactic: (tactic) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              policingTactic: tactic,
            },
          },
        });
      },

      acceptPalestinianHomeland: () => {
        const { game } = get();
        if (!game) return;

        // Must be at UN Summit phase
        if (game.phase !== 'un_summit') return;

        // Must have sufficient US attitude (25+)
        if (game.player.usAttitude < 25) return;

        // Already accepted
        if (game.player.palestinianHomeland) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              palestinianHomeland: true,
              palestinianLevel: 'calm',
              policingTactic: 'none',
              prestige: game.player.prestige + 1,
              usAttitude: game.player.usAttitude + 25,
            },
          },
        });
      },

      // Event Handling
      respondToEvent: (eventId, optionId) => {
        const { game } = get();
        if (!game) return;

        // Find the event and mark it as responded
        const updatedEvents = game.pendingEvents.map((event) => {
          if (event.id === eventId) {
            return { ...event, chosenOption: optionId };
          }
          return event;
        });

        set({
          game: {
            ...game,
            pendingEvents: updatedEvents,
          },
        });
      },

      // Turn Flow
      setPhase: (phase) => {
        const { game } = get();
        if (!game) return;

        set({ game: { ...game, phase } });
      },

      advancePhase: () => {
        const { game } = get();
        if (!game) return;

        const newState = GameEngine.advancePhase(game);
        set({ game: newState });
      },

      endTurn: async () => {
        const { game } = get();
        if (!game) return;

        set({ isLoading: true });

        try {
          // Resolve the turn using GameEngine
          const newState = GameEngine.resolveTurn(game);
          set({ game: newState, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },

      // War Actions
      declareWar: (country) => {
        const { game } = get();
        if (!game) return;

        const newState = CombatEngine.declareWar(game, country);
        set({ game: newState });
      },

      offerCeasefire: (warId) => {
        const { game } = get();
        if (!game) return;

        const result = CombatEngine.offerCeasefire(game, warId);
        set({ game: result.state });

        console.log(result.accepted ? 'Ceasefire accepted' : 'Ceasefire rejected');
      },

      launchNuclearStrike: (target) => {
        const { game } = get();
        if (!game) return;

        if (!CombatEngine.hasNuclearCapability(game)) {
          console.warn('No nuclear capability');
          return;
        }

        const newState = CombatEngine.processNuclearStrike(game, target);
        set({ game: newState });
      },

      // UN Summit
      acceptProposal: (proposalId) => {
        const { game } = get();
        if (!game) return;

        console.log(`Accepted proposal: ${proposalId}`);
        // TODO: Implement specific proposal handling
      },

      rejectProposal: (proposalId) => {
        const { game } = get();
        if (!game) return;

        console.log(`Rejected proposal: ${proposalId}`);
        // TODO: Implement specific proposal handling
      },

      // Debug Actions (dev mode only)
      debugAddBudget: (amount) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              budget: game.player.budget + amount,
            },
          },
        });
      },

      debugSetPrestige: (level) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              prestige: Math.max(0, Math.min(10, level)),
            },
          },
        });
      },

      debugSetKnessetDisapproval: (value) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              knessetDisapproval: Math.max(0, Math.min(10, value)),
            },
          },
        });
      },

      debugModifyUSAttitude: (delta) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              usAttitude: Math.max(0, Math.min(100, game.player.usAttitude + delta)),
            },
          },
        });
      },

      debugAddWeapon: (weaponId, quantity) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              arsenal: {
                ...game.player.arsenal,
                [weaponId]: (game.player.arsenal[weaponId] || 0) + quantity,
              },
            },
          },
        });
      },

      debugSetNuclearStage: (stage) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              nuclearStage: stage,
              nuclearProgress: stage === 'operational' ? 12 : 0,
            },
          },
        });
      },

      debugSetPalestinianLevel: (level) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            player: {
              ...game.player,
              palestinianLevel: level,
            },
          },
        });
      },

      debugSetRelationship: (country, level) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            countries: {
              ...game.countries,
              [country]: {
                ...game.countries[country],
                relationship: level,
              },
            },
          },
        });
      },

      debugDefeatCountry: (country) => {
        const { game } = get();
        if (!game) return;

        set({
          game: {
            ...game,
            countries: {
              ...game.countries,
              [country]: {
                ...game.countries[country],
                isDefeated: true,
                defeatedBy: 'israel',
                defeatedOnTurn: game.turn,
                stability: 'collapse' as const,
              },
            },
          },
        });
      },

      debugWinWar: (warId) => {
        const { game } = get();
        if (!game) return;

        const war = game.wars.find((w) => w.id === warId);
        if (!war) return;

        // Determine enemy and defeat them
        const enemy = war.attacker === 'israel' ? war.defender : war.attacker;

        set({
          game: {
            ...game,
            wars: game.wars.filter((w) => w.id !== warId),
            countries: {
              ...game.countries,
              [enemy]: {
                ...game.countries[enemy],
                isDefeated: true,
                defeatedBy: 'israel',
                defeatedOnTurn: game.turn,
                stability: 'collapse' as const,
              },
            },
            player: {
              ...game.player,
              prestige: Math.min(10, game.player.prestige + 2),
            },
          },
        });
      },

      debugLoseWar: (warId) => {
        const { game } = get();
        if (!game) return;

        // Set game over state
        set({
          game: {
            ...game,
            wars: game.wars.filter((w) => w.id !== warId),
            phase: 'game_over',
            endState: {
              type: 'defeat',
              condition: 'military_defeat',
              finalScore: 0,
              leadershipStyle: 'Defeated',
              narrative: 'Israel has fallen to military defeat.',
              statistics: {
                turnsPlayed: game.turn,
                warsWon: 0,
                warsLost: 1,
                countriesDefeated: [],
                totalWeaponsPurchased: 0,
                totalAirstrikes: 0,
                peakPrestige: game.player.prestige,
                peakKnessetDisapproval: game.player.knessetDisapproval,
              },
            },
          },
        });
      },

      debugSkipTurns: (turns) => {
        const { game } = get();
        if (!game) return;

        const newTurn = game.turn + turns;
        const newMonth = ((game.month - 1 + turns) % 12) + 1;
        const yearsToAdd = Math.floor((game.month - 1 + turns) / 12);

        set({
          game: {
            ...game,
            turn: newTurn,
            month: newMonth,
            year: game.year + yearsToAdd,
          },
        });
      },
    }),
    {
      name: 'conflict-save',
      partialize: (state) => ({ game: state.game }),
    }
  )
);
