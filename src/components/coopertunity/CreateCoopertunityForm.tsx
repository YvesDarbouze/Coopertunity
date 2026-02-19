"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, MapPin, DollarSign, BookOpen } from "lucide-react";

enum CoopertunityType {
    LAND_DEAL = "LAND_DEAL",
    MINING_RIGHTS = "MINING_RIGHTS",
    NON_PROFIT_NEED = "NON_PROFIT_NEED",
    SKILLS_REQUEST = "SKILLS_REQUEST",
    INVESTMENT_OPP = "INVESTMENT_OPP",
}

enum EconomicSector {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    TERTIARY = "TERTIARY",
    QUATERNARY = "QUATERNARY",
}

export default function CreateCoopertunityForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: CoopertunityType.SKILLS_REQUEST,
        sector: EconomicSector.QUATERNARY,
        location: "",
        investmentAmount: "",
        willingnessToTeach: false,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/coopertunities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    investmentAmount: formData.investmentAmount ? parseFloat(formData.investmentAmount) : null
                }),
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                console.error("Failed to create coopertunity");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-2xl backdrop-blur-sm"
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-deep-brown font-heading">Post a Coopertunity</h2>
                <p className="text-mocha-mousse mt-2 font-medium">Connect with the Diaspora to build the continent.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition placeholder-mocha-mousse/50"
                        placeholder="e.g. Lead Engineer for Solar Project"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                {/* Type & Sector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">Type</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as CoopertunityType })}
                        >
                            {Object.values(CoopertunityType).map((t) => (
                                <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">Economic Sector</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition"
                            value={formData.sector}
                            onChange={(e) => setFormData({ ...formData, sector: e.target.value as EconomicSector })}
                        >
                            {Object.values(EconomicSector).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">Description</label>
                    <textarea
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition h-32 resize-none placeholder-mocha-mousse/50"
                        placeholder="Describe the opportunity, requirements, and goal..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Dynamic Fields based on Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-mocha-mousse w-5 h-5" />
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition placeholder-mocha-mousse/50"
                                placeholder="e.g. Accra, Ghana"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    {(formData.type === CoopertunityType.INVESTMENT_OPP || formData.type === CoopertunityType.LAND_DEAL) && (
                        <div>
                            <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">Investment Amount (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-mocha-mousse w-5 h-5" />
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition placeholder-mocha-mousse/50"
                                    placeholder="e.g. 50000"
                                    value={formData.investmentAmount}
                                    onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Willingness to Teach Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <BookOpen className="text-pan-green w-6 h-6" />
                        <div>
                            <h3 className="font-bold text-deep-brown">Willingness to Teach</h3>
                            <p className="text-xs text-mocha-mousse font-medium">Are you open to mentoring others on this project?</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.willingnessToTeach}
                            onChange={(e) => setFormData({ ...formData, willingnessToTeach: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pan-green/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pan-green"></div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-deep-brown text-white font-black py-4 rounded-xl hover:bg-mocha-mousse transition-colors disabled:opacity-50 shadow-lg"
                >
                    {loading ? "Posting..." : "Create Coopertunity"}
                </button>
            </form>
        </motion.div>
    );
}
