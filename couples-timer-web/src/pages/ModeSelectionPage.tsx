import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModeSelection } from '../viewModel/useModeSelection';
import { ModeCard } from '../components';
import { useTranslation } from 'react-i18next';

const ModeSelectionPage: React.FC = () => {
  const { 
    presetModes, 
    customModes, 
    selectMode,
    createCustomMode,
    loadCustomModes
  } = useModeSelection();
  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomModes();
  }, [loadCustomModes]);

  const handleModeSelect = (mode: any) => {
    selectMode(mode);
    setSelectedModeId(mode.id);
  };

  const handleStartSession = () => {
    if (selectedModeId) {
      // Find the selected mode
      const mode = [...presetModes, ...customModes].find(m => m.id === selectedModeId);
      if (mode) {
        navigate('/session', { state: { selectedMode: mode } });
      }
    }
  };

  const handleCreateCustomMode = () => {
    const newMode = createCustomMode();
    navigate('/sequence-builder', { state: { mode: newMode } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-therapeutic-light">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">{t('common.appTitle')}</h1>
      </header>
      
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('modeSelection.title')}</h2>
          <p className="text-gray-600">{t('modeSelection.description')}</p>
        </div>
        
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('modeSelection.subtitle')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {presetModes.map(mode => (
              <ModeCard
                key={mode.id}
                mode={mode}
                isSelected={selectedModeId === mode.id}
                onClick={() => handleModeSelect(mode)}
              />
            ))}
          </div>
          
          {customModes.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('modeSelection.customMode')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {customModes.map(mode => (
                  <ModeCard
                    key={mode.id}
                    mode={mode}
                    isSelected={selectedModeId === mode.id}
                    onClick={() => handleModeSelect(mode)}
                  />
                ))}
              </div>
            </>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={handleCreateCustomMode}
              className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              {t('modeSelection.createCustom')}
            </button>
            
            <button
              onClick={handleStartSession}
              disabled={!selectedModeId}
              className={`font-medium py-2 px-6 rounded-lg transition-colors ${
                selectedModeId 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('modeSelection.selectMode')}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {t('common.appTitle')}
      </footer>
    </div>
  );
};

export default ModeSelectionPage;