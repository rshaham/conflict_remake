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
} from '../types/game';

interface GameStore {
  // State
  game: GameState | null;
  isLoading: boolean;
  error: string | null;

  // Game Lifecycle
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

  // Palestinian Actions
  setPolicingTactic: (tactic: PolicingTactic) => void;

  // Event Handling
  respondToEvent: (eventId: string, optionId: string) => void;

  // Turn Flow
  advancePhase: () => void;
  endTurn: () => Promise<void>;

  // War Actions
  offerCeasefire: (warId: string) => void;
  launchNuclearStrike: (warId: string) => void;

  // UN Summit
  acceptProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial State
      game: null,
      isLoading: false,
      error: null,

      // Game Lifecycle - Stubs for Phase 2
      newGame: async (difficulty, scenario) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Phase 2 - Initialize game state from scenario data
          console.log(`Starting new game: ${difficulty} / ${scenario}`);
          // For now, just clear loading state
          set({ isLoading: false });
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

      // Diplomatic Actions - Stubs
      setDiplomaticAction: (country, action) => {
        console.log(`Diplomatic action: ${action} with ${country}`);
        // TODO: Phase 2 - Update game state
      },

      // Intelligence Actions - Stubs
      setIntelligenceAction: (country, action) => {
        console.log(`Intelligence action: ${action} for ${country}`);
        // TODO: Phase 2 - Update game state
      },

      attemptExtremeMeasure: (country, type) => {
        console.log(`Extreme measure: ${type} on ${country}`);
        // TODO: Phase 2 - Process extreme measure
      },

      // Military Actions - Stubs
      purchaseWeapon: (vendor, weapon, quantity) => {
        console.log(`Purchase: ${quantity}x ${weapon} from ${vendor}`);
        // TODO: Phase 2 - Process purchase
      },

      fundNuclear: (fund) => {
        console.log(`Nuclear funding: ${fund}`);
        // TODO: Phase 2 - Update nuclear funding
      },

      deployTroops: (country, brigades) => {
        console.log(`Deploy: ${brigades} brigades to ${country} border`);
        // TODO: Phase 2 - Update troop deployment
      },

      orderAirstrike: (country, target) => {
        console.log(`Airstrike: ${target} targets in ${country}`);
        // TODO: Phase 2 - Process airstrike
      },

      // Palestinian Actions - Stub
      setPolicingTactic: (tactic) => {
        console.log(`Policing tactic: ${tactic}`);
        // TODO: Phase 2 - Update policing
      },

      // Event Handling - Stub
      respondToEvent: (eventId, optionId) => {
        console.log(`Event response: ${optionId} for ${eventId}`);
        // TODO: Phase 2 - Process event response
      },

      // Turn Flow - Stubs
      advancePhase: () => {
        console.log('Advancing phase');
        // TODO: Phase 2 - Advance game phase
      },

      endTurn: async () => {
        console.log('Ending turn');
        // TODO: Phase 2 - Process turn resolution
      },

      // War Actions - Stubs
      offerCeasefire: (warId) => {
        console.log(`Ceasefire offer: ${warId}`);
        // TODO: Phase 2 - Process ceasefire
      },

      launchNuclearStrike: (warId) => {
        console.log(`Nuclear strike: ${warId}`);
        // TODO: Phase 2 - Process nuclear strike
      },

      // UN Summit - Stubs
      acceptProposal: (proposalId) => {
        console.log(`Accept proposal: ${proposalId}`);
        // TODO: Phase 2 - Accept UN proposal
      },

      rejectProposal: (proposalId) => {
        console.log(`Reject proposal: ${proposalId}`);
        // TODO: Phase 2 - Reject UN proposal
      },
    }),
    {
      name: 'conflict-save',
      partialize: (state) => ({ game: state.game }),
    }
  )
);
