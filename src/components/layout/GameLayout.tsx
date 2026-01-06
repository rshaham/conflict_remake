// ============================================
// Game Layout - Main Layout Wrapper
// ============================================

import type { ReactNode } from 'react';
import { StatusBar } from './StatusBar';
import { NavBar } from './NavBar';
import { ActionBar } from './ActionBar';

interface GameLayoutProps {
  children: ReactNode;
  showActionBar?: boolean;
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

export function GameLayout({
  children,
  showActionBar = true,
  primaryAction,
  secondaryAction,
}: GameLayoutProps) {
  return (
    <div className="min-h-screen bg-game-bg-dark">
      <StatusBar />

      <main className="screen-container">
        {children}
      </main>

      {showActionBar && (
        <ActionBar
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
        />
      )}

      <NavBar />
    </div>
  );
}
