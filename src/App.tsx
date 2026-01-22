// ============================================
// App - Root Component with Routing
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import { PhaseGuard } from './components/game/PhaseGuard';

// Screens
import { TitleScreen } from './screens/TitleScreen';
import { NewsScreen } from './screens/NewsScreen';
import { DiplomaticScreen } from './screens/DiplomaticScreen';
import { IntelligenceScreen } from './screens/IntelligenceScreen';
import { MilitaryScreen } from './screens/MilitaryScreen';
import { ArmsScreen } from './screens/ArmsScreen';
import { NuclearScreen } from './screens/NuclearScreen';
import { PalestinianScreen } from './screens/PalestinianScreen';
import { WarScreen } from './screens/WarScreen';
import { UNSummitScreen } from './screens/UNSummitScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { AirstrikeReportScreen } from './screens/AirstrikeReportScreen';
import { MonthlySummaryScreen } from './screens/MonthlySummaryScreen';
import { WarReportScreen } from './screens/WarReportScreen';
import { HubScreen } from './screens/HubScreen';
// New screens will be added as we create them
// import { EventsScreen } from './screens/EventsScreen';

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
        <PhaseGuard>
          <Routes>
            {/* Title / Main Menu */}
            <Route path="/" element={<TitleScreen />} />

            {/* Main Game Flow */}
            <Route path="/game/news" element={<NewsScreen />} />
            <Route path="/game/hub" element={<HubScreen />} />
            {/* <Route path="/game/events" element={<EventsScreen />} /> */}
            <Route path="/game/diplomatic" element={<DiplomaticScreen />} />
            <Route path="/game/intelligence" element={<IntelligenceScreen />} />
            <Route path="/game/military" element={<MilitaryScreen />} />
            <Route path="/game/war" element={<WarScreen />} />

            {/* Resolution Interstitials */}
            <Route path="/game/airstrike-report" element={<AirstrikeReportScreen />} />
            <Route path="/game/war-report" element={<WarReportScreen />} />
            <Route path="/game/monthly-summary" element={<MonthlySummaryScreen />} />

            {/* Special Phases */}
            <Route path="/game/summit" element={<UNSummitScreen />} />
            <Route path="/game/territories" element={<PalestinianScreen />} />
            <Route path="/game/over" element={<GameOverScreen />} />

            {/* Sub-screens (accessible from phases, don't change phase) */}
            <Route path="/game/arms" element={<ArmsScreen />} />
            <Route path="/game/nuclear" element={<NuclearScreen />} />

            {/* Fallback - redirect to title */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhaseGuard>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
