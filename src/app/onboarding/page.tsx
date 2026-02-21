"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import ProfessionalDNAForm from "@/components/onboarding/ProfessionalDNAForm";
import DutyFlagsForm from "@/components/onboarding/DutyFlagsForm";
import GatekeeperPrompt from "@/components/onboarding/GatekeeperPrompt";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();

    const [gateKeeperPassed, setGateKeeperPassed] = useState(false);
    const [dnaPassed, setDnaPassed] = useState(false);

    // If unauthenticated, they shouldn't be here
    if (status === "unauthenticated") {
        router.replace("/");
        return null;
    }

    const handleFinalComplete = async () => {
        // Form now handles its own save during submit inside DutyFlagsForm
        // We just need to force session update and route
        await update({ onboarded: true });
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

    const handleDNAComplete = () => {
        setDnaPassed(true);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cloud-dancer">
                <Loader2 className="w-12 h-12 text-pan-gold animate-spin" />
            </div>
        );
    }

    // Determine sequence
    // 1. If not isAfrican, show Gatekeeper
    const showGatekeeper = !gateKeeperPassed && session?.user?.isAfrican !== true;

    if (showGatekeeper) {
        return <GatekeeperPrompt onDecision={handleGatekeeperDecision} />;
    }

    // 2. If Passed Gatekeeper but NOT DNA, show DNA
    if (!dnaPassed) {
        return <ProfessionalDNAForm onComplete={handleDNAComplete} />;
    }

    // 3. If Passed Both, show Final Duty Flags
    return <DutyFlagsForm onComplete={handleFinalComplete} />;
}
