import { PhaseType } from '../domain/PhaseType';
import { GuidanceLevel, GuidanceSettings, getGuidanceSettings } from '../domain/GuidanceLevel';
import { t } from 'i18next';

/**
 * Service that provides guidance tips based on phase type and guidance level
 */
export interface GuidanceServiceProtocol {
  getRandomTip: (phase: PhaseType, level: GuidanceLevel) => string | null;
  getTipsForPhase: (phase: PhaseType, level: GuidanceLevel) => string[];
}

export class GuidanceService implements GuidanceServiceProtocol {
  /**
   * Returns a random tip for the given phase and guidance level
   */
  getRandomTip(phase: PhaseType, level: GuidanceLevel): string | null {
    const tips = this.getTipsForPhase(phase, level);
    
    if (tips.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }

  /**
   * Returns all tips for the given phase and guidance level
   */
  getTipsForPhase(phase: PhaseType, level: GuidanceLevel): string[] {
    const settings = getGuidanceSettings(level);
    let tips: string[] = [];

    // Get tips based on phase type
    switch (phase) {
      case PhaseType.PREP:
        if (settings.showPrepTips) {
          tips = [
            t('guidance.prepTips.breathing'),
            t('guidance.prepTips.intention'),
            t('guidance.prepTips.openMind')
          ];
        }
        break;
        
      case PhaseType.TRANSITION:
        if (settings.showTransitionTips) {
          tips = [
            t('guidance.transitionTips.switchFocus'),
            t('guidance.transitionTips.listenDeeply'),
            t('guidance.transitionTips.breathe')
          ];
        }
        break;
        
      case PhaseType.COOLDOWN:
        // Always show cooldown tips if in cooldown phase, regardless of guidance level
        tips = [
          t('guidance.cooldownTips.reflect'),
          t('guidance.cooldownTips.appreciate'),
          t('guidance.cooldownTips.integrate')
        ];
        break;
        
      default:
        // For other phases (SLOT_A, SLOT_B, CLOSING_A, CLOSING_B), 
        // we may want to provide general speaking/listening tips
        tips = [];
        break;
    }

    return tips;
  }
}

// Singleton instance
export const guidanceService = new GuidanceService();