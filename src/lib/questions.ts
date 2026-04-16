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
        id: 'kategorie_wundsituation',
        type: 'info',
        label: 'Kategorie 1: Wundsituation'
    },
    {
        id: 'lokalisation',
        type: 'text',
        label: '1.1 Lokalisation\n*Körperregion und Seitenangabe*'
    },
    {
        id: 'wundtyp',
        type: 'multiselect',
        label: '1.2 Wundtyp',
        placeholder: 'Wundtyp suchen...',
        options: [
            'Dekubitus',
            'Ulcus cruris venosum',
            'Ulcus cruris arteriosum',
            'Ulcus cruris mixtum',
            'Diabetisches Fußulkus',
            'Traumatische Wunde',
            'Tumorwunde',
            'Verbrennungswunde',
            'Postoperative Wunde',
            'Sonstiges'
        ]
    },
    {
        id: 'wundtyp_spezifikation',
        type: 'text',
        label: '1.3 Spezifizierung Wundtyp\n*Optional: Gradangabe, Subtyp, Ergänzung*'
    },
    {
        id: 'wundstadium',
        type: 'multiselect',
        label: '1.4 Wundphase\n*Mehrfachauswahl möglich*',
        placeholder: 'Wundphase suchen...',
        options: [
            'Nekrose / Eschara',
            'Fibrinbelag / Slough',
            'Granulation',
            'Epithelisierung',
            'Gemischt'
        ]
    },
    {
        id: 'exsudat',
        type: 'dropdown',
        label: '1.5 Exsudatmenge',
        options: ['Keine', 'Leicht', 'Mäßig', 'Stark', 'Sehr stark']
    },
    {
        id: 'infektion',
        type: 'dropdown',
        label: '1.6 Infektionsstatus',
        options: [
            'Keine Infektionszeichen',
            'Verdacht auf Infektion / kritische Kolonisation',
            'Deutliche Infektionszeichen'
        ]
    },
    {
        id: 'wundrand',
        type: 'text',
        label: '1.7 Wundrand\n*z.B. glatt, mazeriert, unterminiert, gerötet*'
    },
    {
        id: 'wundumgebung',
        type: 'text',
        label: '1.8 Wundumgebung\n*z.B. Rötung, Mazeration, Ödem, Ekzem*'
    },
    {
        id: 'auffaelligkeiten',
        type: 'text',
        label: '1.9 Weitere Auffälligkeiten\n*Geruch, Schmerzen, Besonderheiten*'
    },
    {
        id: 'kategorie_wundreinigung',
        type: 'info',
        label: 'Kategorie 2: Wundreinigung / Débridement'
    },
    {
        id: 'debridement_notwendig',
        type: 'dropdown',
        label: '2.1 Ist eine Wundreinigung / Débridement notwendig?',
        options: ['Ja', 'Nein']
    },
    {
        id: 'spuelloesung',
        type: 'multiselect',
        label: '2.2 Spüllösung',
        options: [
            'Neutrale Spüllösung (NaCl, Ringer)',
            'Antimikrobielle Spüllösung (PHMB, Octenisept)',
            'Sonstiges'
        ]
    },
    {
        id: 'debridement',
        type: 'multiselect',
        label: '2.3 Débridement-Methode\n*Mehrfachauswahl möglich*',
        options: [
            'Autolytisch (Hydrogele, Hydrokolloide, Folienverbände)',
            'Mechanisch (Monofilament-Pad, feuchte Kompressen, Wundspülung)',
            'Chirurgisch/Scharf (Skalpell, Kürette)',
            'Kein Débridement erforderlich',
            'Sonstiges'
        ]
    },
    {
        id: 'kategorie_primaerverband',
        type: 'info',
        label: 'Kategorie 3: Primärverband (Wundauflage)'
    },
    {
        id: 'praeferenz_produkt',
        type: 'multiselect',
        label: '3.1 Präferierte Verbandklasse\n*Erstempfehlung; Mehrfachauswahl möglich*',
        options: [
            'Schaumstoffverbände (Foam)',
            'Alginate',
            'Hydrofaser / Hydrofiber',
            'Hydrokolloide',
            'Hydrogele (Kompresse)',
            'Semipermeable Filme',
            'Wundkontaktschichten (Silikon/Paraffin)',
            'Superabsorber',
            'Aktivkohleverband',
            'Sonstiges'
        ]
    },
    {
        id: 'alternative_produkt',
        type: 'multiselect',
        label: '3.2 Alternative Verbandklasse\n*Therapeutisch gleichwertige Alternative*',
        options: [
            'Schaumstoffverbände (Foam)',
            'Alginate',
            'Hydrofaser / Hydrofiber',
            'Hydrokolloide',
            'Hydrogele (Kompresse)',
            'Semipermeable Filme',
            'Wundkontaktschichten (Silikon/Paraffin)',
            'Superabsorber',
            'Aktivkohleverband',
            'Sonstiges'
        ]
    },
    {
        id: 'antimikrobiell_notwendig',
        type: 'dropdown',
        label: '3.3 Soll der Primärverband antimikrobiell sein?',
        options: ['Ja', 'Nein']
    },
    {
        id: 'antimikrobielles_agens',
        type: 'multiselect',
        label: '3.4 Wenn ja – antimikrobielles Agens?',
        options: [
            'Silber (Ag⁺)',
            'PHMB',
            'Octenidin',
            'Medizinischer Honig (Manuka)',
            'Aktivkohle (mit Silber)',
            'Sonstiges'
        ]
    },
    {
        id: 'kategorie_sekundaerverband',
        type: 'info',
        label: 'Kategorie 4: Sekundärverband / Fixierung / Hautschutz'
    },
    {
        id: 'sekundaerverband',
        type: 'multiselect',
        label: '4.1 Sekundärverband / Fixierung',
        options: [
            'Fixiervlies / -pflaster',
            'Elastische Fixierbinden',
            'Schlauchverbände',
            'Nicht erforderlich (selbsthaftender Primärverband)',
            'Sonstiges'
        ]
    },
    {
        id: 'hautschutz',
        type: 'multiselect',
        label: '4.2 Wundrand- / Hautschutz',
        options: [
            'Hautschutzfilm / Barrierespray',
            'Zinksalbe / Zinkpaste',
            'Wundrandschutzpaste',
            'Nicht erforderlich',
            'Sonstiges'
        ]
    },
    {
        id: 'kategorie_kompression',
        type: 'info',
        label: 'Kategorie 5: Kompressionstherapie'
    },
    {
        id: 'kompression_indiziert',
        type: 'dropdown',
        label: '5.1 Ist eine Kompressionstherapie indiziert?',
        options: ['Ja', 'Nein', 'Nicht beurteilbar']
    },
    {
        id: 'kompression_produkte',
        type: 'multiselect',
        label: '5.2 Wenn ja – welche Art?',
        options: [
            'Kurzzugbinden',
            'Langzugbinden',
            'Mehrkomponentensysteme (2-/4-Lagen)',
            'Kompressionsstrümpfe (Klasse I–IV)',
            'Adaptive Kompressionsbandagen (Wrap)',
            'Sonstiges'
        ]
    },
    {
        id: 'kategorie_einschraenkungen',
        type: 'info',
        label: 'Kategorie 6: Einschränkungen & Annahmen'
    },
    {
        id: 'einschraenkungen',
        type: 'text',
        label: '6.1 Einschränkungen, Annahmen oder fehlende Informationen\n*Welche Informationen haben gefehlt? Welche Annahmen wurden getroffen?*'
    }
];
