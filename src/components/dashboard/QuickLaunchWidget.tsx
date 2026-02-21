"use client";

import React, { useState } from "react";
import { Plus, Briefcase, ShieldCheck, Menu, X, Rocket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function QuickLaunchWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleAvailability = () => setIsAvailable(!isAvailable);

    return (
        <>
            {/* Desktop Widget (Sticky Right Rail) */}
            <div className="hidden lg:block sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
                    {/* Subtle aesthetic gradient background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                        <Rocket size={20} className="text-amber-500" />
                        Quick Launch
                    </h3>

                    <div className="space-y-4 relative z-10">
                        <Link
                            href="/coopertunities/create"
                            className="flex items-center justify-center w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-600/20 hover:-translate-y-0.5 transition-all text-sm gap-2"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Post a Need
                        </Link>

                        <button
                            onClick={toggleAvailability}
                            className={cn(
                                "flex items-center justify-between w-full p-4 rounded-xl font-semibold border-2 transition-all hover:-translate-y-0.5 shadow-sm",
                                isAvailable
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-100/50"
                                    : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
                            )}
                        >
                            <span className="flex items-center gap-2.5 text-sm">
                                <Briefcase size={18} strokeWidth={2.5} />
                                {isAvailable ? "Open to Work" : "Busy"}
                            </span>
                            <span className="relative flex h-3 w-3">
                                {isAvailable && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                )}
                                <span className={cn(
                                    "relative inline-flex rounded-full h-3 w-3",
                                    isAvailable ? "bg-emerald-500" : "bg-gray-400"
                                )}></span>
                            </span>
                        </button>

                        <Link
                            href="/verify"
                            className="flex items-center justify-center w-full py-3.5 px-4 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all text-sm gap-2"
                        >
                            <ShieldCheck size={18} strokeWidth={2.5} />
                            Verify Identity
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile FAB (Floating Action Button) */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                {isOpen && (
                    <div className="absolute bottom-16 right-0 space-y-3 min-w-[200px] flex flex-col items-end pb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
                        <Link
                            href="/coopertunities/create"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full shadow-xl font-bold hover:scale-105 active:scale-95 transition-all"
                        >
                            Post a Need
                            <Plus size={20} strokeWidth={2.5} />
                        </Link>

                        <button
                            onClick={toggleAvailability}
                            className={cn(
                                "flex items-center gap-3 px-5 py-3.5 rounded-full shadow-xl font-bold hover:scale-105 active:scale-95 transition-all border",
                                isAvailable
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : "bg-white text-gray-700 border-gray-100"
                            )}
                        >
                            {isAvailable ? "Open to Work" : "Busy"}
                            <Briefcase size={20} strokeWidth={2.5} />
                        </button>

                        <Link
                            href="/verify"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full shadow-xl font-bold hover:scale-105 active:scale-95 transition-all"
                        >
                            Verify ID
                            <ShieldCheck size={20} strokeWidth={2.5} />
                        </Link>
                    </div>
                )}

                <button
                    onClick={toggleMenu}
                    className="h-14 w-14 bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-amber-700/50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30"
                >
                    {isOpen ? <X size={24} className="animate-in spin-in-90" /> : <Rocket size={24} className="animate-in slide-in-from-bottom-2 fade-in" />}
                </button>
            </div>
        </>
    );
}
