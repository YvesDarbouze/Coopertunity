"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import ProfessionalDNAForm from "@/components/onboarding/ProfessionalDNAForm";

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
        // Form now handles its own save during submit inside ProfessionalDNAForm
        // We just need to force session update and route
        // Force NextAuth to pull fresh session data (which might contain the new DB state, depending on session callback)
        await update({ onboarded: true });
        // Route them to the promised land
        router.push("/dashboard");
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

    // Determine if we need to show Gatekeeper vs DNA Builder
    // If session.user.isAfrican is true, they already passed gatekeeper in a previous session but didn't finish DNA.
    const showGatekeeper = !gateKeeperPassed && session?.user?.isAfrican !== true;

    if (showGatekeeper) {
        return <GatekeeperPrompt onDecision={handleGatekeeperDecision} />;
    }

    return <ProfessionalDNAForm onComplete={handleWalkthroughComplete} />;
}
