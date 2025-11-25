import { 
  SessionMode, 
  PhaseType, 
  SessionStateType, 
  SessionState, 
  isValidSessionMode,
  getAudioFileNameForEvent,
  AudioEvent
} from '../domain';
import { TimerService } from '../services/TimerService';
import { audioService, AudioServiceProtocol } from '../services/AudioService';
import { guidanceService, GuidanceServiceProtocol } from '../services/GuidanceService';

export interface SessionEngineProtocol {
  start: (mode: SessionMode) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  getCurrentState: () => SessionState;
  getCurrentPhase: () => PhaseType | null;
  getCurrentPhaseDuration: () => number;
  getRemainingTime: () => number;
  getElapsedSessionTime: () => number;
  getElapsedPhaseTime: () => number;
  getProgress: () => number; // 0 to 1
  getGuidanceTip: () => string | null;
  subscribe: (callback: (state: SessionState) => void) => () => void;
}

export class SessionEngine implements SessionEngineProtocol {
  private mode: SessionMode | null = null;
  private state: SessionState = {
    type: SessionStateType.IDLE,
    currentPhaseIndex: -1,
    elapsedSessionTime: 0,
    elapsedPhaseTime: 0
  };
  private timerService: TimerService;
  private audioService: AudioServiceProtocol;
  private guidanceService: GuidanceServiceProtocol;
  private callbacks: Array<(state: SessionState) => void> = [];
  private unsubscribeTimer: (() => void) | null = null;

  constructor(
    timerService: TimerService = new TimerService(),
    audioService: AudioServiceProtocol = audioService,
    guidanceService: GuidanceServiceProtocol = guidanceService
  ) {
    this.timerService = timerService;
    this.audioService = audioService;
    this.guidanceService = guidanceService;
  }

  start(mode: SessionMode): void {
    if (!isValidSessionMode(mode)) {
      throw new Error('Invalid session mode provided');
    }

    this.mode = { ...mode }; // Create a copy to prevent external mutations
    this.state = {
      type: SessionStateType.RUNNING,
      currentPhaseIndex: 0,
      elapsedSessionTime: 0,
      elapsedPhaseTime: 0
    };

    // Play start sound
    this.audioService.playSound(getAudioFileNameForEvent(AudioEvent.SESSION_START));

    // Subscribe to timer updates
    this.unsubscribeTimer = this.timerService.subscribe(this.handleTimerUpdate);

    this.timerService.reset();
    this.timerService.start();
  }

  stop(): void {
    if (this.state.type === SessionStateType.IDLE) {
      return;
    }

    this.timerService.stop();
    if (this.unsubscribeTimer) {
      this.unsubscribeTimer();
      this.unsubscribeTimer = null;
    }

    this.state = {
      type: SessionStateType.IDLE,
      currentPhaseIndex: -1,
      elapsedSessionTime: 0,
      elapsedPhaseTime: 0
    };

    this.mode = null;
    this.notifySubscribers();
  }

  pause(): void {
    if (this.state.type !== SessionStateType.RUNNING) {
      return;
    }

    this.timerService.pause();
    this.state = {
      ...this.state,
      type: SessionStateType.PAUSED
    };
    this.notifySubscribers();
  }

  resume(): void {
    if (this.state.type !== SessionStateType.PAUSED) {
      return;
    }

    this.timerService.resume();
    this.state = {
      ...this.state,
      type: SessionStateType.RUNNING
    };
    this.notifySubscribers();
  }

  getCurrentState(): SessionState {
    return { ...this.state }; // Return a copy to prevent external mutations
  }

  getCurrentPhase(): PhaseType | null {
    if (!this.mode || this.state.currentPhaseIndex < 0) {
      return null;
    }

    if (this.state.currentPhaseIndex >= this.mode.phases.length) {
      return null;
    }

    return this.mode.phases[this.state.currentPhaseIndex].type;
  }

  getCurrentPhaseDuration(): number {
    if (!this.mode || this.state.currentPhaseIndex < 0) {
      return 0;
    }

    if (this.state.currentPhaseIndex >= this.mode.phases.length) {
      return 0;
    }

    return this.mode.phases[this.state.currentPhaseIndex].duration;
  }

  getRemainingTime(): number {
    const currentPhaseDuration = this.getCurrentPhaseDuration();
    const remaining = currentPhaseDuration - (this.state.elapsedPhaseTime / 1000);
    return Math.max(0, remaining);
  }

  getElapsedSessionTime(): number {
    return this.state.elapsedSessionTime;
  }

  getElapsedPhaseTime(): number {
    return this.state.elapsedPhaseTime;
  }

  getProgress(): number {
    const currentPhaseDuration = this.getCurrentPhaseDuration();
    if (currentPhaseDuration <= 0) {
      return 0;
    }

    return Math.min(1, this.state.elapsedPhaseTime / (currentPhaseDuration * 1000));
  }

  getGuidanceTip(): string | null {
    if (!this.mode) {
      return null;
    }

    const currentPhase = this.getCurrentPhase();
    if (!currentPhase) {
      return null;
    }

    return this.guidanceService.getRandomTip(currentPhase, this.mode.guidanceLevel);
  }

  subscribe(callback: (state: SessionState) => void): () => void {
    this.callbacks.push(callback);

    // Return an unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private handleTimerUpdate = (elapsed: number): void => {
    // Update session and phase time
    const newElapsedSessionTime = elapsed;
    const timeSinceLastUpdate = newElapsedSessionTime - this.state.elapsedSessionTime;
    
    this.state = {
      ...this.state,
      elapsedSessionTime: newElapsedSessionTime,
      elapsedPhaseTime: this.state.elapsedPhaseTime + timeSinceLastUpdate
    };

    // Check if the current phase is complete
    if (this.mode && this.state.currentPhaseIndex >= 0) {
      const currentPhaseDuration = this.getCurrentPhaseDuration();
      
      if ((this.state.elapsedPhaseTime / 1000) >= currentPhaseDuration) {
        this.moveToNextPhase();
      }
    }

    this.notifySubscribers();
  };

  private moveToNextPhase(): void {
    if (!this.mode) {
      return;
    }

    // Play appropriate sound based on the current phase
    if (this.state.currentPhaseIndex < this.mode.phases.length - 1) {
      // This is not the last phase
      const currentPhase = this.mode.phases[this.state.currentPhaseIndex].type;

      if (currentPhase === PhaseType.COOLDOWN) {
        // Shouldn't happen in normal flow, but just in case
      } else if (currentPhase === PhaseType.TRANSITION) {
        this.audioService.playSound(getAudioFileNameForEvent(AudioEvent.TRANSITION_END));
      } else {
        this.audioService.playSound(getAudioFileNameForEvent(AudioEvent.SLOT_END));
      }

      // Move to next phase
      this.state = {
        ...this.state,
        currentPhaseIndex: this.state.currentPhaseIndex + 1,
        elapsedPhaseTime: 0
      };

      // Check if we're moving to a closing phase
      const nextPhase = this.mode.phases[this.state.currentPhaseIndex].type;
      if (nextPhase === PhaseType.CLOSING_A || nextPhase === PhaseType.CLOSING_B) {
        this.audioService.playSound(getAudioFileNameForEvent(AudioEvent.CLOSING_START));
      }
      
      // Check if we're moving to cooldown phase
      if (nextPhase === PhaseType.COOLDOWN) {
        this.audioService.playSound(getAudioFileNameForEvent(AudioEvent.COOLDOWN_START));
      }
    } else {
      // We've reached the end of the sequence
      this.audioService.playSound(getAudioFileNameForEvent(AudioEvent.COOLDOWN_END));
      this.state = {
        ...this.state,
        type: SessionStateType.FINISHED
      };
      this.timerService.stop();
    }
  }

  private notifySubscribers(): void {
    this.callbacks.forEach(callback => callback(this.getCurrentState()));
  }
}