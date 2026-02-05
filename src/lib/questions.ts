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
}

export const questions: Question[] = [
    // 1. Kategorisierung
    { id: 'diagnose', type: 'dropdown', label: '1. Diagnose / Wundart', options: ['Ulcus cruris venosum', 'Ulcus cruris arteriosum', 'Ulcus cruris mixtum', 'Dekubitus', 'Diabetisches Fußsyndrom', 'Posttraumatische Wunde', 'Chirurgische Wunde', 'Palliativwunde', 'Andere'] },

    // 2. Wundstatus
    { id: 'wundalter', type: 'dropdown', label: '2. Wundalter', options: ['Akut (< 6 Wochen)', 'Chronisch (> 6 Wochen)'] },
    { id: 'rezidiv', type: 'dropdown', label: '3. Rezidiv?', options: ['Nein', 'Ja'] },

    // 3. Wundgröße & Tiefe (Visual estimates)
    { id: 'flaeche_schaetzung', type: 'slider', label: '4. Geschätzte Wundfläche (cm²)', min: 0, max: 200, unit: 'cm²' },
    { id: 'tiefe', type: 'dropdown', label: '5. Wundtiefe', options: ['Oberflächlich (Epidermis/Dermis)', 'Tief (Subkutis)', 'Sehr tief (Faszie/Muskel/Knochen)'] },

    // 4. Wundgrund (Gewebetypen nach % Anteil - Summe muss nicht 100 sein, slider pro Typ)
    { id: 'gewebe_nekrose', type: 'slider', label: '6. Anteil Nekrose (schwarz) %', min: 0, max: 100, unit: '%' },
    { id: 'gewebe_fibrin', type: 'slider', label: '7. Anteil Fibrinbelag (gelb) %', min: 0, max: 100, unit: '%' },
    { id: 'gewebe_granulation', type: 'slider', label: '8. Anteil Granulation (rot) %', min: 0, max: 100, unit: '%' },
    { id: 'gewebe_epithel', type: 'slider', label: '9. Anteil Epithelisierung (rosa) %', min: 0, max: 100, unit: '%' },

    // 5. Exsudat
    { id: 'exsudat_menge', type: 'slider', label: '10. Exsudatmenge (0=kein, 10=sehr viel)', min: 0, max: 10, unit: '/10' },
    { id: 'exsudat_farbe', type: 'dropdown', label: '11. Exsudatfarbe', options: ['Klar/Serös', 'Trüb/Eitrig', 'Blutig/Hämorrhagisch', 'Grünlich', 'Bräunlich'] },
    { id: 'exsudat_geruch', type: 'dropdown', label: '12. Geruch', options: ['Kein', 'Leicht', 'Stark/Jaucheartig'] },

    // 6. Wundrand & Umgebung
    { id: 'wundrand', type: 'dropdown', label: '13. Wundrand', options: ['Vital/Intakt', 'Mazeriert', 'Gerötet', 'Unterminiert/Taschenbildung', 'Hyperkeratose'] },
    { id: 'umgebung_haut', type: 'dropdown', label: '14. Wundumgebungshaut', options: ['Intakt', 'Gerötet/Erythem', 'Ödem', 'Ekzem', 'Trocken/Schuppig'] },
    { id: 'oedom', type: 'dropdown', label: '15. Ödem vorhanden?', options: ['Nein', 'Ja, lokal', 'Ja, generalisiert'] },

    // 7. Infektionszeichen
    { id: 'infektion_lokal', type: 'dropdown', label: '16. Lokale Infektionszeichen', options: ['Keine', 'Rötung/Schwellung/Wärme', 'Eiter', 'Alle klassischen Zeichen'] },
    { id: 'biofilm', type: 'dropdown', label: '17. Verdacht auf Biofilm?', options: ['Nein', 'Ja', 'Unsicher'] },

    // 8. Schmerz
    { id: 'schmerz_ruhe', type: 'slider', label: '18. Schmerz in Ruhe (VAS 0-10)', min: 0, max: 10, unit: 'VAS' },
    { id: 'schmerz_wechsel', type: 'slider', label: '19. Schmerz beim Verbandswechsel (VAS 0-10)', min: 0, max: 10, unit: 'VAS' },

    // 9. Therapie & Verlauf
    { id: 'therapie_lokal', type: 'dropdown', label: '20. Aktuelle Lokaltherapie (Gruppe)', options: ['Nass-Trocken', 'Hydrokolloid', 'Schaumverband', 'Alginat/Hydrofiber', 'Silberauflage', 'Unterdrucktherapie (VAC)', 'Andere'] },
    { id: 'heilungstendenz', type: 'dropdown', label: '21. Heilungstendenz', options: ['Besserung', 'Stagnation', 'Verschlechterung'] },

    // 10. Zusatzfragen
    { id: 'kompression', type: 'dropdown', label: '22. Kompressionstherapie notwendig?', options: ['Ja', 'Nein', 'Kontraindiziert'] },
    { id: 'schuhwerk', type: 'dropdown', label: '23. Geeignetes Schuhwerk/Druckentlastung?', options: ['Ja', 'Nein', 'Teilweise'] },

    // 11. Freitext
    { id: 'bemerkung', type: 'text', label: '24. Sonstige Bemerkungen' },
    { id: 'versorgungsvorschlag', type: 'text', label: '25. Versorgungsvorschlag / Nächste Schritte' }
];
