// ============================================
// Diplomatic Screen - Manage Relations
// ============================================

import { GameLayout } from '../components/layout/GameLayout';

const COUNTRIES = [
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬', relation: 'Cool' },
  { id: 'syria', name: 'Syria', flag: '🇸🇾', relation: 'Lamentable' },
  { id: 'jordan', name: 'Jordan', flag: '🇯🇴', relation: 'Satisfactory' },
  { id: 'lebanon', name: 'Lebanon', flag: '🇱🇧', relation: 'Cool' },
];

export function DiplomaticScreen() {
  return (
    <GameLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold text-game-text-primary mb-4">
          Diplomatic Relations
        </h2>

        {/* Mini Map Placeholder */}
        <div className="card mb-4 h-40 flex items-center justify-center bg-game-bg-dark">
          <p className="text-game-text-secondary">
            [Mini Map - Phase 5]
          </p>
        </div>

        {/* Country Cards */}
        <div className="space-y-3">
          {COUNTRIES.map((country) => (
            <div key={country.id} className="card flex items-center gap-4">
              <span className="text-3xl">{country.flag}</span>
              <div className="flex-1">
                <h3 className="font-medium text-game-text-primary">
                  {country.name}
                </h3>
                <p className="text-sm text-game-text-secondary">
                  Relationship: {country.relation}
                </p>
              </div>
              <button className="btn-secondary text-sm px-3 py-1">
                Details
              </button>
            </div>
          ))}
        </div>

        {/* Phase Indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-game-text-secondary">
            Diplomatic Phase - Placeholder Screen
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
