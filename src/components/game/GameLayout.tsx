// ============================================
// GameLayout - Common layout wrapper for game screens
// ============================================

import { useState } from 'react';
import { Scanlines } from '../ui/Scanlines';
import { ArsenalOverlay } from './ArsenalOverlay';
import { ArsenalButton } from './ArsenalButton';
import { useGameStore } from '../../store/gameStore';

interface GameLayoutProps {
  children: React.ReactNode;
  /** Hide the arsenal button (e.g., on resolution screens) */
  hideArsenal?: boolean;
}

export function GameLayout({ children, hideArsenal = false }: GameLayoutProps) {
  const [arsenalOpen, setArsenalOpen] = useState(false);
  const game = useGameStore((state) => state.game);

  // Don't show arsenal button if no game
  const showArsenalButton = !hideArsenal && game !== null;

  return (
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />
      {children}

      {showArsenalButton && (
        <>
          <ArsenalButton onClick={() => setArsenalOpen(true)} />
          <ArsenalOverlay isOpen={arsenalOpen} onClose={() => setArsenalOpen(false)} />
        </>
      )}
    </div>
  );
}
