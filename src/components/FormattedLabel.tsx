

export const FormattedLabel = ({ text }: { text: string }) => {
    // Split by *italic* markers
    const parts = text.split(/(\*[^*\n]+\*)/g);

    return (
        <span className="whitespace-pre-wrap">
            {parts.map((part, i) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i} className="italic font-normal">{part.slice(1, -1)}</em>;
                }
                return part;
            })}
        </span>
    );
};
