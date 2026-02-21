import NetworkPageClient from "@/components/network/NetworkPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Network & Stakeholders",
    description: "Manage your professional connections and build project Stakeholders.",
};

export default function NetworkPage() {
    return <NetworkPageClient />;
}
