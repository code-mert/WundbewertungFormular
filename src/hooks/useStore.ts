import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TOTAL_IMAGES = 60;
const STORAGE_KEY = 'ground_truth_state';

// Generate image list: wunde_01.jpg ... wunde_60.jpg
const IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
        id: `wunde_${num}`,
        url: `${import.meta.env.BASE_URL}images/wunde_${num}.jpg` // Correct path for public folder with base
    };
});

export interface AppState {
    expertId: string;
    currentImageIndex: number;
    answers: Record<string, Record<string, any>>;
    // answers: { [imageId]: { [questionId]: value } }
}

const INITIAL_STATE: AppState = {
    expertId: '',
    currentImageIndex: 0,
    answers: {},
};

export function useStore() {
    const [state, setState] = useState<AppState>(INITIAL_STATE);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setState(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse local storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state, isLoaded]);

    const setExpertId = (id: string) => {
        setState(prev => ({ ...prev, expertId: id }));
    };

    const setAnswer = (questionId: string, value: any) => {
        const currentImageId = IMAGES[state.currentImageIndex].id;
        setState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [currentImageId]: {
                    ...(prev.answers[currentImageId] || {}),
                    [questionId]: value
                }
            }
        }));
    };

    const currentImage = IMAGES[state.currentImageIndex];
    const currentAnswers = state.answers[currentImage.id] || {};
    const isLastImage = state.currentImageIndex === TOTAL_IMAGES - 1;

    const nextImage = async () => {
        if (!state.expertId) {
            alert("Bitte geben Sie zuerst Ihre Experten-ID ein.");
            return;
        }

        setIsSyncing(true);

        // Sync current image data to Supabase
        try {
            const payload = {
                expert_id: state.expertId,
                image_id: currentImage.id,
                data: currentAnswers,
                completed_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('responses').insert([payload]);

            if (error) {
                console.error('Supabase sync error:', error);
                alert('Fehler beim Speichern in die Datenbank. Daten wurden nur lokal gespeichert.');
                // We persist anyway locally, so we can retry or export later.
            }
        } catch (err) {
            console.error('Sync failed', err);
        } finally {
            setIsSyncing(false);
        }

        if (!isLastImage) {
            setState(prev => ({ ...prev, currentImageIndex: prev.currentImageIndex + 1 }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Handle finish
            alert("Alle Bilder bearbeitet! Danke.");
        }
    };

    const prevImage = () => {
        if (state.currentImageIndex > 0) {
            setState(prev => ({ ...prev, currentImageIndex: prev.currentImageIndex - 1 }));
        }
    };

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.answers, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `wundbewertung_export_${state.expertId}_${new Date().toISOString()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };


    return {
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
        TRAINING_IMAGES: IMAGES
    };
}
