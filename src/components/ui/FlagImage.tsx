// ============================================
// FlagImage - Renders flag images with fallback
// ============================================
// Uses PNG images instead of emoji flags for cross-platform compatibility

import { useState } from 'react';
import type { CountryId, VendorId } from '../../types/game';

type FlagId = CountryId | VendorId;

interface FlagImageProps {
  id: FlagId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-5 h-4',
  md: 'w-8 h-6',
  lg: 'w-10 h-8',
};

export function FlagImage({ id, size = 'md', className = '' }: FlagImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span className={`inline-flex items-center justify-center bg-gray-300 border border-gray-400 font-mono text-[8px] font-bold ${SIZE_CLASSES[size]} ${className}`}>
        {id.slice(0, 3).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={`/images/flags/${id}.png`}
      alt={`${id} flag`}
      className={`inline-block object-cover ${SIZE_CLASSES[size]} ${className}`}
      onError={() => setError(true)}
    />
  );
}
