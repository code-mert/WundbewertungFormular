import { useState } from 'react';
import type { Question } from '../../lib/questions';
import { FaTimes, FaSearch } from 'react-icons/fa';

interface Props {
    question: Question;
    value: string[]; // Array of selected strings
    onChange: (val: string[]) => void;
}

export function MultiSelectInput({ question, value = [], onChange }: Props) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const options = question.options || [];

    // Filter options: exclude already selected ones and match search term
    const filteredOptions = options.filter(opt =>
        !value.includes(opt) &&
        opt.toLowerCase().includes(search.toLowerCase())
    );

    const addOption = (opt: string) => {
        onChange([...value, opt]);
        setSearch('');
    };

    const removeOption = (opt: string) => {
        onChange(value.filter(v => v !== opt));
    };

    return (
        <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 block mb-2">{question.label}</label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
                {value.map(opt => (
                    <span key={opt} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {opt}
                        <button onClick={() => removeOption(opt)} className="hover:text-blue-900 focus:outline-none">
                            <FaTimes size={12} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Search & Dropdown */}
            <div className="relative">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                        placeholder="Produkt suchen..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow click
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="p-3 text-slate-500 text-sm text-center">Keine Produkte gefunden</div>
                        ) : (
                            filteredOptions.map(opt => (
                                <button
                                    key={opt}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 transition"
                                    onClick={() => addOption(opt)}
                                >
                                    {opt}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
