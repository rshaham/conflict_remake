// ============================================
// Country Data Utility
// ============================================
// Centralized country display data
// Future: Can be refactored to load from YAML

import type { CountryId } from '../types/game';

/**
 * Display names for each country
 */
export const COUNTRY_NAMES: Record<CountryId, string> = {
  israel: 'Israel',
  egypt: 'Egypt',
  syria: 'Syria',
  jordan: 'Jordan',
  lebanon: 'Lebanon',
  iraq: 'Iraq',
  iran: 'Iran',
  libya: 'Libya',
};

/**
 * Flag emoji for each country
 */
export const COUNTRY_FLAGS: Record<CountryId, string> = {
  israel: '🇮🇱',
  egypt: '🇪🇬',
  syria: '🇸🇾',
  jordan: '🇯🇴',
  lebanon: '🇱🇧',
  iraq: '🇮🇶',
  iran: '🇮🇷',
  libya: '🇱🇾',
};

/**
 * Get display name for a country
 */
export function getCountryName(id: CountryId): string {
  return COUNTRY_NAMES[id];
}

/**
 * Get flag emoji for a country
 */
export function getCountryFlag(id: CountryId): string {
  return COUNTRY_FLAGS[id];
}

/**
 * Get formatted display string with flag and name
 */
export function getCountryDisplay(id: CountryId): string {
  return `${COUNTRY_FLAGS[id]} ${COUNTRY_NAMES[id]}`;
}
