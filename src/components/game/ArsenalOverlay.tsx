// ============================================
// Arsenal Overlay - Military Forces Display
// ============================================
// Slide-up panel showing current military assets

import { useGameStore } from '../../store/gameStore';
import { COUNTRY_NAMES } from '../../utils/countryData';
import type { NeighborCountryId, NuclearStage } from '../../types/game';

interface ArsenalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NEIGHBOR_BORDERS: NeighborCountryId[] = ['egypt', 'syria', 'jordan', 'lebanon'];

const NUCLEAR_STAGE_DISPLAY: Record<NuclearStage, { label: string; progress: number }> = {
  none: { label: 'NOT STARTED', progress: 0 },
  research: { label: 'RESEARCH', progress: 25 },
  development: { label: 'DEVELOPMENT', progress: 50 },
  testing: { label: 'TESTING', progress: 75 },
  operational: { label: 'OPERATIONAL', progress: 100 },
};

function formatBudget(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(2)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export function ArsenalOverlay({ isOpen, onClose }: ArsenalOverlayProps) {
  const game = useGameStore((state) => state.game);

  if (!game) {
    return null;
  }

  const { arsenal, deployedTroops, nuclearStage, nuclearProgress, budget } = game.player;
  const nuclearDisplay = NUCLEAR_STAGE_DISPLAY[nuclearStage];

  // Ground forces
  const lightTanks = arsenal.light_tank || 0;
  const mainBattleTanks = arsenal.main_battle_tank || 0;
  const infantryBrigades = arsenal.infantry_brigade || 0;

  // Air forces
  const fighters = arsenal.fighter_aircraft || 0;
  const antiTankHelos = arsenal.anti_tank_helicopter || 0;
  const antiSamHelos = arsenal.anti_sam_helicopter || 0;

  // Air defense
  const samBatteries = arsenal.sam_battery || 0;

  // Calculate total deployed
  const totalDeployed = NEIGHBOR_BORDERS.reduce(
    (sum, border) => sum + (deployedTroops[border] || 0),
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-up Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white border-t-2 border-l-2 border-r-2 border-black max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-black text-white p-3 flex items-center justify-between">
            <div>
              <h2 className="font-pixel text-sm">ARSENAL</h2>
              <div className="font-mono text-[8px] text-green-400 uppercase tracking-wider">
                Military Forces Overview
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border-2 border-white text-white font-mono font-bold hover:bg-white hover:text-black transition-colors"
            >
              X
            </button>
          </div>

          {/* Content */}
          <div className="p-3 space-y-3">
            {/* Budget */}
            <div className="p-2 bg-gray-100 border-2 border-black">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-600 uppercase">Budget</span>
                <span className="font-mono text-lg font-bold text-green-700">
                  {formatBudget(budget)}
                </span>
              </div>
            </div>

            {/* Ground Forces */}
            <div className="border-2 border-black p-2">
              <div className="font-mono font-bold text-[10px] uppercase mb-2 pb-1 border-b border-gray-300">
                Ground Forces
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ForceItem label="LIGHT TANK" count={lightTanks} />
                <ForceItem label="MBT" count={mainBattleTanks} />
                <ForceItem label="INFANTRY" count={infantryBrigades} />
              </div>
            </div>

            {/* Air Forces */}
            <div className="border-2 border-black p-2">
              <div className="font-mono font-bold text-[10px] uppercase mb-2 pb-1 border-b border-gray-300">
                Air Forces
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ForceItem label="FIGHTERS" count={fighters} />
                <ForceItem label="ANTI-TANK" count={antiTankHelos} />
                <ForceItem label="ANTI-SAM" count={antiSamHelos} />
              </div>
            </div>

            {/* Air Defense */}
            <div className="border-2 border-black p-2">
              <div className="font-mono font-bold text-[10px] uppercase mb-2 pb-1 border-b border-gray-300">
                Air Defense
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ForceItem label="SAM" count={samBatteries} />
                <div />
                <div />
              </div>
            </div>

            {/* Nuclear Program */}
            <div className="border-2 border-black p-2">
              <div className="font-mono font-bold text-[10px] uppercase mb-2 pb-1 border-b border-gray-300">
                Nuclear Program
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-gray-600">STATUS</span>
                <span
                  className={`font-mono text-[10px] font-bold ${
                    nuclearStage === 'operational'
                      ? 'text-red-600'
                      : nuclearStage === 'none'
                      ? 'text-gray-400'
                      : 'text-yellow-600'
                  }`}
                >
                  {nuclearDisplay.label}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-3 bg-gray-200 border border-gray-400 relative">
                <div
                  className={`h-full transition-all ${
                    nuclearStage === 'operational' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{
                    width: `${
                      nuclearStage === 'none'
                        ? 0
                        : nuclearDisplay.progress +
                          (nuclearProgress / 12) * 25 // Assume 12 months per stage
                    }%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[8px] font-bold">
                    {nuclearStage !== 'none' && nuclearStage !== 'operational'
                      ? `${nuclearProgress}/12 MONTHS`
                      : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Deployed Troops */}
            <div className="border-2 border-black p-2">
              <div className="font-mono font-bold text-[10px] uppercase mb-2 pb-1 border-b border-gray-300 flex justify-between">
                <span>Deployed Troops</span>
                <span className="text-blue-600">{totalDeployed}/{infantryBrigades}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {NEIGHBOR_BORDERS.map((border) => (
                  <BorderDeployment
                    key={border}
                    border={border}
                    count={deployedTroops[border] || 0}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-100 border-t-2 border-black">
            <div className="font-mono text-[8px] text-center text-gray-500 uppercase">
              Tap outside to close
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper component for force display
function ForceItem({ label, count }: { label: string; count: number }) {
  return (
    <div className="p-2 bg-gray-50 border border-gray-300 text-center">
      <div className="font-mono text-lg font-bold text-blue-700">{count}</div>
      <div className="font-mono text-[8px] text-gray-500">{label}</div>
    </div>
  );
}

// Helper component for border deployment
function BorderDeployment({
  border,
  count,
}: {
  border: NeighborCountryId;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-300">
      <span className="font-mono text-[10px] font-bold">{COUNTRY_NAMES[border]}</span>
      <span
        className={`font-mono text-[10px] font-bold ${
          count > 0 ? 'text-green-600' : 'text-gray-400'
        }`}
      >
        {count} BDE
      </span>
    </div>
  );
}
