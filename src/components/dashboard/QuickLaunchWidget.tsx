"use client";

import React, { useState } from "react";
import { Plus, Briefcase, ShieldCheck, Menu, X } from "lucide-react";
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-heading font-bold text-pan-deep-brown mb-4">
                        Quick Launch
                    </h3>
                    <div className="space-y-3">
                        <Link
                            href="/coopertunities/create"
                            className="flex items-center justify-between w-full p-3 bg-pan-gold text-white rounded-lg font-bold hover:bg-pan-gold/90 transition-colors shadow-md"
                        >
                            <span className="flex items-center gap-2">
                                <Plus size={18} />
                                Post a Need
                            </span>
                        </Link>

                        <button
                            onClick={toggleAvailability}
                            className={cn(
                                "flex items-center justify-between w-full p-3 rounded-lg font-medium border transition-all",
                                isAvailable
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <Briefcase size={18} />
                                {isAvailable ? "Open to Work" : "Busy"}
                            </span>
                            <div
                                className={cn(
                                    "w-3 h-3 rounded-full",
                                    isAvailable ? "bg-green-500" : "bg-gray-400"
                                )}
                            />
                        </button>

                        <Link
                            href="/verify"
                            className="flex items-center justify-between w-full p-3 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={18} />
                                Verify Identity
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile FAB (Floating Action Button) */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                {isOpen && (
                    <div className="absolute bottom-16 right-0 space-y-3 min-w-[200px] flex flex-col items-end">
                        <Link
                            href="/coopertunities/create"
                            className="flex items-center gap-3 px-4 py-3 bg-pan-gold text-white rounded-full shadow-lg font-bold hover:scale-105 transition-transform"
                        >
                            Post a Need
                            <Plus size={20} />
                        </Link>
                        <button
                            onClick={toggleAvailability}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-full shadow-lg font-medium hover:scale-105 transition-transform",
                                isAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-white text-gray-700"
                            )}
                        >
                            {isAvailable ? "Open to Work" : "Busy"}
                            <Briefcase size={20} />
                        </button>
                        <Link
                            href="/verify"
                            className="flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-800 rounded-full shadow-lg font-medium hover:scale-105 transition-transform"
                        >
                            Verify ID
                            <ShieldCheck size={20} />
                        </Link>
                    </div>
                )}

                <button
                    onClick={toggleMenu}
                    className="h-14 w-14 bg-pan-deep-brown text-white rounded-full flex items-center justify-center shadow-xl hover:bg-pan-charcoal transition-colors focus:outline-none focus:ring-4 focus:ring-pan-gold/30"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </>
    );
}
