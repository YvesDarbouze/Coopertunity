import { Suspense } from "react";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import InboxClient from "./InboxClient";

export const metadata: Metadata = {
    title: "Network Inbox",
    description: "Manage your direct messages and network communications.",
};

export default function InboxPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-[#F5F3EF]">
                <Loader2 className="w-8 h-8 text-pan-gold animate-spin" />
            </div>
        }>
            <InboxClient />
        </Suspense>
    );
}
