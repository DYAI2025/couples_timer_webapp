import { SessionMode } from '../domain/SessionMode';

const CUSTOM_MODES_KEY = 'couples_timer_custom_modes';

export interface PersistenceServiceProtocol {
  saveCustomModes: (modes: SessionMode[]) => void;
  loadCustomModes: () => SessionMode[];
  addCustomMode: (mode: SessionMode) => void;
  updateCustomMode: (mode: SessionMode) => void;
  deleteCustomMode: (modeId: string) => void;
}

export class PersistenceService implements PersistenceServiceProtocol {
  saveCustomModes(modes: SessionMode[]): void {
    try {
      localStorage.setItem(CUSTOM_MODES_KEY, JSON.stringify(modes));
    } catch (error) {
      console.error('Failed to save custom modes:', error);
      throw new Error('Could not save custom modes to local storage');
    }
  }

  loadCustomModes(): SessionMode[] {
    try {
      const stored = localStorage.getItem(CUSTOM_MODES_KEY);
      if (!stored) {
        return [];
      }
      
      const parsed = JSON.parse(stored);
      
      // Validate the parsed data
      if (!Array.isArray(parsed)) {
        console.warn('Invalid data format for custom modes, returning empty array');
        return [];
      }
      
      // Ensure all loaded modes have isLocked: false
      return parsed.map(mode => ({
        ...mode,
        isLocked: false  // Custom modes should never be locked when loaded
      }));
    } catch (error) {
      console.error('Failed to load custom modes:', error);
      return [];
    }
  }

  addCustomMode(mode: SessionMode): void {
    const modes = this.loadCustomModes();
    // Ensure the new mode has isLocked: false
    const newMode = { ...mode, isLocked: false };
    modes.push(newMode);
    this.saveCustomModes(modes);
  }

  updateCustomMode(mode: SessionMode): void {
    const modes = this.loadCustomModes();
    const index = modes.findIndex(m => m.id === mode.id);
    
    if (index !== -1) {
      // Ensure the updated mode has isLocked: false
      modes[index] = { ...mode, isLocked: false };
      this.saveCustomModes(modes);
    }
  }

  deleteCustomMode(modeId: string): void {
    let modes = this.loadCustomModes();
    modes = modes.filter(mode => mode.id !== modeId);
    this.saveCustomModes(modes);
  }
}

// Singleton instance
export const persistenceService = new PersistenceService();