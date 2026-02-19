"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CoopertunityCard from "@/components/coopertunity/CoopertunityCard";
import UserCard from "@/components/profile/UserCard";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import { FeedModal } from "@/components/feed/FeedModal";

export default function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (term: string) => {
        setLoading(true);
        try {
            // Mocking a unified search API for now
            // In a real app, this would hit /api/search?q=... which aggregates Users and Coopertunities
            // For now, let's simulate mixed results

            // Simulating API latency
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockResults = [
                { type: "USER", id: "u1", name: "Dr. Kwame Osei", profession: "Agronomist", location: "Accra, Ghana", isVeteran: false, isAfrican: true, image: null },
                { type: "COOP", id: "c1", title: "Cocoa Processing Plant", sector: "SECONDARY", description: "Seeking investment for expansion of cocoa processing facility in Kumasi.", location: "Kumasi, Ghana", author: { name: "Akosua Mensah" }, createdAt: new Date() },
                { type: "USER", id: "u2", name: "Sarah Jones", profession: "Civil Engineer", location: "London, UK", isVeteran: true, isAfrican: false, image: null },
                { type: "COOP", id: "c2", title: "Gold Mine Concession", sector: "PRIMARY", description: "Small scale mining concession rights available for joint venture.", location: "Tarkwa, Ghana", author: { name: "Kofi Annan" }, createdAt: new Date() },
                { type: "COOP", id: "c3", title: "Tech Hub Investment", sector: "QUATERNARY", description: "Seed funding round for Lagos-based fintech startup.", location: "Lagos, Nigeria", author: { name: "Chioma Okereke" }, createdAt: new Date() },
                { type: "USER", id: "u3", name: "Amara Diop", profession: "Logistics Expert", location: "Dakar, Senegal", isVeteran: false, isAfrican: true, image: null },
            ];

            setResults(mockResults);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleAction = (action: string, item: any) => {
        console.log("Action:", action, item);
        setSelectedItem(null); // Close on action for now
    };

    return (
        <main className="min-h-screen bg-cloud-dancer pt-32 px-4 pb-12">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Search Header */}
                <div className="flex flex-col items-center space-y-6 mb-12">
                    <h1 className="text-3xl font-heading font-black text-deep-brown text-center uppercase tracking-tight">
                        Searching for <span className="text-peach-fuzz">"{query}"</span>
                    </h1>
                    <div className="w-full max-w-xl">
                        <HomeSearchBar />
                    </div>
                </div>

                {/* Masonry Grid */}
                {loading ? (
                    <div className="text-center text-deep-brown/60 font-medium py-20 font-body animate-pulse">Scanning the network...</div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {results.map((item, index) => (
                            <div key={index} className="break-inside-avoid">
                                {item.type === "USER" ? (
                                    <UserCard user={item} onClick={() => setSelectedItem(item)} />
                                ) : (
                                    <CoopertunityCard coopertunity={item} onClick={() => setSelectedItem(item)} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && results.length === 0 && (
                    <div className="text-center text-deep-brown/60 py-20 font-bold">No results found.</div>
                )}

                {/* Interaction Overlay */}
                <FeedModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAction={handleAction}
                />

            </div>
        </main>
    );
}
