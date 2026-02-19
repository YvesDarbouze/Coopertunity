"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Eye } from "lucide-react";
import { MapPin, Briefcase } from "lucide-react";
import Image from "next/image";
import { MatchScore } from "@/components/ui/MatchScore";
import { FeedItem } from "./FeedCard";

interface FeedModalProps {
    item: FeedItem | null;
    onClose: () => void;
    onAction: (action: "PASS" | "WATCH" | "CONNECT", item: FeedItem) => void;
}

export function FeedModal({ item, onClose, onAction }: FeedModalProps) {
    if (!item) return null;

    return (
        <AnimatePresence>
            {item && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-deep-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    >
                        {/* Modal Content - Glassmorphism */}
                        <motion.div
                            layoutId={`card-${item.id}`}
                            className="bg-white/95 backdrop-blur-xl border border-white/40 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 bg-white/40 hover:bg-white/60 p-2 rounded-full transition text-deep-brown backdrop-blur-md shadow-sm"
                            >
                                <X size={20} />
                            </button>

                            {/* Left: Media & Key Info */}
                            <div className="w-full md:w-1/2 relative min-h-[300px] md:h-auto bg-gray-100/50">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-peach-fuzz/20 text-peach-fuzz">
                                        <Briefcase size={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/90 via-transparent to-transparent opacity-90" />

                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <MatchScore score={item.matchScore} className="scale-110 shadow-lg" />
                                        <span className="text-white font-heading font-bold text-shadow-md drop-shadow-lg tracking-wide">
                                            {item.type === 'USER' ? 'POTENTIAL PARTNER' : 'OPPORTUNITY'}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-none mb-2 text-shadow-lg">
                                        {item.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-peach-fuzz">
                                        <MapPin size={16} />
                                        <span className="font-bold uppercase tracking-wider text-sm">{item.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Details & Actions */}
                            <div className="w-full md:w-1/2 p-8 flex flex-col bg-transparent overflow-y-auto">
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-heading">
                                            {item.type === 'USER' ? 'PROFESSION' : 'SECTOR'}
                                        </h4>
                                        <p className="text-xl text-deep-brown font-medium">{item.subtitle}</p>
                                    </div>

                                    {/* Mock Description - Replace with real data in production */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-heading">
                                            ABOUT
                                        </h4>
                                        <p className="text-mocha-mousse leading-relaxed font-body">
                                            Looking to collaborate with like-minded individuals to drive impact on the continent. Specialized in sustainable development and ethical investment. Open to new ventures and partnerships that align with Pan-African growth.
                                        </p>
                                    </div>

                                    {/* Skills / Tags */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-heading">
                                            KEYWORDS & SKILLS
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-50 text-deep-brown text-xs font-bold rounded-full border border-gray-200">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons (Swipe Interface) */}
                                <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => onAction("PASS", item)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-red-500 group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                                            <X size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-red-500 transition-colors uppercase tracking-wider">Pass</span>
                                    </button>

                                    <button
                                        onClick={() => onAction("WATCH", item)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                            <Eye size={24} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors uppercase tracking-wider">Watch</span>
                                    </button>

                                    <button
                                        onClick={() => onAction("CONNECT", item)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-14 h-14 rounded-full border-2 border-pan-charcoal bg-pan-charcoal text-white flex items-center justify-center group-hover:bg-mocha-mousse group-hover:border-mocha-mousse transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                            <Heart size={24} className="fill-current" />
                                        </div>
                                        <span className="text-xs font-black text-pan-charcoal group-hover:text-mocha-mousse transition-colors uppercase tracking-wider">Connect</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
