import { FaCheckCircle } from 'react-icons/fa';

export function ThankYou() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                    <FaCheckCircle className="text-6xl text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Vielen Dank!</h1>
                <p className="text-slate-600 mb-6">
                    Sie haben alle Wundbilder erfolgreich bewertet. Ihre Expertise ist ein wertvoller Beitrag für dieses Projekt.
                </p>
                <p className="text-slate-500 text-sm">
                    Sie können das Fenster nun schließen.
                </p>
            </div>
        </div>
    );
}
