"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccessDenied() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
            <ShieldAlert className="w-20 h-20 text-pan-gold mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Access Restricted</h1>
            <p className="text-xl text-gray-400 max-w-lg mb-8">
                Posting new Coopertunities is reserved for community members identified as African to ensure the integrity of our mission: "Africa for the Africans".
            </p>
            <div className="flex gap-4">
                <Link href="/" className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full font-medium transition">
                    Return Home
                </Link>
                <Link href="/articles" className="bg-pan-green hover:bg-green-800 text-white px-6 py-3 rounded-full font-medium transition">
                    Read Articles
                </Link>
            </div>
        </div>
    );
}
