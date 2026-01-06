// ============================================
// News Screen - Turn Start Headlines
// ============================================

import { GameLayout } from '../components/layout/GameLayout';

export function NewsScreen() {
  return (
    <GameLayout>
      <div className="p-4">
        {/* Newspaper Header */}
        <div className="card mb-4 text-center">
          <p className="text-xs text-game-text-secondary uppercase tracking-wider">
            The Jerusalem Post
          </p>
          <h1 className="text-2xl font-bold text-game-text-primary">
            Regional News
          </h1>
          <p className="text-sm text-game-text-secondary">
            January 1997
          </p>
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          <div className="card">
            <h3 className="font-medium text-game-text-primary">
              Tensions Rise in the Region
            </h3>
            <p className="text-sm text-game-text-secondary mt-1">
              Placeholder headline - AI generation in Phase 4
            </p>
          </div>

          <div className="card">
            <h3 className="font-medium text-game-text-primary">
              New Prime Minister Takes Office
            </h3>
            <p className="text-sm text-game-text-secondary mt-1">
              Following the assassination of your predecessor, you assume command.
            </p>
          </div>

          <div className="card">
            <h3 className="font-medium text-game-text-primary">
              Analysts Warn of Syrian Buildup
            </h3>
            <p className="text-sm text-game-text-secondary mt-1">
              Intelligence reports increased military activity on the Golan border.
            </p>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="mt-8 text-center">
          <p className="text-xs text-game-text-secondary">
            News Phase - Placeholder Screen
          </p>
        </div>
      </div>
    </GameLayout>
  );
}
