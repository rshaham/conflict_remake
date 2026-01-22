// ============================================
// Game Over Screen - End Game Summary
// ============================================
// Victory or defeat summary with statistics

import { useNavigate } from 'react-router-dom';
import { Scanlines } from '../components/ui/Scanlines';
import { useGameStore } from '../store/gameStore';
import { FlagImage } from '../components/ui/FlagImage';
import { COUNTRY_NAMES } from '../utils/countryData';
import type { CountryId } from '../types/game';

export function GameOverScreen() {
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);

  // Get end state from game
  const endState = game?.endState;

  const isVictory = endState?.type === 'victory';
  const score = endState?.finalScore ?? 0;
  const leadershipStyle = endState?.leadershipStyle ?? 'Unknown';
  const narrative = endState?.narrative ?? 'Your time as Prime Minister has ended.';
  const statistics = endState?.statistics;

  const conditionNames: Record<string, string> = {
    total_victory: 'TOTAL VICTORY',
    military_defeat: 'MILITARY DEFEAT',
    nuclear_holocaust: 'NUCLEAR HOLOCAUST',
    impeachment: 'IMPEACHMENT',
    assassination: 'ASSASSINATION',
  };

  const handlePlayAgain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-retro-bg">
      <Scanlines />

      {/* Header */}
      <div className={`shrink-0 p-6 bg-white border-b-4 ${isVictory ? 'border-green-600' : 'border-red-600'} text-center`}>
        <div className="text-6xl mb-2">
          {isVictory ? '🏆' : '💀'}
        </div>
        <h1 className={`font-pixel text-3xl ${isVictory ? 'text-green-700' : 'text-red-700'}`}>
          {isVictory ? 'VICTORY' : 'DEFEAT'}
        </h1>
        <div className={`font-mono text-xs ${isVictory ? 'text-green-600' : 'text-red-600'} mt-1`}>
          {endState?.condition ? conditionNames[endState.condition] : 'GAME OVER'}
        </div>
      </div>

      {/* Terminal-style display */}
      <div className={`shrink-0 px-3 py-2 bg-black ${isVictory ? 'text-green-500' : 'text-red-500'} font-mono text-[10px] flex justify-between items-center`}>
        <span>GAME COMPLETE</span>
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 ${isVictory ? 'bg-green-500' : 'bg-red-500'}`} />
          FINAL REPORT
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* Score Display */}
        <div className="bg-white border-2 border-black retro-shadow p-4 text-center">
          <div className="font-mono text-[10px] text-gray-500 uppercase mb-1">Final Score</div>
          <div className="font-pixel text-4xl text-blue-600">{score}</div>
        </div>

        {/* Leadership Style */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-1 pb-1 border-b border-gray-300">
            Leadership Style
          </div>
          <div className="font-pixel text-lg text-center py-2">{leadershipStyle}</div>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="bg-white border-2 border-black retro-shadow p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
              Statistics
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 border border-gray-300 bg-gray-50 text-center">
                <div className="font-mono text-lg font-bold">{statistics.turnsPlayed}</div>
                <div className="font-mono text-[8px] text-gray-500">TURNS PLAYED</div>
              </div>
              <div className="p-2 border border-gray-300 bg-gray-50 text-center">
                <div className="font-mono text-lg font-bold text-green-600">{statistics.warsWon}</div>
                <div className="font-mono text-[8px] text-gray-500">WARS WON</div>
              </div>
              <div className="p-2 border border-gray-300 bg-gray-50 text-center">
                <div className="font-mono text-lg font-bold text-red-600">{statistics.warsLost}</div>
                <div className="font-mono text-[8px] text-gray-500">WARS LOST</div>
              </div>
              <div className="p-2 border border-gray-300 bg-gray-50 text-center">
                <div className="font-mono text-lg font-bold">{statistics.countriesDefeated.length}</div>
                <div className="font-mono text-[8px] text-gray-500">NATIONS DEFEATED</div>
              </div>
              <div className="p-2 border border-gray-300 bg-gray-50 text-center">
                <div className="font-mono text-lg font-bold">{statistics.totalWeaponsPurchased}</div>
                <div className="font-mono text-[8px] text-gray-500">WEAPONS BOUGHT</div>
              </div>
              <div className="p-2 border border-gray-300 bg-gray-50 text-center">
                <div className="font-mono text-lg font-bold">{statistics.peakPrestige}</div>
                <div className="font-mono text-[8px] text-gray-500">PEAK PRESTIGE</div>
              </div>
            </div>
          </div>
        )}

        {/* Defeated Nations */}
        {statistics && statistics.countriesDefeated.length > 0 && (
          <div className="bg-white border-2 border-green-600 retro-shadow p-3">
            <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-green-300 text-green-700">
              Defeated Nations
            </div>
            <div className="flex flex-wrap gap-2">
              {statistics.countriesDefeated.map((country) => (
                <span
                  key={country}
                  className="px-2 py-1 border-2 border-green-600 bg-green-100 font-mono text-[10px] font-bold text-green-700 flex items-center gap-1"
                >
                  <FlagImage id={country as CountryId} size="sm" /> {COUNTRY_NAMES[country as keyof typeof COUNTRY_NAMES]?.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Narrative / Legacy */}
        <div className="bg-white border-2 border-black retro-shadow p-3">
          <div className="font-mono font-bold text-xs uppercase mb-2 pb-1 border-b border-gray-300">
            Your Legacy
          </div>
          <div className="font-mono text-[10px] text-gray-700 leading-relaxed">
            {narrative}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black space-y-2">
        <button
          type="button"
          onClick={handlePlayAgain}
          className="w-full py-3 font-mono font-bold text-sm uppercase border-2 border-black bg-black text-white retro-shadow-sm hover:bg-gray-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          PLAY AGAIN
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full py-2 font-mono font-bold text-xs uppercase border-2 border-gray-400 bg-white text-gray-600 hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5"
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
}
