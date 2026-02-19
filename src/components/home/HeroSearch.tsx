"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search } from "lucide-react";
import AuthToggle from "@/components/layout/AuthToggle";
import clsx from "clsx";

export default function HeroSearch() {
    const { scrollY } = useScroll();
    const [isSticky, setIsSticky] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Transform values
    const searchWidth = useTransform(scrollY, [0, 200], ["100%", "90%"]); // Mobile full width
    const headerOpacity = useTransform(scrollY, [150, 200], [0, 1]);
    const headerTextY = useTransform(scrollY, [0, 100], [0, -50]);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsSticky(latest > 150);
        });
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <>
            {/* Persistent Header Background (Appears on Scroll) */}
            <motion.div
                style={{ opacity: headerOpacity }}
                className="fixed top-0 left-0 w-full h-20 bg-cloud-dancer/95 backdrop-blur-md z-40 border-b border-pan-black/10 flex items-center justify-between px-8"
            >
                <div className="text-pan-black font-heading font-black text-xl tracking-tighter">COOPERTUNITY</div>
                <AuthToggle />
            </motion.div>

            {/* Main Hero Container - Centered & Dominant */}
            <div className="relative h-[80vh] w-full flex flex-col items-center justify-center p-6 text-center bg-cloud-dancer">

                {/* Main Heading - The Hook */}
                <motion.h1
                    style={{ y: headerTextY, opacity: useTransform(scrollY, [0, 150], [1, 0]) }}
                    className="font-heading font-black text-pan-black text-[32px] md:text-6xl lg:text-7xl mb-12 uppercase leading-tight tracking-tighter max-w-4xl z-10"
                >
                    Where Africans find solutions, <br className="hidden md:block" />
                    <span className="text-pan-black/60">and each other.</span>
                </motion.h1>

                {/* Sign In Toggle (Initial Position) */}
                <motion.div
                    style={{ opacity: useTransform(scrollY, [0, 50], [1, 0]) }}
                    className="absolute top-8 right-8 z-50"
                >
                    <AuthToggle />
                </motion.div>

                {/* Search Component - The Interaction */}
                <motion.div
                    style={{
                        width: isSticky ? "100%" : "100%",
                        maxWidth: isSticky ? "100%" : "600px",
                    }}
                    className={clsx(
                        "transition-all duration-300 z-30",
                        isSticky
                            ? "fixed top-0 left-0 right-0 px-4 py-2 bg-cloud-dancer shadow-xl border-b border-pan-black/10"
                            : "relative"
                    )}
                >
                    <div
                        className={clsx(
                            "group flex items-center px-6 h-16 md:h-20 bg-cloud-dancer border-2 transition-all duration-300",
                            isSticky ? "rounded-lg" : "rounded-full",
                            isFocused ? "border-peach-fuzz" : "border-pan-black"
                        )}
                    >
                        <Search className={clsx(
                            "w-6 h-6 mr-4 transition-colors",
                            isFocused ? "text-pan-black" : "text-pan-black/40"
                        )} />

                        <input
                            type="text"
                            placeholder="Find A Coopertunity"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full h-full bg-transparent outline-none text-xl font-heading font-bold text-pan-black placeholder:text-pan-black/30 placeholder:uppercase placeholder:tracking-wider placeholder:font-bold"
                        />
                    </div>
                </motion.div>

            </div>
        </>
    );
}
