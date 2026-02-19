"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, X, ExternalLink } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "AgroTech Initiative",
        sector: "Agriculture",
        location: "Nairobi, Kenya",
        description: "Scaling vertically integrated urban farming solutions.",
        status: "Active Funding",
        color: "bg-pan-green"
    },
    {
        id: 2,
        title: "Solar Grid Expansion",
        sector: "Energy",
        location: "Lagos, Nigeria",
        description: "Decentralized solar micro-grids for rural communities.",
        status: "Seeking Partners",
        color: "bg-pan-gold"
    },
    {
        id: 3,
        title: "EdTech Platform",
        sector: "Education",
        location: "Accra, Ghana",
        description: "AI-driven vocational training for youth employment.",
        status: "Beta Testing",
        color: "bg-deep-brown"
    },
    {
        id: 4,
        title: "FinTech Gateway",
        sector: "Finance",
        location: "Kigali, Rwanda",
        description: "Cross-border payment infrastructure for SMEs.",
        status: "Seed Round",
        color: "bg-blue-600"
    }
];

export default function IntelFolderGrid() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <section className="min-h-screen bg-cloud-dancer py-24 px-4 relative z-0">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => setSelectedId(project.id)}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-64 bg-white border-2 border-deep-brown p-6 hover:shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
                                {/* Folder Tab Design */}
                                <div className="absolute top-0 left-0 w-24 h-8 bg-gray-100 border-r-2 border-b-2 border-deep-brown rounded-br-lg z-0" />

                                <div className="relative z-10 space-y-4 pt-6">
                                    <div className="flex justify-between items-start">
                                        <Folder className="w-10 h-10 text-deep-brown group-hover:text-pan-gold transition-colors" />
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 text-white ${project.color}`}>
                                            {project.sector}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-deep-brown uppercase leading-tight font-heading">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium mt-2 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-10 pt-4 border-t border-gray-100 flex justify-between items-center bg-white">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        ID: {`CPT-${project.id}00`}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-pan-gold animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-brown/80 backdrop-blur-sm"
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            layoutId={`project-${selectedId}`}
                            className="bg-white w-full max-w-2xl border-4 border-black p-8 shadow-[16px_16px_0px_0px_#D4AF37] relative overflow-y-auto max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedId(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-deep-brown" />
                            </button>

                            {projects.map((project) => {
                                if (project.id === selectedId) {
                                    return (
                                        <div key={project.id} className="space-y-8">
                                            <div className="space-y-2">
                                                <span className={`inline-block text-xs font-black uppercase px-3 py-1 text-white ${project.color}`}>
                                                    {project.sector}
                                                </span>
                                                <h2 className="text-4xl md:text-5xl font-black text-deep-brown uppercase font-heading">
                                                    {project.title}
                                                </h2>
                                                <p className="text-lg text-gray-500 font-bold flex items-center gap-2">
                                                    📍 {project.location}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y-2 border-gray-100 py-8">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                                    <p className="text-xl font-bold text-deep-brown">{project.status}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opportunity</label>
                                                    <p className="text-xl font-bold text-deep-brown">Open for Investment</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xl font-black text-deep-brown uppercase">Intel Brief</h4>
                                                <p className="text-gray-600 leading-relaxed text-lg">
                                                    This project represents a high-impact opportunity in the {project.sector.toLowerCase()} sector.
                                                    {project.description} Currently seeking partners for the next phase of expansion.
                                                    Comprehensive due diligence reports are available for verified members.
                                                </p>
                                            </div>

                                            <button className="w-full bg-deep-brown text-white font-black py-4 text-xl uppercase tracking-widest hover:bg-pan-gold transition-colors flex items-center justify-center gap-3">
                                                Access Full Dossier <ExternalLink size={20} />
                                            </button>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
