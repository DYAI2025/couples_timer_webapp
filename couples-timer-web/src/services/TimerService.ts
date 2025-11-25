/**
 * TimerService provides accurate time tracking using performance.now() 
 * and minimizes drift in the timing system.
 */
export interface TimerServiceProtocol {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  getElapsed: () => number; // in milliseconds
  isRunning: () => boolean;
  subscribe: (callback: (elapsed: number) => void) => () => void; // returns unsubscribe function
}

export class TimerService implements TimerServiceProtocol {
  private startTime: number = 0;
  private pausedTime: number = 0;
  private accumulatedPausedTime: number = 0;
  private isTimerRunning: boolean = false;
  private intervalId: number | null = null;
  private callbacks: Array<(elapsed: number) => void> = [];
  
  // Using performance.now() for high-resolution timestamps
  private readonly getTimestamp = typeof performance !== 'undefined' 
    ? () => performance.now() 
    : () => Date.now();

  start(): void {
    if (this.isTimerRunning) return;
    
    this.startTime = this.getTimestamp();
    this.isTimerRunning = true;
    
    // Update time approximately every 16ms (~60fps) for smooth UI updates
    this.intervalId = window.setInterval(() => {
      if (this.isTimerRunning) {
        this.notifySubscribers();
      }
    }, 16) as unknown as number;
  }

  pause(): void {
    if (!this.isTimerRunning) return;
    
    this.isTimerRunning = false;
    this.pausedTime = this.getTimestamp();
  }

  resume(): void {
    if (this.isTimerRunning) return;
    
    // Add the paused duration to the accumulated paused time
    this.accumulatedPausedTime += this.getTimestamp() - this.pausedTime;
    this.isTimerRunning = true;
    
    // Restart the update interval if needed
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => {
        if (this.isTimerRunning) {
          this.notifySubscribers();
        }
      }, 16) as unknown as number;
    }
  }

  stop(): void {
    this.isTimerRunning = false;
    this.accumulatedPausedTime = 0;
    
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.notifySubscribers();
  }

  reset(): void {
    this.startTime = 0;
    this.pausedTime = 0;
    this.accumulatedPausedTime = 0;
    this.isTimerRunning = false;
    
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getElapsed(): number {
    if (this.startTime === 0) {
      return 0;
    }
    
    let currentTime = this.getTimestamp();
    if (this.isTimerRunning) {
      return currentTime - this.startTime - this.accumulatedPausedTime;
    } else {
      return this.pausedTime - this.startTime - this.accumulatedPausedTime;
    }
  }

  isRunning(): boolean {
    return this.isTimerRunning;
  }

  subscribe(callback: (elapsed: number) => void): () => void {
    this.callbacks.push(callback);
    
    // Return an unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    const elapsed = this.getElapsed();
    this.callbacks.forEach(callback => callback(elapsed));
  }
}