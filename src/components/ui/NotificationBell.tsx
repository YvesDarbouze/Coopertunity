"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    linkUrl?: string;
    createdAt: string;
}

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [tier1, setTier1] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        async function fetchNotifications() {
            try {
                const res = await fetch("/api/notifications");
                if (res.ok) {
                    const data = await res.json();
                    setTier1(data.tier1 ?? []);
                    setUnreadCount(data.unreadCountTier1 ?? 0);
                }
            } catch (e) {
                console.error("Failed to load notifications", e);
            }
        }

        fetchNotifications(); // Initial fetch

        intervalId = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const markAsRead = async (id: string, linkUrl?: string) => {
        setTier1(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
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
        setTier1(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markAllRead: true, tier: 'TIER_1' }),
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-peach-fuzz/20 transition text-deep-brown hover:text-pan-terracotta"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-peach-fuzz border-2 border-white rounded-full animate-pulse shadow-sm" />
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
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-peach-fuzz/10">
                                <h3 className="font-heading font-black text-pan-terracotta text-sm flex items-center gap-1">
                                    <Bell size={14} className="text-pan-gold" /> Opportunities
                                </h3>
                                <div className="flex items-center gap-3">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="text-[10px] text-pan-terracotta hover:text-deep-brown hover:underline font-bold transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto bg-white">
                                {tier1.length === 0 ? (
                                    <div className="p-6 text-center text-mocha-mousse text-xs font-medium">
                                        No recent matches found. Keep building your network!
                                    </div>
                                ) : (
                                    tier1.slice(0, 6).map(notif => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id, notif.linkUrl)}
                                            className={clsx(
                                                "p-3 border-b border-gray-50 hover:bg-peach-fuzz/5 transition cursor-pointer relative",
                                                !notif.isRead && "bg-peach-fuzz/10 shadow-sm"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-1 relative z-10">
                                                <span className={clsx("font-bold text-sm", !notif.isRead ? "text-pan-terracotta" : "text-gray-500")}>
                                                    {notif.title}
                                                </span>
                                                {!notif.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-peach-fuzz mt-1 shrink-0 ml-2 shadow-[0_0_8px_rgba(255,190,152,0.8)]" />
                                                )}
                                            </div>
                                            <p className="text-xs text-mocha-mousse line-clamp-2 relative z-10 font-medium">{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <Link
                                href="/dashboard/explore"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-1 py-3 text-xs font-bold text-pan-gold hover:bg-amber-50 transition-colors border-t border-gray-100 bg-gray-50"
                            >
                                Explore All Opportunities →
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
