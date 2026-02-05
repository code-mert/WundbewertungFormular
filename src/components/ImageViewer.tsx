import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FaSearchPlus, FaSearchMinus, FaUndo } from 'react-icons/fa';

interface Props {
    imageUrl: string;
}

export function ImageViewer({ imageUrl }: Props) {
    return (
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
                        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                            <button onClick={() => zoomIn()} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition">
                                <FaSearchPlus />
                            </button>
                            <button onClick={() => zoomOut()} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition">
                                <FaSearchMinus />
                            </button>
                            <button onClick={() => resetTransform()} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition">
                                <FaUndo />
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center w-full h-full cursor-move">
                            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full flex items-center justify-center">
                                <img
                                    src={imageUrl}
                                    alt="Wundbild"
                                    className="max-h-full max-w-full object-contain shadow-2xl"
                                />
                            </TransformComponent>
                        </div>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}
