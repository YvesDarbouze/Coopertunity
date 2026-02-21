"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Compass, Activity, Users, Home, PlusCircle, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthToggle from "./AuthToggle";
import clsx from "clsx";

export default function Header() {
    const { data: session } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isObserver = session?.user?.isAfrican === false;

    // Hide Header on Landing Page (handled by HeroSearch)
    if (pathname === "/") return null;

    return (
        <>
            {/* Floating Glass Island Header */}
            <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-0 pointer-events-none">
                <div className="max-w-7xl mx-auto pointer-events-auto">
                    <div className="bg-white/80 backdrop-blur-xl border border-pan-black/10 rounded-full px-6 py-3 shadow-lg flex justify-between items-center transition-all duration-300 hover:border-pan-black/20 hover:bg-white/90">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-pan-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="font-heading font-black text-white text-xl">C</span>
                            </div>
                            <span className="font-heading font-bold text-xl text-pan-black tracking-tight hidden md:block">
                                Coopertunity
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex items-center gap-6">
                                {[
                                    { name: "Explore", href: "/dashboard/explore", icon: Compass, restrictObserver: true },
                                    { name: "Matches", href: "/dashboard/matches", icon: Activity, restrictObserver: true },
                                    { name: "Network", href: "/dashboard/network", icon: Users, restrictObserver: true },
                                    { name: "Post", href: "/coopertunities/create", icon: PlusCircle, restrictObserver: true },
                                    { name: "Settings", href: "/dashboard/settings/profile", icon: Settings, restrictObserver: false },
                                ]
                                    .filter(link => !(isObserver && link.restrictObserver))
                                    .map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={clsx(
                                                "flex items-center gap-2 text-sm font-bold transition-colors duration-200",
                                                pathname === link.href ? "text-pan-gold" : "text-pan-black/70 hover:text-pan-black"
                                            )}
                                        >
                                            <link.icon size={18} />
                                            {link.name}
                                        </Link>
                                    ))}
                            </nav>

                            {/* Divider */}
                            <div className="h-6 w-px bg-pan-black/10"></div>

                            {/* Auth / Profile */}
                            <AuthToggle />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white p-2 rounded-full hover:bg-white/10 transition"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Panel (Full Screen Glass) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-28 px-6 md:hidden flex flex-col gap-6"
                    >
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: "Dashboard", href: "/dashboard", icon: Home, restrictObserver: false },
                                { name: "Explore", href: "/dashboard/explore", icon: Compass, restrictObserver: true },
                                { name: "Matches", href: "/dashboard/matches", icon: Activity, restrictObserver: true },
                                { name: "Network", href: "/dashboard/network", icon: Users, restrictObserver: true },
                                { name: "Post", href: "/coopertunities/create", icon: PlusCircle, restrictObserver: true },
                            ]
                                .filter(link => !(isObserver && link.restrictObserver))
                                .map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-4 text-2xl font-heading font-bold text-white/90 hover:text-pan-gold transition py-2 border-b border-white/5"
                                    >
                                        <link.icon size={28} className="text-white/50" />
                                        {link.name}
                                    </Link>
                                ))}
                        </nav>
                        <div className="mt-auto mb-10">
                            <AuthToggle />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
