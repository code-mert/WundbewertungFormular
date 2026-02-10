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

                return (
                    <div key={q.id} className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                        {q.type === 'dropdown' && (
                            <DropdownInput question={q} value={value} onChange={(v) => onAnswerChange(q.id, v)} />
                        )}
                        {q.type === 'slider' && (
                            <SliderInput question={q} value={value} onChange={(v) => onAnswerChange(q.id, v)} />
                        )}
                        {q.type === 'info' && (
                            <div className="prose prose-slate">
                                <h3 className="font-bold text-xl text-slate-800 mb-2">{q.label.split('\n')[0]}</h3>
                                <p className="text-slate-600 italic text-base">{q.label.split('\n')[1]}</p>
                            </div>
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
