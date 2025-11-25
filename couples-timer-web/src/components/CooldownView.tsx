import React from 'react';
import { useTranslation } from 'react-i18next';
import TimerDisplay from './TimerDisplay';

interface CooldownViewProps {
  timeLeft: number;
  totalTime: number;
  onCompleted?: () => void;
}

const CooldownView: React.FC<CooldownViewProps> = ({ timeLeft, totalTime, onCompleted }) => {
  const [t] = useTranslation();

  // Call onCompleted when time is up
  React.useEffect(() => {
    if (timeLeft <= 0) {
      // Add a small delay to allow UI to show 00:00 before triggering completion
      const timer = setTimeout(() => {
        if (onCompleted) onCompleted();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, onCompleted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {t('session.cooldownPhase')}
        </h2>
        
        <div className="mb-8">
          <TimerDisplay 
            timeLeft={timeLeft} 
            totalTime={totalTime} 
            isRunning={timeLeft > 0}
          />
        </div>
        
        <div className="bg-therapeutic-light border border-therapeutic-medium rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <svg 
              className="h-6 w-6 text-therapeutic-dark mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">
              {t('session.noAftertalk')}
            </h3>
          </div>
          
          <p className="text-gray-600">
            {t('session.cooldownInstruction')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CooldownView;