// ============================================
// Action Bar - Contextual Actions
// ============================================

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';

interface ActionBarProps {
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'danger';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export function ActionBar({ primaryAction, secondaryAction }: ActionBarProps) {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);
  const endTurn = useGameStore((state) => state.endTurn);

  // Default actions based on game phase
  const getDefaultActions = (): {
    primary: ActionBarProps['primaryAction'] | null;
    secondary: ActionBarProps['secondaryAction'] | null;
  } => {
    if (!game) return { primary: null, secondary: null };

    switch (game.phase) {
      case 'news':
        return {
          primary: { label: 'Continue', onClick: advancePhase },
          secondary: null,
        };
      case 'diplomatic':
        return {
          primary: { label: 'Intelligence →', onClick: advancePhase },
          secondary: { label: '← News', onClick: () => navigate('/game/news') },
        };
      case 'intelligence':
        return {
          primary: { label: 'Military →', onClick: advancePhase },
          secondary: { label: '← Diplomatic', onClick: () => navigate('/game/diplomatic') },
        };
      case 'military':
        return {
          primary: { label: 'End Turn', onClick: () => endTurn(), variant: 'danger' as const },
          secondary: { label: '← Intelligence', onClick: () => navigate('/game/intelligence') },
        };
      default:
        return { primary: null, secondary: null };
    }
  };

  const defaults = getDefaultActions();
  const primary = primaryAction || defaults.primary;
  const secondary = secondaryAction || defaults.secondary;

  if (!primary && !secondary) {
    return null;
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-game-bg-dark to-transparent">
      <div className="flex gap-3 max-w-md mx-auto">
        {secondary && (
          <button
            onClick={secondary.onClick}
            disabled={secondary.disabled}
            className="btn-secondary flex-1"
          >
            {secondary.label}
          </button>
        )}
        {primary && (
          <button
            onClick={primary.onClick}
            disabled={primary.disabled}
            className={`flex-1 ${
              primary.variant === 'danger'
                ? 'btn-primary bg-red-600 hover:bg-red-700'
                : 'btn-primary'
            }`}
          >
            {primary.label}
          </button>
        )}
      </div>
    </div>
  );
}
