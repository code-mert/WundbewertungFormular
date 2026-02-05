import { ProgressBar } from './ProgressBar';

interface Props {
    expertId: string;
    currentImageIndex: number;
    totalImages: number;
    imageId: string;
}

export function Header({ expertId, currentImageIndex, totalImages, imageId }: Props) {
    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-slate-200 z-50 flex items-center px-6 shadow-sm">
            <div className="flex items-center gap-4 w-64">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">GT</div>
                <h1 className="font-bold text-slate-800 hidden sm:block">WundAnalyse</h1>
            </div>

            <div className="flex-1 max-w-2xl mx-auto px-4 flex flex-col gap-1">
                <div className="flex justify-between text-xs text-slate-500 font-medium upppercase tracking-wider">
                    <span>Bild {currentImageIndex + 1} von {totalImages}</span>
                    <span>ID: {imageId}</span>
                </div>
                <ProgressBar total={totalImages} current={currentImageIndex} />
            </div>

            <div className="w-64 flex justify-end items-center gap-3">
                <div className="text-right">
                    <p className="text-xs text-slate-400">Experte</p>
                    <p className="text-sm font-semibold text-slate-700">{expertId || 'Nicht angemeldet'}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    👤
                </div>
            </div>
        </header>
    );
}
