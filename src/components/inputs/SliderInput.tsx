import type { Question } from '../../lib/questions';
import { FormattedLabel } from '../FormattedLabel';

interface Props {
    question: Question;
    value: number;
    onChange: (val: number) => void;
}

export function SliderInput({ question, value, onChange }: Props) {
    const val = value ?? 0;

    return (
        <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700"><FormattedLabel text={question.label} /></label>
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {val} {question.unit}
                </span>
            </div>
            <input
                type="range"
                min={question.min}
                max={question.max}
                step={question.step || 1}
                value={val}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
                <span>{question.min}</span>
                <span>{question.max}</span>
            </div>
        </div>
    );
}
