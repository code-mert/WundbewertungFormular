import { supabase } from '../lib/supabase';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export function Auth() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 mb-12">
                <div className="mb-8 space-y-4 text-slate-700">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">
                        Herzlich willkommen zum Experten-Panel für moderne Wundversorgung.
                    </h1>

                    <p>
                        Im Rahmen dieses Projekts bitten wir Sie um Ihre fachliche Expertise zur Bewertung von insgesamt 60 verschiedenen Wundbildern. Ziel ist es, für jedes Szenario eine optimale Behandlungsempfehlung basierend auf dem aktuellen Lohmann & Rauscher Produktportfolio zu erstellen.
                    </p>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-slate-800">Hinweise zur Bearbeitung:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                <span className="font-medium">Vollständigkeit:</span> Bitte versuchen Sie, jedes Bild so präzise wie möglich zu beurteilen. Der "Weiter & Speichern" Button färbt sich grün, sobald das Wundbild vollständig bearbeitet wurde.
                            </li>
                            <li>
                                <span className="font-medium">Zusatzinformationen:</span> Sollten Ihnen wichtige klinische Informationen zur abschließenden Bewertung fehlen, nutzen Sie bitte das dafür vorgesehene Notizfeld am Ende jedes Fragebogens.
                            </li>
                            <li>
                                <span className="font-medium">Flexibilität & Speicherung:</span> Ihre Fortschritte werden automatisch nach jeder Eingabe gespeichert. Sie können die Bilder in einer beliebigen Reihenfolge bearbeiten und die Sitzung jederzeit unterbrechen.
                            </li>
                            <li>
                                <span className="font-medium">Übersicht:</span> Über das Menü-Icon oben links gelangen Sie zu einer Übersicht, die Ihnen anzeigt, welche Bilder bereits fertig bearbeitet sind und wo noch Angaben fehlen.
                            </li>
                        </ul>
                    </div>

                    <p className="border-t border-slate-100 pt-4 mt-4">
                        Bei technischen Fragen oder Anmerkungen können Sie sich jederzeit an folgende <br /> E-Mail Adresse wenden: <a href="mailto:mert.akdemir@nursit-institute.com" className="text-blue-600 hover:underline">mert.akdemir@nursit-institute.com</a>
                    </p>

                    <p>
                        Vielen Dank für Ihre Zeit und Ihre wertvolle Fachexpertise.
                    </p>

                    <p className="font-semibold pt-4">
                        Bitte melden Sie sich mit Ihren Zugangsdaten an:
                    </p>
                </div>

                <SupabaseAuth
                    supabaseClient={supabase}
                    view="sign_in"
                    showLinks={false}
                    appearance={{ theme: ThemeSupa }}
                    theme="light"
                    providers={[]}
                    localization={{
                        variables: {
                            sign_in: {
                                email_label: 'E-Mail Adresse',
                                password_label: 'Passwort',
                                button_label: 'Anmelden',
                            },
                        }
                    }}
                />
            </div>
        </div>
    );
}
