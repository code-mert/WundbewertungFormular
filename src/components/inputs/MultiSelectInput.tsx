import { useState, useRef, useEffect } from 'react';
import type { Question } from '../../lib/questions';
import { FaTimes, FaSearch, FaPlus } from 'react-icons/fa';
import { FormattedLabel } from '../FormattedLabel';

interface Props {
    question: Question;
    value: string[]; // Array of selected strings
    onChange: (val: string[]) => void;
}

export function MultiSelectInput({ question, value = [], onChange }: Props) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = question.options || [];

    // Filter options: exclude already selected ones and match search term
    const filteredOptions = options.filter(opt =>
        !value.includes(opt) &&
        opt.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const addOption = (opt: string) => {
        if (opt === 'Sonstiges') {
            setShowCustomInput(true);
            setIsOpen(false);
            setSearch('');
        } else {
            onChange([...value, opt]);
            setSearch('');
            setIsOpen(false);
        }
    };

    const addCustomOption = () => {
        if (customValue.trim()) {
            onChange([...value, customValue.trim()]);
            setCustomValue('');
            setShowCustomInput(false);
        }
    };

    const removeOption = (opt: string) => {
        onChange(value.filter(v => v !== opt));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomOption();
        }
    }

    return (
        <div className="mb-4" ref={dropdownRef}>
            <label className="text-base font-medium text-slate-700 block mb-2 whitespace-pre-wrap"><FormattedLabel text={question.label} /></label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
                {value.map(opt => (
                    <span key={opt} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-base flex items-center gap-2">
                        {opt}
                        <button onClick={() => removeOption(opt)} className="hover:text-blue-900 focus:outline-none">
                            <FaTimes size={12} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Custom Input Field for "Sonstiges" */}
            {showCustomInput && (
                <div className="flex items-center gap-2 mb-3 animate-fade-in">
                    <input
                        type="text"
                        className="flex-1 border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                        placeholder="Sonstiges..."
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <button
                        onClick={addCustomOption}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!customValue.trim()}
                        title="Hinzufügen"
                    >
                        <FaPlus size={16} />
                    </button>
                    <button
                        onClick={() => { setShowCustomInput(false); setCustomValue(''); }}
                        className="text-slate-400 hover:text-slate-600 p-2"
                        title="Abbrechen"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
            )}

            {/* Search & Dropdown - Hide when custom input is active to avoid clutter? Or keep it? keeping it allows adding more standard items while custom input is open. */}
            {!showCustomInput && (
                <div className="relative">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                            placeholder={question.placeholder || "Produkt suchen..."}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
                            onFocus={() => setIsOpen(true)}
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
            )}
        </div>
    );
}
