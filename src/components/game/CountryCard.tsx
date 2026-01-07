// ============================================
// Country Card - Display Country Status
// ============================================

import type {
  CountryId,
  CountryState,
  DiplomaticAction,
  RelationshipLevel,
} from '../../types/game';
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../../utils/countryData';

// Relationship level colors matching tailwind.config.js
const RELATIONSHIP_COLORS: Record<RelationshipLevel, string> = {
  military_pact: 'bg-relationship-military-pact text-white',
  profitable: 'bg-relationship-profitable text-gray-900',
  beneficial: 'bg-relationship-beneficial text-gray-900',
  favourable: 'bg-relationship-favourable text-gray-900',
  satisfactory: 'bg-relationship-satisfactory text-gray-900',
  cool: 'bg-relationship-cool text-gray-900',
  lamentable: 'bg-relationship-lamentable text-gray-900',
  hostile: 'bg-relationship-hostile text-gray-900',
  war: 'bg-relationship-war text-white',
};

const RELATIONSHIP_NAMES: Record<RelationshipLevel, string> = {
  military_pact: 'Military Pact',
  profitable: 'Profitable',
  beneficial: 'Beneficial',
  favourable: 'Favourable',
  satisfactory: 'Satisfactory',
  cool: 'Cool',
  lamentable: 'Lamentable',
  hostile: 'Hostile',
  war: 'War',
};

interface CountryCardProps {
  country: CountryState;
  currentAction?: DiplomaticAction;
  onActionChange?: (countryId: CountryId, action: DiplomaticAction) => void;
  onSelect?: (countryId: CountryId) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export function CountryCard({
  country,
  currentAction,
  onActionChange,
  onSelect,
  isSelected = false,
  showActions = true,
}: CountryCardProps) {
  const isDefeated = country.isDefeated;
  const isAtWar = country.relationship === 'war';

  return (
    <div
      className={`card p-4 transition-all ${
        isSelected ? 'ring-2 ring-game-accent' : ''
      } ${isDefeated ? 'opacity-50' : ''}`}
      onClick={() => onSelect?.(country.id)}
    >
      {/* Header Row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl" role="img" aria-label={COUNTRY_NAMES[country.id]}>
          {COUNTRY_FLAGS[country.id]}
        </span>
        <div className="flex-1">
          <h3 className="font-medium text-game-text-primary">
            {COUNTRY_NAMES[country.id]}
          </h3>
          <p className="text-xs text-game-text-secondary">
            Leader: {country.leader.name}
          </p>
        </div>
        {/* Relationship Badge */}
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            RELATIONSHIP_COLORS[country.relationship]
          }`}
        >
          {isDefeated ? 'Defeated' : RELATIONSHIP_NAMES[country.relationship]}
        </span>
      </div>

      {/* Status Row */}
      <div className="flex items-center gap-4 text-xs text-game-text-secondary mb-3">
        <span>Stability: {country.stability.replace('_', ' ')}</span>
        <span>Stance: {country.stance}</span>
        {country.nuclearStage !== 'none' && (
          <span className="text-yellow-500">Nuclear: {country.nuclearStage}</span>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && !isDefeated && !isAtWar && onActionChange && (
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
              currentAction === 'improve'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onActionChange(country.id, 'improve');
            }}
          >
            Improve
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
              currentAction === 'maintain'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onActionChange(country.id, 'maintain');
            }}
          >
            Maintain
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
              currentAction === 'worsen'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onActionChange(country.id, 'worsen');
            }}
          >
            Worsen
          </button>
        </div>
      )}

      {/* War Status */}
      {isAtWar && (
        <div className="mt-2 p-2 bg-red-900/30 rounded text-center">
          <span className="text-red-400 text-sm font-medium">At War</span>
        </div>
      )}

      {/* Defeated Status */}
      {isDefeated && (
        <div className="mt-2 p-2 bg-gray-900/50 rounded text-center">
          <span className="text-gray-400 text-sm">
            Defeated on turn {country.defeatedOnTurn}
          </span>
        </div>
      )}
    </div>
  );
}
