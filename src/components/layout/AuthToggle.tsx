"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { MessageBubble } from "@/components/ui/MessageBubble";
import { useAuthModal } from "@/contexts/AuthModalContext";

export default function AuthToggle() {
    const { data: session } = useSession();

    const { openModal } = useAuthModal();

    if (session) {
        return (
            <div className="flex items-center gap-5">
                {/* The Tiered Notification Center */}
                <div className="flex items-center gap-1">
                    <MessageBubble />
                    <NotificationBell />
                </div>

                <div className="h-4 w-px bg-pan-black/10"></div>

                <Link
                    href="/dashboard"
                    className="text-pan-gold font-bold uppercase tracking-wider text-sm hover:text-pan-terracotta transition-colors"
                >
                    Dashboard
                </Link>
            </div>
        );
    }

    return (
        <button
            onClick={openModal}
            className="text-pan-gold font-bold uppercase tracking-wider text-sm hover:text-pan-terracotta transition-colors"
        >
            Sign In
        </button>
    );
}
