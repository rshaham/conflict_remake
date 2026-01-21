// ============================================
// Arsenal Button - Floating Trigger Button
// ============================================
// Positioned floating button to open arsenal overlay

interface ArsenalButtonProps {
  onClick: () => void;
  className?: string;
}

export function ArsenalButton({ onClick, className = '' }: ArsenalButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-20 right-4 z-30 w-12 h-12 flex items-center justify-center bg-white border-2 border-black retro-shadow font-mono font-bold text-lg hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${className}`}
      aria-label="Open Arsenal"
      title="View Arsenal"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="w-6 h-6"
      >
        {/* Shield icon */}
        <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V6l-8-4z" />
      </svg>
    </button>
  );
}
