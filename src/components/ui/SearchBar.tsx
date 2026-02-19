"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [history, setHistory] = useState<{ id: string, query: string }[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/search/history");
                if (res.ok) setHistory(await res.json());
            } catch (e) {
                console.error("Failed to fetch history");
            }
        };
        fetchHistory();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Save to history
        await fetch("/api/search/history", {
            method: "POST",
            body: JSON.stringify({ query }),
        });

        // Redirect or filter (Mock behavior for now)
        console.log("Searching for:", query);
        setShowHistory(false);
        setIsFocused(false);
    };

    return (
        <div className="relative max-w-2xl w-full mx-auto z-30">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        setShowHistory(true);
                        setIsFocused(true);
                    }}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-full leading-5 bg-white/50 text-deep-brown placeholder-mocha-mousse/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-peach-fuzz sm:text-lg transition-all duration-300 backdrop-blur-md shadow-sm"
                    placeholder="Find your way home..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-mocha-mousse" />
                </div>
            </form>

            {/* History Dropdown */}
            <AnimatePresence>
                {showHistory && history.length > 0 && isFocused && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-xl overflow-hidden shadow-2xl"
                    >
                        <div className="px-4 py-2 text-xs font-black text-mocha-mousse uppercase tracking-widest border-b border-gray-100">
                            Recent Paths
                        </div>
                        {history.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setQuery(item.query);
                                    setShowHistory(false);
                                }}
                                className="w-full text-left px-4 py-3 text-deep-brown hover:bg-peach-fuzz/20 transition flex items-center gap-2 font-medium"
                            >
                                <span className="opacity-50 text-mocha-mousse">↺</span>
                                {item.query}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
