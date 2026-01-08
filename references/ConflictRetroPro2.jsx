import React, { useState, useEffect } from 'react';

// ============================================
// DESIGN SYSTEM - RETRO BRUTALIST (REFINED)
// ============================================

const COLORS = {
  bgRetro: '#F3F3E8',
  bgPaper: '#FFFFFF',
  borderHard: '#111111',
  textMain: '#111111',
  textDim: '#555555',
  accentRed: '#E61919',
  accentGreen: '#00A651',
  accentOrange: '#FF7D00',
  terminalGreen: '#22c55e',
};

const RELATIONS = {
  allied: { bg: '#dcfce7', text: '#166534', border: '#166534', label: 'ALLIED' },
  friendly: { bg: '#dcfce7', text: '#166534', border: '#166534', label: 'FRIENDLY' },
  neutral: { bg: '#f3f4f6', text: '#374151', border: '#374151', label: 'NEUTRAL' },
  tense: { bg: '#ffedd5', text: '#c2410c', border: '#c2410c', label: 'TENSE' },
  hostile: { bg: '#fee2e2', text: '#dc2626', border: '#dc2626', label: 'HOSTILE' },
  war: { bg: '#fecaca', text: '#991b1b', border: '#991b1b', label: 'WAR' },
};

// ============================================
// GAME DATA
// ============================================

const GAME = {
  turn: 1,
  date: 'JAN 01 1997',
  budget: 1540,
  readiness: 92,
  
  headlines: {
    main: 'SYRIAN ARMOR MOVES ON GOLAN',
    sub: 'Satellite imagery obtained at 0400 hours confirms movement of two armored columns toward DMZ following breakdown of Cairo talks.',
  },
  
  ticker: [
    '08:00 CAIRO TALKS END',
    '07:15 JORDAN NEUTRAL',
    '06:30 REDACTED',
    '05:45 OIL +4%',
  ],
  
  countries: [
    { id: 'egypt', name: 'Egypt', code: 'EGY', relation: 'neutral', stability: 65, troops: 450000, nuclear: 15 },
    { id: 'syria', name: 'Syria', code: 'SYR', relation: 'hostile', stability: 40, troops: 320000, nuclear: 45 },
    { id: 'jordan', name: 'Jordan', code: 'JOR', relation: 'friendly', stability: 55, troops: 110000, nuclear: 0 },
    { id: 'lebanon', name: 'Lebanon', code: 'LBN', relation: 'tense', stability: 20, troops: 75000, nuclear: 0 },
    { id: 'iraq', name: 'Iraq', code: 'IRQ', relation: 'hostile', stability: 30, troops: 380000, nuclear: 95 },
    { id: 'iran', name: 'Iran', code: 'IRN', relation: 'tense', stability: 45, troops: 550000, nuclear: 80 },
  ],
  
  forces: [
    { name: 'AIR FORCE', qty: '4 Squadrons', condition: 100, icon: '✈' },
    { name: 'ARMOR', qty: '1,200 Units', condition: 78, icon: '⬡' },
    { name: 'INFANTRY', qty: '180,000', condition: 95, icon: '⚑' },
    { name: 'NAVY', qty: '12 Vessels', condition: 88, icon: '⚓' },
  ],
  
  covertOps: [
    { name: 'SABOTAGE', risk: 'HIGH', cost: 50 },
    { name: 'WIRETAP', risk: 'LOW', cost: 15 },
    { name: 'FUND REBELS', risk: 'MED', cost: 120 },
    { name: 'ASSASSINATE', risk: 'EXTREME', cost: 200 },
  ],
  
  arms: [
    { name: 'US Arms Package (F-16s)', status: 'available', cost: 120 },
    { name: 'French Naval Systems', status: 'negotiate', cost: 85 },
    { name: 'UK Radar Systems', status: 'embargo', cost: 0 },
    { name: 'Private Dealer (Tanks)', status: 'available', cost: 45 },
  ],
};

// ============================================
// GLOBAL STYLES
// ============================================

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=VT323&family=Space+Mono:wght@400;700&display=swap');

    .font-pixel { font-family: 'VT323', monospace; letter-spacing: 0.02em; }
    .font-mono { font-family: 'Space Mono', monospace; }

    .retro-shadow { box-shadow: 4px 4px 0px 0px #111; }
    .retro-shadow-sm { box-shadow: 2px 2px 0px 0px #111; }
    .retro-shadow-red { box-shadow: 4px 4px 0px 0px #dc2626; }
    
    .retro-button:active {
      transform: translate(2px, 2px);
      box-shadow: none !important;
    }

    .scanlines {
      background: linear-gradient(
        to bottom,
        rgba(255,255,255,0) 50%,
        rgba(0,0,0,0.015) 50%
      );
      background-size: 100% 4px;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 100;
    }
    
    .hatched {
      background: repeating-linear-gradient(
        45deg,
        #000,
        #000 2px,
        #fff 2px,
        #fff 4px
      );
    }
    
    .hatched-red {
      background: repeating-linear-gradient(
        45deg,
        #dc2626,
        #dc2626 2px,
        #fff 2px,
        #fff 4px
      );
    }
    
    .hatched-green {
      background: repeating-linear-gradient(
        45deg,
        #16a34a,
        #16a34a 2px,
        #fff 2px,
        #fff 4px
      );
    }

    ::selection {
      background: #111;
      color: #F3F3E8;
    }
  `}</style>
);

const Scanlines = () => <div className="scanlines" />;

// ============================================
// UI COMPONENTS
// ============================================

// Retro bordered panel
const Panel = ({ children, className = '' }) => (
  <div className={`bg-white border-2 border-black retro-shadow ${className}`}>
    {children}
  </div>
);

// Status badge
const StatusBadge = ({ status }) => {
  const rel = RELATIONS[status] || RELATIONS.neutral;
  return (
    <span 
      className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border-2"
      style={{ backgroundColor: rel.bg, color: rel.text, borderColor: rel.border }}
    >
      {rel.label}
    </span>
  );
};

// Hatched progress bar
const HatchedBar = ({ value, label, showDanger = true }) => {
  const isDanger = showDanger && value < 50;
  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
        <span>{label}</span>
        <span className={isDanger ? 'text-red-600' : ''}>{value}%</span>
      </div>
      <div className="h-4 border-2 border-black bg-white p-0.5">
        <div 
          className={`h-full ${isDanger ? 'hatched-red' : 'hatched'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Retro button
const Button = ({ children, variant = 'default', onClick, className = '' }) => {
  const base = "px-4 py-2 font-mono font-bold text-xs uppercase border-2 border-black retro-button transition-all";
  const variants = {
    default: 'bg-white hover:bg-gray-100 retro-shadow-sm',
    primary: 'bg-black text-white hover:bg-gray-800 retro-shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-black retro-shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 shadow-none',
  };
  
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// ============================================
// SCREENS
// ============================================

// Title Screen (BIOS Boot)
const TitleScreen = ({ onStart }) => (
  <div className="h-full bg-black flex flex-col items-center justify-center p-6 relative">
    <div className="border-2 border-green-500 p-6 w-full max-w-xs text-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
      {/* BIOS header */}
      <div className="text-green-600 font-mono text-[9px] mb-6 flex justify-between">
        <span>BIOS 01/01/97</span>
        <span>640K OK</span>
      </div>
      
      <h1 className="font-pixel text-6xl text-green-500 leading-none mb-2">
        CONFLICT
      </h1>
      <h2 className="font-mono text-green-700 text-[10px] tracking-[0.25em] mb-8 border-y border-green-900 py-2">
        MIDDLE EAST SIMULATION
      </h2>
      
      <div className="space-y-3">
        <button 
          onClick={onStart}
          className="w-full py-3 bg-green-900/20 border-2 border-green-500 text-green-500 font-mono font-bold text-xs hover:bg-green-500 hover:text-black transition-all"
        >
          [ INITIALIZE ]
        </button>
        <button className="w-full py-2 border border-green-900 text-green-900 font-mono text-[10px] hover:border-green-500 hover:text-green-500 transition-all">
          LOAD SAVE
        </button>
      </div>
      
      <div className="mt-6 text-green-900 text-[9px] font-mono">
        (C) 1990-1997 DISCOVERY
      </div>
    </div>
    
    <div className="absolute bottom-6 font-mono text-green-700 text-[10px]">
      C:\{'>'} <span className="animate-pulse">█</span>
    </div>
  </div>
);

// News Screen (Dot Matrix Bulletin)
const NewsScreen = ({ onProceed }) => (
  <div className="h-full flex flex-col bg-[#F3F3E8]">
    {/* Header bar */}
    <div className="shrink-0 p-3 bg-white border-b-2 border-black flex justify-between items-center">
      <span className="font-pixel text-2xl">THE CONFLICT</span>
      <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5">VOL.97.1</span>
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
          {GAME.headlines.main}
        </h2>
        
        <p className="font-mono text-[11px] leading-relaxed mb-4">
          <span className="float-left text-4xl font-pixel mr-2 mt-[-2px]">D</span>
          AMASCUS — {GAME.headlines.sub}
        </p>
        
        {/* ASCII divider */}
        <div className="text-center font-mono text-gray-300 text-[8px] tracking-[0.4em] my-4">
          ++++++++++++++++++
        </div>
        
        {/* Secondary stories */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border-2 border-black p-2 bg-gray-50">
            <h3 className="font-mono font-bold text-[9px] border-b border-black inline-block mb-1">US ENVOY</h3>
            <p className="font-mono text-[8px] text-gray-600">Delayed +24h</p>
          </div>
          <div className="border-2 border-black p-2 bg-gray-50">
            <h3 className="font-mono font-bold text-[9px] border-b border-black inline-block mb-1">OIL</h3>
            <p className="font-mono text-[8px] text-gray-600">Futures +4%</p>
          </div>
        </div>
        
        {/* Ticker */}
        <div className="border-2 border-black p-2 bg-white mb-4">
          <h4 className="font-pixel text-sm mb-2">TICKER</h4>
          <div className="font-mono text-[9px] space-y-1 text-gray-600">
            {GAME.ticker.map((t, i) => <div key={i}>{'>'} {t}</div>)}
          </div>
        </div>
        
        {/* Action box */}
        <div className="border-2 border-red-600 p-3 bg-red-50 relative retro-shadow-red">
          <div className="absolute -top-2.5 left-3 bg-red-600 text-white px-2 py-0.5 text-[8px] font-mono font-bold uppercase">
            Action Required
          </div>
          <p className="font-mono text-[10px] font-bold text-red-900 mb-3 mt-1">
            CABINET REQUIRES IMMEDIATE REVIEW OF DEFENSE BUDGET.
          </p>
          <Button variant="danger" onClick={onProceed} className="w-full">
            PROCEED →
          </Button>
        </div>
      </Panel>
    </div>
  </div>
);

// Hub Screen (Main Menu)
const HubScreen = ({ onNavigate }) => {
  const menuItems = [
    { id: 'diplomatic', label: 'DIPLOMATIC', icon: '🌐', desc: 'Foreign Relations' },
    { id: 'military', label: 'MILITARY', icon: '⚔️', desc: 'Strategic Command' },
    { id: 'intel', label: 'INTEL', icon: '👁️', desc: 'Covert Operations' },
    { id: 'arms', label: 'ARMS', icon: '🛒', desc: 'Procurement' },
    { id: 'nuclear', label: 'NUCLEAR', icon: '☢️', desc: 'Project Jericho' },
    { id: 'territories', label: 'TERRITORIES', icon: '🗺️', desc: 'Palestinian Issue' },
  ];
  
  return (
    <div className="h-full flex flex-col bg-[#F3F3E8]">
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-pixel text-2xl leading-none">CONFLICT.EXE</h1>
            <div className="font-mono text-[8px] text-gray-500 uppercase tracking-wider">System v2.0</div>
          </div>
          <div className="text-right font-mono text-[10px]">
            <div className="text-gray-500">DATE</div>
            <div className="font-bold">{GAME.date}</div>
          </div>
        </div>
      </div>
      
      {/* Status bar (terminal style) */}
      <div className="shrink-0 px-3 py-2 bg-black text-green-500 font-mono text-[10px] flex justify-between items-center">
        <span>BUDGET: ${GAME.budget}M</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 animate-pulse" />
          READY: {GAME.readiness}%
        </span>
      </div>
      
      {/* Menu grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="bg-white border-2 border-black p-4 text-left retro-shadow retro-button transition-all hover:-translate-y-0.5"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-mono font-bold text-[10px]">{item.label}</div>
              <div className="font-mono text-[8px] text-gray-500">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* End turn */}
      <div className="shrink-0 p-3 bg-white border-t-2 border-black">
        <Button variant="primary" onClick={() => onNavigate('turn')} className="w-full py-3">
          END TURN — ADVANCE →
        </Button>
      </div>
    </div>
  );
};

// Diplomatic Screen
const DiplomaticScreen = ({ onBack }) => {
  const [expanded, setExpanded] = useState(null);
  
  return (
    <div className="h-full flex flex-col bg-[#F3F3E8]">
      {/* Header */}
      <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
        <button onClick={onBack} className="font-mono text-[10px] hover:underline">← BACK</button>
        <span className="font-pixel text-xl">DIPLOMATIC CORPS</span>
      </div>
      
      {/* Legend */}
      <div className="shrink-0 px-3 py-2 bg-gray-100 border-b-2 border-black flex gap-3 font-mono text-[8px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-600" /> FRIENDLY</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-600" /> HOSTILE</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500" /> TENSE</span>
      </div>
      
      {/* Country list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {GAME.countries.map(country => (
          <div key={country.id} className="bg-white border-2 border-black retro-shadow relative">
            {/* Floppy label */}
            <div className="bg-black text-white text-[8px] font-mono font-bold px-2 py-0.5 absolute -top-2.5 left-3 uppercase">
              REF: {country.code}-97
            </div>
            
            <div className="p-4 pt-5">
              {/* Header row */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-pixel text-3xl">{country.name}</h3>
                <StatusBadge status={country.relation} />
              </div>
              
              {/* Stability bar */}
              <HatchedBar value={country.stability} label="STABILITY" />
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="border-2 border-black p-2 bg-gray-50">
                  <div className="font-mono text-[8px] text-gray-500 font-bold">TROOPS</div>
                  <div className="font-mono text-xs font-bold">{country.troops.toLocaleString()}</div>
                </div>
                <div className="border-2 border-black p-2 bg-gray-50">
                  <div className="font-mono text-[8px] text-gray-500 font-bold">NUCLEAR</div>
                  <div className={`font-mono text-xs font-bold ${country.nuclear > 50 ? 'text-red-600 animate-pulse' : country.nuclear > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {country.nuclear > 0 ? `${country.nuclear}%` : 'NONE'}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t-2 border-dashed border-black">
                <Button className="text-[9px]">DIPLOMACY</Button>
                <button className="px-4 py-2 font-mono font-bold text-[9px] uppercase border-2 border-black text-red-600 hover:bg-red-600 hover:text-white retro-shadow-sm retro-button transition-all">
                  COVERT OPS
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Military Screen
const MilitaryScreen = ({ onBack }) => (
  <div className="h-full flex flex-col bg-[#F3F3E8]">
    <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
      <button onClick={onBack} className="font-mono text-[10px] hover:underline">← BACK</button>
      <span className="font-pixel text-xl">STRATEGIC COMMAND</span>
    </div>
    
    {/* Budget display (terminal style) */}
    <div className="shrink-0 m-3 bg-black text-green-500 p-3 border-4 border-gray-600 font-mono rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
      <div className="text-[9px] text-green-700">AVAILABLE BUDGET</div>
      <div className="font-pixel text-2xl">${GAME.budget},000,000</div>
      <div className="flex items-center gap-2 mt-2 text-[9px]">
        <span className="w-2 h-2 bg-green-500" />
        READINESS: {GAME.readiness}%
      </div>
    </div>
    
    {/* Units */}
    <div className="flex-1 overflow-y-auto p-3 pt-0 space-y-3">
      {GAME.forces.map((unit, i) => (
        <Panel key={i} className="p-3">
          <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
            <span className="font-mono font-bold text-xs">{unit.name}</span>
            <span className="text-xl">{unit.icon}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 font-mono text-[10px] mb-3">
            <div>
              <span className="text-gray-500">QTY: </span>
              <span className="font-bold">{unit.qty}</span>
            </div>
            <div>
              <span className="text-gray-500">COND: </span>
              <span className={`font-bold ${unit.condition < 80 ? 'text-orange-600' : 'text-green-600'}`}>
                {unit.condition}%
              </span>
            </div>
          </div>
          <Button className="w-full text-[9px]">💰 REQUISITION</Button>
        </Panel>
      ))}
    </div>
    
    {/* Footer */}
    <div className="shrink-0 p-3 bg-gray-100 border-t-2 border-dashed border-black">
      <p className="font-mono text-[8px] text-gray-400 text-center uppercase">
        {'<< END OF MILITARY REPORT >>'}
      </p>
    </div>
  </div>
);

// Intelligence Screen (Terminal Heavy)
const IntelScreen = ({ onBack }) => {
  const [log, setLog] = useState([
    'C:\\> MOSSAD_NET.EXE',
    'Loading encryption...',
    'Connection: SECURE_V2',
  ]);
  
  useEffect(() => {
    const t = setTimeout(() => {
      setLog(prev => [...prev, 'ALERT: Syrian movement confirmed.']);
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  
  const hostileCountries = GAME.countries.filter(c => c.relation === 'hostile' || c.relation === 'tense');
  
  return (
    <div className="h-full flex flex-col bg-[#F3F3E8]">
      <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
        <button onClick={onBack} className="font-mono text-[10px] hover:underline">← BACK</button>
        <span className="font-pixel text-xl">DIRECTORATE</span>
      </div>
      
      {/* Terminal */}
      <div className="m-3 bg-black border-4 border-gray-600 p-3 font-mono text-[10px] text-green-500 h-24 overflow-hidden relative rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
        <div className="absolute top-1 right-2 text-gray-600 text-[8px] font-bold">TERMINAL</div>
        <div className="space-y-1">
          {log.map((line, i) => <div key={i}>{line}</div>)}
          <div className="animate-pulse">_</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-sm" />
      </div>
      
      {/* Targets */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
        <div className="font-mono text-[9px] font-bold text-gray-500 uppercase">Select Target</div>
        {hostileCountries.map(country => (
          <div 
            key={country.id}
            className="bg-white border-2 border-black p-3 flex justify-between items-center hover:bg-red-50 cursor-pointer retro-shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white w-6 h-6 flex items-center justify-center border border-black text-xs">⚠</div>
              <div>
                <div className="font-mono font-bold text-xs">{country.name}</div>
                <div className="font-mono text-[8px] text-red-600 uppercase font-bold">Hostile Activity</div>
              </div>
            </div>
            <Button className="text-[8px] py-1">EXECUTE</Button>
          </div>
        ))}
        
        {/* Covert tools */}
        <div className="font-mono text-[9px] font-bold text-gray-500 uppercase mt-4">Covert Tools</div>
        <div className="grid grid-cols-2 gap-2">
          {GAME.covertOps.map(op => (
            <button 
              key={op.name}
              className="bg-white border-2 border-black p-3 text-left retro-shadow-sm retro-button hover:bg-gray-50"
            >
              <div className="font-mono font-bold text-[10px]">{op.name}</div>
              <div className="font-mono text-[8px] text-gray-500">${op.cost}M • {op.risk}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Arms Market Screen
const ArmsScreen = ({ onBack }) => (
  <div className="h-full flex flex-col bg-[#F3F3E8]">
    <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
      <button onClick={onBack} className="font-mono text-[10px] hover:underline">← BACK</button>
      <span className="font-pixel text-xl">ARMS MARKET</span>
    </div>
    
    <div className="shrink-0 m-3 bg-black text-green-500 p-3 border-4 border-gray-600 font-mono rounded-sm">
      <div className="text-[9px] text-green-700">AVAILABLE BUDGET</div>
      <div className="font-pixel text-xl">${GAME.budget}M</div>
    </div>
    
    <div className="flex-1 overflow-y-auto p-3 pt-0">
      <Panel className="p-3">
        <div className="font-mono font-bold text-[10px] border-b-2 border-black pb-2 mb-3">MARKET STATUS</div>
        <div className="space-y-3">
          {GAME.arms.map((item, i) => {
            const styles = {
              available: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-800', label: 'AVAILABLE' },
              negotiate: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-800', label: 'NEGOTIATE' },
              embargo: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-800', label: 'EMBARGO' },
            };
            const s = styles[item.status];
            
            return (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <div>
                  <div className="font-mono text-[10px] font-bold">{item.name}</div>
                  {item.cost > 0 && <div className="font-mono text-[8px] text-gray-500">${item.cost}M</div>}
                </div>
                <span className={`font-mono text-[8px] font-bold px-2 py-0.5 border-2 ${s.bg} ${s.text} ${s.border}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  </div>
);

// Nuclear Screen
const NuclearScreen = ({ onBack }) => (
  <div className="h-full flex flex-col bg-[#F3F3E8]">
    <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
      <button onClick={onBack} className="font-mono text-[10px] hover:underline">← BACK</button>
      <span className="font-pixel text-xl">PROJECT JERICHO</span>
    </div>
    
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="text-6xl mb-4 animate-pulse">☢️</div>
      <h2 className="font-pixel text-5xl mb-1">STAGE 1</h2>
      <p className="font-mono text-[10px] text-red-600 uppercase tracking-wider mb-6">Research Phase</p>
      
      <Panel className="w-full max-w-xs p-4">
        <HatchedBar value={45} label="R&D PROGRESS" showDanger={false} />
        <p className="font-mono text-[9px] text-gray-500 mt-3 text-center">
          Est. completion: 8 months
        </p>
        <Button className="w-full mt-4 text-[9px]">ALLOCATE $25M</Button>
      </Panel>
    </div>
  </div>
);

// Territories Screen
const TerritoriesScreen = ({ onBack }) => (
  <div className="h-full flex flex-col bg-[#F3F3E8]">
    <div className="shrink-0 p-3 bg-white border-b-2 border-black flex items-center gap-3">
      <button onClick={onBack} className="font-mono text-[10px] hover:underline">← BACK</button>
      <span className="font-pixel text-xl">TERRITORIES</span>
    </div>
    
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {/* Status meters */}
      <div className="grid grid-cols-2 gap-3">
        <Panel className="p-3 text-center">
          <div className="font-pixel text-4xl text-orange-600">32</div>
          <div className="font-mono text-[8px] text-gray-500 uppercase">Unrest Level</div>
        </Panel>
        <Panel className="p-3 text-center">
          <div className="font-pixel text-4xl text-red-600">-18</div>
          <div className="font-mono text-[8px] text-gray-500 uppercase">World Opinion</div>
        </Panel>
      </div>
      
      {/* Policy options */}
      <Panel className="p-3">
        <div className="font-mono font-bold text-[10px] border-b-2 border-black pb-2 mb-3">POLICY OPTIONS</div>
        <div className="space-y-2">
          {[
            { name: 'DEPLOY BRIGADE', effect: '-Unrest / -Opinion' },
            { name: 'ECONOMIC AID', effect: '-Unrest / -Budget' },
            { name: 'SETTLEMENTS', effect: '+Domestic / -Opinion' },
            { name: 'STATUS QUO', effect: 'No Change' },
          ].map(p => (
            <button 
              key={p.name}
              className="w-full p-3 border-2 border-black text-left bg-white hover:bg-gray-50 retro-shadow-sm retro-button"
            >
              <div className="font-mono font-bold text-[10px]">{p.name}</div>
              <div className="font-mono text-[8px] text-gray-500">{p.effect}</div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  </div>
);

// Turn End Screen
const TurnEndScreen = ({ onContinue }) => (
  <div className="h-full flex flex-col bg-[#F3F3E8]">
    <div className="shrink-0 p-3 bg-white border-b-2 border-black">
      <span className="font-pixel text-xl">TURN COMPLETE</span>
    </div>
    
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      <Panel className="p-4 text-center">
        <div className="font-pixel text-5xl mb-1">TURN {GAME.turn}</div>
        <div className="font-mono text-[10px] text-gray-500">{GAME.date} COMPLETE</div>
      </Panel>
      
      <Panel className="p-3">
        <div className="font-mono font-bold text-[10px] border-b-2 border-black pb-2 mb-3">KEY EVENTS</div>
        <div className="space-y-2">
          {[
            { type: 'success', text: 'US approves $3B aid package' },
            { type: 'danger', text: 'Syrian troops mass on border' },
            { type: 'neutral', text: 'UN calls for peace talks' },
            { type: 'success', text: 'Jordan intelligence sharing' },
          ].map((e, i) => (
            <div 
              key={i}
              className={`p-2 border-l-4 font-mono text-[10px] ${
                e.type === 'success' ? 'border-green-600 bg-green-50' :
                e.type === 'danger' ? 'border-red-600 bg-red-50' :
                'border-gray-400 bg-gray-50'
              }`}
            >
              {e.text}
            </div>
          ))}
        </div>
      </Panel>
      
      <div className="grid grid-cols-2 gap-3">
        <Panel className="p-3 text-center">
          <div className="font-pixel text-2xl text-green-600">+$12M</div>
          <div className="font-mono text-[8px] text-gray-500 uppercase">Budget</div>
        </Panel>
        <Panel className="p-3 text-center">
          <div className="font-pixel text-2xl">72%</div>
          <div className="font-mono text-[8px] text-gray-500 uppercase">Approval</div>
        </Panel>
      </div>
    </div>
    
    <div className="shrink-0 p-3 bg-white border-t-2 border-black">
      <Button variant="primary" onClick={onContinue} className="w-full py-3">
        PROCEED TO FEBRUARY →
      </Button>
    </div>
  </div>
);

// ============================================
// MAIN APP
// ============================================

export default function ConflictRetroPro() {
  const [screen, setScreen] = useState('title');
  
  const nav = (s) => setScreen(s);
  const back = () => setScreen('hub');

  return (
    <>
      <GlobalStyles />
      <Scanlines />
      
      <div className="flex justify-center items-center min-h-screen p-4 bg-[#F3F3E8]">
        <div className="relative rounded-[2.5rem] p-2 bg-black shadow-2xl" style={{ width: 340 }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full z-[101] bg-black" />
          
          <div className="rounded-[2rem] overflow-hidden bg-[#F3F3E8]" style={{ height: 680 }}>
            {screen === 'title' && <TitleScreen onStart={() => nav('news')} />}
            {screen === 'news' && <NewsScreen onProceed={() => nav('hub')} />}
            {screen === 'hub' && <HubScreen onNavigate={nav} />}
            {screen === 'diplomatic' && <DiplomaticScreen onBack={back} />}
            {screen === 'military' && <MilitaryScreen onBack={back} />}
            {screen === 'intel' && <IntelScreen onBack={back} />}
            {screen === 'arms' && <ArmsScreen onBack={back} />}
            {screen === 'nuclear' && <NuclearScreen onBack={back} />}
            {screen === 'territories' && <TerritoriesScreen onBack={back} />}
            {screen === 'turn' && <TurnEndScreen onContinue={() => nav('news')} />}
          </div>
        </div>
        
        {/* Debug nav */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 flex-wrap justify-center max-w-md">
          {['title', 'news', 'hub', 'diplomatic', 'military', 'intel', 'arms', 'nuclear', 'territories', 'turn'].map(s => (
            <button 
              key={s} 
              onClick={() => setScreen(s)} 
              className={`px-2 py-1 text-[8px] font-mono font-bold border-2 border-black transition-all ${
                screen === s 
                  ? 'bg-black text-white' 
                  : 'bg-white hover:bg-gray-100 retro-shadow-sm retro-button'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
