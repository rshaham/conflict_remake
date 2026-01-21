// ============================================
// News Screen - Dot Matrix Bulletin Style
// ============================================

import { Panel } from '../components/ui/Panel';
import { GameLayout } from '../components/game/GameLayout';
import { NewsImage } from '../components/ui/GameImage';
import { useGameStore } from '../store/gameStore';
import type { GameState } from '../types/game';

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export function NewsScreen() {
  const game = useGameStore((state) => state.game);
  const advancePhase = useGameStore((state) => state.advancePhase);

  // If no game is loaded, show placeholder
  if (!game) {
    return (
      <GameLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-retro-text-dim">No game in progress</p>
        </div>
      </GameLayout>
    );
  }

  const monthName = MONTH_NAMES[game.month - 1];
  const dateStr = `${monthName} ${String(game.turn).padStart(2, '0')} ${game.year}`;

  // Generate contextual headlines based on game state
  const headlines = generateHeadlines(game);
  const mainHeadline = headlines[0];
  const secondaryHeadlines = headlines.slice(1, 3);

  // Generate ticker items
  const ticker = generateTicker(game);

  const handleProceed = () => {
    advancePhase();
  };

  return (
    <GameLayout>
      {/* Header bar */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black flex justify-between items-center">
        <span className="font-pixel text-2xl">THE CONFLICT</span>
        <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5">
          VOL.{String(game.year).slice(-2)}.{game.turn}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <Panel className="p-4">
          {/* Classification tag */}
          <div className="bg-black text-white font-mono text-[8px] font-bold px-2 py-1 inline-block mb-3 uppercase transform -rotate-1">
            Classified // Eyes Only
          </div>

          {/* Main headline */}
          <h2 className="font-pixel text-3xl leading-tight mb-3 bg-gray-100 p-2 border-l-4 border-black">
            {mainHeadline.title.toUpperCase()}
          </h2>

          {/* News illustration */}
          <div className="mb-4">
            <NewsImage
              topic={game.wars.length > 0 ? 'war' : 'diplomatic'}
              className="w-full max-w-sm mx-auto"
            />
          </div>

          <p className="font-mono text-[11px] leading-relaxed mb-4">
            <span className="float-left text-4xl font-pixel mr-2 mt-[-2px]">
              {mainHeadline.body.charAt(0)}
            </span>
            {mainHeadline.body.slice(1)}
          </p>

          {/* ASCII divider */}
          <div className="text-center font-mono text-gray-300 text-[8px] tracking-[0.4em] my-4">
            ++++++++++++++++++
          </div>

          {/* Secondary stories */}
          {secondaryHeadlines.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {secondaryHeadlines.map((headline, i) => (
                <div key={i} className="border-2 border-black p-2 bg-gray-50">
                  <h3 className="font-mono font-bold text-[9px] border-b border-black inline-block mb-1">
                    {headline.title.toUpperCase().slice(0, 20)}
                  </h3>
                  <p className="font-mono text-[8px] text-gray-600">
                    {headline.body.slice(0, 50)}...
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Ticker */}
          <div className="border-2 border-black p-2 bg-white mb-4">
            <h4 className="font-pixel text-sm mb-2">TICKER</h4>
            <div className="font-mono text-[9px] space-y-1 text-gray-600">
              {ticker.map((t, i) => (
                <div key={i}>{'>'} {t}</div>
              ))}
            </div>
          </div>

          {/* Action box */}
          <div className="border-2 border-red-600 p-3 bg-red-50 relative retro-shadow-red">
            <div className="absolute -top-2.5 left-3 bg-red-600 text-white px-2 py-0.5 text-[8px] font-mono font-bold uppercase">
              Action Required
            </div>
            <p className="font-mono text-[10px] font-bold text-red-900 mb-3 mt-1">
              {game.wars.length > 0
                ? 'MILITARY SITUATION REQUIRES IMMEDIATE ATTENTION.'
                : 'CABINET AWAITS YOUR DIRECTIVES FOR THIS MONTH.'}
            </p>
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-2 bg-red-600 text-white font-mono font-bold text-xs uppercase border-2 border-black retro-shadow-sm hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              CONTINUE &rarr;
            </button>
          </div>
        </Panel>

        {/* Situation Report */}
        <Panel className="p-3 mt-3">
          <div className="font-mono font-bold text-[10px] border-b-2 border-black pb-2 mb-3">
            SITUATION REPORT — {dateStr}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500 font-bold">ACTIVE WARS</div>
              <div className={`font-mono text-lg font-bold ${game.wars.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {game.wars.length}
              </div>
            </div>
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500 font-bold">BUDGET</div>
              <div className="font-mono text-lg font-bold text-green-700">
                ${(game.player.budget / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500 font-bold">PRESTIGE</div>
              <div className="font-mono text-lg font-bold">
                {game.player.prestige}
              </div>
            </div>
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[8px] text-gray-500 font-bold">US ATTITUDE</div>
              <div className={`font-mono text-lg font-bold ${game.player.usAttitude >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {game.player.usAttitude > 0 ? '+' : ''}{game.player.usAttitude}
              </div>
            </div>
          </div>
        </Panel>
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
        }. Casualty reports remain classified.`,
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
      body: `Relations with ${hostileCountries.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' and ')} remain hostile. Intelligence analysts warn of potential military mobilization along borders.`,
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
      body: `The government of ${name} has fallen following sustained military pressure. Regional power dynamics shift dramatically as neighboring states reassess their positions.`,
      urgent: true,
    });
  }

  // Nuclear progress
  if (game.player.nuclearStage !== 'none' && game.player.nuclearStage !== 'operational') {
    headlines.push({
      title: 'Project Jericho Advances',
      body: `Classified reports indicate Israel's strategic deterrent program continues in the ${game.player.nuclearStage} phase. International observers express growing concern.`,
    });
  }

  // Palestinian situation
  if (game.player.palestinianLevel !== 'calm') {
    const levelNames = {
      unrest: 'grows increasingly restless',
      protests: 'see protests spreading across territories',
      violence: 'report violent clashes between security forces and protesters',
      intifada: 'face full-scale intifada conditions',
    };
    headlines.push({
      title: 'Palestinian Territories Destabilize',
      body: `The occupied territories ${levelNames[game.player.palestinianLevel as keyof typeof levelNames]}. Cabinet urges decisive response.`,
      urgent: game.player.palestinianLevel === 'intifada',
    });
  }

  // Add default headline if no news
  if (headlines.length === 0) {
    headlines.push({
      title: 'Relative Calm in the Region',
      body: `Diplomatic channels remain open as the government consolidates power. Regional analysts note cautious optimism among neighboring states regarding potential negotiations.`,
    });
  }

  // Always add a regional context headline
  headlines.push({
    title: 'Cabinet Analysis',
    body: `As Prime Minister, you face ${game.wars.length > 0 ? 'ongoing military challenges requiring immediate attention' : 'complex diplomatic negotiations on multiple fronts'}. Your decisions this month will shape Israel's strategic position.`,
  });

  return headlines;
}

function generateTicker(game: GameState): string[] {
  const items: string[] = [];

  // Current time simulation
  items.push(`08:00 TURN ${game.turn} BEGINS`);

  // Wars
  if (game.wars.length > 0) {
    items.push(`07:30 ${game.wars.length} ACTIVE FRONT${game.wars.length > 1 ? 'S' : ''}`);
  }

  // Budget
  const budgetM = Math.floor(game.player.budget / 1000000);
  items.push(`07:00 TREASURY: $${budgetM}M`);

  // US Relations
  items.push(`06:30 US STANCE: ${game.player.usAttitude >= 0 ? 'FAVORABLE' : 'CRITICAL'}`);

  // Palestinian
  if (game.player.palestinianLevel !== 'calm') {
    items.push(`06:00 TERRITORIES: ${game.player.palestinianLevel.toUpperCase()}`);
  }

  return items.slice(0, 4);
}
