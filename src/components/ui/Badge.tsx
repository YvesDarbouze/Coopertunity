import { Shield, CheckCircle, Award } from "lucide-react";
import clsx from "clsx";

type BadgeType = "VETERAN" | "INVESTOR" | "SKILL";

interface BadgeProps {
    type: BadgeType;
    label?: string;
    size?: "sm" | "md" | "lg";
}

export default function Badge({ type, label, size = "md" }: BadgeProps) {

    const sizeClasses = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-2 text-sm",
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16,
    };

    if (type === "VETERAN") {
        return (
            <div className={clsx(
                "inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider bg-pan-red/10 text-pan-red border border-pan-red/20",
                sizeClasses[size]
            )}>
                <Shield size={iconSizes[size]} fill="currentColor" className="opacity-50" />
                <span>{label || "Veteran"}</span>
            </div>
        );
    }

    if (type === "INVESTOR") {
        return (
            <div className={clsx(
                "inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider bg-pan-green/10 text-pan-green border border-pan-green/20",
                sizeClasses[size]
            )}>
                <CheckCircle size={iconSizes[size]} />
                <span>{label || "Verified Investor"}</span>
            </div>
        );
    }

    return (
        <div className={clsx(
            "inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider bg-gray-100 text-mocha-mousse border border-gray-200",
            sizeClasses[size]
        )}>
            <Award size={iconSizes[size]} />
            <span>{label || "Skill"}</span>
        </div>
    );
}
