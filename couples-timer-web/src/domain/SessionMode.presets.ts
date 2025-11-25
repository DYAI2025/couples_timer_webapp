import { PhaseConfig } from './PhaseConfig';
import { PhaseType } from './PhaseType';
import { SessionMode } from './SessionMode';
import { GuidanceLevel } from './GuidanceLevel';
import { calculateTotalDuration } from './SessionMode';

/**
 * Creates a PhaseConfig with appropriate ranges for each phase type
 */
function createPhaseWithDefaultRange(type: PhaseType, duration: number): PhaseConfig {
  let allowedRange: { min: number; max: number } | undefined;
  
  switch (type) {
    case PhaseType.PREP:
      allowedRange = { min: 30, max: 300 }; // 30s to 5min
      break;
    case PhaseType.SLOT_A:
    case PhaseType.SLOT_B:
      allowedRange = { min: 60, max: 1800 }; // 1min to 30min
      break;
    case PhaseType.TRANSITION:
      allowedRange = { min: 10, max: 120 }; // 10s to 2min
      break;
    case PhaseType.CLOSING_A:
    case PhaseType.CLOSING_B:
      allowedRange = { min: 30, max: 300 }; // 30s to 5min
      break;
    case PhaseType.COOLDOWN:
      allowedRange = { min: 60, max: 600 }; // 1min to 10min
      break;
  }
  
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
    type,
    duration,
    allowedRange
  };
}

/**
 * Creates a custom mode template
 */
export function createCustomModeTemplate(): SessionMode {
  return {
    id: `custom_${Date.now()}`,
    name: 'Custom Mode',
    phases: [
      createPhaseWithDefaultRange(PhaseType.PREP, 120), // 2 min prep
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 300), // 5 min slot A
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 30), // 30s transition
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 300), // 5 min slot B
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 30), // 30s transition
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 120), // 2 min closing A
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 120), // 2 min closing B
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 300) // 5 min cooldown
    ],
    guidanceLevel: GuidanceLevel.MODERATE,
    isLocked: false,
    totalDuration: calculateTotalDuration([
      createPhaseWithDefaultRange(PhaseType.PREP, 120),
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 300),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 30),
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 300),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 30),
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 120),
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 120),
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 300)
    ])
  };
}

/**
 * Creates the Maintain Mode preset
 */
export function createMaintainMode(): SessionMode {
  return {
    id: 'maintain_mode',
    name: 'Maintain Mode',
    phases: [
      createPhaseWithDefaultRange(PhaseType.PREP, 120), // 2 min prep
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 600), // 10 min slot A
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60), // 1 min transition
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 600), // 10 min slot B
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60), // 1 min transition
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 180), // 3 min closing A
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 180), // 3 min closing B
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 300) // 5 min cooldown
    ],
    guidanceLevel: GuidanceLevel.MODERATE,
    isLocked: true,
    totalDuration: calculateTotalDuration([
      createPhaseWithDefaultRange(PhaseType.PREP, 120),
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 600),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60),
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 600),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60),
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 180),
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 180),
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 300)
    ])
  };
}

/**
 * Creates the Commitment Mode preset
 */
export function createCommitmentMode(): SessionMode {
  return {
    id: 'commitment_mode',
    name: 'Commitment Mode',
    phases: [
      createPhaseWithDefaultRange(PhaseType.PREP, 180), // 3 min prep
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 900), // 15 min slot A
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90), // 1.5 min transition
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 900), // 15 min slot B
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90), // 1.5 min transition
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 600), // 10 min slot A
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90), // 1.5 min transition
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 600), // 10 min slot B
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90), // 1.5 min transition
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 300), // 5 min closing A
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 300), // 5 min closing B
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 600) // 10 min cooldown
    ],
    guidanceLevel: GuidanceLevel.HIGH,
    isLocked: true,
    totalDuration: calculateTotalDuration([
      createPhaseWithDefaultRange(PhaseType.PREP, 180),
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 900),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90),
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 900),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90),
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 600),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90),
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 600),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 90),
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 300),
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 300),
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 600)
    ])
  };
}

/**
 * Creates the Listening Mode preset
 */
export function createListeningMode(): SessionMode {
  return {
    id: 'listening_mode',
    name: 'Listening Mode',
    phases: [
      createPhaseWithDefaultRange(PhaseType.PREP, 120), // 2 min prep
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 480), // 8 min slot A
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60), // 1 min transition
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 480), // 8 min slot B
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60), // 1 min transition
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 300), // 5 min slot A
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60), // 1 min transition
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 300), // 5 min slot B
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60), // 1 min transition
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 240), // 4 min closing A
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 240), // 4 min closing B
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 420) // 7 min cooldown
    ],
    guidanceLevel: GuidanceLevel.HIGH,
    isLocked: true,
    totalDuration: calculateTotalDuration([
      createPhaseWithDefaultRange(PhaseType.PREP, 120),
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 480),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60),
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 480),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60),
      createPhaseWithDefaultRange(PhaseType.SLOT_A, 300),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60),
      createPhaseWithDefaultRange(PhaseType.SLOT_B, 300),
      createPhaseWithDefaultRange(PhaseType.TRANSITION, 60),
      createPhaseWithDefaultRange(PhaseType.CLOSING_A, 240),
      createPhaseWithDefaultRange(PhaseType.CLOSING_B, 240),
      createPhaseWithDefaultRange(PhaseType.COOLDOWN, 420)
    ])
  };
}

/**
 * Gets all preset modes
 */
export function getPresetModes(): SessionMode[] {
  return [
    createMaintainMode(),
    createCommitmentMode(),
    createListeningMode()
  ];
}