import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FaSearchPlus, FaSearchMinus, FaUndo, FaExpand, FaTimes } from 'react-icons/fa';

interface Props {
    imageUrl: string;
}

export function ImageViewer({ imageUrl }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Handle Escape key to close fullscreen
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFullscreen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const Controls = ({ zoomIn, zoomOut, resetTransform, toggleFullscreen, isFull = false }: any) => (
        <div className={`absolute z-10 flex gap-2 ${isFull ? 'bottom-8 right-8' : 'bottom-4 right-4'}`}>
            <button onClick={() => zoomIn()} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition" title="Zoom In">
                <FaSearchPlus />
            </button>
            <button onClick={() => zoomOut()} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition" title="Zoom Out">
                <FaSearchMinus />
            </button>
            <button onClick={() => resetTransform()} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition" title="Reset">
                <FaUndo />
            </button>
            <button onClick={toggleFullscreen} className="p-3 bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-full backdrop-blur-md transition" title={isFull ? "Schließen" : "Vollbild"}>
                {isFull ? <FaTimes /> : <FaExpand />}
            </button>
        </div>
    );

    return (
        <>
            {/* Inline Viewer */}
            <div className="h-full bg-slate-900 relative overflow-hidden flex flex-col">
                <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded-lg text-white backdrop-blur-sm pointer-events-none">
                    <p className="text-xs font-semibold">Scroll/Pinch to Zoom • Drag to Pan</p>
                </div>

                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={4}
                    centerOnInit={true}
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            <Controls
                                zoomIn={zoomIn}
                                zoomOut={zoomOut}
                                resetTransform={resetTransform}
                                toggleFullscreen={() => setIsFullscreen(true)}
                            />

                            <div className="flex-1 flex items-center justify-center w-full h-full cursor-move bg-slate-900">
                                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                    <img
                                        src={imageUrl}
                                        alt="Wundbild"
                                        className="!w-full !h-full object-contain"
                                    />
                                </TransformComponent>
                            </div>
                        </>
                    )}
                </TransformWrapper>
            </div>

            {/* Fullscreen Overlay */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fadeIn">
                    <div className="absolute top-4 left-4 z-[60] text-white/70 pointer-events-none">
                        <p className="text-sm">Vollbildmodus (ESC zum Schließen)</p>
                    </div>

                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={5}
                        centerOnInit={true}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <div className="fixed inset-0 flex items-center justify-center bg-black/95 z-50">
                                    <TransformComponent
                                        wrapperClass="!w-full !h-full"
                                        contentClass="!w-full !h-full flex items-center justify-center"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt="Wundbild Vollbild"
                                            className="!w-full !h-full object-contain"
                                        />
                                    </TransformComponent>
                                </div>
                                <div className="z-[60] relative pointer-events-none w-full h-full">
                                    {/* Container to position controls on top */}
                                    <div className="pointer-events-auto">
                                        <Controls
                                            zoomIn={zoomIn}
                                            zoomOut={zoomOut}
                                            resetTransform={resetTransform}
                                            toggleFullscreen={() => setIsFullscreen(false)}
                                            isFull={true}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </TransformWrapper>
                </div>
            )}
        </>
    );
}
