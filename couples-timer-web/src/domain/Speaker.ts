/**
 * Represents the speaker in a session
 */
export enum Speaker {
  A = 'A',
  B = 'B'
}

/**
 * Helper function to get the other speaker
 */
export function getOtherSpeaker(speaker: Speaker): Speaker {
  return speaker === Speaker.A ? Speaker.B : Speaker.A;
}

/**
 * Helper function to check if a speaker is valid
 */
export function isSpeaker(value: string): value is Speaker {
  return Object.values(Speaker).includes(value as Speaker);
}