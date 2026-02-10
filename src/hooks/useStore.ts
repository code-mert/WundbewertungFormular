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
    imageSequence: string[]; // History of visited image IDs
}

const INITIAL_STATE: AppState = {
    expertId: '',
    currentImageIndex: 0,
    answers: {},
    imageSequence: [],
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
                const parsed = JSON.parse(saved);
                // Ensure imageSequence exists (migration for existing users)
                if (!parsed.imageSequence || parsed.imageSequence.length === 0) {
                    const randomId = IMAGES[Math.floor(Math.random() * IMAGES.length)].id;
                    parsed.imageSequence = [randomId];
                    parsed.currentImageIndex = 0;
                }
                setState(parsed);
            } catch (e) {
                console.error("Failed to parse local storage", e);
                // Fallback init if parse fails
                const randomId = IMAGES[Math.floor(Math.random() * IMAGES.length)].id;
                setState({ ...INITIAL_STATE, imageSequence: [randomId] });
            }
        } else {
            // First time load
            const randomId = IMAGES[Math.floor(Math.random() * IMAGES.length)].id;
            setState({ ...INITIAL_STATE, imageSequence: [randomId] });
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

    const currentImageId = state.imageSequence[state.currentImageIndex] || IMAGES[0].id;
    // Find image object by ID
    const currentImage = IMAGES.find(img => img.id === currentImageId) || IMAGES[0];

    const setAnswer = (questionId: string, value: any) => {
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

    const currentAnswers = state.answers[currentImageId] || {};
    const isLastImage = state.imageSequence.length >= TOTAL_IMAGES && state.currentImageIndex === TOTAL_IMAGES - 1;

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
                image_id: currentImageId,
                data: currentAnswers,
                completed_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('responses').insert([payload]);

            if (error) {
                console.error('Supabase sync error:', error);
                alert('Fehler beim Speichern in die Datenbank. Daten wurden nur lokal gespeichert.');
            }
        } catch (err) {
            console.error('Sync failed', err);
        } finally {
            setIsSyncing(false);
        }

        // Logic for next image
        setState(prev => {
            // If we are navigating history (not at the end)
            if (prev.currentImageIndex < prev.imageSequence.length - 1) {
                return { ...prev, currentImageIndex: prev.currentImageIndex + 1 };
            }

            // We are at the end, pick a NEW random image
            // 1. Get all used IDs
            const usedIds = new Set(prev.imageSequence);
            // 2. Find available IDs
            const available = IMAGES.filter(img => !usedIds.has(img.id));

            if (available.length === 0) {
                // Should be caught by isLastImage check before calling next, but handled here
                alert("Alle Wunden bearbeitet! Danke.");
                return prev;
            }

            // 3. Pick random
            const randomImg = available[Math.floor(Math.random() * available.length)];

            return {
                ...prev,
                imageSequence: [...prev.imageSequence, randomImg.id],
                currentImageIndex: prev.currentImageIndex + 1
            };
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
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
