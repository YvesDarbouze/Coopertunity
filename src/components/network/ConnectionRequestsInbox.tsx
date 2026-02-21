"use client";

import { useState, useEffect } from "react";
import { UserPlus, Briefcase, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import clsx from "clsx";

type ConnectionRequest = {
    id: string;
    type: "PERSONAL" | "BUSINESS" | null;
    status: string;
    createdAt: string;
    sender: {
        id: string;
        name: string | null;
        profession: string | null;
        image: string | null;
    };
};

export default function ConnectionRequestsInbox({ onEmpty }: { onEmpty?: () => void }) {
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"PERSONAL" | "BUSINESS">("PERSONAL");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const res = await fetch("/api/network/connections");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
                if (data.length === 0 && onEmpty) onEmpty();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId: string, action: "ACCEPTED" | "REJECTED") => {
        // Optimistic Remove
        setRequests(prev => prev.filter(req => req.id !== requestId));
        try {
            await fetch("/api/network/connections", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, action })
            });

            // Check if fully empty after optimisic removal
            if (requests.length <= 1 && onEmpty) onEmpty();

        } catch (e) {
            console.error("Failed to update connection state", e);
        }
    };

    // Filter requests into the active buckets. Default to PERSONAL if type is null.
    const filteredRequests = requests.filter(req =>
        (activeTab === "PERSONAL" && (req.type === "PERSONAL" || !req.type)) ||
        (activeTab === "BUSINESS" && req.type === "BUSINESS")
    );

    if (loading) {
        return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-300" /></div>;
    }

    if (requests.length === 0) {
        return null; // Don't render if completely empty
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            {/* Header Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50">
                <button
                    onClick={() => setActiveTab("PERSONAL")}
                    className={clsx(
                        "flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition transition-colors relative",
                        activeTab === "PERSONAL" ? "text-emerald-700 bg-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                    )}
                >
                    <UserPlus size={18} /> Personal
                    {activeTab === "PERSONAL" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full relative" style={{ bottom: '-1px' }} />}
                </button>
                <button
                    onClick={() => setActiveTab("BUSINESS")}
                    className={clsx(
                        "flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition transition-colors relative border-l border-gray-100",
                        activeTab === "BUSINESS" ? "text-amber-700 bg-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                    )}
                >
                    <Briefcase size={18} /> Business / Project
                    {activeTab === "BUSINESS" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full relative" style={{ bottom: '-1px' }} />}
                </button>
            </div>

            {/* Content Inbox */}
            <div className="p-4 max-h-[300px] overflow-y-auto">
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm font-medium">No pending {activeTab.toLowerCase()} requests.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredRequests.map(req => (
                            <div key={req.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition">
                                <img
                                    src={req.sender.image || `https://ui-avatars.com/api/?name=${req.sender.name || 'U'}&background=random`}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{req.sender.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{req.sender.profession || "Professional"}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">{new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => handleAction(req.id, "REJECTED")}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleAction(req.id, "ACCEPTED")}
                                        className={clsx(
                                            "p-2 rounded-full transition",
                                            activeTab === "PERSONAL" ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                                        )}
                                    >
                                        <CheckCircle2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
