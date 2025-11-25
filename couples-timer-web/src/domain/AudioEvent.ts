import type { AudioFileName } from '../services/AudioService';

/**
 * Represents different audio events in the session
 */
export enum AudioEvent {
  SESSION_START = 'sessionStart',
  SLOT_END = 'slotEnd',
  TRANSITION_END = 'transitionEnd',
  CLOSING_START = 'closingStart',
  COOLDOWN_START = 'cooldownStart',
  COOLDOWN_END = 'cooldownEnd',
}

/**
 * Maps audio events to actual file names
 */
export function getAudioFileNameForEvent(event: AudioEvent): AudioFileName {
  switch (event) {
    case AudioEvent.SESSION_START:
      return 'BOWL_DEEP_SINGLE';
    case AudioEvent.SLOT_END:
      return 'BOWL_DOUBLE';
    case AudioEvent.TRANSITION_END:
      return 'BOWL_CLEAR';
    case AudioEvent.CLOSING_START:
      return 'BOWL_RISING';
    case AudioEvent.COOLDOWN_START:
      return 'BOWL_FADE';
    case AudioEvent.COOLDOWN_END:
      return 'BOWL_TRIPLE';
    default:
      // This should never happen due to enum constraints
      const exhaustiveCheck: never = event;
      throw new Error(`Unhandled audio event: ${exhaustiveCheck}`);
  }
}