
"use client";

import { Search } from "lucide-react";
import Link from "next/link";

// Prompt 41: 'No Results' State
export default function NoResults({ query }: { query?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Search className="text-peach-fuzz w-8 h-8 opacity-80" />
            </div>

            <h3 className="text-2xl font-heading font-black text-deep-brown mb-2">
                {query ? `No match for "${query}" yet.` : "No results found."}
            </h3>

            <p className="text-mocha-mousse font-medium font-body max-w-md mb-8 leading-relaxed">
                Be the first to create this Coopertunity. Post a need or offer a skill now to start the connection.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/create"
                    className="px-6 py-3 bg-peach-fuzz hover:bg-peach-fuzz/80 text-pan-charcoal font-bold rounded-xl transition active:scale-95 shadow-md"
                >
                    Post a Need
                </Link>
                <Link
                    href="/profile"
                    className="px-6 py-3 bg-white hover:bg-gray-50 text-deep-brown font-bold rounded-xl transition active:scale-95 border border-gray-200 shadow-sm"
                >
                    Offer a Skill
                </Link>
            </div>
        </div>
    );
}
