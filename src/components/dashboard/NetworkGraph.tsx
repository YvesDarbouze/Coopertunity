
"use client";

import { motion } from "framer-motion";
import { User, MapPin } from "lucide-react";

// Mock Data for Prompt 39: "My Network" Graph
const NODES = [
    { id: "me", x: 400, y: 300, label: "You", type: "root" },
    { id: "1", x: 250, y: 150, label: "Lagos, NG", type: "loc" },
    { id: "2", x: 550, y: 150, label: "Accra, GH", type: "loc" },
    { id: "3", x: 250, y: 450, label: "Nairobi, KE", type: "loc" },
    { id: "u1", x: 200, y: 100, label: "Amara", type: "user" },
    { id: "u2", x: 300, y: 100, label: "Tunde", type: "user" },
    { id: "u3", x: 600, y: 100, label: "Kwame", type: "user" },
    { id: "u4", x: 200, y: 500, label: "Wanjiku", type: "user" },
];

const LINKS = [
    { source: "me", target: "1" },
    { source: "me", target: "2" },
    { source: "me", target: "3" },
    { source: "1", target: "u1" },
    { source: "1", target: "u2" },
    { source: "2", target: "u3" },
    { source: "3", target: "u4" },
];

export default function NetworkGraph() {
    return (
        <div className="w-full h-[600px] bg-gray-50 rounded-3xl border border-gray-200 relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-xl font-heading font-black text-deep-brown">My Value Web</h3>
                <p className="text-sm text-mocha-mousse font-medium">Visualizing your Pan-African reach.</p>
            </div>

            <svg className="w-full h-full" viewBox="0 0 800 600">
                {/* Links */}
                {LINKS.map((link, i) => {
                    const source = NODES.find(n => n.id === link.source)!;
                    const target = NODES.find(n => n.id === link.target)!;

                    return (
                        <motion.line
                            key={i}
                            x1={source.x} y1={source.y}
                            x2={target.x} y2={target.y}
                            stroke="#d1d5db"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    );
                })}

                {/* Nodes */}
                {NODES.map((node) => (
                    <motion.g
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: Math.random() * 0.5 + 1, type: "spring" }}
                    >
                        {/* Circle */}
                        <circle
                            cx={node.x} cy={node.y}
                            r={node.type === "root" ? 40 : node.type === "loc" ? 30 : 20}
                            fill={node.type === "root" ? "#4A3427" : "#FFFFFF"} // Deep Brown or White
                            stroke={node.type === "root" ? "#FDBA74" : node.type === "loc" ? "#10B981" : "#9CA3AF"} // Peach or Emerald or Gray
                            strokeWidth={3}
                            className="cursor-pointer hover:fill-gray-100 transition shadow-lg"
                        />

                        {/* Icon */}
                        <foreignObject x={node.x - 10} y={node.y - 10} width="20" height="20">
                            <div className="flex items-center justify-center h-full text-white">
                                {node.type === "loc" ? <MapPin size={14} className="text-emerald-500" /> : <User size={14} className={node.type === "root" ? "text-peach-fuzz" : "text-gray-400"} />}
                            </div>
                        </foreignObject>

                        {/* Label */}
                        <text
                            x={node.x}
                            y={node.y + (node.type === "root" ? 55 : 45)}
                            textAnchor="middle"
                            fill={node.type === "root" ? "#4A3427" : "#6B7280"}
                            fontSize={node.type === "root" ? "14" : "10"}
                            fontWeight="bold"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {node.label}
                        </text>
                    </motion.g>
                ))}
            </svg>
        </div>
    );
}
