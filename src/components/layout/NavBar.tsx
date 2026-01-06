// ============================================
// Nav Bar - Bottom Navigation
// ============================================

import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'news', label: 'News', path: '/game/news', icon: '📰' },
  { id: 'diplomatic', label: 'Diplo', path: '/game/diplomatic', icon: '🤝' },
  { id: 'intelligence', label: 'Intel', path: '/game/intelligence', icon: '🕵️' },
  { id: 'military', label: 'Military', path: '/game/military', icon: '⚔️' },
  { id: 'menu', label: 'Menu', path: '/game/menu', icon: '☰' },
];

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const game = useGameStore((state) => state.game);

  // Don't show nav bar on title screen or when no game
  if (!game || location.pathname === '/') {
    return null;
  }

  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-game-bg-card border-t border-gray-700 z-50">
      <div className="h-full flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-game-accent bg-opacity-20 text-game-accent'
                  : 'text-game-text-secondary hover:text-game-text-primary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
