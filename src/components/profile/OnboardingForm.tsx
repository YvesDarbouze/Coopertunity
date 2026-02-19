"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Shield, Globe, X } from "lucide-react";
import { TAXONOMY } from "@/lib/taxonomy_data";

export default function OnboardingForm() {
    const router = useRouter();
    interface FormData {
        location: string;
        targetLocation: string;
        profession: string;
        dream: string;
        isAfrican: boolean;
        isVeteran: boolean;
        isBusiness: boolean;
        isInvestor: boolean;
        investmentRange: string;
        willingToTeach: boolean;
        skills: string;
        verificationType: string;
    }

    const [formData, setFormData] = useState<FormData>({
        location: "", // Current Location
        targetLocation: "", // Prompt 16: Location Anchoring
        profession: "", // Past
        dream: "", // Prompt 11: Future
        isAfrican: false,
        isVeteran: false, // Prompt 12: Enlist
        isBusiness: false,
        isInvestor: false, // Prompt 14: Investment Interest
        investmentRange: "",
        willingToTeach: false, // Prompt 15: Willingness to Teach
        skills: "",
        verificationType: "", // Prompt 17: Verified Profile
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Convert comma-separated nature of skills string to array/json
        const skillsArray = formData.skills.split(",").map((s) => s.trim());

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    skillsInventory: skillsArray,
                }),
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                console.error("Failed to update profile");
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
            className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-2xl backdrop-blur-sm"
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-deep-brown font-heading">Complete Your Profile</h2>
                <p className="text-mocha-mousse mt-2 font-medium">Join the network building the continent.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* 1. Professional DNA (History & Dream) */}
                <div className="space-y-6">
                    <h3 className="text-lg font-heading font-bold text-deep-brown border-b border-gray-200 pb-2">Professional DNA</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* PAST - with Predictive Search */}
                        <div className="relative group">
                            <label className="block text-sm font-bold text-mocha-mousse mb-2 uppercase tracking-wider">Your History (Past)</label>
                            <input
                                type="text"
                                required
                                list="careers-list"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition placeholder-mocha-mousse/50"
                                placeholder="e.g. Civil Engineer"
                                value={formData.profession}
                                onChange={(e) => {
                                    setFormData({ ...formData, profession: e.target.value });
                                    // In a real app, we'd debounce call an API here. 
                                    // For now, the datalist filters automatically based on the static TAXONOMY.CAREERS or we could fetch from /api/jobs/search
                                }}
                            />
                            <datalist id="careers-list">
                                {/* Enhanced with 'Predictive' feel by ensuring list is populated */}
                                {TAXONOMY.CAREERS.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                                <option value="Agricultural Engineer" />
                                <option value="Blockchain Developer" />
                                <option value="Mining Engineer" />
                                <option value="Renewable Energy Specialist" />
                            </datalist>
                            <p className="text-[10px] text-mocha-mousse/70 mt-1 font-medium">Select from standard library for best matching.</p>
                        </div>

                        {/* FUTURE */}
                        <div>
                            <label className="block text-sm font-bold text-mocha-mousse mb-2 uppercase tracking-wider">Your Dream (Future)</label>
                            <textarea
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition h-[52px] resize-none overflow-hidden focus:h-24 placeholder-mocha-mousse/50"
                                placeholder="How do you want to help build the continent?"
                                value={formData.dream}
                                onChange={(e) => setFormData({ ...formData, dream: e.target.value })}
                            />
                            <p className="text-[10px] text-mocha-mousse/70 mt-1 font-medium">What you want to do.</p>
                        </div>
                    </div>

                    {/* Skills Tag Cloud */}
                    <div>
                        <label className="block text-sm font-bold text-mocha-mousse mb-2 uppercase tracking-wider">
                            Specialized Skills <span className="text-mocha-mousse/60 font-normal lowercase">(Max 10)</span>
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-peach-fuzz transition min-h-[100px]">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.skills.split(",").filter(Boolean).map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-deep-brown font-bold flex items-center gap-2 shadow-sm">
                                        {skill.trim()}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const skills = formData.skills.split(",").filter(Boolean);
                                                skills.splice(i, 1);
                                                setFormData({ ...formData, skills: skills.join(",") });
                                            }}
                                            className="hover:text-red-500 transition"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                list="skills-list"
                                className="bg-transparent outline-none text-deep-brown w-full placeholder:text-mocha-mousse/50"
                                placeholder="Add a skill (e.g. AutoCAD, Project Management)..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = e.currentTarget.value.trim();
                                        if (val && !formData.skills.includes(val)) {
                                            setFormData(prev => ({
                                                ...prev,
                                                skills: prev.skills ? `${prev.skills},${val}` : val
                                            }));
                                            e.currentTarget.value = "";
                                        }
                                    }
                                }}
                            />
                            <datalist id="skills-list">
                                {TAXONOMY.SKILLS.map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                </div>

                {/* 2. Location Anchoring */}
                <div className="space-y-6">
                    <h3 className="text-lg font-heading font-bold text-deep-brown border-b border-gray-200 pb-2">Location Strategy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-mocha-mousse mb-2 uppercase tracking-wider">Current Base</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-peach-fuzz focus:border-transparent outline-none transition placeholder-mocha-mousse/50"
                                placeholder="e.g. New York, USA"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-mocha-mousse mb-2 uppercase tracking-wider text-pan-green">Target Location (Build Here)</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-deep-brown focus:ring-2 focus:ring-pan-green focus:border-transparent outline-none transition placeholder-mocha-mousse/50"
                                placeholder="e.g. Accra, Ghana"
                                value={formData.targetLocation}
                                onChange={(e) => setFormData({ ...formData, targetLocation: e.target.value })}
                            />
                            <p className="text-[10px] text-mocha-mousse/70 mt-1 font-medium">Where do you want to deploy your skills/capital?</p>
                        </div>
                    </div>
                </div>

                {/* 3. Identity & Role Toggles */}
                <div className="space-y-4">
                    {/* Identity: African */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Globe className="text-pan-green w-5 h-5" />
                            <div>
                                <h3 className="font-bold text-deep-brown text-sm">Identify as African</h3>
                                <p className="text-[11px] text-mocha-mousse font-medium">Required for posting privileges.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isAfrican}
                                onChange={(e) => setFormData({ ...formData, isAfrican: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pan-green"></div>
                        </label>
                    </div>

                    {/* Role: Veteran (Enlist) */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm group relative">
                        <div className="flex items-center gap-3">
                            <Shield className="text-deep-brown w-5 h-5" />
                            <div>
                                <h3 className="font-bold text-deep-brown text-sm">Military Veteran (Enlist)</h3>
                                <p className="text-[11px] text-mocha-mousse font-medium">Consult on security projects.</p>
                            </div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute left-1/2 -top-12 -translate-x-1/2 bg-deep-brown text-white text-xs px-3 py-2 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition w-64 text-center border border-mocha-mousse z-10 font-bold">
                            Check this if you are a military veteran willing to consult on Pan-African security projects.
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isVeteran}
                                onChange={(e) => setFormData({ ...formData, isVeteran: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-deep-brown"></div>
                        </label>
                    </div>

                    {/* Role: Investor */}
                    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-deep-brown font-black text-lg">$</span>
                                <div>
                                    <h3 className="font-bold text-deep-brown text-sm">Active Investor</h3>
                                    <p className="text-[11px] text-mocha-mousse font-medium">I am looking to deploy capital.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isInvestor}
                                    onChange={(e) => setFormData({ ...formData, isInvestor: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-peach-fuzz"></div>
                            </label>
                        </div>

                        {formData.isInvestor && (
                            <select
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-deep-brown text-sm outline-none focus:border-peach-fuzz animate-in fade-in slide-in-from-top-1"
                                value={formData.investmentRange}
                                onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                            >
                                <option value="" disabled>Select Investment Range</option>
                                <option value="micro">$1k - $10k (Micro)</option>
                                <option value="growth">$10k - $100k (Growth)</option>
                                <option value="institutional">Institutional / Accredited</option>
                            </select>
                        )}
                    </div>

                    {/* Role: Teacher */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-blue-400 flex items-center justify-center text-blue-400 text-xs font-bold">T</div>
                            <div>
                                <h3 className="font-bold text-deep-brown text-sm">Willing to Mentor/Teach</h3>
                                <p className="text-[11px] text-mocha-mousse font-medium">Transfer knowledge to local youth.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.willingToTeach}
                                onChange={(e) => setFormData({ ...formData, willingToTeach: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                    </div>

                    {/* Verification */}
                    <div className="p-4 bg-cloud-dancer rounded-xl border border-dashed border-gray-300">
                        <h3 className="font-bold text-deep-brown text-sm mb-3">Get Verified</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-pan-green cursor-pointer transition gap-2 bg-white shadow-sm">
                                <input type="radio" name="verification" value="business" className="sr-only"
                                    checked={formData.verificationType === 'business'}
                                    onChange={() => setFormData({ ...formData, verificationType: 'business', isBusiness: true })}
                                />
                                <Shield className={formData.verificationType === 'business' ? "text-pan-green" : "text-mocha-mousse"} />
                                <span className={formData.verificationType === 'business' ? "text-deep-brown text-xs font-bold" : "text-mocha-mousse text-xs"}>Business ID</span>
                            </label>
                            <label className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-pan-green cursor-pointer transition gap-2 bg-white shadow-sm">
                                <input type="radio" name="verification" value="personal" className="sr-only"
                                    checked={formData.verificationType === 'personal'}
                                    onChange={() => setFormData({ ...formData, verificationType: 'personal', isBusiness: false })}
                                />
                                <div className="w-6 h-6 rounded border-2 border-current flex items-center justify-center text-[8px] font-bold text-deep-brown">ID</div>
                                <span className={formData.verificationType === 'personal' ? "text-deep-brown text-xs font-bold" : "text-mocha-mousse text-xs"}>Personal ID</span>
                            </label>
                        </div>

                        {(formData.verificationType) && (
                            <div className="mt-4 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pan-green transition cursor-pointer group bg-white/50">
                                <Upload className="w-6 h-6 mb-2 text-mocha-mousse group-hover:text-pan-green transition" />
                                <span className="text-xs text-mocha-mousse group-hover:text-deep-brown transition font-medium">
                                    Upload {formData.verificationType === 'business' ? 'Business Registration' : 'Government ID'}
                                </span>
                            </div>
                        )}
                    </div>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-deep-brown text-white font-black py-4 rounded-xl hover:bg-mocha-mousse transition-colors disabled:opacity-50 text-lg uppercase tracking-wider shadow-lg"
                >
                    {loading ? "Updating..." : "Complete Profile"}
                </button>
            </form>
        </motion.div>
    );
}
