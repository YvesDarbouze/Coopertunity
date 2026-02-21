"use client";

import { useState } from "react";
import { Loader2, Plus, X, Briefcase, MapPin, Target } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const COMMON_CAREERS = [
    "Software Engineer", "Civil Engineer", "Agronomist", "Corporate Lawyer",
    "Financial Analyst", "Data Scientist", "Product Manager", "Supply Chain Manager",
    "Healthcare Administrator", "Renewable Energy Consultant", "Urban Planner",
    "Architect", "Investment Banker", "Marketing Director", "Operations Manager"
];

interface DNAFormProps {
    onComplete: () => void;
}

export default function ProfessionalDNAForm({ onComplete }: DNAFormProps) {
    const { data: session } = useSession();

    // Core state
    const [profession, setProfession] = useState(session?.user?.profession || "");
    const [skills, setSkills] = useState<string[]>([]);
    const [currentSkillInput, setCurrentSkillInput] = useState("");
    const [targetLocation, setTargetLocation] = useState(session?.user?.targetLocation || "");

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-pulled physical location (Read Only display)
    const physicalLocation = session?.user?.location || "Unknown Location";

    // Handle Skill Tags
    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newSkill = currentSkillInput.trim().toUpperCase();
            if (newSkill && !skills.includes(newSkill) && skills.length < 10) {
                setSkills([...skills, newSkill]);
                setCurrentSkillInput("");
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profession.trim()) {
            toast.error("Please provide your primary profession.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profession,
                    skillsInventory: skills, // sending array directly
                    targetLocation
                }),
            });

            if (res.ok) {
                toast.success("DNA Verified. Final step pending.");
                onComplete();
            } else {
                toast.error("Failed to save professional DNA.");
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
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-pan-black text-cloud-dancer px-8 py-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pan-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h1 className="text-3xl font-heading font-black tracking-tight relative z-10">
                        Map Your Professional DNA
                    </h1>
                    <p className="text-cloud-dancer/70 mt-3 font-medium max-w-lg mx-auto relative z-10">
                        Define your expertise and target impact area to plug directly into the Global Pan-African economic taxonomy.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-10 space-y-10">

                    {/* 1. Career Dropdown/Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Briefcase size={16} className="text-pan-deep-brown" />
                            What is your primary profession?
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                list="careers"
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                placeholder="e.g. Architectural Engineer"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-pan-deep-brown/20 focus:border-pan-deep-brown transition-all"
                            />
                            <datalist id="careers">
                                {COMMON_CAREERS.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                    </div>

                    {/* 2. Skills Tag Cloud */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Target size={16} className="text-pan-gold" />
                                What specific skills can you offer?
                            </label>
                            <span className="text-xs font-semibold text-gray-400">
                                {skills.length}/10 Max
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Type a skill and press Enter or comma to add it.</p>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-pan-gold/20 focus-within:border-pan-gold transition-all flex flex-wrap gap-2 items-center min-h-[60px]">
                            {skills.map(skill => (
                                <span key={skill} className="flex items-center gap-1 bg-pan-black text-white text-xs font-bold px-3 py-1.5 rounded-full animate-in zoom-in duration-200">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="hover:text-pan-gold transition-colors ml-1"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}

                            <input
                                type="text"
                                value={currentSkillInput}
                                onChange={(e) => setCurrentSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder={skills.length < 10 ? "Add a skill..." : "Limit reached"}
                                disabled={skills.length >= 10}
                                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* 3. Location Anchoring */}
                    <div className="pt-6 border-t border-gray-100 space-y-6">
                        {/* Auto-pulled Physical Location */}
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F5F3EF] border border-[#E8E1D5]">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <MapPin size={20} className="text-emerald-700" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detected Physical Location</p>
                                <p className="text-sm font-bold text-gray-900 mt-0.5">{physicalLocation}</p>
                                <p className="text-xs text-gray-500 mt-1">Sourced securely via OAuth. You can fuzz this in Trust & Safety settings.</p>
                            </div>
                        </div>

                        {/* Target Impact Location */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Target size={16} className="text-emerald-700" />
                                Target Impact Location
                            </label>
                            <p className="text-xs text-gray-500">Where on the continent do you want to focus your efforts? (e.g. 'Lagos, Nigeria' or 'Pan-African')</p>
                            <input
                                type="text"
                                value={targetLocation}
                                onChange={(e) => setTargetLocation(e.target.value)}
                                placeholder="Enter city, country, or region..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting || !profession.trim()}
                            className="w-full bg-pan-gold text-pan-black hover:bg-[#E6AA68] font-black text-lg py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>Deploy Professional DNA</>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
