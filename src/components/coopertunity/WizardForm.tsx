"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, MapPin, DollarSign, BookOpen, ChevronRight, ChevronLeft, Check, X,
    Sprout, Hammer, Fish, Trees, Flame, Factory, HardHat, Zap, Shirt,
    GraduationCap, Stethoscope, Landmark, Plane, Cpu, Microscope, Clapperboard,
    Users, AlertTriangle, ExternalLink, Heart
} from "lucide-react";
import { TAXONOMY } from "@/lib/taxonomy_data";
import clsx from "clsx";

enum CoopertunityType {
    PROJECT = "PROJECT", // Team/Stakeholder
    ROLE = "ROLE", // Single Job
    DEAL = "DEAL", // Investment
    LAND_DEAL = "LAND_DEAL", // Specific Deal type
}

enum EconomicSector {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    TERTIARY = "TERTIARY",
    QUATERNARY = "QUATERNARY",
}

enum CompensationType {
    PAID = "PAID_SALARY",
    EQUITY = "EQUITY_SHARES",
    VOLUNTEER = "VOLUNTEER",
    INVESTMENT_REQUIRED = "INVESTMENT_REQUIRED"
}

// Wizard Steps
const STEPS = [
    { id: "type", title: "What does the Continent need?", subtitle: "Start the conversation." },
    { id: "sector", title: "Where does it fit?", subtitle: "Select the economic sector." },
    { id: "details", title: "Define the Opportunity", subtitle: "Specifics, Stakeholders, and Keywords." },
    { id: "location", title: "Pinpoint Location", subtitle: "Where is this happening?" },
    { id: "extras", title: "Final Details", subtitle: "Safety, Value, and Impact." },
];

export default function WizardForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [loading, setLoading] = useState(false);
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "", // Set via flow
        sector: "",
        subSector: "", // New sub-sector
        location: "",
        coordinates: { lat: 0, lng: 0 }, // For Geolocation
        compensationType: CompensationType.PAID,
        investmentAmount: "",
        roi: "",
        isNonProfit: false,
        donationLink: "",
        keywords: [] as string[],
        requiredSkills: [] as string[], // New Matching Field
        stakeholders: [] as { role: string, count: number }[], // For Projects
        landTitleVerified: false, // Internal check
    });

    // Moderation List (MVP)
    const BANNED_WORDS = ["scam", "fraud", "wire transfer", "western union", "h hate", "slur"];

    const validateContent = () => {
        const textToCheck = `${formData.title} ${formData.description} ${formData.keywords.join(" ")}`.toLowerCase();
        const found = BANNED_WORDS.find(word => textToCheck.includes(word));
        if (found) {
            alert(`Moderation Alert: Your post contains prohibited terms/phrases ("${found}"). Please revise.`);
            return false;
        }
        return true;
    };

    const nextStep = () => {
        // Step Validation
        if (currentStep === 1) {
            if (!formData.sector || !formData.subSector) {
                alert("Please select a Sector and an Industry to continue.");
                return;
            }
        }

        if (currentStep === 2) {
            if (!formData.title.trim() || !formData.description.trim()) {
                alert("A Title and Description are required to proceed.");
                return;
            }
            if (!validateContent()) return;
            if (formData.keywords.length === 0) {
                alert("Please provide at least one Keyword to help with matching.");
                return;
            }
        }

        if (currentStep === 3) {
            if (!formData.location.trim()) {
                alert("Please indicate the Location for this opportunity.");
                return;
            }
        }

        if (currentStep === 4) {
            if (formData.type === CoopertunityType.LAND_DEAL && !disclaimerAccepted) {
                alert("You must acknowledge the Land Deal disclaimer to proceed.");
                return;
            }
            if (!formData.isNonProfit && (formData.type === CoopertunityType.DEAL || formData.compensationType === CompensationType.INVESTMENT_REQUIRED)) {
                if (!formData.investmentAmount || parseFloat(formData.investmentAmount) <= 0) {
                    alert("Please specify the Investment Amount required.");
                    return;
                }
            }
        }

        if (currentStep < STEPS.length - 1) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        } else {
            if (!validateContent()) return; // Final check
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/coopertunities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    type: formData.type,
                    sector: formData.sector,
                    subSector: formData.subSector, // New
                    location: formData.location,
                    latitude: formData.coordinates.lat, // New
                    longitude: formData.coordinates.lng, // New
                    investmentAmount: formData.investmentAmount ? parseFloat(formData.investmentAmount) : null,
                    compensationType: formData.compensationType, // New
                    isNonProfit: formData.isNonProfit, // New
                    donationLink: formData.donationLink, // New
                    keywords: formData.keywords,
                    requiredSkills: formData.requiredSkills, // New Matching Field
                    stakeholders: formData.type === CoopertunityType.PROJECT ? formData.stakeholders : undefined, // New
                }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/dashboard/explore`); // Go to feed for now, or `/coopertunities/${data.id}` if a specific post page exists
            } else {
                console.error("Failed to create coopertunity");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Animation variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-12">
                {STEPS.map((_, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "h-1 flex-1 rounded-full transition-all duration-500",
                            index <= currentStep ? "bg-peach-fuzz" : "bg-gray-200"
                        )}
                    />
                ))}
            </div>

            <div className="text-center mb-10">
                <h2 className="text-4xl font-heading font-black text-deep-brown mb-2">{STEPS[currentStep].title}</h2>
                <p className="text-mocha-mousse font-body text-lg font-medium">{STEPS[currentStep].subtitle}</p>
            </div>

            <div className="min-h-[400px] relative">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="absolute w-full"
                    >
                        {/* STEP 1: TYPE (Conversational) */}
                        {currentStep === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        label: "Investment",
                                        desc: "I have capital or need funding.",
                                        icon: DollarSign,
                                        type: CoopertunityType.DEAL
                                    },
                                    {
                                        label: "Expertise (Skills)",
                                        desc: "I need a specific expert.",
                                        icon: BookOpen,
                                        type: CoopertunityType.ROLE
                                    },
                                    {
                                        label: "Labor / Team",
                                        desc: "Building a stakeholder for a project.",
                                        icon: Users,
                                        type: CoopertunityType.PROJECT
                                    },
                                    {
                                        label: "Land Development",
                                        desc: "Real estate or agricultural land.",
                                        icon: Sprout,
                                        type: CoopertunityType.LAND_DEAL
                                    }
                                ].map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={() => setFormData({ ...formData, type: option.type })}
                                        className={clsx(
                                            "p-6 rounded-2xl border text-left transition-all duration-200 flex flex-col gap-4 group h-full shadow-sm",
                                            formData.type === option.type
                                                ? "bg-peach-fuzz text-pan-charcoal border-peach-fuzz shadow-lg"
                                                : "bg-white border-gray-100 text-mocha-mousse hover:border-peach-fuzz hover:bg-gray-50 hover:shadow-md"
                                        )}
                                    >
                                        <div className="flex justify-between w-full items-start">
                                            <option.icon className={clsx("w-8 h-8", formData.type === option.type ? "text-pan-charcoal" : "text-peach-fuzz")} />
                                            {formData.type === option.type && <Check className="w-6 h-6 text-pan-charcoal" />}
                                        </div>
                                        <div>
                                            <span className="font-heading font-black text-xl block mb-1">{option.label}</span>
                                            <span className={clsx("text-sm font-medium", formData.type === option.type ? "text-pan-charcoal/80" : "text-mocha-mousse/70")}>
                                                {option.desc}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* STEP 2: SECTOR & SUB-SECTOR */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                {/* Main Sector */}
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.values(EconomicSector).map((sector) => (
                                        <button
                                            key={sector}
                                            onClick={() => setFormData({ ...formData, sector, subSector: "" })}
                                            className={clsx(
                                                "p-4 rounded-xl border text-center transition-all duration-200 shadow-sm",
                                                formData.sector === sector
                                                    ? "bg-pan-green text-white border-pan-green shadow-md"
                                                    : "bg-white border-gray-100 text-mocha-mousse hover:border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            <span className="font-heading font-black block">{sector}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Sub-Sector Menu */}
                                {formData.sector && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                        <h3 className="text-mocha-mousse text-sm font-bold uppercase mb-3">Select Industry</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {TAXONOMY.INDUSTRIES[formData.sector as keyof typeof TAXONOMY.INDUSTRIES]?.map((ind: any) => {
                                                // Icon mapping
                                                const IconComponent =
                                                    ind.icon === "Wheat" ? Sprout :
                                                        ind.icon === "Pickaxe" ? Hammer :
                                                            ind.icon === "Fish" ? Fish :
                                                                ind.icon === "TreePine" ? Trees :
                                                                    ind.icon === "Flame" ? Flame :
                                                                        ind.icon === "Factory" ? Factory :
                                                                            ind.icon === "HardHat" ? HardHat :
                                                                                ind.icon === "Zap" ? Zap :
                                                                                    ind.icon === "Shirt" ? Shirt :
                                                                                        ind.icon === "GraduationCap" ? GraduationCap :
                                                                                            ind.icon === "Stethoscope" ? Stethoscope :
                                                                                                ind.icon === "Landmark" ? Landmark :
                                                                                                    ind.icon === "Plane" ? Plane :
                                                                                                        ind.icon === "Cpu" ? Cpu :
                                                                                                            ind.icon === "Microscope" ? Microscope :
                                                                                                                ind.icon === "Clapperboard" ? Clapperboard : Briefcase;

                                                return (
                                                    <button
                                                        key={ind.id}
                                                        onClick={() => setFormData({ ...formData, subSector: ind.id })}
                                                        className={clsx(
                                                            "p-3 rounded-lg border flex flex-col items-center gap-2 transition-all shadow-sm",
                                                            formData.subSector === ind.id
                                                                ? "bg-deep-brown text-white border-deep-brown shadow-md"
                                                                : "bg-white border-gray-100 text-mocha-mousse hover:bg-gray-50 hover:border-gray-200"
                                                        )}
                                                    >
                                                        <IconComponent className="w-6 h-6" />
                                                        <span className="text-xs font-bold text-center">{ind.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: DETAILS */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">TITLE</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl font-black text-deep-brown focus:border-peach-fuzz outline-none transition font-heading placeholder:text-gray-300"
                                        placeholder={formData.type === CoopertunityType.ROLE ? "e.g. Senior Agronomist" : "e.g. Solar Plant Construction"}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                {/* Stakeholders for Projects */}
                                {formData.type === CoopertunityType.PROJECT && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <label className="block text-sm font-bold text-deep-brown mb-3 uppercase flex items-center gap-2">
                                            <Users size={16} /> Stakeholder Roles Needed
                                        </label>
                                        <div className="space-y-3">
                                            {formData.stakeholders.map((slot, idx) => (
                                                <div key={idx} className="flex gap-2 items-center">
                                                    <span className="text-mocha-mousse text-sm font-medium">Need</span>
                                                    <input
                                                        type="number" min="1"
                                                        className="w-16 bg-white border border-gray-200 rounded px-2 py-1 text-center text-deep-brown font-medium"
                                                        value={slot.count}
                                                        onChange={(e) => {
                                                            const newStakeholders = [...formData.stakeholders];
                                                            newStakeholders[idx].count = parseInt(e.target.value);
                                                            setFormData({ ...formData, stakeholders: newStakeholders });
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-deep-brown font-medium"
                                                        placeholder="Role (e.g. Architect)"
                                                        value={slot.role}
                                                        onChange={(e) => {
                                                            const newStakeholders = [...formData.stakeholders];
                                                            newStakeholders[idx].role = e.target.value;
                                                            setFormData({ ...formData, stakeholders: newStakeholders });
                                                        }}
                                                    />
                                                    <button onClick={() => {
                                                        setFormData({ ...formData, stakeholders: formData.stakeholders.filter((_, i) => i !== idx) });
                                                    }} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setFormData({ ...formData, stakeholders: [...formData.stakeholders, { role: "", count: 1 }] })}
                                                className="text-xs text-peach-fuzz hover:text-deep-brown hover:underline flex items-center gap-1 font-bold"
                                            >
                                                + Add Role Slot
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">DESCRIPTION</label>
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-deep-brown focus:border-peach-fuzz outline-none transition font-body h-40 resize-none text-lg placeholder-mocha-mousse/50"
                                        placeholder="Tell us the story..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* 12-Keyword Rule */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-deep-brown font-heading">KEYWORDS</label>
                                        <span className={clsx("text-xs font-bold", formData.keywords.length === 12 ? "text-pan-green" : "text-peach-fuzz")}>
                                            {formData.keywords.length} / 12 (Target: 12)
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2 p-3 bg-white rounded-lg min-h-[50px] border border-gray-200 shadow-sm">
                                        {formData.keywords.map((kw, i) => (
                                            <motion.span
                                                layout
                                                key={i}
                                                className="px-2 py-1 bg-peach-fuzz/20 border border-peach-fuzz/30 rounded text-xs text-deep-brown font-medium flex items-center gap-1"
                                            >
                                                #{kw}
                                                <button onClick={() => setFormData({ ...formData, keywords: formData.keywords.filter((_, idx) => idx !== i) })} className="hover:text-red-500">
                                                    <X size={10} />
                                                </button>
                                            </motion.span>
                                        ))}
                                        <input
                                            type="text"
                                            className="bg-transparent outline-none text-sm text-deep-brown placeholder:text-gray-400 flex-1 min-w-[100px]"
                                            placeholder={formData.keywords.length >= 12 ? "Max reached" : "Add keyword..."}
                                            disabled={formData.keywords.length >= 12}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val && !formData.keywords.includes(val) && formData.keywords.length < 12) {
                                                        setFormData({ ...formData, keywords: [...formData.keywords, val] });
                                                        e.currentTarget.value = "";
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-mocha-mousse">
                                        Strict Rule: Select exactly 12 keywords to maximize matching accuracy.
                                    </p>
                                </div>

                                {/* Required Skills for Matchmaking */}
                                <div>
                                    <label className="block text-sm font-bold text-deep-brown font-heading mb-2">REQUIRED SKILLS (FOR MATCHING)</label>
                                    <div className="flex flex-wrap gap-2 mb-2 p-3 bg-white rounded-lg min-h-[50px] border border-gray-200 shadow-sm">
                                        {formData.requiredSkills.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-pan-green/10 border border-pan-green/30 rounded text-xs text-pan-green font-bold flex items-center gap-1">
                                                {skill}
                                                <button onClick={() => setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter((_, idx) => idx !== i) })} className="hover:text-red-500">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            className="bg-transparent outline-none text-sm text-deep-brown placeholder:text-gray-400 flex-1 min-w-[100px]"
                                            placeholder="e.g. Python, Permaculture..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.currentTarget.value.trim();
                                                    if (val && !formData.requiredSkills.includes(val)) {
                                                        setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, val] });
                                                        e.currentTarget.value = "";
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-mocha-mousse">
                                        These skills will be used to automatically notify qualified members.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: LOCATION */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">LOCATION</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-peach-fuzz w-8 h-8" />
                                        <input
                                            type="text"
                                            autoFocus
                                            className="w-full bg-transparent border-b-2 border-gray-200 py-4 pl-12 text-3xl font-black text-deep-brown focus:border-peach-fuzz outline-none transition font-heading placeholder:text-gray-300"
                                            placeholder="City, Country"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Geolocation Visual */}
                                <div className="aspect-video w-full bg-gray-100 rounded-2xl relative overflow-hidden group border border-gray-200 shadow-sm">
                                    {/* Mock Map Background */}
                                    <div className="absolute inset-0 bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition duration-700"
                                        style={{ backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=0,20&zoom=2&size=800x600&maptype=terrain&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}')` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse shadow-sm">
                                                <MapPin className="text-peach-fuzz w-6 h-6" />
                                            </div>
                                            <p className="text-xs text-deep-brown/70 font-bold">Position the pin exactly on the project site.</p>
                                        </div>
                                    </div>
                                    <button className="absolute bottom-4 right-4 bg-white text-deep-brown text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-50 shadow-md border border-gray-100">
                                        Set Pin
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: EXTRAS & SAFETY */}
                        {currentStep === 4 && (
                            <div className="space-y-8">

                                {/* Land Deal Disclaimer */}
                                {formData.type === CoopertunityType.LAND_DEAL && (
                                    <div className="bg-red-50 border border-red-200 p-6 rounded-xl relative overflow-hidden">
                                        <div className="flex items-start gap-4 z-10 relative">
                                            <AlertTriangle className="text-red-500 w-8 h-8 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-heading font-bold text-red-700 text-lg mb-2">Mandatory Disclaimer</h3>
                                                <p className="text-red-600/80 text-sm mb-4">
                                                    Coopertunity connects people but <span className="text-red-700 font-bold">cannot verify land titles</span>.
                                                    Land transactions in many regions require extreme diligence.
                                                    Always use a licensed local attorney and verify documentation in person.
                                                </p>
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition ${disclaimerAccepted ? "bg-red-500 border-red-500" : "border-red-300 group-hover:border-red-500"}`}>
                                                        {disclaimerAccepted && <Check size={16} className="text-white" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={disclaimerAccepted}
                                                        onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                                                    />
                                                    <span className="text-sm font-bold text-red-700">I understand and accept full responsibility.</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Non-Profit Toggle */}
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Heart className={formData.isNonProfit ? "text-pink-500" : "text-gray-400"} />
                                        <div>
                                            <h3 className="font-bold text-deep-brown text-sm">Non-Profit / NGO</h3>
                                            <p className="text-[11px] text-mocha-mousse font-medium">Is this for a charitable cause?</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isNonProfit}
                                            onChange={(e) => setFormData({ ...formData, isNonProfit: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                    </label>
                                </div>

                                {formData.isNonProfit && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">DONATION LINK</label>
                                        <div className="relative">
                                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 w-5 h-5" />
                                            <input
                                                type="url"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-12 text-deep-brown focus:border-pink-500 outline-none transition placeholder-mocha-mousse/50"
                                                placeholder="https://..."
                                                value={formData.donationLink}
                                                onChange={(e) => setFormData({ ...formData, donationLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Compensation / Value */}
                                {!formData.isNonProfit && (
                                    <div className="space-y-4">
                                        <label className="block text-sm font-bold text-deep-brown font-heading">VALUE / COMPENSATION</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: CompensationType.PAID, label: "Paid Salary" },
                                                { id: CompensationType.EQUITY, label: "Equity / Shares" },
                                                { id: CompensationType.VOLUNTEER, label: "Volunteer" },
                                                { id: CompensationType.INVESTMENT_REQUIRED, label: "Investment Req." }
                                            ].map((comp) => (
                                                <button
                                                    key={comp.id}
                                                    onClick={() => setFormData({ ...formData, compensationType: comp.id })}
                                                    className={clsx(
                                                        "p-3 rounded-lg border text-sm font-bold transition-all shadow-sm",
                                                        formData.compensationType === comp.id
                                                            ? "bg-deep-brown text-white border-deep-brown shadow-md"
                                                            : "bg-white border-gray-100 text-mocha-mousse hover:bg-gray-50 hover:border-gray-200"
                                                    )}
                                                >
                                                    {comp.label}
                                                </button>
                                            ))}
                                        </div>

                                        {(formData.type === CoopertunityType.DEAL || formData.compensationType === CompensationType.INVESTMENT_REQUIRED) && (
                                            <div className="pt-2">
                                                <label className="block text-sm font-bold text-deep-brown mb-2 font-heading">AMOUNT (USD)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 text-pan-green w-6 h-6" />
                                                    <input
                                                        type="number"
                                                        className="w-full bg-transparent border-b border-gray-200 py-2 pl-8 text-xl font-bold text-deep-brown focus:border-pan-green outline-none transition"
                                                        placeholder="0.00"
                                                        value={formData.investmentAmount}
                                                        onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-between items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto w-full flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="text-mocha-mousse hover:text-deep-brown font-bold font-heading px-6 py-4 disabled:opacity-30 flex items-center gap-2 transition"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={loading}
                        className="bg-deep-brown hover:bg-mocha-mousse text-white font-bold font-heading px-8 py-4 rounded-full flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {loading ? "Posting..." : currentStep === STEPS.length - 1 ? "Finish" : "Continue"}
                        {!loading && currentStep !== STEPS.length - 1 && <ChevronRight size={20} />}
                    </button>
                </div>
            </div>
        </div >
    );
}
