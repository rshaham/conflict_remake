// ============================================
// News Screen - Turn Start Headlines
// ============================================

import { GameLayout } from '../components/layout/GameLayout';
import { useGameStore } from '../store/gameStore';
import type { GameState } from '../types/game';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function NewsScreen() {
  const game = useGameStore((state) => state.game);

  // If no game is loaded, show placeholder
  if (!game) {
    return (
      <GameLayout>
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-game-text-secondary">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const monthName = MONTH_NAMES[game.month - 1];

  // Generate contextual headlines based on game state
  const headlines = generateHeadlines(game);

  return (
    <GameLayout>
      <div className="p-4 pb-24">
        {/* Newspaper Header */}
        <div className="card mb-4 text-center border-b-4 border-game-accent">
          <p className="text-xs text-game-text-secondary uppercase tracking-wider">
            The Jerusalem Post
          </p>
          <h1 className="text-2xl font-bold text-game-text-primary mt-1">
            Regional News
          </h1>
          <p className="text-sm text-game-text-secondary">
            {monthName} {game.year} - Turn {game.turn}
          </p>
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          {headlines.map((headline, index) => (
            <div key={index} className={`card ${headline.urgent ? 'border-l-4 border-red-500' : ''}`}>
              <div className="flex items-start gap-2">
                {headline.urgent && (
                  <span className="text-red-400 text-xs font-bold uppercase">Breaking</span>
                )}
              </div>
              <h3 className="font-medium text-game-text-primary">
                {headline.title}
              </h3>
              <p className="text-sm text-game-text-secondary mt-1">
                {headline.body}
              </p>
            </div>
          ))}
        </div>

        {/* Game Status Summary */}
        <div className="card mt-6 bg-game-bg-dark">
          <h3 className="text-sm font-semibold text-game-text-secondary uppercase mb-3">
            Situation Report
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-game-text-secondary">Active Wars:</span>
              <span className={`ml-2 ${game.wars.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {game.wars.length}
              </span>
            </div>
            <div>
              <span className="text-game-text-secondary">Budget:</span>
              <span className="ml-2 text-green-400">
                ${(game.player.budget / 1000000).toFixed(0)}M
              </span>
            </div>
            <div>
              <span className="text-game-text-secondary">Prestige:</span>
              <span className="ml-2 text-game-text-primary">
                {game.player.prestige}
              </span>
            </div>
            <div>
              <span className="text-game-text-secondary">US Relations:</span>
              <span className={`ml-2 ${game.player.usAttitude >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {game.player.usAttitude > 0 ? '+' : ''}{game.player.usAttitude}
              </span>
            </div>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
            News Phase - Review headlines and continue
          </span>
        </div>
      </div>
    </GameLayout>
  );
}

interface Headline {
  title: string;
  body: string;
  urgent?: boolean;
}

function generateHeadlines(game: GameState): Headline[] {
  const headlines: Headline[] = [];

  // Check for active wars
  if (game.wars.length > 0) {
    for (const war of game.wars) {
      const enemy = war.attacker === 'israel' ? war.defender : war.attacker;
      const enemyName = enemy.charAt(0).toUpperCase() + enemy.slice(1);
      headlines.push({
        title: `War with ${enemyName} Continues`,
        body: `Fighting continues on the ${enemyName}i front. Military commanders report ${
          war.progress > 0 ? 'steady progress' : war.progress < 0 ? 'fierce resistance' : 'a stalemate'
        }.`,
        urgent: true,
      });
    }
  }

  // Check for hostile relations
  const hostileCountries = Object.entries(game.countries)
    .filter(([id, country]) => id !== 'israel' && !country.isDefeated && country.relationship === 'hostile')
    .map(([id]) => id);

  if (hostileCountries.length > 0 && game.wars.length === 0) {
    headlines.push({
      title: 'Tensions High with Neighboring States',
      body: `Relations with ${hostileCountries.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' and ')} remain hostile. Analysts warn of potential conflict.`,
      urgent: true,
    });
  }

  // Check for defeated countries
  const defeatedThisTurn = Object.entries(game.countries)
    .filter(([, country]) => country.defeatedOnTurn === game.turn - 1)
    .map(([id]) => id);

  if (defeatedThisTurn.length > 0) {
    const name = defeatedThisTurn[0].charAt(0).toUpperCase() + defeatedThisTurn[0].slice(1);
    headlines.push({
      title: `${name} Government Collapses`,
      body: `The government of ${name} has fallen. Regional power dynamics shift dramatically.`,
      urgent: true,
    });
  }

  // Nuclear progress
  if (game.player.nuclearStage !== 'none' && game.player.nuclearStage !== 'operational') {
    headlines.push({
      title: 'Nuclear Program Advances',
      body: `Israel's nuclear program continues in the ${game.player.nuclearStage} phase. International observers express concern.`,
    });
  }

  // Palestinian situation
  if (game.player.palestinianLevel !== 'calm') {
    const levelNames = {
      unrest: 'grows restless',
      protests: 'protests across territories',
      violence: 'violent clashes reported',
      intifada: 'full intifada underway',
    };
    headlines.push({
      title: 'Palestinian Situation Deteriorates',
      body: `The Palestinian territories see ${levelNames[game.player.palestinianLevel as keyof typeof levelNames]}. Government response under scrutiny.`,
      urgent: game.player.palestinianLevel === 'intifada',
    });
  }

  // Add default headline if no news
  if (headlines.length === 0) {
    headlines.push({
      title: 'Relative Calm in the Region',
      body: 'Diplomatic channels remain open as the new government consolidates power.',
    });
  }

  // Always add a regional context headline
  headlines.push({
    title: 'Regional Analysis',
    body: `As Prime Minister, you face ${game.wars.length > 0 ? 'ongoing military challenges' : 'complex diplomatic negotiations'}. Your decisions will shape Israel's future.`,
  });

  return headlines;
}
