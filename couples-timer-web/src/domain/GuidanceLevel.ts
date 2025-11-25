/**
 * Represents the level of guidance provided during a session
 */
export enum GuidanceLevel {
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  HIGH = 'high'
}

/**
 * Interface containing guidance settings
 */
export interface GuidanceSettings {
  showPrepTips: boolean;
  showTransitionTips: boolean;
  showCooldownTips: boolean;
  showBreathingExercise: boolean;
}

/**
 * Gets guidance settings based on guidance level
 */
export function getGuidanceSettings(level: GuidanceLevel): GuidanceSettings {
  switch (level) {
    case GuidanceLevel.MINIMAL:
      return {
        showPrepTips: false,
        showTransitionTips: false,
        showCooldownTips: true,
        showBreathingExercise: false
      };
    case GuidanceLevel.MODERATE:
      return {
        showPrepTips: false,
        showTransitionTips: true,
        showCooldownTips: true,
        showBreathingExercise: false
      };
    case GuidanceLevel.HIGH:
      return {
        showPrepTips: true,
        showTransitionTips: true,
        showCooldownTips: true,
        showBreathingExercise: true
      };
    default:
      // This should never happen due to enum constraints
      const exhaustiveCheck: never = level;
      throw new Error(`Unhandled guidance level: ${exhaustiveCheck}`);
  }
}