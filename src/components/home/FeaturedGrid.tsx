"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectModal from "@/components/coopertunity/ProjectModal";
import { MapPin } from "lucide-react";

// Mock Data for "Featured"
const FEATURED_PROJECTS = [
    { id: "f1", title: "Sustainable Cocoa Farm", sector: "PRIMARY", location: "Ivory Coast", description: "Rehabilitating 50 acres of cocoa using permaculture.", investmentAmount: 50000, author: { name: "Jean-Luc K." } },
    { id: "f2", title: "Drone Delivery Logistics", sector: "TERTIARY", location: "Rwanda", description: "Last-mile medical delivery service needing expansion capital.", investmentAmount: 120000, author: { name: "Marie C." } },
    { id: "f3", title: "Afro-Beat Streaming App", sector: "QUATERNARY", location: "Lagos", description: "Developer team needed for MVP.", investmentAmount: null, author: { name: "Davido O." } },
];

export default function FeaturedGrid() {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="w-full max-w-6xl mx-auto mt-20 px-4">
            <h3 className="text-deep-brown font-heading font-black text-sm uppercase tracking-widest mb-8 text-center border-b border-deep-brown pb-2 w-max mx-auto">Featured Opportunities</h3>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {FEATURED_PROJECTS.map((project) => (
                    <motion.div
                        layoutId={`project-${project.id}`}
                        key={project.id}
                        onClick={() => setSelectedProject(project as any)}
                        className="break-inside-avoid bg-white border border-soft-gray p-6 rounded-none cursor-pointer hover:border-deep-brown hover:shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider bg-deep-brown px-2 py-1">{project.sector}</span>
                            <div className="flex items-center gap-1 text-xs text-mocha-mousse font-bold uppercase">
                                <MapPin size={10} />
                                {project.location}
                            </div>
                        </div>
                        <h4 className="font-heading font-black text-deep-brown text-2xl mb-2 leading-tight group-hover:text-peach-fuzz transition-colors">{project.title}</h4>
                        <p className="font-body text-deep-brown/80 text-sm line-clamp-3">{project.description}</p>
                    </motion.div>
                ))}
            </div>

            <ProjectModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </div>
    );
}
