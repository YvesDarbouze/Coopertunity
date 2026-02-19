"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function HomeSearchBar() {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full mx-auto">
            <div className="relative group">
                <input
                    type="text"
                    className={clsx(
                        "w-full bg-white border-2 py-5 px-8 text-xl md:text-2xl font-body font-bold text-deep-brown outline-none transition-all duration-300 rounded-full shadow-sm",
                        isFocused
                            ? "border-deep-brown shadow-lg"
                            : "border-soft-gray"
                    )}
                    placeholder={isFocused ? "" : "Find A Coopertunity"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-deep-brown text-white p-3 rounded-full hover:bg-mocha-mousse transition-all duration-300"
                >
                    <Search size={20} />
                </button>
            </div>
        </form>
    );
}
