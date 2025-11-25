import { PhaseConfig } from './PhaseConfig';
import { GuidanceLevel } from './GuidanceLevel';

export interface SessionMode {
  id: string;
  name: string;
  phases: PhaseConfig[];
  guidanceLevel: GuidanceLevel;
  isLocked: boolean; // Whether this is a preset mode (true) or custom (false)
  totalDuration: number; // in seconds
}

/**
 * Validates a SessionMode
 */
export function isValidSessionMode(mode: SessionMode): boolean {
  // Must have at least one slotA and one slotB
  const hasSlotA = mode.phases.some(phase => phase.type === 'slotA');
  const hasSlotB = mode.phases.some(phase => phase.type === 'slotB');
  
  if (!hasSlotA || !hasSlotB) {
    return false;
  }
  
  // All phases must be valid
  return mode.phases.every(phase => {
    return phase.duration > 0 && 
           phase.duration <= 3600; // Max 1 hour per phase
  });
}

/**
 * Calculates the total duration of a session mode
 */
export function calculateTotalDuration(phases: PhaseConfig[]): number {
  return phases.reduce((total, phase) => total + phase.duration, 0);
}

/**
 * Counts the number of rounds (A/B speaking pairs) in a mode
 */
export function countRounds(phases: PhaseConfig[]): number {
  let rounds = 0;
  let hasA = false;
  let hasB = false;
  
  for (const phase of phases) {
    if (phase.type === 'slotA') hasA = true;
    if (phase.type === 'slotB') hasB = true;
    
    // If we have both A and B in this round, increment rounds and reset
    if (hasA && hasB) {
      rounds++;
      hasA = false;
      hasB = false;
    }
  }
  
  return rounds;
}

/**
 * Formats the total duration as HH:MM:SS or MM:SS if less than an hour
 */
export function formatTotalDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}