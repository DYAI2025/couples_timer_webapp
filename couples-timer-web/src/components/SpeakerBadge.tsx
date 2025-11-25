import React from 'react';
import { Speaker } from '../domain';
import { useTranslation } from 'react-i18next';

interface SpeakerBadgeProps {
  speaker: Speaker;
  isActive?: boolean;
}

const SpeakerBadge: React.FC<SpeakerBadgeProps> = ({ speaker, isActive = false }) => {
  const { t } = useTranslation();

  const getSpeakerLabel = () => {
    return speaker === Speaker.A ? t('session.speakerA') : t('session.speakerB');
  };

  const getSpeakerColor = () => {
    if (speaker === Speaker.A) {
      return isActive 
        ? 'bg-speakerA-500 text-white ring-2 ring-speakerA-300' 
        : 'bg-speakerA-100 text-speakerA-800';
    } else {
      return isActive 
        ? 'bg-speakerB-500 text-white ring-2 ring-speakerB-300' 
        : 'bg-speakerB-100 text-speakerB-800';
    }
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold ${getSpeakerColor()} ${isActive ? 'animate-pulse' : ''}`}>
      {getSpeakerLabel()}
    </div>
  );
};

export default SpeakerBadge;