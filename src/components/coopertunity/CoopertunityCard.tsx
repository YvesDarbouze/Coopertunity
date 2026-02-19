import { MapPin, DollarSign, BookOpen } from "lucide-react";
import clsx from "clsx";

interface CoopertunityCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coopertunity: any; // Using any for speed, should use Prisma type
    onClick?: () => void;
}

export default function CoopertunityCard({ coopertunity, onClick }: CoopertunityCardProps) {
    // Helper for sector colors
    const getSectorColor = (sector: string) => {
        switch (sector) {
            case "PRIMARY": return "bg-sector-earth text-white";
            case "SECONDARY": return "bg-sector-industry text-white";
            case "TERTIARY": return "bg-sector-service text-deep-brown";
            case "QUATERNARY": return "bg-sector-knowledge text-white";
            default: return "bg-pan-gold text-black";
        }
    };

    return (
        <div
            onClick={onClick}
            className="group relative w-full bg-glass-white/5 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:bg-glass-white/10 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-electric-purple/20"
        >
            {/* Top Section: User & Sector */}
            <div className="p-6 pb-0 flex justify-between items-start z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-0.5 overflow-hidden">
                        {coopertunity.author.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coopertunity.author.image} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <div className="w-full h-full bg-pan-charcoal flex items-center justify-center text-white font-black text-lg">
                                {coopertunity.author.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-white font-heading font-bold text-sm leading-none mb-1">{coopertunity.author.name}</h4>
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Coopertunist</span>
                    </div>
                </div>

                <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg", getSectorColor(coopertunity.sector))}>
                    {coopertunity.sector}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 relative z-10">
                <h3 className="text-2xl md:text-3xl font-heading font-black text-white leading-tight mb-3 group-hover:text-pan-gold transition-colors">
                    {coopertunity.title}
                </h3>
                <p className="text-white/60 font-body text-sm line-clamp-2 leading-relaxed mb-6">
                    {coopertunity.description}
                </p>

                {/* Metadata Chips */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <MapPin size={14} className="text-pan-gold" />
                        {coopertunity.location}
                    </div>
                    {coopertunity.investmentAmount && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <DollarSign size={14} className="text-pan-green" />
                            ${coopertunity.investmentAmount.toLocaleString()}
                        </div>
                    )}
                    {coopertunity.willingnessToTeach && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <BookOpen size={14} className="text-action-blue" />
                            Mentorship
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action Area (Ipsum Style) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 right-4 z-20">
                <button className="h-12 w-12 bg-pan-gold rounded-full flex items-center justify-center text-black shadow-lg shadow-pan-gold/20 group-hover:scale-110 transition-transform duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

