export type QuestionType = 'dropdown' | 'slider' | 'text' | 'checkbox' | 'info' | 'multiselect';

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
        type: 'info',
        label: 'Beschreibung der Wundsituation\nBitte beschreiben Sie Wundart, Wundzustand, Exsudation, Beläge, mögliche Infektionszeichen sowie die Wundumgebung.'
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
    },
    {
        id: 'debridement',
        type: 'dropdown',
        label: 'Wundbettvorbereitung/ Debridement',
        options: [
            'Debrisoft Pad',
            'Debrisoft Duo',
            'Debrisoft Lolly',
            'Keine Wundvorbereitung erforderlich',
            'Chirurgisches Debridement',
            'Autolytisches Debridement',
            'Ultraschall',
            'Sonstiges'
        ]
    },
    {
        id: 'infektion',
        type: 'dropdown',
        label: 'Besteht eine Infektion der Wunde?',
        options: ['Ja', 'Nein']
    },
    {
        id: 'spuelloesung',
        type: 'dropdown',
        label: 'Welche Spüllösung soll verwendet werden?',
        options: ['Neutrale Spüllösung', 'Antimikrobielle Spüllösung']
    },
    {
        id: 'wundauflagen_info',
        type: 'info',
        label: 'Wundauflagen - Präferierte & Alternative Lösung\nBitte wählen Sie eine aus Ihrer Sicht geeignete primäre Wundauflage basierend auf dem sichtbaren Wundzustand. Die alternative Lösung ist als gleichwertige therapeutische Option zu verstehen.'
    },
    {
        id: 'praeferenz_produkt',
        type: 'multiselect',
        label: 'Präferierte Lösung (Mehrfachauswahl möglich)',
        options: [
            'Suprasorb A Pro', 'Suprasorb A + Ag', 'Suprasorb F', 'Suprasorb F Protect',
            'Suprasorb G Gel-Kompresse', 'Suprasorb H', 'Suprasorb Liquacel Pro',
            'Suprasorb P', 'Suprasorb P sensitive', 'Suprasorb P Sensiflex', 'Suprasorb P + PHMB',
            'Suprasorb X', 'Suprasorb X + PHMB', 'Lomatuell Pro', 'Lomatuell H',
            'Vliwasorb Pro', 'Vliwasorb sensitive', 'Vliwasorb adhesive', 'Vliwazell Pro',
            'Vliwazell', 'Vliwaktiv', 'Vliwaktiv Ag', 'Solvaline N', 'Metalline Kompressen',
            'Metalline', 'amorphes Gel', 'Suprasorb CNP', 'Gazin', 'Vliwasoft', 'Zemuko',
            'Opraclean', 'Sonstiges'
        ]
    },
    {
        id: 'alternative_produkt',
        type: 'multiselect',
        label: 'Alternative Lösung (Mehrfachauswahl möglich)',
        options: [
            'Suprasorb A Pro', 'Suprasorb A + Ag', 'Suprasorb F', 'Suprasorb F Protect',
            'Suprasorb G Gel-Kompresse', 'Suprasorb H', 'Suprasorb Liquacel Pro',
            'Suprasorb P', 'Suprasorb P sensitive', 'Suprasorb P Sensiflex', 'Suprasorb P + PHMB',
            'Suprasorb X', 'Suprasorb X + PHMB', 'Lomatuell Pro', 'Lomatuell H',
            'Vliwasorb Pro', 'Vliwasorb sensitive', 'Vliwasorb adhesive', 'Vliwazell Pro',
            'Vliwazell', 'Vliwaktiv', 'Vliwaktiv Ag', 'Solvaline N', 'Metalline Kompressen',
            'Metalline', 'amorphes Gel', 'Suprasorb CNP', 'Gazin', 'Vliwasoft', 'Zemuko',
            'Opraclean', 'Sonstiges'
        ]
    }
];
