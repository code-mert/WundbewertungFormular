import type { Question } from '../../lib/questions';

import { FormattedLabel } from '../FormattedLabel';

interface Props {
    question: Question;
    value: string;
    onChange: (val: string) => void;
}

export function TextInput({ question, value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-1 mb-4">
            <label className="text-base font-medium text-slate-700 whitespace-pre-wrap"><FormattedLabel text={question.label} /></label>
            <textarea
                rows={3}
                className="form-textarea block w-full mt-1 border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 text-base border"
                value={value || ''}
                placeholder="Ihre Eingabe..."
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
