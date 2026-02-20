import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { ImageViewer } from './components/ImageViewer';
import { QuestionForm } from './components/QuestionForm';
import { Auth } from './components/Auth';
import { useStore } from './hooks/useStore';
import { getDescription } from './lib/descriptions';

import { ThankYou } from './components/ThankYou';

function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    state,
    setAnswer,
    nextImage,
    prevImage,

    jumpToImage,
    currentImage,
    currentAnswers,
    isLastImage,
    isSyncing,

    isLoaded,
    TRAINING_IMAGES,
    session,
    isFinished,
    signOut
  } = useStore();

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Laden...</div>;

  // Login Screen
  if (!session) {
    return <Auth />;
  }

  if (isFinished) {
    return <ThankYou />;
  }

  const handleNextClick = () => {
    setShowConfirmModal(true);
  };

  const confirmNextImage = async () => {
    setShowConfirmModal(false);
    await nextImage();
  };

  return (
    <>
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
                {/* Skip button removed */}
                {/* Export button removed */}
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
                onClick={handleNextClick}
                disabled={isSyncing}
                className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
              >
                {isSyncing ? 'Speichert...' : isLastImage ? 'Abschließen' : 'Weiter & Speichern'}
              </button>
            </div>
          </div>
        }
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Bewertung abschließen?</h3>
            <p className="text-slate-600 mb-4 font-medium">Sind Sie mit der Bewertung dieser Wunde fertig?</p>
            <p className="text-sm text-slate-500 mb-8">Sie können später jederzeit über das Übersichtsmenü oben links zu diesem Bild zurückkehren und Ihre Angaben bearbeiten.</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition border border-slate-200"
              >
                Noch mal prüfen
              </button>
              <button
                onClick={confirmNextImage}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 transition-all"
              >
                Ja, weiter zum nächsten Bild
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
