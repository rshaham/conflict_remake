// ============================================
// Phase Controls - Turn Advancement Controls
// ============================================

import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { GamePhase } from '../../types/game';

const PHASE_ROUTES: Record<GamePhase, string> = {
  news: '/game/news',
  events: '/game/news',
  diplomatic: '/game/diplomatic',
  intelligence: '/game/intelligence',
  military: '/game/military',
  palestinian: '/game/palestinian',
  resolution: '/game/news',
  un_summit: '/game/summit',
  game_over: '/game/over',
};

const NEXT_PHASE: Partial<Record<GamePhase, GamePhase>> = {
  news: 'diplomatic',
  diplomatic: 'intelligence',
  intelligence: 'military',
};

interface PhaseControlsProps {
  className?: string;
}

export function PhaseControls({ className = '' }: PhaseControlsProps) {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);
  const endTurn = useGameStore((state) => state.endTurn);
  const isLoading = useGameStore((state) => state.isLoading);
  const navigate = useNavigate();

  if (!game) return null;

  const { phase } = game;

  const handleContinue = () => {
    advancePhase();
    const nextPhase = NEXT_PHASE[phase];
    if (nextPhase) {
      navigate(PHASE_ROUTES[nextPhase]);
    }
  };

  const handleEndTurn = async () => {
    await endTurn();
    // After turn resolution, navigate based on new phase
    const updatedGame = useGameStore.getState().game;
    if (updatedGame) {
      navigate(PHASE_ROUTES[updatedGame.phase]);
    }
  };

  // Render different buttons based on phase
  if (phase === 'news' || phase === 'diplomatic' || phase === 'intelligence') {
    const nextPhaseName = NEXT_PHASE[phase];
    return (
      <div className={`fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-game-bg-dark to-transparent ${className}`}>
        <button
          onClick={handleContinue}
          className="w-full btn-primary py-3 text-lg font-semibold"
        >
          Continue to {nextPhaseName ? nextPhaseName.charAt(0).toUpperCase() + nextPhaseName.slice(1) : 'Next'} Phase
        </button>
      </div>
    );
  }

  if (phase === 'military') {
    return (
      <div className={`fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-game-bg-dark to-transparent ${className}`}>
        <button
          onClick={handleEndTurn}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 text-lg font-semibold rounded-lg transition-colors"
        >
          {isLoading ? 'Processing Turn...' : 'End Turn'}
        </button>
        <p className="text-xs text-center text-game-text-secondary mt-2">
          Point of no return - all actions will be executed
        </p>
      </div>
    );
  }

  if (phase === 'un_summit') {
    return (
      <div className={`fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-game-bg-dark to-transparent ${className}`}>
        <button
          onClick={() => {
            advancePhase();
            navigate('/game/news');
          }}
          className="w-full btn-primary py-3 text-lg font-semibold"
        >
          Leave Summit
        </button>
      </div>
    );
  }

  return null;
}
