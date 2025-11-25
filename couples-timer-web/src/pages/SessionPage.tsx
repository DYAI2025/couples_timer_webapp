import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SessionProvider, useSession } from '../viewModel/SessionContext';
import { 
  TimerDisplay, 
  PhaseIndicator, 
  SpeakerBadge, 
  GuidanceTip, 
  CooldownView 
} from '../components';
import type { SessionMode } from '../domain';
import { PhaseType } from '../domain';
import { useTranslation } from 'react-i18next';

// SessionPage component wrapped with SessionProvider
const SessionPageContent: React.FC = () => {
  const { 
    currentMode,
    initializeSession,
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
    getCurrentPhase,
    getCurrentSpeaker,
    getCurrentPhaseDuration,
    getRemainingTime,
    getGuidanceTip,
    isRunning,
    isPaused,
    isFinished,
    formatTime
  } = useSession();
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get mode from navigation state
  const selectedMode: SessionMode | undefined = state?.selectedMode;

  useEffect(() => {
    if (selectedMode && !isInitialized) {
      initializeSession(selectedMode);
      setIsInitialized(true);
    }
  }, [selectedMode, initializeSession, isInitialized]);

  const handleStart = () => {
    startSession();
  };

  const handlePauseResume = () => {
    if (isRunning()) {
      pauseSession();
    } else if (isPaused()) {
      resumeSession();
    }
  };

  const handleStop = () => {
    if (window.confirm(t('common.stop'))) {
      stopSession();
      navigate('/');
    }
  };

  const handleCooldownCompleted = () => {
    navigate('/');
  };

  // Check if current phase is cooldown
  const currentPhase = getCurrentPhase();
  const isCooldown = currentPhase === PhaseType.COOLDOWN;
  
  // Calculate time remaining
  const remainingTime = isCooldown ? getRemainingTime() : getCurrentPhaseDuration() - (getRemainingTime() * -1);
  const formattedTime = formatTime(remainingTime);
  
  // Determine current speaker
  const speaker = getCurrentSpeaker();
  
  if (!currentMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-700">{t('session.selectMode')}</p>
      </div>
    );
  }

  // If cooldown phase and finished
  if (isCooldown && isFinished()) {
    return (
      <CooldownView 
        timeLeft={remainingTime}
        totalTime={currentMode.phases.find(p => p.type === PhaseType.COOLDOWN)?.duration || 300} // Default to 5 min if not found
        onCompleted={handleCooldownCompleted}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{currentMode.name}</h1>
          <button
            onClick={handleStop}
            className="text-gray-500 hover:text-gray-700"
          >
            {t('common.stop')}
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-therapeutic-light">
        <div className="w-full max-w-2xl">
          {/* Phase indicator and speaker badge */}
          <div className="flex justify-center gap-4 mb-8">
            {currentPhase && <PhaseIndicator phase={currentPhase} />}
            {speaker && <SpeakerBadge speaker={speaker} isActive={isRunning()} />}
          </div>
          
          {/* Timer display */}
          <div className="flex justify-center mb-10">
            <TimerDisplay 
              timeLeft={remainingTime} 
              totalTime={getCurrentPhaseDuration()} 
              isRunning={isRunning()} 
            />
          </div>
          
          {/* Session controls */}
          <div className="flex justify-center gap-4 mb-8">
            {!isRunning() && !isPaused() && (
              <button
                onClick={handleStart}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {t('common.start')}
              </button>
            )}
            
            {(isRunning() || isPaused()) && (
              <button
                onClick={handlePauseResume}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {isPaused() ? t('common.resume') : t('common.pause')}
              </button>
            )}
            
            <button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              {t('common.stop')}
            </button>
          </div>
          
          {/* Time remaining */}
          <div className="text-center text-2xl font-mono font-semibold text-gray-700 mb-6">
            {formattedTime}
            <span className="text-sm font-normal ml-2 text-gray-500">
              {t('session.remainingTime')}
            </span>
          </div>
        </div>
      </main>
      
      {/* Guidance tip display */}
      <GuidanceTip 
        tip={getGuidanceTip()} 
        isVisible={!!getGuidanceTip()} 
      />
      
      <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {t('common.appTitle')}
      </footer>
    </div>
  );
};

// Wrapper component to provide SessionContext
const SessionPage: React.FC = () => {
  return (
    <SessionProvider>
      <SessionPageContent />
    </SessionProvider>
  );
};

export default SessionPage;