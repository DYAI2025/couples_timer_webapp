export enum SessionStateType {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  FINISHED = 'finished',
}

export interface SessionState {
  type: SessionStateType;
  currentPhaseIndex: number;
  elapsedSessionTime: number; // in milliseconds since session start
  elapsedPhaseTime: number;   // in milliseconds since current phase start
}

/**
 * Helper functions for SessionState
 */
export function isActive(state: SessionStateType): boolean {
  return [SessionStateType.RUNNING, SessionStateType.PAUSED].includes(state);
}

export function isPaused(state: SessionStateType): boolean {
  return state === SessionStateType.PAUSED;
}

export function isFinished(state: SessionStateType): boolean {
  return state === SessionStateType.FINISHED;
}

export function isRunning(state: SessionStateType): boolean {
  return state === SessionStateType.RUNNING;
}