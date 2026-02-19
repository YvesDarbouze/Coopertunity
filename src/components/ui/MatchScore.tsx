"use client";

import clsx from "clsx";

interface MatchScoreProps {
    score: number;
    className?: string;
}

export function MatchScore({ score, className }: MatchScoreProps) {
    // Color logic: High = Green, Med = Gold, Low = Gray
    const getColor = (s: number) => {
        if (s >= 80) return "text-pan-green border-pan-green";
        if (s >= 50) return "text-pan-gold border-pan-gold";
        return "text-gray-500 border-gray-500";
    };

    return (
        <div className={clsx("flex items-center gap-1 font-heading font-bold", className)}>
            <div className={clsx("border-2 rounded-full w-10 h-10 flex items-center justify-center text-sm bg-white/50 backdrop-blur-md font-black shadow-sm", getColor(score))}>
                {score}%
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Match</span>
        </div>
    );
}
