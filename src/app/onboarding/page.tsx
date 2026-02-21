"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingWalkthrough from "@/components/onboarding/OnboardingWalkthrough";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const [isSaving, setIsSaving] = useState(false);

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
                // Force NextAuth to pull fresh session data (which might contain the new DB state, depending on session callback)
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

    if (status === "loading" || isSaving) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cloud-dancer">
                <Loader2 className="w-12 h-12 text-pan-gold animate-spin" />
            </div>
        );
    }

    return <OnboardingWalkthrough onComplete={handleWalkthroughComplete} />;
}
