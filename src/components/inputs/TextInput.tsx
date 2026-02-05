import type { Question } from '../../lib/questions';

interface Props {
    question: Question;
    value: string;
    onChange: (val: string) => void;
}

export function TextInput({ question, value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium text-slate-700">{question.label}</label>
            <textarea
                rows={3}
                className="form-textarea block w-full mt-1 border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 border"
                value={value || ''}
                placeholder="Ihre Eingabe..."
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
