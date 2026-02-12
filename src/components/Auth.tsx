import { supabase } from '../lib/supabase';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export function Auth() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Wundbewertung Login</h1>
                <SupabaseAuth
                    supabaseClient={supabase}
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
