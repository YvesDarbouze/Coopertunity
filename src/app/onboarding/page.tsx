"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingWalkthrough from "@/components/onboarding/OnboardingWalkthrough";
import { Loader2 } from "lucide-react";

import GatekeeperPrompt from "@/components/onboarding/GatekeeperPrompt";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [isSaving, setIsSaving] = useState(false);
    const [gateKeeperPassed, setGateKeeperPassed] = useState(false);

    // If unauthenticated, they shouldn't be here
    if (status === "unauthenticated") {
        router.replace("/");
        return null;
    }

    const handleWalkthroughComplete = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ onboarded: true }),
            });

            if (res.ok) {
                // Force NextAuth to pull fresh session data
                await update({ onboarded: true });
                // Route them to the promised land
                router.push("/dashboard");
            } else {
                console.error("Failed to update onboarding status");
                setIsSaving(false);
            }
        } catch (error) {
            console.error("Error saving onboarding status:", error);
            setIsSaving(false);
        }
    };

    const handleGatekeeperDecision = async (isAfrican: boolean) => {
        // Force session update specifically to capture the isAfrican status for the DB
        await update();

        if (isAfrican) {
            setGateKeeperPassed(true);
        } else {
            // Route to dashboard for Observer (API already set onboarded: true)
            // Force update one more time to catch onboarded
            await update({ onboarded: true, isAfrican: false });
            router.push("/dashboard");
        }
    };

    if (status === "loading" || isSaving) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cloud-dancer">
                <Loader2 className="w-12 h-12 text-pan-gold animate-spin" />
            </div>
        );
    }

    // Determine if we need to show Gatekeeper vs Walkthrough
    // If session.user.isAfrican is true, they already passed gatekeeper in a previous session but didn't finish DNA.
    const showGatekeeper = !gateKeeperPassed && session?.user?.isAfrican !== true;

    if (showGatekeeper) {
        return <GatekeeperPrompt onDecision={handleGatekeeperDecision} />;
    }

    return <OnboardingWalkthrough onComplete={handleWalkthroughComplete} />;
}
