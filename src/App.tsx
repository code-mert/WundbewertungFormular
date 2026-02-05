import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { ImageViewer } from './components/ImageViewer';
import { QuestionForm } from './components/QuestionForm';
import { useStore } from './hooks/useStore';
import { getDescription } from './lib/descriptions';
import { FaUserMd, FaDownload } from 'react-icons/fa';

function App() {
  const {
    state,
    setExpertId,
    setAnswer,
    nextImage,
    prevImage,
    currentImage,
    currentAnswers,
    isLastImage,
    isSyncing,
    exportData,
    isLoaded,
    TRAINING_IMAGES
  } = useStore();

  const [tempExpertId, setTempExpertId] = useState('');

  // Safety Warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if session is active (expertId set) and not complete
      if (state.expertId) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.expertId]);

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Laden...</div>;

  // Login Screen
  if (!state.expertId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            <FaUserMd />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Ground Truth Builder</h1>
          <p className="text-slate-500 mb-8">Bitte geben Sie Ihre Experten-ID ein, um die Wundanalyse zu starten.</p>

          <form onSubmit={(e) => { e.preventDefault(); if (tempExpertId.trim()) setExpertId(tempExpertId.trim()); }}>
            <input
              type="text"
              placeholder="z.B. Experte_Mert"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4"
              value={tempExpertId}
              onChange={(e) => setTempExpertId(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={!tempExpertId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
            >
              Session Starten
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Completion Screen (Optional, can be added if index >= total, currently logic just alerts)
  // For now, nextImage alerts on finish. We can add a specialized view here if needed.

  return (
    <Layout
      header={
        <Header
          expertId={state.expertId}
          currentImageIndex={state.currentImageIndex}
          totalImages={TRAINING_IMAGES.length}
          imageId={currentImage.id}
        />
      }
      leftPanel={
        <ImageViewer imageUrl={currentImage.url} />
      }
      rightPanel={
        <div className="pb-24">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-20">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Bild {currentImage.id.replace('wunde_', '')}</h2>
              <p className="text-slate-600 text-sm">{getDescription(currentImage.id)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportData} title="Daten Exportieren" className="p-2 text-slate-400 hover:text-blue-600 transition">
                <FaDownload />
              </button>
            </div>
          </div>

          <QuestionForm
            answers={currentAnswers}
            onAnswerChange={setAnswer}
          />

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between fixed bottom-0 right-0 w-1/2 lg:w-[40%] z-20">
            <button
              onClick={prevImage}
              disabled={state.currentImageIndex === 0}
              className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 transition"
            >
              Zurück
            </button>
            <button
              onClick={nextImage}
              disabled={isSyncing}
              className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
            >
              {isSyncing ? 'Speichert...' : isLastImage ? 'Abschließen' : 'Weiter & Speichern'}
            </button>
          </div>
        </div>
      }
    />
  );
}

export default App;
