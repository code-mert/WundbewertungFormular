import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { questions } from '../lib/questions';

const TOTAL_IMAGES = 60;

// Generate image list: wunde_01.jpg ... wunde_60.jpg
const IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return {
        id: `wunde_${num}`,
        url: `${import.meta.env.BASE_URL}images/wunde_${num}.jpg` // Correct path for public folder with base
    };
});

// Simple seeded random number generator
function seededRandom(seed: number) {
    const m = 0x80000000;
    const a = 1103515245;
    const c = 12345;
    let state = seed ? seed : Math.floor(Math.random() * (m - 1));
    return function () {
        state = (a * state + c) % m;
        return state / (m - 1);
    }
}

function stringToSeed(str: string) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function shuffle<T>(array: T[], seed: number): T[] {
    const rng = seededRandom(seed);
    let m = array.length, t, i;
    const newArray = [...array];
    while (m) {
        i = Math.floor(rng() * m--);
        t = newArray[m];
        newArray[m] = newArray[i];
        newArray[i] = t;
    }
    return newArray;
}

function isImageActuallyComplete(answers: Record<string, any>): boolean {
    const excludedQuestions = ['einschraenkungen', 'auffaelligkeiten'];
    const answerableQuestions = questions.filter(q => q.type !== 'info' && !excludedQuestions.includes(q.id));
    return answerableQuestions.every(q => {
        if (q.id === 'spuelloesung' && answers['infektion'] !== 'Ja') return true;
        if (q.id === 'debridement' && answers['debridement_notwendig'] !== 'Ja') return true;
        if (q.id === 'kompression_produkte' && answers['kompression_indiziert'] !== 'Ja') return true;

        const answer = answers[q.id];
        if (answer === undefined || answer === null) return false;
        if (typeof answer === 'string' && answer.trim() === '') return false;
        if (Array.isArray(answer) && answer.length === 0) return false;
        return true;
    });
}

export interface AppState {
    expertId: string;
    currentImageIndex: number;
    answers: Record<string, Record<string, any>>;
    imageSequence: string[]; // Fixed random order for this user
    completedImages: string[]; // List of IDs that are finished
}

const getInitialState = (): AppState => {
    // Initial state just has a placeholder or empty, actual init happens after auth
    return {
        expertId: '',
        currentImageIndex: 0,
        answers: {},
        imageSequence: [],
        completedImages: [],
    };
};

export function useStore() {
    const [state, setState] = useState<AppState>(getInitialState);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [session, setSession] = useState<any>(null);

    // Initialize Auth and State
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoaded(true);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load history when session is available
    useEffect(() => {
        if (!session?.user?.id) return;

        const initUserSession = async () => {
            try {
                // 1. Generate Deterministic Sequence
                const seed = stringToSeed(session.user.id);
                const shuffledImages = shuffle(IMAGES, seed);
                const sequenceIds = shuffledImages.map(img => img.id);

                // 2. Fetch ALL Data directly from Supabase
                const { data, error } = await supabase
                    .from('bewertungen')
                    .select('*')
                    .eq('user_id', session.user.id);

                if (error) {
                    console.error('Error loading history:', error);
                }

                const dbAnswers: Record<string, any> = {};
                const completedIds: string[] = [];

                if (data) {
                    data.forEach(row => {
                        const imgAnswers: Record<string, any> = {};
                        questions.forEach(q => {
                            if (row[q.id] !== undefined && row[q.id] !== null) {
                                imgAnswers[q.id] = row[q.id];
                            }
                        });
                        dbAnswers[row.image_id] = imgAnswers;

                        if (isImageActuallyComplete(imgAnswers)) {
                            completedIds.push(row.image_id);
                        }
                    });
                }

                // 3. Determine Start Index 
                // First incomplete image in the sequence
                let startIndex = 0;
                const firstIncompleteIndex = sequenceIds.findIndex(id => !completedIds.includes(id));
                if (firstIncompleteIndex !== -1) {
                    startIndex = firstIncompleteIndex;
                }

                setState(prev => ({
                    ...prev,
                    imageSequence: sequenceIds,
                    completedImages: completedIds,
                    currentImageIndex: startIndex,
                    answers: dbAnswers
                }));

            } catch (err) {
                console.error("Failed to init user session", err);
            }
        };

        initUserSession();
    }, [session?.user?.id]);



    const currentImageId = state.imageSequence[state.currentImageIndex] || IMAGES[0].id;
    const currentImage = IMAGES.find(img => img.id === currentImageId) || IMAGES[0];

    const autosaveToSupabase = async (imageId: string, newAnswers: Record<string, any>) => {
        if (!session?.user?.id) return;

        try {
            const payload: Record<string, any> = {
                user_id: session.user.id,
                image_id: imageId,
                updated_at: new Date().toISOString(),
                // Keep the ist_fertig flag unchanged during autosave if it's already true, or false otherwise
            };

            // Merge current image completed status into payload manually to avoid overriding explicitly
            const isAlreadyCompleted = state.completedImages.includes(imageId);
            payload['ist_fertig'] = isAlreadyCompleted;

            questions.forEach(q => {
                if (newAnswers.hasOwnProperty(q.id)) {
                    payload[q.id] = newAnswers[q.id];
                }
            });

            const { error } = await supabase
                .from('bewertungen')
                .upsert(payload, { onConflict: 'user_id, image_id' });

            if (error) {
                console.error('Supabase autosave error:', error);
            }
        } catch (err) {
            console.error('Autosave failed:', err);
        }
    };


    const setAnswer = (questionId: string, value: any) => {
        setState(prev => {
            const currentAnswersForImage = prev.answers[currentImageId] || {};
            const newImageAnswers = {
                ...currentAnswersForImage,
                [questionId]: value
            };

            const newAnswers = {
                ...prev.answers,
                [currentImageId]: newImageAnswers
            };

            // Trigger autosave in background without awaiting (optimistic UI update)
            autosaveToSupabase(currentImageId, newImageAnswers);

            return {
                ...prev,
                answers: newAnswers
            };
        });
    };

    const currentAnswers = state.answers[currentImageId] || {};
    const isLastImage = state.currentImageIndex === TOTAL_IMAGES - 1;

    // Save with explicit ist_fertig = true
    const markImageAsCompleted = async (imageId: string, answers: Record<string, any>) => {
        if (!session?.user?.id) return false;

        setIsSyncing(true);
        try {
            const isComplete = isImageActuallyComplete(answers);

            const payload: Record<string, any> = {
                user_id: session.user.id,
                image_id: imageId,
                updated_at: new Date().toISOString(),
                ist_fertig: isComplete
            };

            questions.forEach(q => {
                if (answers.hasOwnProperty(q.id)) {
                    payload[q.id] = answers[q.id];
                }
            });

            const { error } = await supabase
                .from('bewertungen')
                .upsert(payload, { onConflict: 'user_id, image_id' });

            if (error) {
                console.error('Supabase final save error:', error);
                alert('Fehler beim Speichern des Abschluss-Status.');
                return false;
            }

            setState(prev => {
                const newCompleted = new Set(prev.completedImages);
                if (isComplete) {
                    newCompleted.add(imageId);
                } else {
                    newCompleted.delete(imageId);
                }
                return {
                    ...prev,
                    completedImages: Array.from(newCompleted)
                };
            });

            return true;
        } catch (err) {
            console.error('Final Save failed', err);
            return false;
        } finally {
            setIsSyncing(false);
        }
    };

    const nextImage = async () => {
        if (!session?.user?.id) {
            alert("Bitte melden Sie sich an.");
            return;
        }

        const success = await markImageAsCompleted(currentImageId, currentAnswers);
        if (!success) return;

        if (state.currentImageIndex < state.imageSequence.length - 1) {
            const nextIndex = state.currentImageIndex + 1;
            setState(prev => ({ ...prev, currentImageIndex: nextIndex }));
        } else {
            // Check if ALL images are completed
            let currentCompletedCount = state.completedImages.length;
            const isCurrentComplete = isImageActuallyComplete(currentAnswers);
            if (isCurrentComplete && !state.completedImages.includes(currentImageId)) {
                currentCompletedCount++; // optimistically add current if newly completed
            } else if (!isCurrentComplete && state.completedImages.includes(currentImageId)) {
                currentCompletedCount--;
            }

            if (currentCompletedCount >= TOTAL_IMAGES) {
                setIsFinished(true);
            } else {
                alert(`Bitte bearbeiten Sie alle Bilder.\nAktuell: ${currentCompletedCount} / ${TOTAL_IMAGES} fertig.`);
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const skipImage = () => {
        // Removed
    }

    const prevImage = () => {
        if (state.currentImageIndex > 0) {
            const prevIndex = state.currentImageIndex - 1;
            setState(prev => ({ ...prev, currentImageIndex: prevIndex }));
        }
    };

    const jumpToImage = async (index: number) => {
        if (index >= 0 && index < state.imageSequence.length) {
            // we do NOT explicitly mark as completed here, autosave handles the answers.
            setState(prev => ({ ...prev, currentImageIndex: index }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setState(getInitialState());
    };

    const exportData = () => {
        alert("Export funktion ist in dieser Version deaktiviert. Daten sind in Supabase gespeichert.");
    };

    return {
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
        TRAINING_IMAGES: IMAGES,
        session,
        isFinished,
        signOut
    };
}

