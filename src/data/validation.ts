// ============================================
// Data Validation with Zod
// ============================================

import { z } from 'zod';
import type {
  CountryId,
  RelationshipLevel,
  StabilityLevel,
  InsurgencyLevel,
  NuclearStage,
  DiplomaticStance,
} from '../types/game';

// === ID Schemas ===

export const countryIdSchema = z.enum([
  'israel', 'egypt', 'syria', 'jordan', 'lebanon', 'iraq', 'iran', 'libya'
]) satisfies z.ZodType<CountryId>;

export const relationshipLevelSchema = z.enum([
  'military_pact', 'profitable', 'beneficial', 'favourable',
  'satisfactory', 'cool', 'lamentable', 'hostile', 'war'
]) satisfies z.ZodType<RelationshipLevel>;

export const stabilityLevelSchema = z.enum([
  'very_solid', 'solid', 'good', 'weak', 'critical', 'collapse'
]) satisfies z.ZodType<StabilityLevel>;

export const insurgencyLevelSchema = z.enum([
  'none', 'scattered', 'organized', 'armed', 'guerilla_force', 'open_revolt'
]) satisfies z.ZodType<InsurgencyLevel>;

export const nuclearStageSchema = z.enum([
  'none', 'research', 'development', 'testing', 'operational'
]) satisfies z.ZodType<NuclearStage>;

export const diplomaticStanceSchema = z.enum([
  'friendly', 'neutral', 'aggressive'
]) satisfies z.ZodType<DiplomaticStance>;

// === Settings Validation ===

export const difficultyConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startingBudget: z.number().positive(),
  usAttitudeStart: z.number(),
  aiAggressionModifier: z.number().positive(),
  successChanceModifier: z.number().positive(),
  relationshipModifier: z.number(),
});

export const scenarioConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startYear: z.number().int().positive(),
  startMonth: z.number().int().min(1).max(12),
  dataFile: z.string(),
});

export const settingsDataSchema = z.object({
  difficulties: z.record(z.string(), difficultyConfigSchema),
  scenarios: z.record(z.string(), scenarioConfigSchema),
});

// === Country Validation ===

export const leaderTemplateSchema = z.object({
  strengthRange: z.array(z.enum(['weak', 'moderate', 'strong'])),
  aggressionRange: z.array(z.enum(['dovish', 'pragmatic', 'hawkish'])),
  riskRange: z.array(z.enum(['cautious', 'calculated', 'reckless'])),
});

export const countryStartingStateSchema = z.object({
  budget: z.number().optional(),
  gdpDefensePercent: z.number().optional(),
  stability: stabilityLevelSchema,
  insurgency: insurgencyLevelSchema,
  nuclearStage: nuclearStageSchema,
  relationWithPlayer: relationshipLevelSchema.optional(),
  diplomaticStance: diplomaticStanceSchema.optional(),
});

export const countryConfigSchema = z.object({
  id: countryIdSchema,
  name: z.string(),
  displayName: z.string(),
  isPlayer: z.boolean(),
  canDevelopNukes: z.boolean(),
  canBeInvadedByPlayer: z.boolean().optional(),
  borders: z.array(countryIdSchema),
  startingState: countryStartingStateSchema,
  leaderTemplate: leaderTemplateSchema.optional(),
});

// === Weapon Validation ===

export const weaponStatsSchema = z.object({
  armor: z.number().min(0).max(100),
  firepower: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  range: z.number().min(0).max(100),
});

export const weaponSpecsSchema = z.object({
  weight: z.string().optional(),
  mainGun: z.string().optional(),
  engine: z.string().optional(),
  maxSpeed: z.string().optional(),
  range: z.string().optional(),
  ceiling: z.string().optional(),
  armament: z.string().optional(),
  crew: z.number().optional(),
}).optional();

export const weaponConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  hebrewName: z.string().optional(),
  vendor: z.enum(['usa', 'uk', 'france', 'black_market']),
  category: z.enum(['light_armor', 'main_battle_tank', 'attack_helicopter', 'sam_battery', 'fighter_aircraft', 'sead_aircraft', 'infantry']),
  unlockRequirement: z.number().min(0),
  cost: z.number().min(0),
  combatValue: z.number().positive(),
  counters: z.array(z.string()).optional(),
  counteredBy: z.array(z.string()).optional(),
  image: z.string(),
  wikipediaUrl: z.string().optional(),
  summary: z.string().optional(),
  specs: weaponSpecsSchema,
  stats: weaponStatsSchema,
  canAirstrike: z.boolean().optional(),
  canOccupy: z.boolean().optional(),
  canPolice: z.boolean().optional(),
});

// === Validation Functions ===

export function validateSettingsData(data: unknown): boolean {
  try {
    settingsDataSchema.parse(data);
    return true;
  } catch (error) {
    console.error('Settings validation failed:', error);
    return false;
  }
}

export function validateCountryConfig(data: unknown): boolean {
  try {
    countryConfigSchema.parse(data);
    return true;
  } catch (error) {
    console.error('Country config validation failed:', error);
    return false;
  }
}

export function validateWeaponConfig(data: unknown): boolean {
  try {
    weaponConfigSchema.parse(data);
    return true;
  } catch (error) {
    console.error('Weapon config validation failed:', error);
    return false;
  }
}

// === Type Guards ===

export function isValidCountryId(value: string): value is CountryId {
  return countryIdSchema.safeParse(value).success;
}

export function isValidRelationshipLevel(value: string): value is RelationshipLevel {
  return relationshipLevelSchema.safeParse(value).success;
}

export function isValidStabilityLevel(value: string): value is StabilityLevel {
  return stabilityLevelSchema.safeParse(value).success;
}
