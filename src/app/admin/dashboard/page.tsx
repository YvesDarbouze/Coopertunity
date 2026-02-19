
"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, Ban, CheckCircle } from "lucide-react";
import clsx from "clsx";

// Mock Data for Prompt 32: Flagged Posts
const MOCK_FLAGGED = [
    {
        id: "1",
        title: "Exclusive Gold Deal - Send Cash Now",
        author: "Prince J.",
        reason: "Scam / Suspicious Payment Request",
        severity: "HIGH",
        status: "PENDING"
    },
    {
        id: "2",
        title: "Political Rant against X",
        author: "User123",
        reason: "Hate Speech / Political Incitement",
        severity: "MEDIUM",
        status: "PENDING"
    },
    {
        id: "3",
        title: "Cheap Land in Lekki",
        author: "RealEstateMogul",
        reason: "Potential Verification Issue",
        severity: "LOW",
        status: "PENDING"
    }
];

export default function AdminDashboard() {
    const [flaggedPosts, setFlaggedPosts] = useState(MOCK_FLAGGED);

    const handleAction = (id: string, action: "SUSPEND" | "DELETE" | "DISMISS") => {
        // In a real app, this would call an API
        console.log(`Admin Action: ${action} on Post ${id}`);
        setFlaggedPosts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="mb-10 border-b border-zinc-800 pb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-pan-gold">Governance Console</h1>
                    <p className="text-gray-400 mt-1">Community Moderation & Safety</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-pan-gold/10 text-pan-gold px-4 py-2 rounded-full border border-pan-gold/30 flex items-center gap-2 font-bold text-sm">
                        <CheckCircle size={16} />
                        1,240 Matches Made
                    </div>
                    <div className="bg-red-900/20 text-red-500 px-4 py-2 rounded-full border border-red-500/30 flex items-center gap-2 font-bold text-sm">
                        <AlertTriangle size={16} />
                        {flaggedPosts.length} Actions Required
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 bg-zinc-800/50">
                        <h2 className="text-xl font-bold font-heading">Flagged Content Queue</h2>
                    </div>

                    {flaggedPosts.length === 0 ? (
                        <div className="p-20 text-center text-gray-500">
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">All caught up! No flagged content.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {flaggedPosts.map((post) => (
                                <div key={post.id} className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                post.severity === "HIGH" ? "bg-red-500/20 text-red-500 border border-red-500/30" :
                                                    post.severity === "MEDIUM" ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" :
                                                        "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                                            )}>
                                                {post.severity}
                                            </span>
                                            <span className="text-xs text-gray-500">Reported for: <span className="text-white font-bold">{post.reason}</span></span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
                                        <p className="text-sm text-gray-400">Posted by: {post.author}</p>
                                    </div>

                                    <div className="flex items-center gap-3 ml-6">
                                        <button
                                            onClick={() => handleAction(post.id, "DISMISS")}
                                            className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition"
                                        >
                                            Dismiss
                                        </button>
                                        <button
                                            onClick={() => handleAction(post.id, "DELETE")}
                                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-lg transition flex items-center gap-2"
                                        >
                                            <Trash2 size={14} />
                                            Delete Post
                                        </button>
                                        <button
                                            onClick={() => handleAction(post.id, "SUSPEND")}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-lg shadow-red-900/20"
                                        >
                                            <Ban size={14} />
                                            Suspend User
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
