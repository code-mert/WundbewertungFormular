import { questions } from '../lib/questions';
import { DropdownInput } from './inputs/DropdownInput';
import { SliderInput } from './inputs/SliderInput';
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

                return (
                    <div key={q.id} className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                        {q.type === 'dropdown' && (
                            <DropdownInput question={q} value={value} onChange={(v) => onAnswerChange(q.id, v)} />
                        )}
                        {q.type === 'slider' && (
                            <SliderInput question={q} value={value} onChange={(v) => onAnswerChange(q.id, v)} />
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
