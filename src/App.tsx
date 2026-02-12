import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { ImageViewer } from './components/ImageViewer';
import { QuestionForm } from './components/QuestionForm';
import { Auth } from './components/Auth';
import { useStore } from './hooks/useStore';
import { getDescription } from './lib/descriptions';
import { FaDownload } from 'react-icons/fa';

function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const {
    state,
    setAnswer,
    nextImage,
    prevImage,
    skipImage,
    jumpToImage,
    currentImage,
    currentAnswers,
    isLastImage,
    isSyncing,
    exportData,
    isLoaded,
    TRAINING_IMAGES,
    session,
    signOut
  } = useStore();

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Laden...</div>;

  // Login Screen
  if (!session) {
    return <Auth />;
  }

  return (
    <Layout
      header={
        <Header
          expertId={session?.user?.email || 'Experte'}
          currentImageIndex={state.currentImageIndex}
          totalImages={TRAINING_IMAGES.length}
          imageId={currentImage.id}
          onLogout={signOut}
          onMenuClick={() => setIsDashboardOpen(true)}
        />
      }
      dashboard={
        <Dashboard
          totalImages={TRAINING_IMAGES.length}
          currentImageIndex={state.currentImageIndex}
          completedImages={state.completedImages}
          imageSequence={state.imageSequence}
          onJump={(index) => {
            jumpToImage(index);
          }}
          isOpen={isDashboardOpen}
          onToggle={() => setIsDashboardOpen(!isDashboardOpen)}
        />
      }
      leftPanel={
        <ImageViewer imageUrl={currentImage.url} />
      }
      rightPanel={
        <div className="pb-24">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-20">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Wunde {state.currentImageIndex + 1}</h2>
              <p className="text-slate-600 text-lg">{getDescription(currentImage.id)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={skipImage}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded border border-slate-300 transition"
              >
                Überspringen
              </button>
              <button onClick={exportData} title="Daten Exportieren" className="p-2 text-slate-400 hover:text-blue-600 transition">
                <FaDownload />
              </button>
            </div>
          </div>

          <QuestionForm
            answers={currentAnswers}
            onAnswerChange={setAnswer}
          />

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between fixed bottom-0 right-0 w-1/2 z-20">
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
