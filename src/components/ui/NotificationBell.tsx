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
    read: boolean;
    link?: string;
    createdAt: string;
}

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [requestCount, setRequestCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const res = await fetch("/api/notifications");
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data.notifications ?? []);
                    setRequestCount((data.requests ?? []).length);
                }
            } catch (e) {
                console.error("Failed to load notifications", e);
            }
        }
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length + requestCount;

    const markAsRead = async (id: string, link?: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setIsOpen(false);
        if (link) router.push(link);
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markAllRead: true }),
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition text-deep-brown hover:text-mocha-mousse"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm" />
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
                                <h3 className="font-heading font-black text-deep-brown text-sm">Notifications</h3>
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

                            <div className="max-h-[300px] overflow-y-auto">
                                {requestCount > 0 && (
                                    <Link
                                        href="/inbox?tab=requests"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2.5 bg-violet-50 border-b border-violet-100 hover:bg-violet-100 transition-colors"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                                        <span className="text-xs font-bold text-violet-700 flex-1">
                                            {requestCount} pending connection request{requestCount !== 1 ? "s" : ""}
                                        </span>
                                        <span className="text-[10px] text-violet-400">View →</span>
                                    </Link>
                                )}

                                {notifications.length === 0 && requestCount === 0 ? (
                                    <div className="p-4 text-center text-mocha-mousse text-xs font-medium">
                                        No notifications yet.
                                    </div>
                                ) : (
                                    notifications.slice(0, 6).map(notif => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id, notif.link)}
                                            className={clsx(
                                                "p-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer",
                                                !notif.read && "bg-peach-fuzz/10"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={clsx("font-bold text-sm", !notif.read ? "text-deep-brown" : "text-gray-400")}>
                                                    {notif.title}
                                                </span>
                                                {!notif.read && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 ml-2" />
                                                )}
                                            </div>
                                            <p className="text-xs text-mocha-mousse line-clamp-2">{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer → Inbox */}
                            <Link
                                href="/inbox"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-1 py-3 text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors border-t border-gray-100"
                            >
                                View all in Inbox →
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
