// ============================================
// Nuclear Screen - Project Jericho
// ============================================
// Dedicated nuclear program management screen
// Split from MilitaryScreen for focused experience

import { useNavigate } from 'react-router-dom';
import { Scanlines } from '../components/ui/Scanlines';
import { HatchedBar } from '../components/ui/HatchedBar';
import { useGameStore } from '../store/gameStore';

// Nuclear stages with progress thresholds
const NUCLEAR_STAGES = {
  none: { name: 'NO PROGRAM', progress: 0, desc: 'Nuclear research not initiated' },
  research: { name: 'RESEARCH', progress: 25, desc: 'Theoretical physics and feasibility studies' },
  development: { name: 'DEVELOPMENT', progress: 50, desc: 'Uranium enrichment and weapon design' },
  testing: { name: 'TESTING', progress: 75, desc: 'Underground test preparations' },
  operational: { name: 'OPERATIONAL', progress: 100, desc: 'Nuclear deterrent capability achieved' },
};

const MONTHLY_COST = 20000000; // $20M

export function NuclearScreen() {
  const navigate = useNavigate();
  const { game, fundNuclear } = useGameStore();

  if (!game) {
    return (
      <div className="min-h-screen bg-retro-bg flex items-center justify-center">
        <Scanlines />
        <p className="font-mono text-retro-text-dim">No game in progress</p>
      </div>
    );
  }

  const currentStage = game.player.nuclearStage;
  const stageInfo = NUCLEAR_STAGES[currentStage];
  const isFunding = game.player.turnActions.fundedNuclear;
  const isOperational = currentStage === 'operational';
  const progress = game.player.nuclearProgress;

  // Calculate estimated months to operational (simplified)
  const estimatedMonths = isOperational ? 0 : Math.max(0, 48 - progress);

  // Budget check
  const budgetM = Math.floor(game.player.budget / 1000000);
  const canAfford = game.player.budget >= MONTHLY_COST;

  return (
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />

      {/* Header with back button */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/game/hub')}
          className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white retro-shadow-sm hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          ←
        </button>
        <div>
          <h1 className="font-pixel text-lg leading-none">PROJECT JERICHO</h1>
          <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">Nuclear Program</div>
        </div>
      </div>

      {/* Terminal-style status display */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>BUDGET: ${budgetM}M</span>
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 ${isOperational ? 'bg-yellow-500' : isFunding ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          {isOperational ? 'DETERRENT ACTIVE' : isFunding ? 'R&D IN PROGRESS' : 'PROGRAM PAUSED'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Large Nuclear Icon Display */}
        <div className="bg-white border-2 border-black retro-shadow p-6 text-center">
          <div className={`text-8xl mb-4 ${isOperational ? 'animate-pulse' : ''}`}>
            ☢️
          </div>
          <div className={`font-pixel text-2xl ${isOperational ? 'text-yellow-600' : 'text-gray-800'}`}>
            {stageInfo.name}
          </div>
          <div className="font-mono text-[10px] text-gray-500 mt-2">
            {stageInfo.desc}
          </div>
        </div>

        {/* Progress Display */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-3 pb-1 border-b border-gray-300">
            Development Progress
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between mb-3">
            {Object.entries(NUCLEAR_STAGES).map(([key, stage]) => {
              const isActive = key === currentStage;
              const isPast = stage.progress < stageInfo.progress;
              return (
                <div
                  key={key}
                  className={`text-center flex-1 ${key !== 'none' ? 'border-l border-gray-300' : ''}`}
                >
                  <div className={`font-mono text-[8px] font-bold ${
                    isActive ? 'text-yellow-600' : isPast ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {key === 'none' ? '—' : key.slice(0, 3).toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <HatchedBar
            value={stageInfo.progress}
            label="OVERALL PROGRESS"
            showDanger={false}
          />

          {/* Months Counter */}
          {!isOperational && (
            <div className="mt-3 p-2 bg-gray-100 border border-gray-300 font-mono text-[10px] text-center">
              <span className="text-gray-600">MONTHS OF R&D: </span>
              <span className="font-bold text-blue-600">{progress}</span>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-gray-600">EST. REMAINING: </span>
              <span className="font-bold text-orange-600">{estimatedMonths}</span>
            </div>
          )}
        </div>

        {/* Funding Control */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-3 pb-1 border-b border-gray-300">
            Funding Allocation
          </div>

          {isOperational ? (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-600 text-center">
              <div className="font-mono font-bold text-yellow-700 text-sm mb-1">
                NUCLEAR CAPABILITY ACHIEVED
              </div>
              <div className="font-mono text-[10px] text-yellow-600">
                Israel possesses nuclear deterrent capability
              </div>
            </div>
          ) : (
            <>
              {/* Cost Info */}
              <div className="mb-3 p-2 bg-gray-50 border border-gray-300">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-gray-600">Monthly R&D Cost:</span>
                  <span className="font-bold text-red-600">$20M</span>
                </div>
                <div className="flex justify-between font-mono text-[10px] mt-1">
                  <span className="text-gray-600">Available Budget:</span>
                  <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                    ${budgetM}M
                  </span>
                </div>
              </div>

              {/* Fund Button */}
              <button
                type="button"
                onClick={() => fundNuclear(!isFunding)}
                disabled={!canAfford && !isFunding}
                className={`w-full py-3 font-mono font-bold text-sm uppercase border-2 transition-all ${
                  isFunding
                    ? 'border-green-600 bg-green-100 text-green-800 retro-shadow-sm'
                    : canAfford
                    ? 'border-black bg-yellow-400 text-black retro-shadow-sm hover:bg-yellow-500 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                    : 'border-gray-400 bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFunding ? '✓ FUNDING ACTIVE — CLICK TO PAUSE' : 'ALLOCATE FUNDING'}
              </button>

              {!canAfford && !isFunding && (
                <div className="mt-2 font-mono text-[9px] text-red-600 text-center">
                  Insufficient budget for nuclear R&D
                </div>
              )}
            </>
          )}
        </div>

        {/* Strategic Information */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Strategic Brief
          </div>
          <div className="space-y-2 font-mono text-[10px] text-gray-700">
            <div className="p-2 bg-gray-50 border border-gray-200">
              <span className="font-bold">CODENAME:</span> Project Jericho
            </div>
            <div className="p-2 bg-gray-50 border border-gray-200">
              <span className="font-bold">FACILITY:</span> Dimona Research Center
            </div>
            <div className="p-2 bg-gray-50 border border-gray-200">
              <span className="font-bold">POLICY:</span> Nuclear ambiguity maintained
            </div>
            <div className="p-2 bg-red-50 border border-red-200 text-red-700">
              <span className="font-bold">WARNING:</span> Discovery by enemies may trigger preemptive strikes
            </div>
          </div>
        </div>

        {/* Consequences Panel */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Nuclear Capability Effects
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 border border-green-300 text-center">
              <div className="font-mono text-[10px] text-green-700">
                <div className="font-bold">DETERRENCE</div>
                <div className="text-[9px]">Enemies less likely to attack</div>
              </div>
            </div>
            <div className="p-2 bg-red-50 border border-red-300 text-center">
              <div className="font-mono text-[10px] text-red-700">
                <div className="font-bold">SANCTIONS</div>
                <div className="text-[9px]">Risk of international pressure</div>
              </div>
            </div>
            <div className="p-2 bg-yellow-50 border border-yellow-300 text-center">
              <div className="font-mono text-[10px] text-yellow-700">
                <div className="font-bold">LAST RESORT</div>
                <div className="text-[9px]">Use triggers nuclear holocaust</div>
              </div>
            </div>
            <div className="p-2 bg-blue-50 border border-blue-300 text-center">
              <div className="font-mono text-[10px] text-blue-700">
                <div className="font-bold">LEVERAGE</div>
                <div className="text-[9px]">Stronger diplomatic position</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <div className="font-mono text-[9px] text-center text-gray-500 uppercase">
          {isOperational
            ? 'Nuclear deterrent operational — Use with extreme caution'
            : 'Funding is deducted at end of turn'}
        </div>
      </div>
    </div>
  );
}
