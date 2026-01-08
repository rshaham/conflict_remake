// ============================================
// Terminal - CRT Display Component
// ============================================

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Terminal({ children, className = '', glow = false }: TerminalProps) {
  return (
    <div
      className={`
        terminal p-3
        ${glow ? 'terminal-glow' : ''}
        ${className}
      `}
    >
      {/* CRT reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-sm" />
      {children}
    </div>
  );
}

interface TerminalLineProps {
  children: React.ReactNode;
  className?: string;
}

export function TerminalLine({ children, className = '' }: TerminalLineProps) {
  return (
    <div className={`text-green-500 font-mono text-[10px] ${className}`}>
      {children}
    </div>
  );
}

interface TerminalValueProps {
  label: string;
  value: string | number;
  large?: boolean;
  className?: string;
}

export function TerminalValue({ label, value, large = false, className = '' }: TerminalValueProps) {
  return (
    <div className={className}>
      <div className="text-[9px] text-green-700">{label}</div>
      <div className={`${large ? 'font-pixel text-2xl' : 'font-mono text-sm'} text-green-500`}>
        {value}
      </div>
    </div>
  );
}
