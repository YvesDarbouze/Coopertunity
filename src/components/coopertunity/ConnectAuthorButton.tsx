"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ConnectAuthorButton({ coopertunityId }: { coopertunityId: string }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [connected, setConnected] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            const res = await fetch("/api/interactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetId: coopertunityId,
                    targetType: "COOPERTUNITY",
                    action: "CONNECT"
                })
            });

            if (res.ok) {
                toast.success("Connection request sent! They will be notified.");
                setConnected(true);
            } else {
                toast.error("Failed to send request.");
            }
        } catch (e) {
            toast.error("Internal Server Error");
        } finally {
            setIsConnecting(false);
        }
    };

    if (connected) {
        return (
            <button disabled className="w-full bg-pan-green text-white font-black py-3 rounded-xl shadow-sm opacity-90 cursor-not-allowed">
                Request Sent ✓
            </button>
        );
    }

    return (
        <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-deep-brown hover:bg-pan-charcoal text-white font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isConnecting ? <Loader2 className="animate-spin w-5 h-5" /> : "Connect & Apply"}
        </button>
    );
}
