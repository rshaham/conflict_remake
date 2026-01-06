// ============================================
// YAML Data Loader
// ============================================

import yaml from 'js-yaml';
import type {
  GameData,
  SettingsData,
  CountriesData,
  EnumsData,
  WeaponsData,
  NuclearData,
  PalestinianData,
  ScoringData,
  LeadersData,
  CombatData,
  AIDecisionsData,
  EventsData,
} from '../types/data';

// Cache for loaded data
const dataCache: Map<string, unknown> = new Map();

/**
 * Load and parse a YAML file
 */
export async function loadYaml<T>(filename: string): Promise<T> {
  // Check cache first
  if (dataCache.has(filename)) {
    return dataCache.get(filename) as T;
  }

  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.statusText}`);
    }

    const text = await response.text();
    const data = yaml.load(text) as T;

    // Cache the result
    dataCache.set(filename, data);

    return data;
  } catch (error) {
    console.error(`Error loading YAML file ${filename}:`, error);
    throw error;
  }
}

/**
 * Load all game data files
 */
export async function loadAllGameData(): Promise<GameData> {
  const [
    settings,
    countries,
    enums,
    weapons,
    nuclear,
    palestinian,
    scoring,
    leaders,
    combat,
    aiDecisions,
    events,
  ] = await Promise.all([
    loadYaml<SettingsData>('settings.yaml'),
    loadYaml<CountriesData>('countries.yaml'),
    loadYaml<EnumsData>('enums.yaml'),
    loadYaml<WeaponsData>('weapons.yaml'),
    loadYaml<NuclearData>('nuclear.yaml'),
    loadYaml<PalestinianData>('palestinian.yaml'),
    loadYaml<ScoringData>('scoring.yaml'),
    loadYaml<LeadersData>('leaders.yaml'),
    loadYaml<CombatData>('combat.yaml'),
    loadYaml<AIDecisionsData>('ai_decisions.yaml'),
    loadYaml<EventsData>('events.yaml'),
  ]);

  return {
    settings,
    countries,
    enums,
    weapons,
    nuclear,
    palestinian,
    scoring,
    leaders,
    combat,
    aiDecisions,
    events,
  };
}

/**
 * Load scenario data
 */
export async function loadScenario(scenarioId: string): Promise<unknown> {
  return loadYaml(`scenarios/${scenarioId}.yaml`);
}

/**
 * Clear the data cache (useful for hot reload during development)
 */
export function clearDataCache(): void {
  dataCache.clear();
}

/**
 * Check if data is cached
 */
export function isDataCached(filename: string): boolean {
  return dataCache.has(filename);
}
