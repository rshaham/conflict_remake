// ============================================
// News Screen - Dot Matrix Bulletin Style
// ============================================

import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const game = useGameStore((state) => state.game);
  const setPhase = useGameStore((state) => state.setPhase);

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
  const secondaryHeadlines = headlines.slice(1, 7); // Show up to 6 secondary headlines

  // Generate ticker items
  const ticker = generateTicker(game);

  const handleProceed = () => {
    setPhase('hub');
    navigate('/game/hub');
  };

  return (
    <GameLayout>
      {/* Header bar */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black flex justify-between items-center">
        <span className="font-pixel text-2xl">THE CONFLICT</span>
        <span className="font-mono text-xs bg-black text-white px-2 py-0.5">
          VOL.{String(game.year).slice(-2)}.{game.turn}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <Panel className="p-4">
          {/* Classification tag */}
          <div className="bg-black text-white font-mono text-[10px] font-bold px-2 py-1 inline-block mb-3 uppercase transform -rotate-1">
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

          <p className="font-mono text-sm leading-relaxed mb-4">
            <span className="float-left text-4xl font-pixel mr-2 mt-[-2px]">
              {mainHeadline.body.charAt(0)}
            </span>
            {mainHeadline.body.slice(1)}
          </p>

          {/* ASCII divider */}
          <div className="text-center font-mono text-gray-300 text-xs tracking-[0.4em] my-4">
            ++++++++++++++++++
          </div>

          {/* Secondary stories */}
          {secondaryHeadlines.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {secondaryHeadlines.map((headline, i) => (
                <div key={i} className="border-2 border-black p-2 bg-gray-50">
                  <h3 className="font-mono font-bold text-xs border-b border-black inline-block mb-1">
                    {headline.title.toUpperCase().slice(0, 28)}
                  </h3>
                  <p className="font-mono text-[11px] text-gray-600 leading-tight">
                    {headline.body.slice(0, 70)}...
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Ticker */}
          <div className="border-2 border-black p-2 bg-white mb-4">
            <h4 className="font-pixel text-sm mb-2">TICKER</h4>
            <div className="font-mono text-xs space-y-1 text-gray-600">
              {ticker.map((t, i) => (
                <div key={i}>{'>'} {t}</div>
              ))}
            </div>
          </div>

          {/* Action box */}
          <div className="border-2 border-red-600 p-3 bg-red-50 relative retro-shadow-red">
            <div className="absolute -top-2.5 left-3 bg-red-600 text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
              Action Required
            </div>
            <p className="font-mono text-xs font-bold text-red-900 mb-3 mt-1">
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
          <div className="font-mono font-bold text-xs border-b-2 border-black pb-2 mb-3">
            SITUATION REPORT — {dateStr}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[10px] text-gray-500 font-bold">ACTIVE WARS</div>
              <div className={`font-mono text-lg font-bold ${game.wars.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {game.wars.length}
              </div>
            </div>
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[10px] text-gray-500 font-bold">BUDGET</div>
              <div className="font-mono text-lg font-bold text-green-700">
                ${(game.player.budget / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[10px] text-gray-500 font-bold">PRESTIGE</div>
              <div className="font-mono text-lg font-bold">
                {game.player.prestige}
              </div>
            </div>
            <div className="border-2 border-black p-2 bg-gray-50">
              <div className="font-mono text-[10px] text-gray-500 font-bold">US ATTITUDE</div>
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

// Helper to capitalize country names
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Airstrike target type names
const AIRSTRIKE_TARGET_NAMES: Record<string, string> = {
  military: 'MILITARY INSTALLATIONS',
  civilian: 'CIVILIAN INFRASTRUCTURE',
  industrial: 'INDUSTRIAL FACILITIES',
  nuclear: 'NUCLEAR FACILITIES',
};

// Relationship direction
function relationshipImproved(from: string, to: string): boolean {
  const order = ['military_pact', 'profitable', 'beneficial', 'favourable', 'satisfactory', 'cool', 'lamentable', 'hostile', 'war'];
  return order.indexOf(to) < order.indexOf(from);
}

function generateHeadlines(game: GameState): Headline[] {
  const headlines: Headline[] = [];
  const results = game.lastTurnResults;

  // === HEADLINES FROM LAST TURN RESULTS ===

  // 1. Airstrike headlines
  if (results?.airstrikes && results.airstrikes.length > 0) {
    for (const airstrike of results.airstrikes) {
      const targetName = capitalize(airstrike.target);
      const targetType = AIRSTRIKE_TARGET_NAMES[airstrike.type] || airstrike.type.toUpperCase();

      if (airstrike.success) {
        headlines.push({
          title: `IAF Strikes ${targetName} ${targetType}`,
          body: `Israeli Air Force jets successfully struck ${targetType.toLowerCase()} in ${targetName}. ${airstrike.damage}. ${airstrike.fightersLost > 0 ? `${airstrike.fightersLost} aircraft lost to enemy air defenses.` : 'All aircraft returned safely.'}`,
          urgent: true,
        });
      } else {
        headlines.push({
          title: `Air Raid on ${targetName} Fails`,
          body: `An Israeli air operation against ${targetType.toLowerCase()} in ${targetName} failed to achieve its objectives. ${airstrike.damage}`,
          urgent: true,
        });
      }
    }
  }

  // 2. War progress headlines
  if (results?.wars && results.wars.length > 0) {
    for (const war of results.wars) {
      const enemyName = capitalize(war.enemy);

      if (war.outcome === 'victory') {
        headlines.push({
          title: `${enemyName} Surrenders to Israeli Forces`,
          body: `After sustained military operations, ${enemyName} has capitulated. The government has collapsed following Israel's decisive military campaign. Regional power balance shifts dramatically.`,
          urgent: true,
        });
      } else if (war.outcome === 'defeat') {
        headlines.push({
          title: `IDF Withdraws from ${enemyName} Front`,
          body: `Israeli forces have been forced to withdraw following heavy losses on the ${enemyName}i front. Military commanders are reassessing strategy as Knesset opposition grows.`,
          urgent: true,
        });
      } else if (war.outcome === 'ceasefire') {
        headlines.push({
          title: `Ceasefire Reached with ${enemyName}`,
          body: `Fighting has ceased on the ${enemyName}i front following diplomatic negotiations. Both sides claim victory as peacekeepers prepare to monitor the border.`,
          urgent: true,
        });
      } else {
        // Ongoing war
        const progressText = war.progressChange > 0
          ? 'IDF advances on all fronts'
          : war.progressChange < 0
            ? 'Heavy resistance slows Israeli advance'
            : 'Stalemate continues';
        headlines.push({
          title: `Fighting Continues on ${enemyName} Front`,
          body: `${progressText}. Military sources report ${Object.values(war.playerLosses).reduce((a, b) => a + (b || 0), 0) || 'minimal'} equipment losses this month. Enemy forces have suffered significant attrition.`,
          urgent: true,
        });
      }
    }
  }

  // 3. Diplomatic shift headlines
  if (results?.diplomaticShifts && results.diplomaticShifts.length > 0) {
    for (const shift of results.diplomaticShifts) {
      const countryName = capitalize(shift.country);
      const improved = relationshipImproved(shift.from, shift.to);

      if (shift.to === 'war') {
        headlines.push({
          title: `${countryName} Declares War on Israel`,
          body: `In a dramatic escalation, ${countryName} has declared war following deteriorating relations. IDF forces are mobilizing along the border as the nation braces for conflict.`,
          urgent: true,
        });
      } else if (shift.from === 'war') {
        headlines.push({
          title: `Peace Restored with ${countryName}`,
          body: `Following intense negotiations, hostilities with ${countryName} have ceased. Relations now stand at ${shift.to.replace('_', ' ')}.`,
          urgent: false,
        });
      } else if (improved) {
        headlines.push({
          title: `Relations with ${countryName} Improve`,
          body: `Diplomatic efforts have paid off as relations with ${countryName} improved from ${shift.from.replace('_', ' ')} to ${shift.to.replace('_', ' ')}. Foreign Ministry sources express cautious optimism.`,
        });
      } else {
        headlines.push({
          title: `${countryName} Relations Deteriorate`,
          body: `Relations with ${countryName} have worsened from ${shift.from.replace('_', ' ')} to ${shift.to.replace('_', ' ')}. Diplomats warn of further deterioration if current trends continue.`,
          urgent: shift.to === 'hostile',
        });
      }
    }
  }

  // 4. Weapon delivery headlines (from economy details)
  if (results?.economy?.details) {
    const deliveries = results.economy.details.filter(d => d.startsWith('Purchased'));
    if (deliveries.length > 0) {
      // Consolidate into one headline
      const weaponCount = deliveries.length;
      headlines.push({
        title: `IDF Receives New Military Hardware`,
        body: `The Israel Defense Forces have taken delivery of ${weaponCount} new weapons system${weaponCount > 1 ? 's' : ''} this month. Military readiness is enhanced as the arsenal expands.`,
      });
    }
  }

  // 5. Nuclear progress headline
  if (results?.nuclearProgress) {
    const stage = results.nuclearProgress.stage;
    const stageNames: Record<string, string> = {
      research: 'Research Phase',
      development: 'Development Phase',
      testing: 'Testing Phase',
      operational: 'Operational Status',
    };
    headlines.push({
      title: 'Dimona Research Advances',
      body: `Classified reports indicate Project Jericho continues in the ${stageNames[stage] || stage}. Progress: ${results.nuclearProgress.monthsComplete}/${results.nuclearProgress.monthsRequired} months complete. International observers express growing concern.`,
    });
  }

  // 6. Palestinian situation change
  if (results?.palestinianChange) {
    const levelDescriptions: Record<string, string> = {
      calm: 'relative calm',
      unrest: 'growing unrest',
      protests: 'widespread protests',
      violence: 'violent clashes',
      intifada: 'full-scale intifada',
    };
    const worsened = ['calm', 'unrest', 'protests', 'violence', 'intifada'].indexOf(results.palestinianChange.to) >
                     ['calm', 'unrest', 'protests', 'violence', 'intifada'].indexOf(results.palestinianChange.from);

    headlines.push({
      title: worsened ? 'Palestinian Unrest Escalates' : 'Palestinian Situation Improves',
      body: `The occupied territories have moved from ${levelDescriptions[results.palestinianChange.from]} to ${levelDescriptions[results.palestinianChange.to]}. ${worsened ? 'Security forces are on high alert.' : 'Cautious optimism among peace advocates.'}`,
      urgent: results.palestinianChange.to === 'intifada',
    });
  }

  // === HEADLINES FROM CURRENT STATE (FALLBACKS) ===

  // Active wars (if no war results but wars exist)
  if (headlines.length < 3 && game.wars.length > 0) {
    for (const war of game.wars) {
      const enemy = war.attacker === 'israel' ? war.defender : war.attacker;
      const enemyName = capitalize(enemy);
      if (!headlines.some(h => h.title.includes(enemyName))) {
        headlines.push({
          title: `War with ${enemyName} Continues`,
          body: `Fighting continues on the ${enemyName}i front. Military commanders report ${
            war.progress > 0 ? 'steady progress' : war.progress < 0 ? 'fierce resistance' : 'a stalemate'
          }. Casualty reports remain classified.`,
          urgent: true,
        });
      }
    }
  }

  // Hostile relations
  const hostileCountries = Object.entries(game.countries)
    .filter(([id, country]) => id !== 'israel' && !country.isDefeated && country.relationship === 'hostile')
    .map(([id]) => id);

  if (headlines.length < 5 && hostileCountries.length > 0 && game.wars.length === 0) {
    headlines.push({
      title: 'Tensions High with Neighboring States',
      body: `Relations with ${hostileCountries.map(c => capitalize(c)).join(' and ')} remain hostile. Intelligence analysts warn of potential military mobilization along borders.`,
      urgent: true,
    });
  }

  // Defeated countries this turn
  const defeatedThisTurn = Object.entries(game.countries)
    .filter(([, country]) => country.defeatedOnTurn === game.turn - 1)
    .map(([id]) => id);

  for (const countryId of defeatedThisTurn) {
    if (!headlines.some(h => h.title.includes(capitalize(countryId)))) {
      headlines.push({
        title: `${capitalize(countryId)} Government Collapses`,
        body: `The government of ${capitalize(countryId)} has fallen following sustained military pressure. Regional power dynamics shift dramatically.`,
        urgent: true,
      });
    }
  }

  // Palestinian situation (if no change headline but situation is bad)
  if (headlines.length < 6 && game.player.palestinianLevel !== 'calm') {
    const levelNames: Record<string, string> = {
      unrest: 'grows increasingly restless',
      protests: 'see protests spreading across territories',
      violence: 'report violent clashes',
      intifada: 'face full-scale intifada conditions',
    };
    if (!headlines.some(h => h.title.includes('Palestinian'))) {
      headlines.push({
        title: 'Palestinian Territories Unstable',
        body: `The occupied territories ${levelNames[game.player.palestinianLevel] || 'remain tense'}. Cabinet urges decisive response.`,
        urgent: game.player.palestinianLevel === 'intifada',
      });
    }
  }

  // Nuclear progress (current state)
  if (headlines.length < 6 && game.player.nuclearStage !== 'none' && game.player.nuclearStage !== 'operational') {
    if (!headlines.some(h => h.title.includes('Dimona') || h.title.includes('Jericho'))) {
      headlines.push({
        title: 'Project Jericho Continues',
        body: `Classified reports indicate Israel's strategic deterrent program continues in the ${game.player.nuclearStage} phase.`,
      });
    }
  }

  // Add default headline if still too few
  if (headlines.length === 0) {
    headlines.push({
      title: 'Relative Calm in the Region',
      body: `Diplomatic channels remain open as the government consolidates power. Regional analysts note cautious optimism.`,
    });
  }

  // Always add cabinet context as final headline if we have room
  if (headlines.length < 8) {
    headlines.push({
      title: 'Cabinet Analysis',
      body: `As Prime Minister, you face ${game.wars.length > 0 ? 'ongoing military challenges' : 'complex diplomatic negotiations'}. Your decisions this month will shape Israel's position.`,
    });
  }

  // Limit to 8 headlines
  return headlines.slice(0, 8);
}

function generateTicker(game: GameState): string[] {
  const items: string[] = [];
  const results = game.lastTurnResults;

  // Current turn
  items.push(`08:00 TURN ${game.turn} BEGINS`);

  // Last turn airstrike summary
  if (results?.airstrikes && results.airstrikes.length > 0) {
    const successCount = results.airstrikes.filter(a => a.success).length;
    items.push(`07:45 ${results.airstrikes.length} AIRSTRIKES, ${successCount} SUCCESSFUL`);
  }

  // Wars
  if (game.wars.length > 0) {
    items.push(`07:30 ${game.wars.length} ACTIVE FRONT${game.wars.length > 1 ? 'S' : ''}`);
  }

  // Diplomatic changes from last turn
  if (results?.diplomaticShifts && results.diplomaticShifts.length > 0) {
    items.push(`07:15 ${results.diplomaticShifts.length} DIPLOMATIC SHIFT${results.diplomaticShifts.length > 1 ? 'S' : ''}`);
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

  // Nuclear progress
  if (results?.nuclearProgress) {
    items.push(`05:30 DIMONA: ${results.nuclearProgress.stage.toUpperCase()}`);
  }

  return items.slice(0, 5);
}
