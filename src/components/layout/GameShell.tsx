// ============================================
// GameShell - Unified Game Layout Component
// ============================================
// Provides consistent structure across all game screens:
// - Persistent status bar
// - Clear screen header with back navigation
// - Scrollable content area
// - Optional footer action

import { useNavigate, useLocation } from 'react-router-dom';
import { Scanlines } from '../ui/Scanlines';
import { useGameStore } from '../../store/gameStore';

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

// Screen metadata for consistent display
const SCREEN_META: Record<string, { title: string; subtitle: string; color: string }> = {
  '/game/hub': { title: 'COMMAND CENTER', subtitle: 'Main Operations', color: 'bg-black' },
  '/game/diplomatic': { title: 'DIPLOMATIC', subtitle: 'Foreign Relations', color: 'bg-blue-700' },
  '/game/intelligence': { title: 'INTELLIGENCE', subtitle: 'Mossad Operations', color: 'bg-purple-700' },
  '/game/military': { title: 'MILITARY', subtitle: 'Strategic Command', color: 'bg-red-700' },
  '/game/arms': { title: 'ARMS DEALER', subtitle: 'Procurement', color: 'bg-amber-700' },
  '/game/nuclear': { title: 'NUCLEAR', subtitle: 'Project Jericho', color: 'bg-yellow-600' },
  '/game/territories': { title: 'TERRITORIES', subtitle: 'Palestinian Issue', color: 'bg-orange-700' },
  '/game/war': { title: 'WAR ROOM', subtitle: 'Combat Operations', color: 'bg-red-900' },
  '/game/news': { title: 'BRIEFING', subtitle: 'Intelligence Report', color: 'bg-gray-800' },
};

interface GameShellProps {
  children: React.ReactNode;
  showBack?: boolean;
  footer?: React.ReactNode;
  statusOverride?: React.ReactNode;
}

export function GameShell({ children, showBack = true, footer, statusOverride }: GameShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGameStore((state) => state.game);

  const screenMeta = SCREEN_META[location.pathname] || {
    title: 'CONFLICT',
    subtitle: 'Middle East Simulator',
    color: 'bg-black',
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <Scanlines />
        <p className="font-mono text-retro-text-dim">No game in progress</p>
      </div>
    );
  }

  const monthName = MONTH_NAMES[game.month - 1];
  const budgetM = Math.floor(game.player.budget / 1000000);
  const isAtWar = game.wars.length > 0;
  const isHub = location.pathname === '/game/hub';

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a]">
      <Scanlines />

      {/* === TOP STATUS BAR === */}
      <div className="shrink-0 bg-black border-b-2 border-[#333] px-3 py-2">
        <div className="flex justify-between items-center">
          {/* Budget */}
          <div className="flex items-center gap-3">
            <div className="font-mono text-[10px]">
              <span className="text-gray-500">BUDGET</span>
              <span className="text-green-400 font-bold ml-2">${budgetM}M</span>
            </div>
            <div className="w-px h-4 bg-gray-700" />
            <div className="font-mono text-[10px]">
              <span className="text-gray-500">PRESTIGE</span>
              <span className="text-amber-400 font-bold ml-2">{game.player.prestige}</span>
            </div>
          </div>

          {/* Turn & Date */}
          <div className="flex items-center gap-2">
            {isAtWar && (
              <span className="px-2 py-0.5 bg-red-900 text-red-300 font-mono text-[9px] font-bold animate-pulse">
                WAR
              </span>
            )}
            <div className="font-mono text-[10px] text-right">
              <span className="text-gray-500">TURN {game.turn}</span>
              <span className="text-white font-bold ml-2">{monthName} {game.year}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === SCREEN HEADER === */}
      <div className={`shrink-0 ${screenMeta.color} border-b-2 border-black`}>
        <div className="px-3 py-3 flex items-center gap-3">
          {/* Back button */}
          {showBack && !isHub && (
            <button
              type="button"
              onClick={() => navigate('/game/hub')}
              className="w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 border-2 border-white/20 text-white font-bold text-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Title */}
          <div className="flex-1">
            <h1 className="font-pixel text-xl text-white leading-none tracking-wide">
              {screenMeta.title}
            </h1>
            <div className="font-mono text-[10px] text-white/60 uppercase tracking-wider mt-0.5">
              {screenMeta.subtitle}
            </div>
          </div>

          {/* Optional status override (screen-specific) */}
          {statusOverride}
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 overflow-y-auto bg-[#f5f5dc]">
        {children}
      </div>

      {/* === FOOTER ACTION === */}
      {footer && (
        <div className="shrink-0 bg-white border-t-2 border-black p-3">
          {footer}
        </div>
      )}
    </div>
  );
}
