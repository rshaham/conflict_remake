// ============================================
// Menu Screen - Game Menu
// ============================================

import { useNavigate } from 'react-router-dom';
import { GameLayout } from '../components/layout/GameLayout';
import { useGameStore } from '../store/gameStore';

interface MenuItemProps {
  label: string;
  description?: string;
  icon: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

function MenuItem({ label, description, icon, onClick, variant = 'default' }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full card flex items-center gap-4 text-left transition-colors ${
        variant === 'danger'
          ? 'hover:bg-red-900/20 hover:border-red-800'
          : 'hover:bg-game-bg-dark'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className={`font-medium ${
          variant === 'danger' ? 'text-red-400' : 'text-game-text-primary'
        }`}>
          {label}
        </p>
        {description && (
          <p className="text-sm text-game-text-secondary">{description}</p>
        )}
      </div>
      <span className="text-game-text-secondary">›</span>
    </button>
  );
}

export function MenuScreen() {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);

  if (!game) {
    return (
      <GameLayout showActionBar={false}>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout showActionBar={false}>
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="card mb-6 text-center">
          <h1 className="text-xl font-bold text-game-text-primary">
            Game Menu
          </h1>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {/* Palestinian Situation */}
          <MenuItem
            icon="🏛️"
            label="Palestinian Situation"
            description={`Current level: ${game.player.palestinianLevel}`}
            onClick={() => navigate('/game/palestinian')}
          />

          {/* Game Status */}
          <MenuItem
            icon="📊"
            label="Game Status"
            description={`Turn ${game.turn}, ${game.year}`}
            onClick={() => navigate('/game/news')}
          />

          {/* Settings - Disabled for now */}
          <div className="w-full card flex items-center gap-4 text-left opacity-50 cursor-not-allowed">
            <span className="text-2xl">⚙️</span>
            <div className="flex-1">
              <p className="font-medium text-game-text-primary">Settings</p>
              <p className="text-sm text-game-text-secondary">Coming soon</p>
            </div>
          </div>

          {/* How to Play - Disabled for now */}
          <div className="w-full card flex items-center gap-4 text-left opacity-50 cursor-not-allowed">
            <span className="text-2xl">❓</span>
            <div className="flex-1">
              <p className="font-medium text-game-text-primary">How to Play</p>
              <p className="text-sm text-game-text-secondary">Coming soon</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-4" />

          {/* Return to Title */}
          <MenuItem
            icon="🚪"
            label="Return to Title"
            description="Save and exit to main menu"
            onClick={() => navigate('/')}
            variant="danger"
          />
        </div>
      </div>
    </GameLayout>
  );
}
