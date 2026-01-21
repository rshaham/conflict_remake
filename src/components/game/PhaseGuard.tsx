// ============================================
// PhaseGuard - Enforces current game phase routing
// ============================================

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { GamePhase } from '../../types/game';

// Map phases to their routes
const PHASE_ROUTES: Record<GamePhase, string> = {
  news: '/game/news',
  events: '/game/events',
  diplomatic: '/game/diplomatic',
  intelligence: '/game/intelligence',
  military: '/game/military',
  war: '/game/war',
  palestinian: '/game/territories',
  resolution: '/game/resolution',
  airstrike_report: '/game/airstrike-report',
  war_report: '/game/war-report',
  monthly_summary: '/game/monthly-summary',
  un_summit: '/game/summit',
  game_over: '/game/over',
};

// Map routes back to phases (for validation)
const ROUTE_PHASES: Record<string, GamePhase> = Object.entries(PHASE_ROUTES).reduce(
  (acc, [phase, route]) => ({ ...acc, [route]: phase as GamePhase }),
  {} as Record<string, GamePhase>
);

interface PhaseGuardProps {
  children: React.ReactNode;
}

export function PhaseGuard({ children }: PhaseGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGameStore((state) => state.game);

  useEffect(() => {
    // No game in progress - redirect to title
    if (!game) {
      if (location.pathname.startsWith('/game')) {
        navigate('/', { replace: true });
      }
      return;
    }

    // Get expected route for current phase
    const expectedRoute = PHASE_ROUTES[game.phase];
    const currentPath = location.pathname;

    // Allow arsenal overlay routes (they don't change phase)
    if (currentPath === '/game/arsenal') {
      return;
    }

    // If on a game route but wrong phase, redirect
    if (currentPath.startsWith('/game') && currentPath !== expectedRoute) {
      navigate(expectedRoute, { replace: true });
    }
  }, [game, game?.phase, location.pathname, navigate]);

  return <>{children}</>;
}

export { PHASE_ROUTES, ROUTE_PHASES };
