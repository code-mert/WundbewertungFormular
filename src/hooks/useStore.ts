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

    // Helper to check if 1/3 of questions are answered
    function checkCompletion(answers: Record<string, any>): boolean {
        const answerableQuestions = questions.filter(q => q.type !== 'info');
        const total = answerableQuestions.length;
        const threshold = Math.ceil(total / 3);

        let answeredCount = 0;
        answerableQuestions.forEach(q => {
            const val = answers[q.id];
            if (Array.isArray(val) && val.length > 0) {
                answeredCount++;
            } else if (typeof val === 'string' && val.trim() !== '') {
                answeredCount++;
            } else if (typeof val === 'number') {
                answeredCount++; // Slider?
            }
        });

        return answeredCount >= threshold;
    }

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
                // Shuffle the IMAGES array to get a list of image objects, then map to IDs
                const shuffledImages = shuffle(IMAGES, seed);
                const sequenceIds = shuffledImages.map(img => img.id);

                // Load local index
                const localIndex = parseInt(localStorage.getItem(`wund_index_${session.user.id}`) || '0', 10);

                // Load local answers
                const localAnswersKey = `wund_answers_${session.user.id}`;
                const localAnswers = JSON.parse(localStorage.getItem(localAnswersKey) || '{}');

                // 2. Fetch ALL Data to Validate Completion Status
                const { data, error } = await supabase
                    .from('bewertungen')
                    .select('*')
                    .eq('user_id', session.user.id);

                if (error) {
                    console.error('Error loading history:', error);
                }

                // Merge DB data with Local Data (Local wins for un-synced changes, DB for structure)
                // Actually for now: Use DB as base, override with local if exists? 
                // Better: Just use local for now if we want "offline" cap.
                // But we need to know what is completed.

                // Construct answers map from DB
                const dbAnswers: Record<string, any> = {};
                if (data) {
                    data.forEach(row => {
                        const imgAnswers: Record<string, any> = {};
                        questions.forEach(q => {
                            if (row[q.id] !== undefined && row[q.id] !== null) {
                                imgAnswers[q.id] = row[q.id];
                            }
                        });
                        dbAnswers[row.image_id] = imgAnswers;
                    });
                }

                // Merge strategies:
                // DB Priority: If DB has data for an image, use it! Ignore local.
                // If DB has NO data for an image, check local.
                const mergedAnswers = { ...dbAnswers }; // Start with DB

                Object.keys(localAnswers).forEach(imgId => {
                    // Only use local if DB has no entry for this image OR DB entry is empty keys
                    const dbHasEntry = dbAnswers[imgId] && Object.keys(dbAnswers[imgId]).length > 0;
                    if (!dbHasEntry) {
                        mergedAnswers[imgId] = localAnswers[imgId];
                    }
                });


                // Filter for completed images based on 1/3 rule using MERGED answers
                const completedIds = sequenceIds.filter(id => {
                    const ans = mergedAnswers[id] || {};
                    return checkCompletion(ans);
                });


                // 3. Determine Start Index 
                // If we have a stored local index, prefer that!
                // But ensure it's valid
                let startIndex = 0;
                if (!isNaN(localIndex) && localIndex >= 0 && localIndex < TOTAL_IMAGES) {
                    startIndex = localIndex;
                } else {
                    // Fallback to first incomplete
                    const firstIncompleteIndex = sequenceIds.findIndex(id => !completedIds.includes(id));
                    if (firstIncompleteIndex !== -1) {
                        startIndex = firstIncompleteIndex;
                    }
                }

                setState(prev => ({
                    ...prev,
                    imageSequence: sequenceIds,
                    completedImages: completedIds,
                    currentImageIndex: startIndex,
                    answers: mergedAnswers
                }));

            } catch (err) {
                console.error("Failed to init user session", err);
            }
        };

        initUserSession();
    }, [session?.user?.id]);



    const currentImageId = state.imageSequence[state.currentImageIndex] || IMAGES[0].id; // Fallback only if sequence empty
    // Find image object by ID
    const currentImage = IMAGES.find(img => img.id === currentImageId) || IMAGES[0];

    // Load assessment data when image changes or session changes - REMOVED, WE LOAD ALL AT START
    /*
    useEffect(() => {
        if (!session?.user?.id || !currentImageId) return;
        // Logic moved to main init to allow merging
    }, [currentImageId, session?.user?.id]);
    */


    const setAnswer = (questionId: string, value: any) => {
        setState(prev => {
            const newAnswers = {
                ...prev.answers,
                [currentImageId]: {
                    ...(prev.answers[currentImageId] || {}),
                    [questionId]: value
                }
            };

            // Save to localStorage
            if (session?.user?.id) {
                const key = `wund_answers_${session.user.id}`;
                const stored = JSON.parse(localStorage.getItem(key) || '{}');
                stored[currentImageId] = newAnswers[currentImageId];
                localStorage.setItem(key, JSON.stringify(stored));
            }

            return {
                ...prev,
                answers: newAnswers
            };
        });
    };

    const currentAnswers = state.answers[currentImageId] || {};
    const isLastImage = state.currentImageIndex === TOTAL_IMAGES - 1;

    const saveCurrentAssessment = async () => {
        if (!session?.user?.id) return false;

        setIsSyncing(true);
        try {
            const payload: Record<string, any> = {
                user_id: session.user.id,
                image_id: currentImageId,
                updated_at: new Date().toISOString(),
            };

            questions.forEach(q => {
                if (currentAnswers.hasOwnProperty(q.id)) {
                    payload[q.id] = currentAnswers[q.id];
                }
            });

            const { error } = await supabase
                .from('bewertungen')
                .upsert(payload, { onConflict: 'user_id, image_id' });

            if (error) {
                console.error('Supabase save error:', error);
                alert('Fehler beim Speichern.');
                return false;
            }

            // Check completion Logic
            const isComplete = checkCompletion(currentAnswers);

            setState(prev => {
                const newCompleted = new Set(prev.completedImages);
                if (isComplete) {
                    newCompleted.add(currentImageId);
                } else {
                    newCompleted.delete(currentImageId);
                }
                return {
                    ...prev,
                    completedImages: Array.from(newCompleted)
                };
            });

            return true;
        } catch (err) {
            console.error('Save failed', err);
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

        const success = await saveCurrentAssessment();
        if (!success) return;

        // Logic for next image
        if (state.currentImageIndex < state.imageSequence.length - 1) {
            const nextIndex = state.currentImageIndex + 1;
            setState(prev => {
                const newState = { ...prev, currentImageIndex: nextIndex };
                // Save index specific to this user/sequence
                if (session?.user?.id) {
                    localStorage.setItem(`wund_index_${session.user.id}`, String(nextIndex));
                }
                return newState;
            });
        } else {
            // Check if ALL images are completed
            // We need to check against the updated state or completedImages + current if just finished
            // Since setState is async, we'll calc new completed locally
            let currentCompletedCount = state.completedImages.length;
            const isCurrentNowComplete = checkCompletion(currentAnswers);
            const wasAlreadyComplete = state.completedImages.includes(currentImageId);

            if (isCurrentNowComplete && !wasAlreadyComplete) {
                currentCompletedCount++;
            } else if (!isCurrentNowComplete && wasAlreadyComplete) {
                currentCompletedCount--;
            }

            if (currentCompletedCount === TOTAL_IMAGES) {
                setIsFinished(true);
            } else {
                alert(`Bitte bearbeiten Sie alle Bilder vollständig vor dem Abschluss.\nAktuell: ${currentCompletedCount} / ${TOTAL_IMAGES} fertig.`);
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
            setState(prev => {
                if (session?.user?.id) {
                    localStorage.setItem(`wund_index_${session.user.id}`, String(prevIndex));
                }
                return { ...prev, currentImageIndex: prevIndex };
            });
        }
    };

    const jumpToImage = async (index: number) => {
        if (index >= 0 && index < state.imageSequence.length) {
            await saveCurrentAssessment();
            if (session?.user?.id) {
                localStorage.setItem(`wund_index_${session.user.id}`, String(index));
            }
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
