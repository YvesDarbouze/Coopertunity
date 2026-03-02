"use client";

import { useState, useTransition, useMemo } from "react";
import { Plus, Trash2, Briefcase, GraduationCap, X, Save, AlertCircle, CheckCircle2, Navigation, Leaf, Factory, Store, Cpu } from "lucide-react";
import { updateProfileInfo, updateSkills, addWorkExperience, deleteWorkExperience, addEducation, deleteEducation } from "@/app/actions/profile";
import clsx from "clsx";
import { toast } from "sonner";

// Reusing types locally or import from Prisma client if possible, but keep simple
type WorkExperience = {
    id: string;
    title: string;
    company: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    description: string | null;
};

type Education = {
    id: string;
    school: string;
    degree: string | null;
    fieldOfStudy: string | null;
    startDate: Date | null;
    endDate: Date | null;
};

interface ProfileEditorProps {
    user: {
        name: string | null;
        location: string | null;
        profession: string | null;
        skillsInventory: string[]; // cast from Json
        isVeteran?: boolean;
        willingnessToTeach?: boolean;
        residenceStatus?: string;
        sector?: "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY" | null;
        subSectors?: string[];
    };
    workHistory: WorkExperience[];
    education: Education[];
}

export default function ProfileEditor({ user, workHistory, education }: ProfileEditorProps) {
    const [isPending, startTransition] = useTransition();

    // -- Basic Info & Career Split State --
    const [basicInfo, setBasicInfo] = useState({
        name: user.name || "",
        location: user.location || "",
        profession: user.profession || "" // Career Field
    });

    // -- Badge Center State --
    const [badges, setBadges] = useState({
        isVeteran: user.isVeteran ?? false,
        willingnessToTeach: user.willingnessToTeach ?? false,
        residenceStatus: user.residenceStatus || "UNKNOWN"
    });

    // -- Taxonomy State --
    const [taxonomy, setTaxonomy] = useState({
        sector: user.sector as "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY" | null,
        subSectors: user.subSectors || []
    });
    const [expandedSector, setExpandedSector] = useState<string | null>(null);

    // -- Skills State --
    const [skills, setSkills] = useState<string[]>(user.skillsInventory || []);
    const [newSkill, setNewSkill] = useState("");

    // -- Work History State (For adding new) --
    const [isAddingWork, setIsAddingWork] = useState(false);
    const [newWork, setNewWork] = useState({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
    });

    // -- Education State (For adding new) --
    const [isAddingEdu, setIsAddingEdu] = useState(false);
    const [newEdu, setNewEdu] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: ""
    });

    // --- Handlers ---

    const handleSaveBasicInfo = () => {
        startTransition(async () => {
            const res = await updateProfileInfo({
                ...basicInfo,
                ...badges,
                ...taxonomy
            });
            if (res.success) toast.success("Profile updated successfully");
            else toast.error("Failed to save changes");
        });
    };

    const handleAddSkill = () => {
        if (!newSkill.trim() || skills.length >= 15) return;
        const updatedSkills = [...skills, newSkill.trim()];
        setSkills(updatedSkills);
        setNewSkill("");
        startTransition(async () => {
            await updateSkills(updatedSkills);
        });
    };

    const toggleSubSector = (sub: string) => {
        setTaxonomy(prev => {
            const exists = prev.subSectors.includes(sub);
            if (exists) return { ...prev, subSectors: prev.subSectors.filter(s => s !== sub) };
            return { ...prev, subSectors: [...prev.subSectors, sub] };
        });
    };

    const handleSectorClick = (sector: "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY") => {
        if (taxonomy.sector === sector) {
            setExpandedSector(expandedSector === sector ? null : sector);
        } else {
            setTaxonomy({ sector, subSectors: [] });
            setExpandedSector(sector);
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        const updatedSkills = skills.filter(s => s !== skillToRemove);
        setSkills(updatedSkills);
        startTransition(async () => {
            await updateSkills(updatedSkills);
        });
    };

    const handleSaveWork = () => {
        startTransition(async () => {
            const res = await addWorkExperience({
                ...newWork,
                startDate: new Date(newWork.startDate),
                endDate: newWork.endDate ? new Date(newWork.endDate) : undefined
            });
            if (res.success) {
                setIsAddingWork(false);
                setNewWork({ title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" });
            } else {
                toast.error(res.message);
            }
        });
    };

    const handleDeleteWork = (id: string) => {
        if (!confirm("Delete this experience?")) return;
        startTransition(async () => {
            await deleteWorkExperience(id);
        });
    };

    const handleSaveEdu = () => {
        startTransition(async () => {
            const res = await addEducation({
                ...newEdu,
                startDate: newEdu.startDate ? new Date(newEdu.startDate) : undefined,
                endDate: newEdu.endDate ? new Date(newEdu.endDate) : undefined
            });
            if (res.success) {
                setIsAddingEdu(false);
                setNewEdu({ school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" });
            } else {
                toast.error(res.message);
            }
        });
    };

    const handleDeleteEdu = (id: string) => {
        if (!confirm("Delete this education?")) return;
        startTransition(async () => {
            await deleteEducation(id);
        });
    };

    const SECTORS = {
        PRIMARY: { label: "Primary (Raw Materials)", icon: Leaf, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", subs: ["Agriculture", "Mining", "Forestry", "Fishing"] },
        SECONDARY: { label: "Secondary (Manufacturing)", icon: Factory, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", subs: ["Construction", "Automotive", "Textiles", "Energy"] },
        TERTIARY: { label: "Tertiary (Services)", icon: Store, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", subs: ["Retail", "Logistics", "Healthcare", "Finance"] },
        QUATERNARY: { label: "Quaternary (Knowledge)", icon: Cpu, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", subs: ["IT/Software", "Research", "Education", "Consulting"] },
    };

    return (
        <div className="space-y-12 max-w-3xl mx-auto pb-20">

            {/* Basic Info Section */}
            <section className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm space-y-4 transition-all hover:shadow-md">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h2 className="text-xl font-heading font-black text-pan-black flex items-center gap-2">
                        <Save size={20} className="text-gray-400" />
                        Basic Info Profile
                    </h2>
                    <button
                        onClick={handleSaveBasicInfo}
                        disabled={isPending}
                        className="text-sm font-bold bg-pan-black text-white px-4 py-2 rounded-lg hover:bg-pan-charcoal flex items-center gap-1 transition-colors"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Full Name</label>
                        <input
                            type="text"
                            value={basicInfo.name}
                            onChange={e => setBasicInfo({ ...basicInfo, name: e.target.value })}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-pan-black focus:ring-1 focus:ring-pan-black transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Location</label>
                        <div className="relative">
                            <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={basicInfo.location}
                                onChange={e => setBasicInfo({ ...basicInfo, location: e.target.value })}
                                className="w-full pl-9 p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-pan-black focus:ring-1 focus:ring-pan-black transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* --- SKILL VS CAREER SPLIT --- */}
                <div className="border-t border-gray-100 pt-6 mt-6">
                    <h3 className="text-lg font-heading font-bold text-pan-black mb-4">Skill vs. Career</h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Career Field */}
                        <div className="md:col-span-5">
                            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Career Field</label>
                            <p className="text-xs text-gray-400 mb-2">Define your primary discipline.</p>
                            <input
                                type="text"
                                value={basicInfo.profession}
                                onChange={e => setBasicInfo({ ...basicInfo, profession: e.target.value })}
                                placeholder="e.g. Civil Engineer"
                                className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-pan-black focus:ring-1 focus:ring-pan-black transition-all"
                            />
                        </div>

                        {/* Skill Tags */}
                        <div className="md:col-span-7">
                            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Skill Tags ({skills.length}/15)</label>
                            <p className="text-xs text-gray-400 mb-2">Add technical or specific skills (Max 15).</p>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {skills.map((skill, idx) => (
                                    <span key={idx} className="bg-pan-gold/10 text-pan-deep-brown px-3 py-1 rounded-lg text-xs font-bold border border-pan-gold/20 flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => handleRemoveSkill(skill)} className="text-pan-deep-brown/50 hover:text-red-500 transition-colors"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                    disabled={skills.length >= 15}
                                    placeholder={skills.length >= 15 ? "Skill limit reached" : "Add a new skill..."}
                                    className="flex-1 p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-pan-black disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                                />
                                <button
                                    onClick={handleAddSkill}
                                    disabled={!newSkill.trim() || isPending || skills.length >= 15}
                                    className="bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TAXONOMY SELECTOR */}
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all">
                <div className="mb-4">
                    <h2 className="text-xl font-heading font-black text-pan-black mb-1">Economic Taxonomy</h2>
                    <p className="text-sm text-gray-500">Select your active sector to shape your dashboard algorithm.</p>
                </div>

                {/* Sub-sector Chips */}
                {taxonomy.subSectors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {taxonomy.subSectors.map(sub => (
                            <span key={sub} className="flex items-center gap-1.5 px-3 py-1.5 bg-pan-black text-white text-xs font-bold rounded-full">
                                <CheckCircle2 size={12} /> {sub}
                            </span>
                        ))}
                    </div>
                )}

                {/* Grid Input */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(Object.keys(SECTORS) as Array<keyof typeof SECTORS>).map(key => {
                        const s = SECTORS[key];
                        const isSelected = taxonomy.sector === key;
                        const isExpanded = expandedSector === key;
                        const Icon = s.icon;

                        return (
                            <div key={key} className="col-span-1">
                                <button
                                    onClick={() => handleSectorClick(key)}
                                    className={clsx(
                                        "w-full h-full p-4 rounded-2xl border-2 transition-all text-left group",
                                        isSelected ? `${s.bg} ${s.border}` : "border-gray-100 bg-white hover:border-gray-200"
                                    )}
                                >
                                    <Icon className={clsx("w-6 h-6 mb-3", isSelected ? s.color : "text-gray-400 group-hover:text-gray-600 transition-colors")} />
                                    <h4 className={clsx("font-bold text-sm", isSelected ? s.color : "text-gray-700")}>
                                        {key}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-0.5">{s.label.split(" ")[1].replace(/[()]/g, "")}</p>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Expanded Sub-menu */}
                {expandedSector && SECTORS[expandedSector as keyof typeof SECTORS] && (
                    <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-in slide-in-from-top-2">
                        <p className="text-xs font-bold uppercase text-gray-500 mb-3 block">Specializations in {expandedSector}</p>
                        <div className="flex flex-wrap gap-2">
                            {SECTORS[expandedSector as keyof typeof SECTORS].subs.map(sub => {
                                const active = taxonomy.subSectors.includes(sub);
                                return (
                                    <button
                                        key={sub}
                                        onClick={() => toggleSubSector(sub)}
                                        className={clsx(
                                            "px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                                            active ? "bg-white border-pan-black text-pan-black shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                                        )}
                                    >
                                        {sub}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>

            {/* BADGE CENTER */}
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all">
                <div className="mb-6">
                    <h2 className="text-xl font-heading font-black text-pan-black mb-1">The Badge Center</h2>
                    <p className="text-sm text-gray-500">Configure your specialized statuses and network presence.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* The Enlistment */}
                    <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={badges.isVeteran}
                                onChange={e => setBadges({ ...badges, isVeteran: e.target.checked })}
                                className="mt-1 w-5 h-5 rounded border-gray-300 text-pan-deep-brown focus:ring-pan-deep-brown"
                            />
                            <div>
                                <span className="block font-bold text-gray-900">The Enlistment</span>
                                <span className="block text-xs text-gray-500 mt-1 mb-3">I am a military veteran.</span>
                                <div className="flex gap-2 p-2.5 rounded-lg bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold items-start">
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                    Visible only to Defense Contractors and Government Verified accounts.
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Mentor Status */}
                    <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <span className="block font-bold text-gray-900">Mentor Status</span>
                                <span className="block text-xs text-gray-500 mt-1">Willing to teach or advise.</span>
                            </div>
                            <button
                                onClick={() => setBadges({ ...badges, willingnessToTeach: !badges.willingnessToTeach })}
                                className={clsx(
                                    "w-12 h-6 rounded-full transition-colors relative",
                                    badges.willingnessToTeach ? "bg-green-500" : "bg-gray-300"
                                )}
                            >
                                <span className={clsx(
                                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                                    badges.willingnessToTeach ? "translate-x-6" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    </div>

                    {/* Diaspora vs. Continental */}
                    <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
                        <span className="block font-bold text-gray-900 mb-2">Network Segment</span>
                        <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                            <button
                                onClick={() => setBadges({ ...badges, residenceStatus: "DIASPORA" })}
                                className={clsx(
                                    "flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors",
                                    badges.residenceStatus === "DIASPORA" ? "bg-pan-black text-white shadow" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Diaspora
                            </button>
                            <button
                                onClick={() => setBadges({ ...badges, residenceStatus: "CONTINENTAL" })}
                                className={clsx(
                                    "flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors",
                                    badges.residenceStatus === "CONTINENTAL" ? "bg-pan-black text-white shadow" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Continental
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Work History Section */}
            <section className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm space-y-4 transition-all hover:shadow-md">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h2 className="text-xl font-heading font-black text-pan-black">Work Experience</h2>
                    <button onClick={() => setIsAddingWork(!isAddingWork)} className="text-sm font-bold text-pan-black hover:text-pan-gold flex items-center gap-1">
                        <Plus size={16} /> Add Experience
                    </button>
                </div>

                {isAddingWork && (
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-6 animate-in slide-in-from-top-2">
                        <input type="text" placeholder="Job Title" className="w-full p-2 border rounded-lg" value={newWork.title} onChange={e => setNewWork({ ...newWork, title: e.target.value })} />
                        <input type="text" placeholder="Company" className="w-full p-2 border rounded-lg" value={newWork.company} onChange={e => setNewWork({ ...newWork, company: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="p-2 border rounded-lg" value={newWork.startDate} onChange={e => setNewWork({ ...newWork, startDate: e.target.value })} />
                            <input type="date" className="p-2 border rounded-lg" value={newWork.endDate} onChange={e => setNewWork({ ...newWork, endDate: e.target.value })} disabled={newWork.current} />
                        </div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <input type="checkbox" checked={newWork.current} onChange={e => setNewWork({ ...newWork, current: e.target.checked })} />
                            I currently work here
                        </label>
                        <textarea placeholder="Description" className="w-full p-2 border rounded-lg h-24" value={newWork.description} onChange={e => setNewWork({ ...newWork, description: e.target.value })}></textarea>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddingWork(false)} className="px-3 py-1 text-sm font-bold text-gray-500">Cancel</button>
                            <button onClick={handleSaveWork} className="bg-pan-black text-white px-4 py-1.5 rounded-lg text-sm font-bold">Save</button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {workHistory.map(work => (
                        <div key={work.id} className="group relative pl-4 border-l-2 border-gray-100 hover:border-pan-gold transition-colors">
                            <button onClick={() => handleDeleteWork(work.id)} className="absolute right-0 top-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                            <h3 className="font-bold text-lg text-pan-black">{work.title}</h3>
                            <p className="text-sm font-bold text-gray-500">{work.company} • {work.location}</p>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                                {new Date(work.startDate).toLocaleDateString()} - {work.current ? "Present" : (work.endDate ? new Date(work.endDate).toLocaleDateString() : "")}
                            </p>
                            {work.description && <p className="text-sm text-gray-600 mt-2">{work.description}</p>}
                        </div>
                    ))}
                    {workHistory.length === 0 && !isAddingWork && <p className="text-gray-400 italic text-sm">No work history added.</p>}
                </div>
            </section>

            {/* Education Section */}
            <section className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm space-y-4 transition-all hover:shadow-md">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h2 className="text-xl font-heading font-black text-pan-black">Education</h2>
                    <button onClick={() => setIsAddingEdu(!isAddingEdu)} className="text-sm font-bold text-pan-black hover:text-pan-gold flex items-center gap-1">
                        <Plus size={16} /> Add Education
                    </button>
                </div>

                {isAddingEdu && (
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-6 animate-in slide-in-from-top-2">
                        <input type="text" placeholder="School" className="w-full p-2 border rounded-lg" value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} />
                        <input type="text" placeholder="Degree" className="w-full p-2 border rounded-lg" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                        <input type="text" placeholder="Field of Study" className="w-full p-2 border rounded-lg" value={newEdu.fieldOfStudy} onChange={e => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="p-2 border rounded-lg" value={newEdu.startDate} onChange={e => setNewEdu({ ...newEdu, startDate: e.target.value })} />
                            <input type="date" className="p-2 border rounded-lg" value={newEdu.endDate} onChange={e => setNewEdu({ ...newEdu, endDate: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAddingEdu(false)} className="px-3 py-1 text-sm font-bold text-gray-500">Cancel</button>
                            <button onClick={handleSaveEdu} className="bg-pan-black text-white px-4 py-1.5 rounded-lg text-sm font-bold">Save</button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {education.map(edu => (
                        <div key={edu.id} className="group relative pl-4 border-l-2 border-gray-100 hover:border-pan-gold transition-colors">
                            <button onClick={() => handleDeleteEdu(edu.id)} className="absolute right-0 top-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                            <h3 className="font-bold text-lg text-pan-black">{edu.school}</h3>
                            <p className="text-sm font-bold text-gray-500">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</p>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                                {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} - {edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
                            </p>
                        </div>
                    ))}
                    {education.length === 0 && !isAddingEdu && <p className="text-gray-400 italic text-sm">No education listed.</p>}
                </div>
            </section>

        </div>
    );
}
