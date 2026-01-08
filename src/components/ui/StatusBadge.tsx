// ============================================
// StatusBadge - Relationship Status Indicator
// ============================================

import type { RelationshipLevel } from '../../types/game';

const RELATION_STYLES: Record<RelationshipLevel, { bg: string; text: string; border: string; label: string }> = {
  military_pact: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-800', label: 'ALLIED' },
  profitable: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-700', label: 'PROFIT' },
  beneficial: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-600', label: 'BENEFIC' },
  favourable: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-700', label: 'FAVOUR' },
  satisfactory: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-700', label: 'SATIS' },
  cool: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-700', label: 'COOL' },
  lamentable: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-800', label: 'LAMENT' },
  hostile: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-700', label: 'HOSTILE' },
  war: { bg: 'bg-red-200', text: 'text-red-900', border: 'border-red-900', label: 'WAR' },
};

interface StatusBadgeProps {
  status: RelationshipLevel;
  defeated?: boolean;
  className?: string;
}

export function StatusBadge({ status, defeated = false, className = '' }: StatusBadgeProps) {
  if (defeated) {
    return (
      <span
        className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border-2 bg-gray-200 text-gray-600 border-gray-600 ${className}`}
      >
        DEFEATED
      </span>
    );
  }

  const style = RELATION_STYLES[status];
  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border-2 ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      {style.label}
    </span>
  );
}
