import './App.css'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-semibold text-gray-800">{t('common.appTitle')}</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-4">{t('modeSelection.title')}</h2>
          <p className="text-gray-600 mb-8">
            {t('modeSelection.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              {t('modeSelection.selectMode')}
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors">
              {t('modeSelection.createCustom')}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {t('common.appTitle')}
      </footer>
    </div>
  )
}

export default App
