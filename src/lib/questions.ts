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
        label: 'Wundtyp\n*(z. B. Dekubitus, Ulcus cruris, diabetisches Fußulkus, postoperative Wunde)*'
    },
    {
        id: 'lokalisation',
        type: 'text',
        label: 'Lokalisation\n*(Körperregion & Seitenangabe)*'
    },
    {
        id: 'wundstadium',
        type: 'multiselect',
        label: 'Wundstadium',
        options: [
            'Exsudation',
            'Nekrose',
            'Fibrinbelag',
            'Granulation',
            'Epithelisierung',
            'Infektion',
            'Sonstiges'
        ],
        placeholder: 'Zustand auswählen...'
    },
    {
        id: 'wundgrund',
        type: 'text',
        label: 'Wundgrund\n*(Beschreibung des sichtbaren Gewebes)*'
    },
    {
        id: 'wundrand',
        type: 'text',
        label: 'Wundrand\n*(z. B. glatt, mazeriert, unterminiert, gerötet)*'
    },
    {
        id: 'wundumgebung',
        type: 'text',
        label: 'Wundumgebung\n*(z. B. Rötung, Mazeration, Ödem, Ekzem, Infekt)*'
    },
    {
        id: 'exsudat',
        type: 'text',
        label: 'Exsudat\n*(Menge und Erscheinung)*'
    },
    {
        id: 'auffaelligkeiten',
        type: 'text',
        label: 'Weitere Auffälligkeiten oder Besonderheiten'
    },
    {
        id: 'debridement_info',
        type: 'info',
        label: 'Wundbettvorbereitung/ Debridement'
    },
    {
        id: 'debridement_notwendig',
        type: 'dropdown',
        label: 'Ist eine Wundbettvorbereitung/ Debridement notwendig?',
        options: ['Ja', 'Nein']
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
    },
    {
        id: 'ergaenzende_produkte_info',
        type: 'info',
        label: 'Ergänzende Produkte - Präferierte & Alternative Lösung\nBitte wählen Sie geeignete ergänzende Produkte (z.B. zur Fixierung) für die Versorgung.'
    },
    {
        id: 'ergaenzende_produkte_praeferenz',
        type: 'multiselect',
        label: 'Präferierte Lösung (Mehrfachauswahl möglich)',
        options: [
            'Curapor', 'Curapor transparent', 'Curafix', 'Curaplast sensitive Wundschnellverband', 'Curaplast sensitive Injektionspflaster', 'Curaplast sensitive Pflasterstrips', 'Curaplast Fingerverband', 'Curaplast wasserfest Pflasterstrips',
            'Curaplast Kids', 'Curafix H', 'Silkafix', 'Porofix', 'Sonstiges'
        ]
    },
    {
        id: 'ergaenzende_produkte_alternativ',
        type: 'multiselect',
        label: 'Alternative Lösung (Mehrfachauswahl möglich)',
        options: [
            'Curapor', 'Curapor transparent', 'Curafix', 'Curaplast sensitive Wundschnellverband', 'Curaplast sensitive Injektionspflaster', 'Curaplast sensitive Pflasterstrips', 'Curaplast Fingerverband', 'Curaplast wasserfest Pflasterstrips',
            'Curaplast Kids', 'Curafix H', 'Silkafix', 'Porofix', 'Sonstiges'
        ]
    },
    {
        id: 'kompression_info',
        type: 'info',
        label: 'Kompressionstherapie'
    },
    {
        id: 'kompression_indiziert',
        type: 'dropdown',
        label: 'Ist eine Kompressionstherapie indiziert?',
        options: ['Ja', 'Nein', 'Nicht beurteilbar']
    },
    {
        id: 'kompression_produkte',
        type: 'multiselect',
        label: 'Wählen Sie die benötigten Produkte für eine Kompressionstherapie',
        options: [
            'ReadyWrap Obere Extremität', 'ReadyWrap Untere Extremität', 'ReadyWrap Zubehör', 'Actico UlcerSys System', 'Actico UlcerSys Unterstrumpf',
            'Venosan AES', 'Rosidal 1C', 'Rosidal K', 'Rosidal CC', 'Rosidal SC', 'Rosidal haft', 'Durelast', 'Lenkideal', 'Idealbinde',
            'Rosidal TCS', 'Rosidal sys', 'Rosidal Lymph', 'Panelast', 'Porelast', 'Varicex S', 'Dauerbinde K', 'Dauerbinde F',
            'Rosidal soft', 'Cellona Synthetikwatte', 'Komprex I/II', 'ActiFast', 'tg Schlauchverband', 'tg soft', 'tg grip',
            'Mollelast', 'Geka Mullbinde', 'Mollelast haft latexfrei', 'Haftelast latexfrei', 'tg Fertigverbände',
            'Lenkelast', 'Lenkelast color', 'Haftelast', 'Sonstiges'
        ]
    },
    {
        id: 'einschraenkungen',
        type: 'text',
        label: '**Einschränkungen, Annahmen oder fehlende Informationen***Bitte geben Sie an, welche Informationen für eine sichere Entscheidung gefehlt haben oder welche Annahmen getroffen wurden.*'
    }
];
