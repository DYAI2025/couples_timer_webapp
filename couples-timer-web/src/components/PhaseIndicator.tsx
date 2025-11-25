import React from 'react';
import { PhaseType, getSpeakerForPhase, Speaker } from '../domain';
import { useTranslation } from 'react-i18next';

interface PhaseIndicatorProps {
  phase: PhaseType;
  speaker?: Speaker;
}

const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ phase, speaker }) => {
  const { t } = useTranslation();

  // Translate phase names
  const getPhaseName = (phase: PhaseType): string => {
    switch (phase) {
      case PhaseType.PREP:
        return t('session.prepPhase');
      case PhaseType.SLOT_A:
        return t('session.slotPhase');
      case PhaseType.SLOT_B:
        return t('session.slotPhase');
      case PhaseType.TRANSITION:
        return t('session.transitionPhase');
      case PhaseType.CLOSING_A:
        return t('session.closingPhase');
      case PhaseType.CLOSING_B:
        return t('session.closingPhase');
      case PhaseType.COOLDOWN:
        return t('session.cooldownPhase');
      default:
        return phase;
    }
  };

  // Determine styling based on phase
  let phaseClass = 'bg-therapeutic-light text-gray-700';
  
  if (phase === PhaseType.SLOT_A) {
    phaseClass = 'bg-speakerA-100 text-speakerA-800';
  } else if (phase === PhaseType.SLOT_B) {
    phaseClass = 'bg-speakerB-100 text-speakerB-800';
  } else if (phase === PhaseType.TRANSITION || phase === PhaseType.COOLDOWN) {
    phaseClass = 'bg-therapeutic-medium text-therapeutic-dark';
  }

  return (
    <div className={`rounded-full px-4 py-2 font-medium ${phaseClass} shadow-sm`}>
      <span className="capitalize">
        {getPhaseName(phase)}
        {speaker && (
          <span className="ml-2">
            ({speaker === Speaker.A ? t('session.speakerA') : t('session.speakerB')})
          </span>
        )}
      </span>
    </div>
  );
};

export default PhaseIndicator;