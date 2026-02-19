"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function AuthToggle() {
    const { data: session } = useSession();

    if (session) {
        return (
            <Link
                href="/dashboard"
                className="text-pan-gold font-bold uppercase tracking-wider text-sm hover:text-white transition-colors"
            >
                Dashboard
            </Link>
        );
    }

    return (
        <button
            onClick={() => signIn()}
            className="text-pan-gold font-bold uppercase tracking-wider text-sm hover:text-white transition-colors"
        >
            Sign In
        </button>
    );
}
