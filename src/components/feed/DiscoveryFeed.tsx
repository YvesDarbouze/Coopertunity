"use client";

import { useState, useEffect } from "react";
import { FeedCard, FeedItem } from "./FeedCard";
import { FeedModal } from "./FeedModal";
import { Search, Globe, MapPin } from "lucide-react";
import clsx from "clsx";

export default function DiscoveryFeed() {
    const [activeTab, setActiveTab] = useState<"ALL" | "DIASPORA" | "CONTINENT">("ALL");
    const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
    const [items, setItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Real Data Fetching
    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/feed?filter=${activeTab}`);
                if (!res.ok) throw new Error("Failed to fetch feed");
                const data = await res.json();
                setItems(data);
            } catch (error) {
                console.error("Feed error:", error);
                // Fallback or error state could be handled here
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, [activeTab]);

    const filteredItems = items; // API handles filtering now

    const handleAction = async (action: string, item: FeedItem) => {
        // Optimistic UI update: Remove item if Pass/Connect
        if (action === "PASS" || action === "CONNECT") {
            setItems(prev => prev.filter(i => i.id !== item.id));
        }
        setSelectedItem(null); // Close modal

        try {
            await fetch("/api/interactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetId: item.id,
                    targetType: item.type, // USER, COOPERTUNITY
                    action
                })
            });
        } catch (error) {
            console.error("Interaction failed:", error);
            // Revert optimistic update if necessary
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Feed Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-black text-deep-brown">Discovery Feed</h2>
                    <p className="text-mocha-mousse font-medium">Curated opportunities and connections for you.</p>
                </div>

                {/* Filter Toggles */}
                <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setActiveTab("ALL")}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            activeTab === "ALL" ? "bg-peach-fuzz text-deep-brown shadow-sm" : "text-mocha-mousse hover:text-deep-brown hover:bg-gray-50"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveTab("DIASPORA")}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                            activeTab === "DIASPORA" ? "bg-peach-fuzz text-deep-brown shadow-sm" : "text-mocha-mousse hover:text-deep-brown hover:bg-gray-50"
                        )}
                    >
                        <Globe size={14} /> Diaspora
                    </button>
                    <button
                        onClick={() => setActiveTab("CONTINENT")}
                        className={clsx(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                            activeTab === "CONTINENT" ? "bg-peach-fuzz text-deep-brown shadow-sm" : "text-mocha-mousse hover:text-deep-brown hover:bg-gray-50"
                        )}
                    >
                        <MapPin size={14} /> The Continent
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-[350px] bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm" />
                    ))}
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                    {filteredItems.map((item) => (
                        <FeedCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedItem(item)}
                        />
                    ))}
                </div>
            ) : (
                /* No Results State */
                <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200 backdrop-blur-sm">
                    <div className="bg-peach-fuzz/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-deep-brown">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-deep-brown mb-2">No matches found yet.</h3>
                    <p className="text-mocha-mousse max-w-md mx-auto mb-6 font-medium">
                        You are the first pioneer here. Create a Coopertunity to start this wave.
                    </p>
                    <button className="bg-deep-brown text-white font-heading font-bold px-6 py-3 rounded-full hover:bg-mocha-mousse transition shadow-lg hover:shadow-xl">
                        Create Coopertunity
                    </button>
                </div>
            )}

            {/* Modal */}
            <FeedModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onAction={handleAction}
            />
        </div>
    );
}
