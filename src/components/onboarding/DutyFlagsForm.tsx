"use client";

import { useState } from "react";
import { Loader2, BookOpen, TrendingUp, Shield, Info } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface DutyFlagsFormProps {
    onComplete: () => void;
}

const INVESTMENT_RANGES = [
    "$1,000 - $10,000 (Micro-Investing)",
    "$10,000 - $50,000 (Seed)",
    "$50,000 - $250,000 (Angel)",
    "$250,000+ (Institutional/VC)"
];

export default function DutyFlagsForm({ onComplete }: DutyFlagsFormProps) {
    const { data: session } = useSession();

    const [willingnessToTeach, setWillingnessToTeach] = useState(false);
    const [isInvestor, setIsInvestor] = useState(false);
    const [investmentRange, setInvestmentRange] = useState("");
    const [isVeteran, setIsVeteran] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isInvestor && !investmentRange) {
            toast.error("Please select an investment range.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    willingnessToTeach,
                    isInvestor,
                    investmentRange: isInvestor ? investmentRange : null,
                    isVeteran,
                    onboarded: true // This is the absolute final step. Publishes profile.
                }),
            });

            if (res.ok) {
                toast.success("Welcome to the Global African Network!");
                onComplete();
            } else {
                toast.error("Failed to formalize duties. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-cloud-dancer flex flex-col items-center justify-center p-4 py-12 animate-in fade-in duration-500">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-pan-black text-cloud-dancer px-8 py-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-pan-green/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
                    <h1 className="text-3xl font-heading font-black tracking-tight relative z-10">
                        Pan-African Duties
                    </h1>
                    <p className="text-cloud-dancer/70 mt-3 font-medium max-w-sm mx-auto relative z-10">
                        Opt-in to specialized roles to maximize your impact within the network. These are optional but highly valued.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8">

                    {/* 1. The Educator */}
                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setWillingnessToTeach(!willingnessToTeach)}>
                        <div className={`p-3 rounded-xl transition-colors ${willingnessToTeach ? 'bg-[#FFBE98] text-pan-black' : 'bg-gray-100 text-gray-400'}`}>
                            <BookOpen size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">The Educator</h3>
                            <p className="text-sm text-gray-500 mt-1">Willing to Mentor/Teach</p>
                        </div>
                        <div className="pt-2">
                            <div className={`w-12 h-6 rounded-full transition-colors relative ${willingnessToTeach ? 'bg-[#FFBE98]' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${willingnessToTeach ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </div>

                    {/* 2. The Investor */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => setIsInvestor(!isInvestor)}>
                            <div className={`p-3 rounded-xl transition-colors ${isInvestor ? 'bg-pan-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <TrendingUp size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">The Investor</h3>
                                <p className="text-sm text-gray-500 mt-1">Looking for Investment Opportunities</p>
                            </div>
                            <div className="pt-2">
                                <div className={`w-12 h-6 rounded-full transition-colors relative ${isInvestor ? 'bg-pan-green' : 'bg-gray-200'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isInvestor ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Investor Range Dropdown */}
                        {isInvestor && (
                            <div className="pl-16 pr-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                                    Typical Investment Range
                                </label>
                                <select
                                    value={investmentRange}
                                    onChange={(e) => setInvestmentRange(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-pan-green/20 focus:border-pan-green transition-all"
                                >
                                    <option value="" disabled>Select a range...</option>
                                    {INVESTMENT_RANGES.map(range => (
                                        <option key={range} value={range}>{range}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* 3. The Enlistment (Veterans Only) */}
                    <div className="p-5 rounded-2xl border border-pan-red/20 bg-red-50/30">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="mt-1 relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={isVeteran}
                                    onChange={(e) => setIsVeteran(e.target.checked)}
                                    className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-pan-red checked:border-pan-red transition-all cursor-pointer"
                                />
                                <Shield className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">Military Experience / The Enlistment</h3>
                                    {/* Tooltip trigger */}
                                    <div className="group/tooltip relative flex items-center justify-center">
                                        <Info size={16} className="text-gray-400 hover:text-pan-red cursor-help transition-colors" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-pan-black text-white text-xs rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all z-20">
                                            Check this if you are a former soldier willing to consult on Pan-African security or defense initiatives. Applies a Shield Badge to your profile.
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pan-black rotate-45" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-pan-red/80 mt-1 font-medium italic">Exclusive duty roster.</p>
                            </div>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="pt-8 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-pan-black text-cloud-dancer hover:bg-black font-black text-lg py-5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>Enter the Network <span className="group-hover:translate-x-1 transition-transform">→</span></>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
