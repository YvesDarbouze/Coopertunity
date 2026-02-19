"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Bell, Star, Users, MessageSquare, CheckCheck,
    Loader2, HandshakeIcon, ArrowRight, Check, X, Inbox
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Notification = {
    id: string;
    title: string;
    message: string;
    read: boolean;
    type: string;  // "MATCH" | "SYSTEM" | "INTERACTION"
    link?: string;
    createdAt: string;
};

type Sender = {
    id: string;
    name: string | null;
    image: string | null;
    profession: string | null;
};

type ConnectionRequest = {
    id: string;
    senderId: string;
    createdAt: string;
    sender: Sender;
};

type Tab = "all" | "unread" | "requests";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function NotifIcon({ type }: { type: string }) {
    const base = "w-9 h-9 rounded-full flex items-center justify-center shrink-0";
    switch (type) {
        case "MATCH":
            return <div className={clsx(base, "bg-amber-100")}><Star size={16} className="text-amber-600" /></div>;
        case "INTERACTION":
            return <div className={clsx(base, "bg-emerald-100")}><Users size={16} className="text-emerald-600" /></div>;
        case "SYSTEM":
            return <div className={clsx(base, "bg-blue-100")}><Bell size={16} className="text-blue-500" /></div>;
        default:
            return <div className={clsx(base, "bg-gray-100")}><MessageSquare size={16} className="text-gray-500" /></div>;
    }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InboxPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [requests, setRequests] = useState<ConnectionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("all");
    const [actioning, setActioning] = useState<Record<string, boolean>>({});

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications ?? []);
                setRequests(data.requests ?? []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const markRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markAllRead: true }),
        });
    };

    const handleRequest = async (requestId: string, senderId: string, action: "ACCEPT" | "REJECT") => {
        setActioning(prev => ({ ...prev, [requestId]: true }));
        try {
            const res = await fetch("/api/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId: senderId, action }),
            });
            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== requestId));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setActioning(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const requestCount = requests.length;

    // Build items for "all" and "unread" tabs — merge notifications + requests as a unified feed
    const allItems = [
        ...notifications.map(n => ({ ...n, _kind: "notification" as const })),
        ...requests.map(r => ({
            id: r.id,
            title: `${r.sender.name ?? "Someone"} wants to connect`,
            message: r.sender.profession ?? "Sent you a connection request.",
            read: false,
            type: "CONNECTION_REQUEST",
            createdAt: r.createdAt,
            _kind: "request" as const,
            _request: r,
        })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const displayItems = tab === "unread" ? allItems.filter(i => !i.read) : allItems;

    const TABS: { key: Tab; label: string; count?: number }[] = [
        { key: "all", label: "All", count: allItems.length },
        { key: "unread", label: "Unread", count: unreadCount },
        { key: "requests", label: "Requests", count: requestCount },
    ];

    return (
        <div className="min-h-screen bg-[#F5F3EF]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3D2B1F] to-[#5C3D2E] text-white px-6 py-10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <Inbox size={22} className="text-amber-300" />
                        <p className="text-amber-300 text-sm font-semibold uppercase tracking-widest">Inbox</p>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
                    <p className="text-white/60 mt-1 text-sm">Stay on top of matches, connections, and activity.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Tab bar + Mark all read */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                                    tab === t.key
                                        ? "bg-[#3D2B1F] text-white shadow"
                                        : "text-gray-500 hover:text-gray-800"
                                )}
                            >
                                {t.label}
                                {!!t.count && t.count > 0 && (
                                    <span className={clsx(
                                        "text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center",
                                        tab === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                                    )}>
                                        {t.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {unreadCount > 0 && tab !== "requests" && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                        >
                            <CheckCheck size={14} />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-gray-400">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Loading…
                    </div>
                ) : tab === "requests" ? (
                    /* ── Requests Tab ── */
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <EmptyState
                                icon={<Users size={36} className="opacity-30" />}
                                title="No pending requests"
                                body="When someone wants to connect with you, they'll appear here."
                            />
                        ) : (
                            requests.map(req => (
                                <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                                    {req.sender.image ? (
                                        <img src={req.sender.image} alt={req.sender.name ?? ""} className="w-11 h-11 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800 uppercase shrink-0">
                                            {req.sender.name?.[0] ?? "?"}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm">{req.sender.name ?? "Unknown"}</p>
                                        {req.sender.profession && (
                                            <p className="text-xs text-gray-400">{req.sender.profession}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(req.createdAt)}</p>
                                    </div>
                                    <Link
                                        href={`/profile/${req.sender.id}`}
                                        className="text-xs text-amber-700 font-semibold hover:underline shrink-0 flex items-center gap-1"
                                    >
                                        View <ArrowRight size={12} />
                                    </Link>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            disabled={actioning[req.id]}
                                            onClick={() => handleRequest(req.id, req.senderId, "REJECT")}
                                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40"
                                        >
                                            <X size={14} />
                                        </button>
                                        <button
                                            disabled={actioning[req.id]}
                                            onClick={() => handleRequest(req.id, req.senderId, "ACCEPT")}
                                            className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors disabled:opacity-40"
                                        >
                                            {actioning[req.id]
                                                ? <Loader2 size={12} className="animate-spin" />
                                                : <Check size={14} />
                                            }
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* ── All / Unread Tab ── */
                    <div className="space-y-2">
                        {displayItems.length === 0 ? (
                            <EmptyState
                                icon={<Bell size={36} className="opacity-30" />}
                                title={tab === "unread" ? "All caught up!" : "No notifications yet"}
                                body={tab === "unread" ? "You have no unread notifications." : "We'll notify you about matches, connections, and activity here."}
                            />
                        ) : (
                            displayItems.map(item => {
                                if (item._kind === "request") {
                                    const req = (item as any)._request as ConnectionRequest;
                                    return (
                                        <div key={item.id} className={clsx(
                                            "bg-white rounded-xl border shadow-sm p-4 flex items-start gap-3 transition-all",
                                            !item.read ? "border-amber-200 bg-amber-50/30" : "border-gray-100"
                                        )}>
                                            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                                <HandshakeIcon size={16} className="text-violet-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(item.createdAt)}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0 mt-0.5">
                                                <button onClick={() => handleRequest(req.id, req.senderId, "REJECT")} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors">
                                                    <X size={12} />
                                                </button>
                                                <button onClick={() => handleRequest(req.id, req.senderId, "ACCEPT")} className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
                                                    <Check size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                const notif = item as Notification & { _kind: "notification" };
                                const Inner = (
                                    <div
                                        key={notif.id}
                                        onClick={() => !notif.read && markRead(notif.id)}
                                        className={clsx(
                                            "bg-white rounded-xl border shadow-sm p-4 flex items-start gap-3 transition-all",
                                            !notif.read
                                                ? "border-amber-200 bg-amber-50/30 cursor-pointer hover:bg-amber-50/60"
                                                : "border-gray-100"
                                        )}
                                    >
                                        <NotifIcon type={notif.type} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={clsx("text-sm font-bold", notif.read ? "text-gray-500" : "text-gray-900")}>
                                                    {notif.title}
                                                </p>
                                                <span className="text-[10px] text-gray-400 shrink-0">{timeAgo(notif.createdAt)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                        </div>
                                        {!notif.read && (
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        )}
                                    </div>
                                );

                                return notif.link ? (
                                    <Link key={notif.id} href={notif.link} onClick={() => !notif.read && markRead(notif.id)}>
                                        {Inner}
                                    </Link>
                                ) : (
                                    <div key={notif.id}>{Inner}</div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
    return (
        <div className="text-center py-20 text-gray-400">
            <div className="flex justify-center mb-3">{icon}</div>
            <p className="font-bold text-gray-600 mb-1">{title}</p>
            <p className="text-sm max-w-xs mx-auto">{body}</p>
        </div>
    );
}
