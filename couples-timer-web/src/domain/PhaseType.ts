/**
 * Represents the different phases in a session
 */
export enum PhaseType {
  PREP = 'prep',
  SLOT_A = 'slotA',
  SLOT_B = 'slotB',
  TRANSITION = 'transition',
  CLOSING_A = 'closingA',
  CLOSING_B = 'closingB',
  COOLDOWN = 'cooldown'
}

/**
 * Helper functions for PhaseType
 */
export function isPrepPhase(phase: PhaseType): boolean {
  return phase === PhaseType.PREP;
}

export function isSpeakingPhase(phase: PhaseType): boolean {
  return [PhaseType.SLOT_A, PhaseType.SLOT_B].includes(phase);
}

export function isTransitionPhase(phase: PhaseType): boolean {
  return phase === PhaseType.TRANSITION;
}

export function isClosingPhase(phase: PhaseType): boolean {
  return [PhaseType.CLOSING_A, PhaseType.CLOSING_B].includes(phase);
}

export function isCooldownPhase(phase: PhaseType): boolean {
  return phase === PhaseType.COOLDOWN;
}

export function getSpeakerForPhase(phase: PhaseType): 'A' | 'B' | null {
  if (phase === PhaseType.SLOT_A || phase === PhaseType.CLOSING_A) {
    return 'A';
  } else if (phase === PhaseType.SLOT_B || phase === PhaseType.CLOSING_B) {
    return 'B';
  }
  return null;
}

export function isPhaseWithSpeaker(phase: PhaseType): boolean {
  return getSpeakerForPhase(phase) !== null;
}