"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function GatekeeperModal() {
    const { data: session, update } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // If user is logged in but hasn't answered the gatekeeper question
        if (session?.user && session.user.isAfrican === undefined) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setIsOpen(true);
        }
    }, [session]);

    const handleAnswer = async (isAfrican: boolean) => {
        // Optimistically update session/local state
        await update({ isAfrican });

        // In a real app, this would persist to DB via API
        await fetch('/api/user/gatekeeper', { method: 'POST', body: JSON.stringify({ isAfrican }) });

        setIsOpen(false);

        if (!isAfrican) {
            // Observer Access
            router.push("/articles"); // Redirect to content-only view
        } else {
            // Full Access
            router.push("/onboarding"); // Continue to profile completion
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-brown/80 backdrop-blur-md p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-cloud-dancer border border-peach-fuzz/50 rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pan-green via-peach-fuzz to-pan-red" />

                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 bg-peach-fuzz/20 rounded-full flex items-center justify-center border border-peach-fuzz/50">
                                <Globe className="w-10 h-10 text-deep-brown" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-heading font-black text-deep-brown mb-4 uppercase tracking-wide">
                            The Gatekeeper
                        </h2>

                        <p className="text-xl text-mocha-mousse font-serif italic mb-8 leading-relaxed font-bold">
                            &quot;Do you identify as a member of the Global African Community?&quot;
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleAnswer(true)}
                                className="group p-6 rounded-xl border border-peach-fuzz/50 bg-peach-fuzz/20 hover:bg-peach-fuzz hover:shadow-lg transition-all duration-300"
                            >
                                <div className="font-heading font-black text-xl mb-1 text-deep-brown group-hover:text-pan-charcoal">YES</div>
                                <div className="text-xs text-mocha-mousse group-hover:text-pan-charcoal font-bold">
                                    I am of African descent or citizenship.
                                </div>
                            </button>

                            <button
                                onClick={() => handleAnswer(false)}
                                className="group p-6 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
                            >
                                <div className="font-heading font-black text-xl mb-1 text-deep-brown">NO</div>
                                <div className="text-xs text-mocha-mousse font-bold">
                                    I am an ally or observer.
                                </div>
                            </button>
                        </div>

                        <p className="mt-8 text-[10px] text-mocha-mousse/60 uppercase tracking-widest font-bold">
                            Honesty is the foundation of our community.
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
