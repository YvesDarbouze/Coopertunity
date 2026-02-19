import { MapPin } from "lucide-react";
import clsx from "clsx";

interface CoopertunityTileProps {
    coopertunity: any; // Using any for flexibility during dev
    onClick: () => void;
}

export default function CoopertunityTile({ coopertunity, onClick }: CoopertunityTileProps) {
    // Helper for sector colors (tag style)
    const getSectorColor = (sector: string) => {
        switch (sector) {
            case "PRIMARY": return "bg-sector-earth";
            case "SECONDARY": return "bg-sector-industry";
            case "TERTIARY": return "bg-sector-service";
            case "QUATERNARY": return "bg-sector-knowledge";
            default: return "bg-pan-gold";
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white border border-[#3D3935] p-4 rounded-lg cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 break-inside-avoid mb-4"
        >
            <div className="flex justify-between items-start mb-3">
                <span className={clsx("text-[10px] font-black uppercase px-2 py-0.5 text-white rounded-sm", getSectorColor(coopertunity.sector))}>
                    {coopertunity.sector}
                </span>
            </div>

            <h3 className="text-lg font-bold text-[#3D3935] font-heading leading-tight mb-2">
                {coopertunity.title}
            </h3>

            <div className="flex items-center gap-1 text-xs font-bold text-gray-500 font-body">
                <MapPin size={12} />
                <span>{coopertunity.location}</span>
            </div>
        </div>
    );
}
