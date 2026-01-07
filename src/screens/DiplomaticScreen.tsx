// ============================================
// Diplomatic Screen - Manage Relations
// ============================================

import { useState } from 'react';
import { GameLayout } from '../components/layout/GameLayout';
import { CountryCard } from '../components/game/CountryCard';
import { useGameStore } from '../store/gameStore';
import type { CountryId, DiplomaticAction } from '../types/game';

// The four neighboring countries (primary focus)
const NEIGHBOR_COUNTRIES: CountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

// Other countries in the region
const OTHER_COUNTRIES: CountryId[] = ['iraq', 'iran', 'libya'];

export function DiplomaticScreen() {
  const { game, setDiplomaticAction } = useGameStore();
  const [selectedCountry, setSelectedCountry] = useState<CountryId | null>(null);

  // If no game is loaded, show placeholder
  if (!game) {
    return (
      <GameLayout>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const diplomaticActions = game.player.turnActions.diplomaticActions;

  const handleActionChange = (countryId: CountryId, action: DiplomaticAction) => {
    setDiplomaticAction(countryId, action);
  };

  const handleCountrySelect = (countryId: CountryId) => {
    setSelectedCountry(selectedCountry === countryId ? null : countryId);
  };

  return (
    <GameLayout>
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-game-text-primary">
            Diplomatic Relations
          </h2>
          <p className="text-sm text-game-text-secondary">
            Set your diplomatic stance with each country
          </p>
        </div>

        {/* Mini Map Placeholder */}
        <div className="card mb-4 h-32 flex items-center justify-center bg-game-bg-dark border border-gray-700">
          <div className="text-center">
            <p className="text-game-text-secondary text-sm">Regional Map</p>
            <p className="text-xs text-game-text-secondary opacity-60">
              Coming in Phase 5
            </p>
          </div>
        </div>

        {/* Neighboring Countries (Primary Enemies) */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-game-text-secondary uppercase tracking-wide mb-3">
            Neighboring Countries
          </h3>
          <div className="space-y-3">
            {NEIGHBOR_COUNTRIES.map((countryId) => {
              const country = game.countries[countryId];
              return (
                <CountryCard
                  key={countryId}
                  country={country}
                  currentAction={diplomaticActions[countryId]}
                  onActionChange={handleActionChange}
                  onSelect={handleCountrySelect}
                  isSelected={selectedCountry === countryId}
                  showActions={true}
                />
              );
            })}
          </div>
        </div>

        {/* Other Regional Powers */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-game-text-secondary uppercase tracking-wide mb-3">
            Regional Powers
          </h3>
          <div className="space-y-3">
            {OTHER_COUNTRIES.map((countryId) => {
              const country = game.countries[countryId];
              return (
                <CountryCard
                  key={countryId}
                  country={country}
                  currentAction={diplomaticActions[countryId]}
                  onActionChange={handleActionChange}
                  onSelect={handleCountrySelect}
                  isSelected={selectedCountry === countryId}
                  showActions={true}
                />
              );
            })}
          </div>
        </div>

        {/* Victory Progress */}
        <div className="card p-4 bg-game-bg-dark">
          <h3 className="text-sm font-semibold text-game-text-secondary mb-2">
            Victory Progress
          </h3>
          <div className="flex items-center gap-2">
            {NEIGHBOR_COUNTRIES.map((countryId) => {
              const country = game.countries[countryId];
              return (
                <div
                  key={countryId}
                  className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
                    country.isDefeated
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {countryId.charAt(0).toUpperCase() + countryId.slice(1, 3)}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-game-text-secondary mt-2 text-center">
            Defeat all 4 neighbors to win
          </p>
        </div>

        {/* Phase indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
            Diplomatic Phase
          </span>
        </div>
      </div>
    </GameLayout>
  );
}
