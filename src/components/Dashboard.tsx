import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DashboardProps {
    totalImages: number;
    currentImageIndex: number;
    completedImages: string[]; // List of IDs
    imageSequence: string[]; // List of IDs in order
    onJump: (index: number) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export function Dashboard({
    totalImages,
    currentImageIndex,
    completedImages,
    imageSequence,
    onJump,
    isOpen,
    onToggle
}: DashboardProps) {

    return (
        <div
            className={twMerge(
                "fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
            style={{ width: '320px' }}
        >
            <div className="p-4 border-b flex justify-between items-center bg-sky-900 text-white">
                <h2 className="text-xl font-bold">Übersicht</h2>
                <button
                    onClick={onToggle}
                    className="p-1 hover:bg-sky-800 rounded"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: totalImages }).map((_, i) => {
                        const imageId = imageSequence[i];
                        const isCompleted = completedImages.includes(imageId);
                        const isCurrent = i === currentImageIndex;

                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    onJump(i);
                                    if (window.innerWidth < 768) onToggle(); // Auto-close on mobile
                                }}
                                className={clsx(
                                    "aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-colors border-2",
                                    isCurrent ? "border-sky-600 ring-2 ring-sky-200 z-10" : "border-transparent",
                                    isCompleted
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                )}
                                title={`Bild ${i + 1}`}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 border-t bg-gray-50 text-xs text-gray-500">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded"></div>
                    <span>Bearbeitet</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <span>Offen</span>
                </div>
            </div>
        </div>
    );
}
