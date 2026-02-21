"use client";

import { useState, useEffect } from "react";
import { Eye, Plus, Loader2, Search, Trash2, X } from "lucide-react";
import clsx from "clsx";

type Watchlist = {
    id: string;
    title: string;
    sector: string | null;
    keywords: string[];
    hasNewAlerts: boolean;
    newAlertCount: number;
    lastChecked: string;
};

export default function WatchlistSidebar() {
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState("");
    const [newSector, setNewSector] = useState("");
    const [newKeyword, setNewKeyword] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);

    const SECTORS = ["PRIMARY", "SECONDARY", "TERTIARY", "QUATERNARY"]; // From Prisma Enum

    useEffect(() => {
        loadWatchlists();
    }, []);

    const loadWatchlists = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/network/watchlist");
            if (res.ok) setWatchlists(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newTitle.trim()) return;

        try {
            const res = await fetch("/api/network/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTitle,
                    sector: newSector || null,
                    keywords
                })
            });

            if (res.ok) {
                // Reset form
                setNewTitle("");
                setNewSector("");
                setKeywords([]);
                setIsCreating(false);
                loadWatchlists(); // Reload to get fresh data
            }
        } catch (e) {
            console.error(e);
        }
    };

    const addKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword("");
        }
    };

    const removeKeyword = (kw: string) => {
        setKeywords(keywords.filter(k => k !== kw));
    };

    const dismissAlerts = async (id: string) => {
        // Optimistic UI update
        setWatchlists(prev => prev.map(w => w.id === id ? { ...w, hasNewAlerts: false, newAlertCount: 0 } : w));

        try {
            await fetch("/api/network/watchlist", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ watchlistId: id })
            });
        } catch (e) {
            console.error("Failed to dismiss", e);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h2 className="font-black text-gray-900 flex items-center gap-2">
                    <Eye className="text-emerald-600" size={20} /> Watchlists
                </h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                >
                    {isCreating ? <X size={18} /> : <Plus size={18} />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

                {/* Creation Form */}
                {isCreating && (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mb-2 animate-in slide-in-from-top-2">
                        <input
                            type="text"
                            placeholder="Name (e.g., Mining Deals)"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            className="w-full text-sm p-2 rounded-lg border border-gray-200 mb-2 focus:outline-none focus:border-emerald-500"
                        />
                        <select
                            value={newSector}
                            onChange={e => setNewSector(e.target.value)}
                            className="w-full text-sm p-2 rounded-lg border border-gray-200 mb-2 bg-white outline-none focus:border-emerald-500"
                        >
                            <option value="">Any Sector</option>
                            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Add Keyword..."
                                value={newKeyword}
                                onChange={e => setNewKeyword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addKeyword()}
                                className="flex-1 text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500"
                            />
                            <button onClick={addKeyword} className="px-3 bg-gray-200 rounded-lg shrink-0 hover:bg-gray-300 transition text-gray-700">
                                <Plus size={16} />
                            </button>
                        </div>

                        {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {keywords.map(kw => (
                                    <span key={kw} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                                        {kw} <X size={12} className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => removeKeyword(kw)} />
                                    </span>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleCreate}
                            disabled={!newTitle.trim()}
                            className="w-full bg-emerald-600 text-white font-bold text-sm py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            Save Watchlist
                        </button>
                    </div>
                )}

                {/* List */}
                {loading ? (
                    <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-gray-300" /></div>
                ) : watchlists.length === 0 && !isCreating ? (
                    <div className="text-center py-8 text-gray-400">
                        <Search size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">No watchlists yet.</p>
                        <p className="text-xs mt-1">Track sectors and receive alerts.</p>
                    </div>
                ) : (
                    watchlists.map(wl => (
                        <div key={wl.id} className={clsx(
                            "border rounded-xl p-3 transition",
                            wl.hasNewAlerts ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-white hover:border-emerald-200"
                        )}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-sm text-gray-900">{wl.title}</h3>
                                {wl.hasNewAlerts && (
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                    </span>
                                )}
                            </div>

                            {(wl.sector || wl.keywords.length > 0) && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {wl.sector && <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{wl.sector}</span>}
                                    {wl.keywords.map(kw => (
                                        <span key={kw} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">{kw}</span>
                                    ))}
                                </div>
                            )}

                            {wl.hasNewAlerts ? (
                                <button
                                    onClick={() => dismissAlerts(wl.id)}
                                    className="w-full text-xs font-bold text-amber-700 bg-amber-100/50 hover:bg-amber-100 py-1.5 rounded-md transition text-center border border-amber-200/50"
                                >
                                    {wl.newAlertCount} New Matches &rarr;
                                </button>
                            ) : (
                                <p className="text-xs text-gray-400">Up to date.</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
