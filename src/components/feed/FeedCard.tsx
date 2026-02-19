"use client";

import Image from "next/image";
import { User, Briefcase, MapPin } from "lucide-react";
import { MatchScore } from "@/components/ui/MatchScore";
import clsx from "clsx";
import { motion } from "framer-motion";

export type FeedItemType = "USER" | "COOPERTUNITY" | "JOB";

export interface FeedItem {
    id: string;
    type: FeedItemType;
    title: string; // Name or Title
    subtitle: string; // Profession or Sector
    image?: string | null;
    location?: string;
    matchScore: number;
    tags: string[];
    isDiaspora?: boolean; // True = Diaspora, False = Continent
}

interface FeedCardProps {
    item: FeedItem;
    onClick: () => void;
}

export function FeedCard({ item, onClick }: FeedCardProps) {
    return (
        <motion.div
            layoutId={`card-${item.id}`}
            onClick={onClick}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-xl min-h-[300px] flex flex-col hover:shadow-2xl transition-all"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:brightness-110 transition duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-peach-fuzz/50 bg-gray-50">
                        {item.type === "USER" ? <User size={48} /> : <Briefcase size={48} />}
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 via-transparent to-transparent opacity-60" />

                {/* Match Score */}
                <div className="absolute top-3 right-3">
                    <MatchScore score={item.matchScore} />
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                    <span className={clsx(
                        "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-md bg-white/90 border shadow-sm",
                        item.type === "USER" ? "text-blue-600 border-blue-100" :
                            item.type === "JOB" ? "text-purple-600 border-purple-100" :
                                "text-mocha-mousse border-mocha-mousse/20"
                    )}>
                        {item.type}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col justify-end relative -mt-8">
                <div className="mb-1 flex items-center gap-2 text-xs text-white drop-shadow-md font-bold">
                    <MapPin size={12} />
                    <span>{item.location || "Remote / Global"}</span>
                </div>

                <h3 className="text-xl font-heading font-bold text-deep-brown leading-tight mb-1 group-hover:text-mocha-mousse transition px-1 bg-white/50 backdrop-blur-sm rounded self-start mt-2">{item.title}</h3>
                <p className="text-sm text-mocha-mousse font-bold mb-3 px-1">{item.subtitle}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-auto">
                    {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full border border-gray-200 font-bold">
                            {tag}
                        </span>
                    ))}
                    {item.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-gray-400 text-[10px]">+ {item.tags.length - 3}</span>
                    )}
                </div>
            </div>

            {/* Quick Actions (Hover) */}
            <div className="absolute inset-0 bg-mocha-mousse/90 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-sm z-10 pointer-events-none group-active:pointer-events-none lg:pointer-events-auto">
                <span className="text-white font-heading font-black text-lg tracking-widest drop-shadow-sm">VIEW DETAILS</span>
            </div>
        </motion.div>
    );
}
