import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SessionMode, PhaseConfig } from '../domain';
import {
  PhaseType,
  GuidanceLevel,
  createPhaseConfig,
  formatDuration,
  isValidSessionMode
} from '../domain';
import { useModeSelection } from '../viewModel/useModeSelection';
import { useTranslation } from 'react-i18next';

const SequenceBuilderPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { updateCustomMode } = useModeSelection();
  const { t } = useTranslation();
  
  const initialMode: SessionMode | null = state?.mode || null;
  const [name, setName] = useState(initialMode?.name || '');
  const [phases, setPhases] = useState<PhaseConfig[]>(initialMode?.phases || []);
  const [guidanceLevel, setGuidanceLevel] = useState<GuidanceLevel>(
    initialMode?.guidanceLevel || GuidanceLevel.MODERATE
  );
  const [newPhaseType, setNewPhaseType] = useState<PhaseType>(PhaseType.SLOT_A);
  const [newPhaseDuration, setNewPhaseDuration] = useState(300); // 5 minutes default
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode) {
      setName(initialMode.name);
      setPhases(initialMode.phases);
      setGuidanceLevel(initialMode.guidanceLevel);
    }
  }, [initialMode]);

  const handleAddPhase = () => {
    try {
      const newPhase = createPhaseConfig(newPhaseType, newPhaseDuration);
      setPhases([...phases, newPhase]);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleRemovePhase = (index: number) => {
    const newPhases = [...phases];
    newPhases.splice(index, 1);
    setPhases(newPhases);
  };

  const handleUpdatePhaseDuration = (index: number, duration: number) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], duration };
    setPhases(newPhases);
  };

  const handleMovePhase = (fromIndex: number, toIndex: number) => {
    const newPhases = [...phases];
    const [movedItem] = newPhases.splice(fromIndex, 1);
    newPhases.splice(toIndex, 0, movedItem);
    setPhases(newPhases);
  };

  const handleSaveMode = () => {
    if (!name.trim()) {
      setError(t('sequenceBuilder.modeName') + ' ' + t('common.required'));
      return;
    }

    const baseMode: SessionMode = initialMode ?? {
      id: `custom_${Date.now()}`,
      name,
      phases: [],
      guidanceLevel,
      isLocked: false,
      totalDuration: 0
    };

    const newMode: SessionMode = {
      ...baseMode,
      id: initialMode?.id || baseMode.id,
      name,
      phases,
      guidanceLevel,
      isLocked: false,
      totalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0)
    };

    if (!isValidSessionMode(newMode)) {
      setError(t('sequenceBuilder.invalidConfig'));
      return;
    }

    updateCustomMode(newMode);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  // Check if mode is valid
  const isModeValid = () => {
    if (!name.trim()) return false;
    const candidateMode: SessionMode = {
      id: initialMode?.id || 'preview_mode',
      name,
      phases,
      guidanceLevel,
      isLocked: false,
      totalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0)
    };

    return isValidSessionMode(candidateMode);
  };

  return (
    <div className="min-h-screen bg-therapeutic-light">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {initialMode ? t('sequenceBuilder.title') : t('sequenceBuilder.createTitle')}
          </h1>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            {t('common.back')}
          </button>
        </div>
      </header>
      
      <main className="p-4 max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t('sequenceBuilder.title')}
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sequenceBuilder.modeName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder={t('sequenceBuilder.modeName')}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sequenceBuilder.addPhase')}
            </label>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs text-gray-500 mb-1">
                  {t('sequenceBuilder.phaseType')}
                </label>
                <select
                  value={newPhaseType}
                  onChange={(e) => setNewPhaseType(e.target.value as PhaseType)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.values(PhaseType).map((type) => (
                    <option key={type} value={type}>
                      {t(`sequenceBuilder.phaseTypes.${type}`)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs text-gray-500 mb-1">
                  {t('sequenceBuilder.duration')} (s)
                </label>
                <input
                  type="number"
                  min="1"
                  max="3600"
                  value={newPhaseDuration}
                  onChange={(e) => setNewPhaseDuration(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <button
                onClick={handleAddPhase}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                {t('sequenceBuilder.addPhase')}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sequenceBuilder.guidanceLevel')}
            </label>
            <div className="flex gap-4">
              {Object.values(GuidanceLevel).map((level) => (
                <label key={level} className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={guidanceLevel === level}
                    onChange={() => setGuidanceLevel(level)}
                    className="form-radio h-4 w-4 text-primary-600"
                    name="guidanceLevel"
                  />
                  <span className="ml-2 text-gray-700 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            {t('sequenceBuilder.preview')}
          </h3>
          
          {phases.length === 0 ? (
            <p className="text-gray-500 italic">{t('sequenceBuilder.noPhases')}</p>
          ) : (
            <div className="space-y-3">
              {phases.map((phase, index) => (
                <div 
                  key={phase.id} 
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-3">{index + 1}.</span>
                    <div>
                      <div className="font-medium">
                        {t(`sequenceBuilder.phaseTypes.${phase.type}`)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(phase.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="3600"
                      value={phase.duration}
                      onChange={(e) => handleUpdatePhaseDuration(index, parseInt(e.target.value) || 0)}
                      className="w-20 p-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => handleRemovePhase(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {t('common.delete')}
                    </button>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => index > 0 && handleMovePhase(index, index - 1)}
                        disabled={index === 0}
                        className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => index < phases.length - 1 && handleMovePhase(index, index + 1)}
                        disabled={index === phases.length - 1}
                        className={`p-1 ${index === phases.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          
          <button
            onClick={handleSaveMode}
            disabled={!isModeValid()}
            className={`px-6 py-2 rounded-md text-white ${
              isModeValid() 
                ? 'bg-primary-600 hover:bg-primary-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {t('common.save')}
          </button>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {t('common.appTitle')}
      </footer>
    </div>
  );
};

export default SequenceBuilderPage;