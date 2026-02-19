"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Briefcase, GraduationCap, X, Save } from "lucide-react";
import { updateProfileInfo, updateSkills, addWorkExperience, deleteWorkExperience, addEducation, deleteEducation } from "@/app/actions/profile";
import clsx from "clsx";

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
    };
    workHistory: WorkExperience[];
    education: Education[];
}

export default function ProfileEditor({ user, workHistory, education }: ProfileEditorProps) {
    const [isPending, startTransition] = useTransition();

    // -- Basic Info State --
    const [basicInfo, setBasicInfo] = useState({
        name: user.name || "",
        location: user.location || "",
        profession: user.profession || ""
    });

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
            const res = await updateProfileInfo(basicInfo);
            if (res.success) alert("Profile updated!");
            else alert("Failed to update.");
        });
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;
        const updatedSkills = [...skills, newSkill.trim()];
        setSkills(updatedSkills);
        setNewSkill("");
        startTransition(async () => {
            await updateSkills(updatedSkills);
        });
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
                alert(res.message);
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
                alert(res.message);
            }
        });
    };

    const handleDeleteEdu = (id: string) => {
        if (!confirm("Delete this education?")) return;
        startTransition(async () => {
            await deleteEducation(id);
        });
    };

    return (
        <div className="space-y-12 max-w-3xl mx-auto pb-20">

            {/* Basic Info Section */}
            <section className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm space-y-4 transition-all hover:shadow-md">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h2 className="text-xl font-heading font-black text-pan-black">Basic Info</h2>
                    <button
                        onClick={handleSaveBasicInfo}
                        disabled={isPending}
                        className="text-sm font-bold text-pan-black hover:text-pan-gold flex items-center gap-1"
                    >
                        <Save size={16} /> Save
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Full Name</label>
                        <input
                            type="text"
                            value={basicInfo.name}
                            onChange={e => setBasicInfo({ ...basicInfo, name: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pan-black transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Profession / Headline</label>
                        <input
                            type="text"
                            value={basicInfo.profession}
                            onChange={e => setBasicInfo({ ...basicInfo, profession: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pan-black transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Location</label>
                        <input
                            type="text"
                            value={basicInfo.location}
                            onChange={e => setBasicInfo({ ...basicInfo, location: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pan-black transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm space-y-4 transition-all hover:shadow-md">
                <h2 className="text-xl font-heading font-black text-pan-black border-b border-gray-100 pb-2">Skills</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill, idx) => (
                        <span key={idx} className="bg-cloud-dancer text-pan-black px-3 py-1 rounded-full text-xs font-bold border border-pan-black/10 flex items-center gap-2">
                            {skill}
                            <button onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                        </span>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        placeholder="Add a new skill..."
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pan-black transition-colors"
                        onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button
                        onClick={handleAddSkill}
                        disabled={!newSkill.trim() || isPending}
                        className="bg-pan-black text-white px-4 py-2 rounded-lg font-bold hover:bg-pan-charcoal transition-colors disabled:opacity-50"
                    >
                        Add
                    </button>
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
