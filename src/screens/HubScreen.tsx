// ============================================
// Hub Screen - Central Navigation
// ============================================

import { useNavigate } from 'react-router-dom';
import { Scanlines } from '../components/ui/Scanlines';
import { useGameStore } from '../store/gameStore';

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  desc: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'diplomatic', label: 'DIPLOMATIC', icon: '🌐', desc: 'Foreign Relations', path: '/game/diplomatic' },
  { id: 'military', label: 'MILITARY', icon: '⚔️', desc: 'Strategic Command', path: '/game/military' },
  { id: 'intel', label: 'INTEL', icon: '👁️', desc: 'Covert Operations', path: '/game/intelligence' },
  { id: 'arms', label: 'ARMS', icon: '🛒', desc: 'Procurement', path: '/game/arms' },
  { id: 'nuclear', label: 'NUCLEAR', icon: '☢️', desc: 'Project Jericho', path: '/game/nuclear' },
  { id: 'territories', label: 'TERRITORIES', icon: '🗺️', desc: 'Palestinian Issue', path: '/game/territories' },
];

export function HubScreen() {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const endTurn = useGameStore((state) => state.endTurn);

  if (!game) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <Scanlines />
        <p className="font-mono text-retro-text-dim">No game in progress</p>
      </div>
    );
  }

  const monthName = MONTH_NAMES[game.month - 1];
  const dateStr = `${monthName} ${game.year}`;
  const budgetM = Math.floor(game.player.budget / 1000000);

  // Calculate readiness (simplified)
  const totalArsenal = Object.values(game.player.arsenal).reduce((a, b) => a + b, 0);
  const readiness = Math.min(100, Math.floor(totalArsenal * 2));

  const handleEndTurn = () => {
    endTurn();
    navigate('/game/news');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Check for active wars - show war room prominently
  if (game.wars.length > 0) {
    return (
      <div className="min-h-screen flex flex-col bg-retro-bg">
        <Scanlines />

        {/* Header */}
        <div className="shrink-0 p-3 bg-white border-b-2 border-black">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-pixel text-2xl leading-none">CONFLICT.EXE</h1>
              <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">System v2.0</div>
            </div>
            <div className="text-right font-mono text-[10px]">
              <div className="text-gray-500">DATE</div>
              <div className="font-bold">{dateStr}</div>
            </div>
          </div>
        </div>

        {/* Status bar (terminal style) */}
        <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
          <span>BUDGET: ${budgetM}M</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 animate-pulse" />
            WAR STATUS
          </span>
        </div>

        {/* War alert */}
        <div className="m-3 p-3 border-2 border-red-600 bg-red-50 retro-shadow-red">
          <div className="font-mono font-bold text-red-900 text-xs mb-2">
            ⚠️ ACTIVE MILITARY OPERATIONS
          </div>
          <button
            type="button"
            onClick={() => navigate('/game/war')}
            className="w-full py-3 bg-red-600 text-white font-mono font-bold text-sm uppercase border-2 border-black retro-shadow-sm hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            ENTER WAR ROOM
          </button>
        </div>

        {/* Menu grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className="bg-white border-2 border-black p-4 text-left retro-shadow retro-btn transition-all hover:-translate-y-0.5"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-mono font-bold text-[10px]">{item.label}</div>
                <div className="font-mono text-[8px] text-gray-500">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* End turn */}
        <div className="shrink-0 p-3 bg-white border-t-2 border-black">
          <button
            type="button"
            onClick={handleEndTurn}
            className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            END TURN — ADVANCE →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />

      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-pixel text-2xl leading-none">CONFLICT.EXE</h1>
            <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">System v2.0</div>
          </div>
          <div className="text-right font-mono text-[10px]">
            <div className="text-gray-500">DATE</div>
            <div className="font-bold">{dateStr}</div>
          </div>
        </div>
      </div>

      {/* Status bar (terminal style) */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>BUDGET: ${budgetM}M</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 animate-pulse" />
          READY: {readiness}%
        </span>
      </div>

      {/* Menu grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.path)}
              className="bg-white border-2 border-black p-4 text-left retro-shadow retro-btn transition-all hover:-translate-y-0.5"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-mono font-bold text-[10px]">{item.label}</div>
              <div className="font-mono text-[8px] text-gray-500">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* End turn */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <button
          type="button"
          onClick={handleEndTurn}
          className="w-full py-3 bg-black text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          END TURN — ADVANCE →
        </button>
      </div>
    </div>
  );
}
