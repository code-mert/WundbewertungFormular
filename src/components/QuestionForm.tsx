import { questions } from '../lib/questions';
import { DropdownInput } from './inputs/DropdownInput';
import { SliderInput } from './inputs/SliderInput';
import { MultiSelectInput } from './inputs/MultiSelectInput';
import { TextInput } from './inputs/TextInput';
import { isQuestionAnswered } from '../hooks/useStore';

interface Props {
    answers: Record<string, any>;
    onAnswerChange: (questionId: string, value: any) => void;
}

export function QuestionForm({ answers, onAnswerChange }: Props) {
    return (
        <div className="p-6 space-y-8">
            {questions.map((q, index) => {
                const value = answers[q.id];

                // Conditional Logic: Hide 'spuelloesung' if 'infektion' is not 'Ja'
                if (q.id === 'spuelloesung' && answers['infektion'] !== 'Ja') {
                    return null;
                }

                if (q.id === 'debridement' && answers['debridement_notwendig'] !== 'Ja') {
                    return null;
                }

                if (q.id === 'kompression_produkte' && answers['kompression_indiziert'] !== 'Ja') {
                    return null;
                }

                if (q.type === 'info') {
                    const hasSubtitle = q.label.includes('\n');
                    const title = q.label.split('\n')[0];
                    const subtitle = hasSubtitle ? q.label.substring(title.length + 1) : null;

                    // Check if all questions in this section are answered
                    let nextInfoIndex = questions.findIndex((nextQ, idx) => idx > index && nextQ.type === 'info');
                    if (nextInfoIndex === -1) nextInfoIndex = questions.length;

                    const sectionQuestions = questions.slice(index + 1, nextInfoIndex);
                    const isSectionComplete = sectionQuestions.length > 0 && sectionQuestions.every(sq => isQuestionAnswered(sq, answers));

                    return (
                        <div key={q.id} className="pt-6 pb-2 border-b-2 border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-6 w-1.5 bg-blue-600 rounded-full"></div>
                                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    {title}
                                    {isSectionComplete ? (
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center text-emerald-600 shrink-0" title="Abschnitt vollständig">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" title="Abschnitt unvollständig"></div>
                                    )}
                                </h2>
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
