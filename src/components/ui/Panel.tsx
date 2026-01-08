// ============================================
// Panel - Retro Bordered Container
// ============================================

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div className={`bg-white border-2 border-black retro-shadow ${className}`}>
      {children}
    </div>
  );
}
