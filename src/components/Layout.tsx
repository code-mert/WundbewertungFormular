import type { ReactNode } from 'react';

interface Props {
    header: ReactNode;
    leftPanel: ReactNode;
    rightPanel: ReactNode;
}

export function Layout({ header, leftPanel, rightPanel }: Props) {
    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {header}

            <main className="flex-1 flex overflow-hidden pt-16">
                {/* Left Panel: Image (Fixed) */}
                <section className="w-1/2 h-full bg-slate-900 relative border-r border-slate-200">
                    {leftPanel}
                </section>

                {/* Right Panel: Form (Scrollable) */}
                <section className="w-1/2 h-full overflow-y-auto bg-white">
                    <div className="max-w-2xl mx-auto">
                        {rightPanel}
                    </div>
                </section>
            </main>
        </div>
    );
}
