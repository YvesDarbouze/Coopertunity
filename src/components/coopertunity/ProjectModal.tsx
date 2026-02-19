"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, DollarSign, User, AlertTriangle, Share2 } from "lucide-react";
import clsx from "clsx";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    project: any;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-deep-brown/80 backdrop-blur-sm"
                    />

                    <motion.div
                        layoutId={`project-${project.id}`}
                        initial={{ y: "100%", opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/40 rounded-t-3xl md:rounded-3xl overflow-hidden z-20 shadow-2xl h-[85vh] md:h-auto"
                    >
                        {/* Header Image or Gradient */}
                        <div className="h-48 bg-gradient-to-r from-pan-green/10 to-peach-fuzz/30 relative shrink-0">
                            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/40 hover:bg-white/60 rounded-full text-deep-brown transition backdrop-blur-md shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto h-[calc(85vh-12rem)] md:h-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-black text-peach-fuzz uppercase tracking-wider mb-2 block bg-deep-brown inline-block px-2 py-1 rounded-full">{project.sector}</span>
                                    <h2 className="text-3xl font-heading font-black text-deep-brown mb-2">{project.title}</h2>
                                    <div className="flex items-center gap-2 text-mocha-mousse font-bold font-body">
                                        <MapPin size={16} className="text-deep-brown" />
                                        {project.location}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white/60 p-4 rounded-xl border border-white/50">
                                    <span className="block text-xs text-mocha-mousse uppercase font-bold mb-1">Investment</span>
                                    <div className="flex items-center gap-1 text-pan-green font-black text-lg">
                                        <DollarSign size={16} />
                                        {project.investmentAmount ? project.investmentAmount.toLocaleString() : "N/A"}
                                    </div>
                                </div>
                                <div className="bg-white/60 p-4 rounded-xl col-span-2 border border-white/50">
                                    <span className="block text-xs text-mocha-mousse uppercase font-bold mb-1">Posted By</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            {project.author?.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={project.author.image} className="w-full h-full object-cover" alt="Author" />
                                            ) : (
                                                <User className="w-5 h-5 m-auto mt-1.5 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-deep-brown font-bold text-sm block">{project.author?.name || "Anonymous Member"}</span>
                                            <span className="text-pan-green text-xs font-bold">● Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-deep-brown/80 font-body leading-relaxed mb-8 font-medium">
                                {project.description}
                            </p>

                            {/* Prompt 37: Project Timeline Visualizer */}
                            {(project.industry === "Construction" || project.industry === "Real Estate") && (
                                <div className="mb-8">
                                    <h4 className="text-xs font-bold text-mocha-mousse uppercase mb-4">Project Timeline</h4>
                                    <div className="flex items-center justify-between relative">
                                        {/* Line */}
                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>

                                        {["Planning", "Fundraising", "Breaking Ground", "Completion"].map((step, i) => (
                                            <div key={step} className="flex flex-col items-center gap-2">
                                                <div className={clsx(
                                                    "w-4 h-4 rounded-full border-2",
                                                    i <= 1 ? "bg-peach-fuzz border-peach-fuzz" : "bg-white border-gray-300" // Mock status: Fundraising
                                                )} />
                                                <span className={clsx(
                                                    "text-[10px] font-bold uppercase",
                                                    i <= 1 ? "text-deep-brown" : "text-mocha-mousse"
                                                )}>{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Prompt 28: Land Deal Safety Warning */}
                            {project.type === "LAND_DEAL" && (
                                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                    <AlertTriangle className="text-red-500 shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="text-red-600 font-bold font-heading text-sm uppercase">Safety Warning</h4>
                                        <p className="text-red-500/80 text-xs mt-1 font-medium">
                                            Coopertunity connects people but does not verify land titles. Always use a local lawyer or verify deeds with the relevant government authority before exchanging funds.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Prompt 49: Share Button */}
                            <div className="flex gap-4 mt-4">
                                <button className="flex-1 py-4 bg-peach-fuzz hover:bg-orange-300 text-deep-brown font-black font-heading text-lg rounded-2xl transition active:scale-95 shadow-lg">
                                    Connect with Poster
                                </button>
                                <button className="px-6 py-4 bg-white hover:bg-gray-50 text-deep-brown font-bold rounded-2xl transition border border-gray-200 flex items-center gap-2 shadow-sm">
                                    <Share2 size={20} />
                                    Share
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
