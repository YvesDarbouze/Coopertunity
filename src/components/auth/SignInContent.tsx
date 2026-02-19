"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SignInContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signIn("google", { callbackUrl });
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-cloud-dancer p-4 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/50 via-cloud-dancer to-soft-gray/30 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 text-center"
            >
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-peach-fuzz/20 to-white rounded-full flex items-center justify-center border border-white/50 shadow-inner">
                        <Globe className="w-10 h-10 text-deep-brown" />
                    </div>
                </div>

                <h1 className="text-4xl font-heading font-black text-deep-brown mb-2 tracking-tight">Welcome Back</h1>
                <p className="text-deep-brown/60 font-medium mb-10 text-lg">Sign in to access your Coopertunities</p>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-soft-gray hover:border-deep-brown/30 text-deep-brown font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Connecting...</span>
                        ) : (
                            <>
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                                <span className="text-lg">Continue with Google</span>
                            </>
                        )}
                    </button>

                    <div className="relative py-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-deep-brown/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-transparent px-4 text-deep-brown/40 font-bold backdrop-blur-sm">Or</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setIsLoading(true);
                            signIn("linkedin", { callbackUrl });
                        }}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-[#0077b5] border border-[#0077b5] hover:bg-[#006097] text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span className="text-lg">Continue with LinkedIn</span>
                    </button>

                </div>

                <p className="mt-8 text-xs text-deep-brown/40 font-medium">
                    By signing in, you agree to our <Link href="#" className="underline hover:text-deep-brown">Terms</Link> and <Link href="#" className="underline hover:text-deep-brown">Privacy Policy</Link>.
                </p>
            </motion.div>
        </main>
    );
}
