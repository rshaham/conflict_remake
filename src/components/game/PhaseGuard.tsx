// ============================================
// PhaseGuard - Enforces game phase routing
// ============================================
//
// Phase model:
// - 'news': Start of turn, must view news before hub
// - 'hub': Main turn phase, free navigation to all game screens
// - Resolution phases: Linear flow after end turn
//

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import type { GamePhase } from '../../types/game';

// Routes that are always accessible during 'hub' phase (main turn)
const HUB_ACCESSIBLE_ROUTES = [
  '/game/hub',
  '/game/diplomatic',
  '/game/intelligence',
  '/game/military',
  '/game/arms',
  '/game/nuclear',
  '/game/territories',
  '/game/war',
];

// Map resolution phases to their specific routes
const RESOLUTION_PHASE_ROUTES: Partial<Record<GamePhase, string>> = {
  news: '/game/news',
  airstrike_report: '/game/airstrike-report',
  war_report: '/game/war-report',
  monthly_summary: '/game/monthly-summary',
  un_summit: '/game/summit',
  game_over: '/game/over',
};

interface PhaseGuardProps {
  children: React.ReactNode;
}

export function PhaseGuard({ children }: PhaseGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGameStore((state) => state.game);

  useEffect(() => {
    const currentPath = location.pathname;

    // Not on a game route - no guarding needed
    if (!currentPath.startsWith('/game')) {
      return;
    }

    // No game in progress - redirect to title
    if (!game) {
      navigate('/', { replace: true });
      return;
    }

    const phase = game.phase;

    // During 'hub' phase (main turn), allow free navigation to hub-accessible routes
    if (phase === 'hub' || phase === 'diplomatic' || phase === 'intelligence' || phase === 'military' || phase === 'war' || phase === 'palestinian') {
      // All these phases allow hub navigation
      if (HUB_ACCESSIBLE_ROUTES.includes(currentPath)) {
        return; // Allow
      }
      // If on wrong route, redirect to hub
      navigate('/game/hub', { replace: true });
      return;
    }

    // For resolution phases, enforce specific routes
    const expectedRoute = RESOLUTION_PHASE_ROUTES[phase];
    if (expectedRoute && currentPath !== expectedRoute) {
      navigate(expectedRoute, { replace: true });
      return;
    }

  }, [game, game?.phase, location.pathname, navigate]);

  return <>{children}</>;
}

// Export for use in other components
export { HUB_ACCESSIBLE_ROUTES, RESOLUTION_PHASE_ROUTES };
