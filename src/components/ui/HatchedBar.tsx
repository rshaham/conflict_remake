// ============================================
// HatchedBar - Retro Progress Bar
// ============================================

interface HatchedBarProps {
  value: number;
  label: string;
  showDanger?: boolean;
  className?: string;
}

export function HatchedBar({ value, label, showDanger = true, className = '' }: HatchedBarProps) {
  const isDanger = showDanger && value < 50;

  return (
    <div className={className}>
      <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
        <span>{label}</span>
        <span className={isDanger ? 'text-red-600' : ''}>{value}%</span>
      </div>
      <div className="h-4 border-2 border-black bg-white p-0.5">
        <div
          className={`h-full ${isDanger ? 'hatched-red' : 'hatched'}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

interface StabilityBarProps {
  stability: string;
  className?: string;
}

const STABILITY_VALUES: Record<string, number> = {
  very_solid: 100,
  solid: 85,
  good: 70,
  weak: 40,
  critical: 20,
  collapse: 0,
};

export function StabilityBar({ stability, className = '' }: StabilityBarProps) {
  const value = STABILITY_VALUES[stability] ?? 50;
  return (
    <HatchedBar
      value={value}
      label="STABILITY"
      showDanger={true}
      className={className}
    />
  );
}
