

export const FormattedLabel = ({ text }: { text: string }) => {
    // Split by **bold** or *italic* markers
    // Using positive lookahead/behind or just capturing groups
    // Regex matches: **...** OR *...*
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);

    return (
        <span className="whitespace-pre-wrap block">
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-lg text-slate-900 block mb-1">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i} className="italic font-normal text-slate-600">{part.slice(1, -1)}</em>;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};
