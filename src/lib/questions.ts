export type QuestionType = 'dropdown' | 'slider' | 'text' | 'checkbox';

export interface Question {
    id: string;
    type: QuestionType;
    label: string;
    options?: string[]; // for dropdown
    min?: number;      // for slider
    max?: number;      // for slider
    step?: number;      // for slider
    unit?: string;      // for slider display
    placeholder?: string; // Optional placeholder
}

export const questions: Question[] = [
    {
        id: 'beschreibung',
        type: 'text',
        label: 'Beschreibung der Wundsituation (Wundart, Wundzustand, Exsudation, Beläge, Infektionszeichen, Wundumgebung)'
    },
    {
        id: 'wundtyp',
        type: 'text',
        label: 'Wundtyp (z. B. Dekubitus, Ulcus cruris, diabetisches Fußulkus, postoperative Wunde)'
    },
    {
        id: 'lokalisation',
        type: 'text',
        label: 'Lokalisation (Körperregion & Seitenangabe)'
    },
    {
        id: 'wundstadium',
        type: 'text',
        label: 'Wundstadium (nach EPUAP)'
    },
    {
        id: 'wundgrund',
        type: 'text',
        label: 'Wundgrund (Beschreibung des sichtbaren Gewebes)'
    },
    {
        id: 'wundrand',
        type: 'text',
        label: 'Wundrand (z. B. glatt, mazeriert, unterminiert, gerötet)'
    },
    {
        id: 'wundumgebung',
        type: 'text',
        label: 'Wundumgebung (z. B. Rötung, Mazeration, Ödem, Ekzem, Infekt)'
    },
    {
        id: 'exsudat',
        type: 'text',
        label: 'Exsudat (Menge und Erscheinung)'
    },
    {
        id: 'auffaelligkeiten',
        type: 'text',
        label: 'Weitere Auffälligkeiten oder Besonderheiten'
    }
];
