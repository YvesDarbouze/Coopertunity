"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, DollarSign, BookOpen, ExternalLink, Shield } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, useTransition } from "react";
import { sendConnectionRequest, getConnectionStatus } from "@/app/actions/connections";

interface CoopertunityModalProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coopertunity: any | null;
    onClose: () => void;
}

export default function CoopertunityModal({ coopertunity, onClose }: CoopertunityModalProps) {
    const [status, setStatus] = useState("Connect");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (coopertunity?.author?.id) {
            getConnectionStatus(coopertunity.author.id).then((res) => {
                setStatus(res.status);
            });
        }
    }, [coopertunity]);

    const handleConnect = () => {
        if (status !== "Connect") return;

        startTransition(async () => {
            const result = await sendConnectionRequest(coopertunity.author.id);
            if (result.success) {
                setStatus("Pending");
            } else {
                alert(result.message);
            }
        });
    };

    if (!coopertunity) return null;

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
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm md:p-4"
            >
                <motion.div
                    // Mobile: Slide up from bottom (y: "100%") to (y: 0)
                    // Desktop: Fade/Scale in (y: 20) to (y: 0)
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full h-[85vh] md:h-auto md:max-w-4xl md:max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-xl shadow-2xl relative flex flex-col md:flex-row"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
                    >
                        <X size={20} className="text-black" />
                    </button>

                    {/* Left Column: Key Info & Imagery */}
                    <div className="w-full md:w-1/3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 md:p-8 flex flex-col gap-6">
                        {/* Author Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                                {coopertunity.author.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={coopertunity.author.image} alt={coopertunity.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl font-black text-gray-400">
                                        {coopertunity.author.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg text-deep-brown leading-none">{coopertunity.author.name}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Project Lead</p>
                            </div>
                        </div>

                        {/* Badges / Stats */}
                        <div className="space-y-3">
                            <div className={clsx("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-black uppercase text-center", getSectorColor(coopertunity.sector))}>
                                {coopertunity.sector}
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                <MapPin size={16} className="text-pan-gold" />
                                {coopertunity.location}
                            </div>

                            {coopertunity.investmentAmount && (
                                <div className="flex items-center gap-2 text-sm font-bold text-black">
                                    <DollarSign size={16} className="text-pan-green" />
                                    Investment: ${coopertunity.investmentAmount.toLocaleString()}
                                </div>
                            )}

                            {coopertunity.willingnessToTeach && (
                                <div className="flex items-center gap-2 text-sm font-bold text-action-blue">
                                    <BookOpen size={16} />
                                    Mentorship Available
                                </div>
                            )}

                            {coopertunity.author.isVeteran && (
                                <div className="flex items-center gap-2 text-sm font-bold text-pan-gold">
                                    <Shield size={16} />
                                    Veteran Led
                                </div>
                            )}
                        </div>

                        {/* Connect Button (Desktop) */}
                        <button
                            onClick={handleConnect}
                            disabled={status !== "Connect" || isPending}
                            className={clsx(
                                "mt-auto hidden md:flex w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-colors items-center justify-center gap-2",
                                status === "Connect"
                                    ? "bg-deep-brown text-white hover:bg-pan-gold hover:text-deep-brown"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {isPending ? "Sending..." : status} <ExternalLink size={16} />
                        </button>
                    </div>

                    {/* Right Column: Detailed Description */}
                    <div className="w-full md:w-2/3 p-6 md:p-12 space-y-6 md:space-y-8 pb-24 md:pb-12">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-heading font-black text-deep-brown leading-tight mb-2">
                                {coopertunity.title}
                            </h2>
                            <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                                Needs: {coopertunity.requiredSkills?.join(", ") || "General Support"}
                            </p>
                        </div>

                        <div className="prose prose-sm md:prose-lg text-gray-600 font-body">
                            <h4 className="font-bold text-deep-brown uppercase text-sm mb-2">Project Description</h4>
                            <p className="leading-relaxed">
                                {coopertunity.description}
                            </p>

                            {/* Placeholder for expanded content simulation */}
                            <p className="mt-4">
                                This initiative aims to address critical infrastructure gaps within the {coopertunity.sector.toLowerCase()} sector.
                                We are looking for partners who share our vision for sustainable development and economic empowerment across the continent.
                            </p>
                        </div>

                        {/* Mobile Sticky Connect Button */}
                        <button
                            onClick={handleConnect}
                            disabled={status !== "Connect" || isPending}
                            className={clsx(
                                "md:hidden w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xl",
                                status === "Connect"
                                    ? "bg-deep-brown text-white hover:bg-pan-gold hover:text-deep-brown"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {isPending ? "Sending..." : status} <ExternalLink size={16} />
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
