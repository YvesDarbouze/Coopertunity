"use client";

import { useState, useEffect } from "react";
import { MessageCircle, UserPlus } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Reuse base Notification Interface
interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    linkUrl?: string;
    createdAt: string;
}

export function MessageBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [standard, setStandard] = useState<Notification[]>([]);
    const [requestCount, setRequestCount] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const res = await fetch("/api/notifications");
                if (res.ok) {
                    const data = await res.json();
                    setStandard(data.standard ?? []);
                    setRequestCount((data.requests ?? []).length);
                    setUnreadCount(data.unreadCountStandard ?? 0);
                }
            } catch (e) {
                console.error("Failed to load standard notifications", e);
            }
        }
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string, linkUrl?: string) => {
        setStandard(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId: id }),
        });
        setIsOpen(false);
        if (linkUrl) router.push(linkUrl);
    };

    const markAllRead = async () => {
        setStandard(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(requestCount); // Cannot mark connection requests read via this endpoint yet
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markAllRead: true, tier: 'TIER_2' }), // Will also clear TIER_3 if we extend the API later
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-emerald-50 transition text-deep-brown hover:text-emerald-700"
            >
                <MessageCircle size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-heading font-black text-deep-brown text-sm">Messages</h3>
                                <div className="flex items-center gap-3">
                                    {unreadCount > requestCount && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-[10px] text-emerald-600 hover:text-deep-brown hover:underline font-bold transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {/* Dedicated space for Connection Requests (Tier 2 Actionable) */}
                                {requestCount > 0 && (
                                    <Link
                                        href="/dashboard/network"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 bg-emerald-50 border-b border-emerald-100 hover:bg-emerald-100 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <UserPlus size={16} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-xs font-bold text-emerald-800 flex-1">
                                            {requestCount} new connection request{requestCount !== 1 ? "s" : ""}
                                        </span>
                                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Review</span>
                                    </Link>
                                )}

                                {standard.length === 0 && requestCount === 0 ? (
                                    <div className="p-6 text-center text-mocha-mousse text-xs font-medium">
                                        No recent messages.
                                    </div>
                                ) : (
                                    standard.slice(0, 6).map(notif => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id, notif.linkUrl)}
                                            className={clsx(
                                                "p-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer",
                                                !notif.isRead && "bg-gray-50/80"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={clsx("font-bold text-sm", !notif.isRead ? "text-deep-brown" : "text-gray-400")}>
                                                    {notif.title}
                                                </span>
                                                {!notif.isRead && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 ml-2" />
                                                )}
                                            </div>
                                            <p className="text-xs text-mocha-mousse line-clamp-2">{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <Link
                                href="/dashboard/inbox"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-1 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors border-t border-gray-100"
                            >
                                Open Message Inbox →
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
