"use client";

import { useState } from "react";
import OnboardingForm from "@/components/profile/OnboardingForm";
import OnboardingWalkthrough from "@/components/onboarding/OnboardingWalkthrough";

export default function OnboardingPage() {
    const [showWalkthrough, setShowWalkthrough] = useState(true);

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            {showWalkthrough ? (
                <OnboardingWalkthrough onComplete={() => setShowWalkthrough(false)} />
            ) : (
                <OnboardingForm />
            )}
        </main>
    );
}
