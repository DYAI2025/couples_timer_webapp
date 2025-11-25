import { PhaseType } from './PhaseType';

export interface PhaseConfig {
  id: string;
  type: PhaseType;
  duration: number; // in seconds
  allowedRange?: { min: number; max: number };
}

/**
 * Creates a PhaseConfig with validation
 */
export function createPhaseConfig(
  type: PhaseType,
  duration: number,
  allowedRange?: { min: number; max: number }
): PhaseConfig {
  if (allowedRange && (duration < allowedRange.min || duration > allowedRange.max)) {
    throw new Error(`Duration ${duration} is outside allowed range [${allowedRange.min}, ${allowedRange.max}] for phase type ${type}`);
  }

  return {
    id: generateId(),
    type,
    duration,
    allowedRange
  };
}

/**
 * Validates a PhaseConfig
 */
export function isValidPhaseConfig(config: PhaseConfig): boolean {
  if (config.duration <= 0) return false;
  
  if (config.allowedRange) {
    return config.duration >= config.allowedRange.min && config.duration <= config.allowedRange.max;
  }
  
  return true;
}

/**
 * Formats the duration as MM:SS
 */
export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Helper function to generate unique IDs
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}