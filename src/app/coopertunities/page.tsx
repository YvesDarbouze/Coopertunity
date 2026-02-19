"use client";

import { useEffect, useState } from "react";
import CoopertunityCard from "@/components/coopertunity/CoopertunityCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function CoopertunitiesFeed() {
    const [coopertunities, setCoopertunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/coopertunities")
            .then((res) => res.json())
            .then((data) => {
                setCoopertunities(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-white text-center p-20">Loading Coopertunities...</div>;

    return (
        <main className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Coopertunities</h1>
                        <p className="text-gray-400">Discover projects and investments across the continent.</p>
                    </div>
                    <Link
                        href="/coopertunities/create"
                        className="flex items-center gap-2 bg-pan-gold hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold transition"
                    >
                        <Plus className="w-5 h-5" />
                        Post New
                    </Link>
                </div>

                {/* Filters could go here */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coopertunities.map((item: any) => (
                        <CoopertunityCard key={item.id} coopertunity={item} />
                    ))}

                    {coopertunities.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 border border-dashed border-zinc-800 rounded-xl">
                            No Coopertunities found. Be the first to post something!
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
