// ============================================
// Hub Screen - Central Command Interface
// ============================================
// Redesigned for clarity: clear visual hierarchy,
// grouped functions, prominent status indicators

import { useNavigate } from 'react-router-dom';
import { GameShell } from '../components/layout/GameShell';
import { useGameStore } from '../store/gameStore';

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  desc: string;
  path: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

// SVG Icons for cleaner look than emoji
const DiplomaticIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IntelIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const MilitaryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ArmsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const NuclearIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TerritoriesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'diplomacy',
    title: 'FOREIGN AFFAIRS',
    items: [
      {
        id: 'diplomatic',
        label: 'DIPLOMATIC',
        desc: 'Manage relations with neighboring states',
        path: '/game/diplomatic',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        icon: <DiplomaticIcon />,
      },
      {
        id: 'intel',
        label: 'INTELLIGENCE',
        desc: 'Covert operations and espionage',
        path: '/game/intelligence',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
        icon: <IntelIcon />,
      },
    ],
  },
  {
    id: 'military',
    title: 'DEFENSE',
    items: [
      {
        id: 'military',
        label: 'MILITARY',
        desc: 'Deploy forces and order airstrikes',
        path: '/game/military',
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-red-200 hover:bg-red-100',
        icon: <MilitaryIcon />,
      },
      {
        id: 'arms',
        label: 'ARMS DEALER',
        desc: 'Purchase weapons from vendors',
        path: '/game/arms',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
        icon: <ArmsIcon />,
      },
    ],
  },
  {
    id: 'special',
    title: 'SPECIAL PROGRAMS',
    items: [
      {
        id: 'nuclear',
        label: 'NUCLEAR',
        desc: 'Project Jericho development',
        path: '/game/nuclear',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
        icon: <NuclearIcon />,
      },
      {
        id: 'territories',
        label: 'TERRITORIES',
        desc: 'Palestinian situation management',
        path: '/game/territories',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        icon: <TerritoriesIcon />,
      },
    ],
  },
];

export function HubScreen() {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const endTurn = useGameStore((state) => state.endTurn);

  if (!game) {
    return null; // GameShell handles this
  }

  const handleEndTurn = () => {
    endTurn();
    navigate('/game/news');
  };

  const isAtWar = game.wars.length > 0;

  // Calculate some stats for the overview
  const totalArsenal = Object.values(game.player.arsenal).reduce((a, b) => a + b, 0);
  const deployedTroops = Object.values(game.player.deployedTroops).reduce((a, b) => a + b, 0);
  const defeatedCount = Object.values(game.countries).filter(c => c.isDefeated && c.id !== 'israel').length;

  const footer = (
    <button
      type="button"
      onClick={handleEndTurn}
      className="w-full py-4 bg-black text-white font-mono font-bold text-sm uppercase tracking-wider border-2 border-black retro-shadow hover:bg-gray-900 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
    >
      END TURN — EXECUTE ORDERS
    </button>
  );

  return (
    <GameShell showBack={false} footer={footer}>
      <div className="p-4 space-y-4">
        {/* === WAR ALERT === */}
        {isAtWar && (
          <button
            type="button"
            onClick={() => navigate('/game/war')}
            className="w-full p-4 bg-red-900 border-2 border-red-600 text-white flex items-center gap-4 hover:bg-red-800 transition-colors animate-pulse"
          >
            <div className="w-12 h-12 bg-red-700 rounded flex items-center justify-center shrink-0">
              <WarIcon />
            </div>
            <div className="flex-1 text-left">
              <div className="font-pixel text-lg">ACTIVE WAR</div>
              <div className="font-mono text-xs text-red-200">
                {game.wars.length} front{game.wars.length > 1 ? 's' : ''} — Requires immediate attention
              </div>
            </div>
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* === STATUS OVERVIEW === */}
        <div className="bg-white border-2 border-black p-4">
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-3">
            SITUATION OVERVIEW
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-gray-50 border border-gray-200">
              <div className="font-pixel text-xl text-green-600">{totalArsenal}</div>
              <div className="font-mono text-[8px] text-gray-500 uppercase">Units</div>
            </div>
            <div className="text-center p-2 bg-gray-50 border border-gray-200">
              <div className="font-pixel text-xl text-blue-600">{deployedTroops}</div>
              <div className="font-mono text-[8px] text-gray-500 uppercase">Deployed</div>
            </div>
            <div className="text-center p-2 bg-gray-50 border border-gray-200">
              <div className="font-pixel text-xl text-red-600">{game.wars.length}</div>
              <div className="font-mono text-[8px] text-gray-500 uppercase">Wars</div>
            </div>
            <div className="text-center p-2 bg-gray-50 border border-gray-200">
              <div className="font-pixel text-xl text-amber-600">{defeatedCount}/4</div>
              <div className="font-mono text-[8px] text-gray-500 uppercase">Victory</div>
            </div>
          </div>
        </div>

        {/* === MENU SECTIONS === */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.id}>
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-1">
              {section.title}
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`w-full p-3 border-2 flex items-center gap-4 transition-all ${item.bgColor}`}
                >
                  <div className={`w-10 h-10 border-2 border-current rounded flex items-center justify-center shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-mono font-bold text-sm ${item.color}`}>
                      {item.label}
                    </div>
                    <div className="font-mono text-[10px] text-gray-500">
                      {item.desc}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* === US RELATIONS INDICATOR === */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
              US RELATIONS
            </div>
            <div className={`font-mono font-bold text-sm ${
              game.player.usAttitude >= 50 ? 'text-green-600' :
              game.player.usAttitude >= 0 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {game.player.usAttitude > 0 ? '+' : ''}{game.player.usAttitude}
            </div>
          </div>
          <div className="h-3 bg-gray-200 border border-gray-300 relative overflow-hidden">
            <div
              className={`h-full transition-all ${
                game.player.usAttitude >= 50 ? 'bg-green-500' :
                game.player.usAttitude >= 0 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, (game.player.usAttitude + 100) / 2))}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-black/20" style={{ marginLeft: '50%' }} />
            </div>
          </div>
          <div className="flex justify-between font-mono text-[8px] text-gray-400 mt-1">
            <span>HOSTILE</span>
            <span>NEUTRAL</span>
            <span>ALLIED</span>
          </div>
        </div>

        {/* === KNESSET INDICATOR === */}
        <div className={`bg-white border-2 p-4 ${
          game.player.knessetDisapproval >= 8 ? 'border-red-600' : 'border-black'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
              KNESSET APPROVAL
            </div>
            <div className={`font-mono font-bold text-sm ${
              game.player.knessetDisapproval >= 8 ? 'text-red-600' :
              game.player.knessetDisapproval >= 5 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {(10 - game.player.knessetDisapproval).toFixed(0)}/10
            </div>
          </div>
          <div className="h-3 bg-gray-200 border border-gray-300 relative overflow-hidden">
            <div
              className={`h-full transition-all ${
                game.player.knessetDisapproval >= 8 ? 'bg-red-500' :
                game.player.knessetDisapproval >= 5 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.max(0, (10 - game.player.knessetDisapproval) * 10)}%` }}
            />
          </div>
          {game.player.knessetDisapproval >= 8 && (
            <div className="font-mono text-[9px] text-red-600 mt-2">
              WARNING: Government stability critical!
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
}
