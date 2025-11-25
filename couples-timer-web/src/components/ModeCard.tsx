import React from 'react';
import { SessionMode, formatTotalDuration, countRounds } from '../domain';
import { useTranslation } from 'react-i18next';

interface ModeCardProps {
  mode: SessionMode;
  isSelected?: boolean;
  onClick?: () => void;
}

const ModeCard: React.FC<ModeCardProps> = ({ mode, isSelected = false, onClick }) => {
  const { t } = useTranslation();

  // Format duration
  const formattedDuration = formatTotalDuration(mode.totalDuration);

  // Count rounds
  const rounds = countRounds(mode.phases);

  // Determine styling based on selection state
  const cardClass = isSelected
    ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50'
    : 'border-gray-200 hover:border-primary-300 hover:shadow-md';

  return (
    <div 
      className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ${cardClass} bg-white`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{mode.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {rounds} {t('sequenceBuilder.phaseTypes.slotA')} / {t('sequenceBuilder.phaseTypes.slotB')}
          </p>
        </div>
        
        {mode.isLocked ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {t('modeSelection.maintainMode')} {/* Using maintain as a general lock indicator */}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {t('modeSelection.customMode')}
          </span>
        )}
      </div>
      
      <div className="mt-4 flex items-center text-sm text-gray-600">
        <svg 
          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>{formattedDuration}</span>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        {mode.guidanceLevel === 'minimal' && t('guidance.prepTips.breathing')}
        {mode.guidanceLevel === 'moderate' && t('guidance.transitionTips.listenDeeply')}
        {mode.guidanceLevel === 'high' && t('guidance.cooldownTips.reflect')}
      </div>
    </div>
  );
};

export default ModeCard;