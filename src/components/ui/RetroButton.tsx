// ============================================
// RetroButton - Brutalist Button Component
// ============================================

interface RetroButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'ghost' | 'terminal';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function RetroButton({
  children,
  variant = 'default',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: RetroButtonProps) {
  const baseClasses = 'retro-btn';

  const variantClasses: Record<string, string> = {
    default: 'retro-btn-default',
    primary: 'retro-btn-primary',
    danger: 'retro-btn-danger',
    ghost: 'retro-btn-ghost',
    terminal: 'bg-green-900/20 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}
