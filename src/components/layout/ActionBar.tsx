// ============================================
// Action Bar - End Turn Button
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
  const endTurn = useGameStore((state) => state.endTurn);

  // Don't show on special phases or when no game
  if (!game || game.phase === 'un_summit' || game.phase === 'game_over') {
    return null;
  }

  // Default action: End Turn (can be overridden by props)
  const primary = primaryAction || {
    label: 'End Turn',
    onClick: () => { endTurn(); navigate('/game/news'); },
    variant: 'danger' as const,
  };

  const secondary = secondaryAction || null;

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
        <button
          type="button"
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
      </div>
    </div>
  );
}
