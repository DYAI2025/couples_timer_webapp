import { useState, useEffect } from 'react';
import {
  type SessionMode,
  getPresetModes,
  createCustomModeTemplate,
  isValidSessionMode
} from '../domain';
import { persistenceService } from '../services/PersistenceService';

export interface ModeSelectionViewModel {
  presetModes: SessionMode[];
  customModes: SessionMode[];
  selectedMode: SessionMode | null;
  loading: boolean;
  error: string | null;
  selectMode: (mode: SessionMode) => void;
  createCustomMode: () => SessionMode;
  updateCustomMode: (mode: SessionMode) => void;
  deleteCustomMode: (modeId: string) => void;
  loadCustomModes: () => void;
}

export const useModeSelection = (): ModeSelectionViewModel => {
  const [presetModes] = useState<SessionMode[]>(() => getPresetModes());
  const [customModes, setCustomModes] = useState<SessionMode[]>([]);
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load custom modes on mount
  useEffect(() => {
    loadCustomModes();
  }, []);

  const loadCustomModes = () => {
    try {
      setLoading(true);
      const loadedModes = persistenceService.loadCustomModes();
      setCustomModes(loadedModes);
      setError(null);
    } catch (err) {
      setError('Failed to load custom modes');
      console.error('Error loading custom modes:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectMode = (mode: SessionMode) => {
    if (!isValidSessionMode(mode)) {
      setError('Invalid session mode selected');
      return;
    }
    setSelectedMode(mode);
  };

  const createCustomMode = () => {
    const newMode = createCustomModeTemplate();
    persistenceService.addCustomMode(newMode);
    setCustomModes([...customModes, newMode]);
    setSelectedMode(newMode);
    return newMode;
  };

  const updateCustomMode = (mode: SessionMode) => {
    if (mode.isLocked) {
      // This should not happen as locked modes cannot be updated
      return;
    }

    try {
      persistenceService.updateCustomMode(mode);
      setCustomModes(customModes.map(m => m.id === mode.id ? mode : m));
    } catch (err) {
      setError('Failed to update custom mode');
      console.error('Error updating custom mode:', err);
    }
  };

  const deleteCustomMode = (modeId: string) => {
    try {
      persistenceService.deleteCustomMode(modeId);
      setCustomModes(customModes.filter(mode => mode.id !== modeId));
      if (selectedMode?.id === modeId) {
        setSelectedMode(null);
      }
    } catch (err) {
      setError('Failed to delete custom mode');
      console.error('Error deleting custom mode:', err);
    }
  };

  return {
    presetModes,
    customModes,
    selectedMode,
    loading,
    error,
    selectMode,
    createCustomMode,
    updateCustomMode,
    deleteCustomMode,
    loadCustomModes
  };
};