"use client";

import { useEffect, useState } from "react";
import { FeedCard } from "@/components/feed/FeedCard"; // Reusing FeedCard for consistency
import { Loader2 } from "lucide-react";

interface DashboardData {
    matches: any[];
    posts: any[];
    saved: any[];
}

export default function UserDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white text-peach-fuzz">
                <Loader2 className="h-10 w-10 animate-spin text-deep-brown" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen pt-24 p-4 md:p-8 bg-cloud-dancer">
            <h1 className="text-4xl md:text-5xl font-black text-peach-fuzz mb-8 tracking-tighter drop-shadow-sm stroke-deep-brown" style={{ WebkitTextStroke: "1px #4A3427" }}>
                HOME BASE
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Matches */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold bg-white/50 p-4 rounded-xl border border-gray-200 flex items-center gap-2 text-deep-brown shadow-sm">
                        <span className="text-pan-green">●</span> My Matches
                    </h2>
                    <div className="space-y-4">
                        {data.matches.length === 0 ? (
                            <p className="text-gray-500 italic p-4">No matches yet. Keep exploring!</p>
                        ) : (
                            data.matches.map((match: any) => (
                                <div key={match.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                                            {match.image && <img src={match.image} alt={match.name} className="h-full w-full object-cover" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-deep-brown group-hover:text-mocha-mousse transition">{match.name}</h3>
                                            <p className="text-sm text-gray-500">{match.profession}</p>
                                        </div>
                                        <button className="ml-auto text-sm bg-mocha-mousse text-white px-4 py-1.5 rounded-full hover:bg-deep-brown transition font-bold shadow-md">
                                            Message
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Column 2: My Active Posts */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold bg-white/50 p-4 rounded-xl border border-gray-200 flex items-center gap-2 text-deep-brown shadow-sm">
                        <span className="text-peach-fuzz">●</span> Active Posts
                    </h2>
                    <div className="space-y-4">
                        {data.posts.length === 0 ? (
                            <p className="text-gray-500 italic p-4">You haven't posted any Coopertunities yet.</p>
                        ) : (
                            data.posts.map((post: any) => (
                                <div key={post.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-lg">
                                    <h3 className="font-bold text-lg text-deep-brown">{post.title}</h3>
                                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{post.type}</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 bg-gray-100 text-deep-brown py-2 rounded-lg hover:bg-gray-200 transition font-bold text-sm">Edit</button>
                                        <button className="flex-1 bg-gray-100 text-deep-brown py-2 rounded-lg hover:bg-gray-200 transition font-bold text-sm">Stats</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Column 3: Saved for Later */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold bg-white/50 p-4 rounded-xl border border-gray-200 flex items-center gap-2 text-deep-brown shadow-sm">
                        <span className="text-blue-400">●</span> Saved / Watching
                    </h2>
                    <div className="space-y-4">
                        {data.saved.length === 0 ? (
                            <p className="text-gray-500 italic p-4">Nothing saved yet.</p>
                        ) : (
                            data.saved.map((item: any) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-deep-brown">Saved Item</p>
                                        <p className="text-xs text-gray-500">{item.createdAt}</p>
                                    </div>
                                    <button className="text-xs text-red-400 hover:text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Remove</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
