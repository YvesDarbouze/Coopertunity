"use client";

import { useEffect } from "react";
import { ArrowLeft, Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define a minimal strict type for the passed data
interface UserData {
    name: string | null;
    email: string | null;
    profession: string | null;
    location: string | null;
    skillsInventory: any; // Using any for JSONB to avoid strict runtime type constraints here
    isVeteran: boolean;
    isAfrican: boolean;
    sector: string | null;
}

export default function CVPrintClient({ user }: { user: UserData }) {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

    // Auto-trigger print dialog after a brief delay for rendering
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Format skills if it's an array
    const skills = Array.isArray(user.skillsInventory) ? user.skillsInventory : [];

    return (
        <div className="min-h-screen bg-cloud-dancer p-8 md:p-12 print:p-0 print:bg-white">

            {/* Non-Printable Controls */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-deep-brown hover:text-pan-gold transition-colors font-bold"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-pan-gold text-deep-brown px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                >
                    <Printer className="w-5 h-5" /> Print / Save PDF
                </button>
            </div>

            {/* The Printable CV Document */}
            <div className="max-w-4xl mx-auto bg-white p-12 md:p-16 shadow-2xl rounded-2xl print:shadow-none print:rounded-none m-0">

                {/* Header */}
                <div className="border-b-4 border-pan-gold pb-8 mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-heading font-black text-deep-brown mb-2">{user.name || "Coopertunity Member"}</h1>
                        <h2 className="text-2xl font-bold text-pan-green mb-4">{user.profession || "Professional"}</h2>

                        <div className="flex flex-col gap-1 text-gray-600 font-medium">
                            {user.location && <p>{user.location}</p>}
                            {user.email && <p>{user.email}</p>}
                        </div>
                    </div>

                    {/* Coopertunity Branding & Badges */}
                    <div className="text-right">
                        <div className="text-xl font-heading font-black text-gray-300 uppercase tracking-widest mb-4">
                            Coopertunity
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {user.isAfrican && (
                                <span className="inline-block bg-pan-green/10 text-pan-green px-3 py-1 rounded-full text-xs font-bold border border-pan-green/20">
                                    Verified Diaspora / Continental
                                </span>
                            )}
                            {user.isVeteran && (
                                <span className="inline-block bg-blue-500/10 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">
                                    Military Veteran
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Main Column */}
                    <div className="md:col-span-2 space-y-10">
                        <section>
                            <h3 className="text-xl font-heading font-bold text-deep-brown uppercase tracking-wider mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-pan-gold" /> Profile Summary
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                A verified member of the Coopertunity network operating effectively within the Pan-African economy.
                                Specializing in {user.sector ? user.sector.replace(/_/g, " ") : "cross-sector innovation"} and economic development.
                                Actively seeking strategic partnerships, investment opportunities, and meaningful projects.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-heading font-bold text-deep-brown uppercase tracking-wider mb-4 border-b pb-2">
                                Sector Expertise
                            </h3>
                            <p className="text-lg font-bold text-pan-green">
                                {user.sector ? user.sector.replace(/_/g, " ") : "General Management"}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <div>
                        <section>
                            <h3 className="text-xl font-heading font-bold text-deep-brown uppercase tracking-wider mb-4 border-b pb-2">
                                Core Skills
                            </h3>
                            {skills.length > 0 ? (
                                <ul className="space-y-2">
                                    {skills.map((skill: string, i: number) => (
                                        <li key={i} className="text-gray-700 font-medium py-1 px-3 bg-gray-50 rounded-md border border-gray-100">
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No specific skills listed.</p>
                            )}
                        </section>
                    </div>
                </div>

                {/* Footer Validation */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 font-medium print:mt-24">
                    Generated securely from Coopertunity.com • {new Date().toLocaleDateString()}
                </div>

            </div>
        </div>
    );
}
