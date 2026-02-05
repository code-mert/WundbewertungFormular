interface Props {
    total: number;
    current: number;
}

export function ProgressBar({ total, current }: Props) {
    const progress = ((current + 1) / total) * 100;

    return (
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
