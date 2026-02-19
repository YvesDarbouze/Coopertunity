"use client";

import { useEffect, useState } from "react";
import { Copy, UserX, Trash2, CheckCircle, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/moderation");
            if (res.ok) {
                setStats(await res.json());
            } else {
                // Handle unauthorized
                setStats({ error: "Unauthorized" });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAction = async (targetId: string, action: string, type: string) => {
        if (!confirm(`Are you sure you want to ${action}?`)) return;

        try {
            await fetch("/api/admin/moderation", {
                method: "POST",
                body: JSON.stringify({ targetId, action, type })
            });
            fetchStats(); // Refresh
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;
    if (stats?.error) return <div className="p-10 text-center text-red-500">Access Denied</div>;

    return (
        <div className="min-h-screen bg-cloud-dancer text-deep-brown p-8 bg-[url('/noise.png')]">
            <h1 className="text-4xl font-black text-red-600 mb-8 border-b border-deep-brown/10 pb-4 tracking-tighter uppercase">
                SYSTEM ADMIN: GOD VIEW
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Moderation Queue */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-deep-brown">
                        <AlertTriangle className="text-amber-500" /> Flagged Content
                    </h2>
                    <div className="space-y-4">
                        {stats.flagged.length === 0 ? (
                            <p className="text-deep-brown/50 font-medium italic">No pending reports.</p>
                        ) : (
                            stats.flagged.map((report: any) => (
                                <div key={report.id} className="bg-white/60 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-red-500">{report.reason}</span>
                                        <span className="text-xs text-deep-brown/50 font-bold">{new Date(report.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-mocha-mousse mt-2">Target ID: {report.targetId}</p>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => handleAction(report.targetId, "BAN_USER", "USER")}
                                            className="bg-red-50/80 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1 font-bold transition"
                                        >
                                            <UserX className="h-4 w-4" /> Ban User
                                        </button>
                                        <button
                                            onClick={() => handleAction(report.targetId, "DELETE_POST", "COOPERTUNITY")}
                                            className="bg-amber-50/80 hover:bg-amber-100 text-amber-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1 font-bold transition"
                                        >
                                            <Trash2 className="h-4 w-4" /> Delete Post
                                        </button>
                                        <button className="bg-emerald-50/80 hover:bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-sm flex items-center gap-1 font-bold transition">
                                            <CheckCircle className="h-4 w-4" /> Ignore
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Live Feed Inspector */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-deep-brown">
                        <Copy className="text-blue-500" /> Recent Post Feed
                    </h2>
                    <div className="space-y-4">
                        {stats.recent.map((post: any) => (
                            <div key={post.id} className="bg-white/60 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-sm hover:shadow-md transition hover:-translate-y-1">
                                <h3 className="font-bold text-deep-brown">{post.title}</h3>
                                <p className="text-sm text-deep-brown/50 font-bold">by {post.author.name}</p>
                                <p className="text-sm mt-2 line-clamp-2 text-mocha-mousse">{post.description}</p>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={() => handleAction(post.id, "DELETE_POST", "COOPERTUNITY")}
                                        className="text-red-500 text-xs hover:underline flex items-center gap-1 font-bold"
                                    >
                                        <Trash2 className="h-3 w-3" /> Force Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
