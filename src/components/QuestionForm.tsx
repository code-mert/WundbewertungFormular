import { questions } from '../lib/questions';
import { DropdownInput } from './inputs/DropdownInput';
import { SliderInput } from './inputs/SliderInput';
import { MultiSelectInput } from './inputs/MultiSelectInput';
import { TextInput } from './inputs/TextInput';

interface Props {
    answers: Record<string, any>;
    onAnswerChange: (questionId: string, value: any) => void;
}

export function QuestionForm({ answers, onAnswerChange }: Props) {
    return (
        <div className="p-6 space-y-8">
            {questions.map((q) => {
                const value = answers[q.id];

                // Conditional Logic: Hide 'spuelloesung' if 'infektion' is not 'Ja'
                if (q.id === 'spuelloesung' && answers['infektion'] !== 'Ja') {
                    return null;
                }

                if (q.id === 'debridement' && answers['debridement_notwendig'] !== 'Ja') {
                    return null;
                }

                if (q.type === 'info') {
                    const hasSubtitle = q.label.includes('\n');
                    const title = q.label.split('\n')[0];
                    const subtitle = hasSubtitle ? q.label.substring(title.length + 1) : null;

                    return (
                        <div key={q.id} className="pt-6 pb-2 border-b-2 border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-6 w-1.5 bg-blue-600 rounded-full"></div>
                                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
                            </div>
                            {subtitle && (
                                <p className="text-slate-500 italic text-sm ml-4 leading-relaxed">{subtitle}</p>
                            )}
                        </div>
                    );
                }

                return (
                    <div key={q.id} className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                        {q.type === 'dropdown' && (
                            <DropdownInput question={q} value={value} onChange={(v) => onAnswerChange(q.id, v)} />
                        )}
                        {q.type === 'slider' && (
                            <SliderInput question={q} value={value} onChange={(v) => onAnswerChange(q.id, v)} />
                        )}
                        {q.type === 'multiselect' && (
                            <MultiSelectInput question={q} value={value || []} onChange={(v) => onAnswerChange(q.id, v)} />
                        )}
                        {q.type === 'text' && (
                            <TextInput question={q} value={value} onChange={(v) => onAnswerChange(q.id, v)} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
