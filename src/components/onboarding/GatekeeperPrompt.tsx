"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Using sonner for toasts as standard in this project

interface GatekeeperPromptProps {
    onDecision: (isAfrican: boolean) => void;
}

export default function GatekeeperPrompt({ onDecision }: GatekeeperPromptProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDecision = async (isAfrican: boolean) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/user/gatekeeper", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAfrican }),
            });

            if (res.ok) {
                if (!isAfrican) {
                    toast.success("Thank you for your support. Coopertunity matchmaking is reserved for the Pan-African community, but you are welcome to read our public updates.", {
                        duration: 8000,
                    });
                }
                onDecision(isAfrican);
            } else {
                toast.error("Failed to save selection. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error setting gatekeeper:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cloud-dancer p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-3xl w-full text-center space-y-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-pan-black leading-tight tracking-tight">
                    Do you identify as a member of the Global African Community?
                </h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button
                        onClick={() => handleDecision(true)}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-5 rounded-full bg-pan-black text-cloud-dancer font-bold text-lg md:text-xl hover:bg-pan-black/90 transition-all flex items-center justify-center min-w-[280px]"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Yes, I am African / Diaspora"}
                    </button>

                    <button
                        onClick={() => handleDecision(false)}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-5 rounded-full border-2 border-pan-black text-pan-black bg-transparent font-bold text-lg md:text-xl hover:bg-pan-black hover:text-cloud-dancer transition-all flex items-center justify-center min-w-[280px]"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "No, I am an Ally/Observer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
