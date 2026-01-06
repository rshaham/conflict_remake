// ============================================
// App - Root Component with Routing
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Screens
import { TitleScreen } from './screens/TitleScreen';
import { NewsScreen } from './screens/NewsScreen';
import { DiplomaticScreen } from './screens/DiplomaticScreen';
import { IntelligenceScreen } from './screens/IntelligenceScreen';
import { MilitaryScreen } from './screens/MilitaryScreen';
import { PalestinianScreen } from './screens/PalestinianScreen';
import { WarScreen } from './screens/WarScreen';
import { UNSummitScreen } from './screens/UNSummitScreen';
import { GameOverScreen } from './screens/GameOverScreen';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Title / Main Menu */}
          <Route path="/" element={<TitleScreen />} />

          {/* Game Screens */}
          <Route path="/game/news" element={<NewsScreen />} />
          <Route path="/game/diplomatic" element={<DiplomaticScreen />} />
          <Route path="/game/intelligence" element={<IntelligenceScreen />} />
          <Route path="/game/military" element={<MilitaryScreen />} />
          <Route path="/game/palestinian" element={<PalestinianScreen />} />
          <Route path="/game/war" element={<WarScreen />} />
          <Route path="/game/summit" element={<UNSummitScreen />} />
          <Route path="/game/over" element={<GameOverScreen />} />

          {/* Fallback - redirect to title */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
