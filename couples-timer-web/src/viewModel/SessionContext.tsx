import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { SessionEngine } from '../domain/SessionEngine';
import { SessionMode, SessionStateType, PhaseType, Speaker, getSpeakerForPhase } from '../domain';
import { TimerService } from '../services/TimerService';
import { audioService } from '../services/AudioService';
import { guidanceService } from '../services/GuidanceService';

interface SessionContextType {
  sessionEngine: SessionEngine | null;
  currentMode: SessionMode | null;
  isInitialized: boolean;
  initializeSession: (mode: SessionMode) => void;
  startSession: () => void;
  stopSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  getCurrentPhase: () => PhaseType | null;
  getCurrentSpeaker: () => Speaker | null;
  getCurrentPhaseDuration: () => number;
  getRemainingTime: () => number;
  getElapsedSessionTime: () => number;
  getElapsedPhaseTime: () => number;
  getProgress: () => number; // 0 to 1
  getGuidanceTip: () => string | null;
  isRunning: () => boolean;
  isPaused: () => boolean;
  isFinished: () => boolean;
  formatTime: (seconds: number) => string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionEngine, setSessionEngine] = useState<SessionEngine | null>(null);
  const [currentMode, setCurrentMode] = useState<SessionMode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentSessionState, setCurrentSessionState] = useState({
    type: SessionStateType.IDLE,
    currentPhaseIndex: -1,
    elapsedSessionTime: 0,
    elapsedPhaseTime: 0
  });

  // Initialize the session engine
  useEffect(() => {
    const engine = new SessionEngine(
      new TimerService(),
      audioService,
      guidanceService
    );

    // Subscribe to engine updates
    const unsubscribe = engine.subscribe((state) => {
      setCurrentSessionState(state);
    });

    setSessionEngine(engine);
    setIsInitialized(true);

    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe();
      engine.stop(); // Ensure engine is stopped
    };
  }, []);

  const initializeSession = useCallback((mode: SessionMode) => {
    if (!sessionEngine) return;
    
    setCurrentMode(mode);
  }, [sessionEngine]);

  const startSession = useCallback(() => {
    if (!sessionEngine || !currentMode) return;
    
    sessionEngine.start(currentMode);
  }, [sessionEngine, currentMode]);

  const stopSession = useCallback(() => {
    if (!sessionEngine) return;
    
    sessionEngine.stop();
    setCurrentMode(null);
  }, [sessionEngine]);

  const pauseSession = useCallback(() => {
    if (!sessionEngine) return;
    
    sessionEngine.pause();
  }, [sessionEngine]);

  const resumeSession = useCallback(() => {
    if (!sessionEngine) return;
    
    sessionEngine.resume();
  }, [sessionEngine]);

  const getCurrentPhase = useCallback((): PhaseType | null => {
    if (!sessionEngine) return null;
    return sessionEngine.getCurrentPhase();
  }, [sessionEngine]);

  const getCurrentSpeaker = useCallback((): Speaker | null => {
    const currentPhase = getCurrentPhase();
    if (!currentPhase) return null;
    
    const speakerStr = getSpeakerForPhase(currentPhase);
    if (speakerStr === 'A') return Speaker.A;
    if (speakerStr === 'B') return Speaker.B;
    
    return null;
  }, [getCurrentPhase]);

  const getCurrentPhaseDuration = useCallback((): number => {
    if (!sessionEngine) return 0;
    return sessionEngine.getCurrentPhaseDuration();
  }, [sessionEngine]);

  const getRemainingTime = useCallback((): number => {
    if (!sessionEngine) return 0;
    return sessionEngine.getRemainingTime();
  }, [sessionEngine]);

  const getElapsedSessionTime = useCallback((): number => {
    if (!sessionEngine) return 0;
    return sessionEngine.getElapsedSessionTime();
  }, [sessionEngine]);

  const getElapsedPhaseTime = useCallback((): number => {
    if (!sessionEngine) return 0;
    return sessionEngine.getElapsedPhaseTime();
  }, [sessionEngine]);

  const getProgress = useCallback((): number => {
    if (!sessionEngine) return 0;
    return sessionEngine.getProgress();
  }, [sessionEngine]);

  const getGuidanceTip = useCallback((): string | null => {
    if (!sessionEngine) return null;
    return sessionEngine.getGuidanceTip();
  }, [sessionEngine]);

  const isRunning = useCallback((): boolean => {
    return currentSessionState.type === SessionStateType.RUNNING;
  }, [currentSessionState]);

  const isPaused = useCallback((): boolean => {
    return currentSessionState.type === SessionStateType.PAUSED;
  }, [currentSessionState]);

  const isFinished = useCallback((): boolean => {
    return currentSessionState.type === SessionStateType.FINISHED;
  }, [currentSessionState]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.floor(Math.abs(seconds) % 60);
    const sign = seconds < 0 ? '-' : '';
    
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const value: SessionContextType = {
    sessionEngine,
    currentMode,
    isInitialized,
    initializeSession,
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
    getCurrentPhase,
    getCurrentSpeaker,
    getCurrentPhaseDuration,
    getRemainingTime,
    getElapsedSessionTime,
    getElapsedPhaseTime,
    getProgress,
    getGuidanceTip,
    isRunning,
    isPaused,
    isFinished,
    formatTime
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};