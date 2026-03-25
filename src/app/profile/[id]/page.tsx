import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Briefcase, GraduationCap, Shield } from "lucide-react";
import ResultsFeed from "@/components/coopertunity/ResultsFeed";
import { ConnectAuthorButton } from "@/components/coopertunity/ConnectAuthorButton";
import { generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: { name: true, profession: true, image: true, _count: { select: { coopertunities: true } } }
    });

    if (!user) {
        return { title: 'Unknown Member | Coopertunity' };
    }

    return generateSEOMetadata({
        title: user.name || "Member",
        description: `View ${user.name}'s professional profile on Coopertunity. ${user.profession ? `They are a ${user.profession}.` : ''}`,
        path: `/profile/${params.id}`,
        image: user.image || undefined,
    });
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            coopertunities: true,
            workHistory: {
                orderBy: { startDate: 'desc' }
            },
            education: {
                orderBy: { startDate: 'desc' }
            },
            _count: {
                select: {
                    coopertunities: true,
                }
            }
        }
    });

    if (!user) notFound();

    // The skills schema uses a raw array now
    const skills = Array.isArray(user.skillsInventory) ? user.skillsInventory : [];

    return (
        <main className="min-h-screen bg-cloud-dancer pb-20">
            {/* Header / Cover */}
            <div className="h-48 md:h-64 bg-pan-charcoal relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pan-black to-pan-charcoal opacity-90"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cloud-dancer shadow-xl bg-gray-200 overflow-hidden shrink-0 mt-[-4rem]">
                        {user.image ? (
                            <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl font-black text-gray-400 bg-white">
                                {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 md:pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-5xl font-heading font-black text-pan-black">
                                    {user.name}
                                </h1>
                                {user.isVeteran && (
                                    <div title="The Enlistment - Verified Veteran" className="bg-pan-red/10 p-2 rounded-full border border-pan-red/20 shadow-sm self-start mt-1">
                                        <Shield size={20} className="text-pan-red" />
                                    </div>
                                )}
                            </div>

                            {/* Reuse the interaction button mapped specifically to this user context if needed, or build a simple form. 
                                Since ConnectAuthorButton uses coopertunityId, we'll build a direct connect button for users. */}
                            <form action={async () => {
                                "use server";
                                // A simplified server action call to POST /api/interactions or handle directly
                            }}>
                                <button className="bg-pan-gold hover:bg-amber-500 text-deep-brown font-bold px-6 py-2.5 rounded-full shadow-sm transition-colors text-sm uppercase tracking-wider hidden md:block">
                                    Connect
                                </button>
                            </form>

                        </div>

                        <p className="text-xl text-pan-black/60 font-medium mb-4">
                            {user.profession || "Member"}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-600 mb-6">
                            {user.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-pan-gold" />
                                    {user.location}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {/* Left Sidebar */}
                    <div className="space-y-8">
                        {/* Bio */}
                        {user.bio && (
                            <div className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm">
                                <h3 className="font-heading font-bold text-lg mb-4 text-deep-brown">About</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {user.bio}
                                </p>
                            </div>
                        )}

                        {/* Skills */}
                        <div className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm">
                            <h3 className="font-heading font-bold text-lg mb-4 text-deep-brown">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.length > 0 ? (skills as string[]).slice(0, 15).map((skill: string) => (
                                    <span key={skill} className="bg-cloud-dancer text-pan-black px-3 py-1 rounded-full text-xs font-bold border border-pan-black/10">
                                        {skill}
                                    </span>
                                )) : <span className="text-gray-400 italic text-sm">No skills listed</span>}
                            </div>
                        </div>

                        {/* Experience */}
                        {user.workHistory.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm">
                                <h3 className="font-heading font-bold text-lg mb-4 text-deep-brown flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-pan-gold" /> Experience
                                </h3>
                                <div className="space-y-4">
                                    {user.workHistory.map(work => (
                                        <div key={work.id}>
                                            <p className="font-bold text-sm text-gray-900">{work.title}</p>
                                            <p className="text-xs text-gray-600 font-medium">{work.company}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {work.startDate ? new Date(work.startDate).getFullYear() : 'N/A'} - {work.current ? "Present" : (work.endDate ? new Date(work.endDate).getFullYear() : "")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {user.education.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm">
                                <h3 className="font-heading font-bold text-lg mb-4 text-deep-brown flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-pan-blue" /> Education
                                </h3>
                                <div className="space-y-4">
                                    {user.education.map(edu => (
                                        <div key={edu.id}>
                                            <p className="font-bold text-sm text-gray-900">{edu.school}</p>
                                            <p className="text-xs text-gray-600 font-medium">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {edu.startDate ? new Date(edu.startDate).getFullYear() : 'N/A'} - {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Feed */}
                    <div className="md:col-span-2 space-y-8">
                        <h3 className="font-heading font-bold text-2xl border-b border-pan-black/10 pb-4 text-deep-brown">
                            Active Coopertunities
                        </h3>

                        {user.coopertunities.length > 0 ? (
                            <ResultsFeed coopertunities={user.coopertunities.map(c => ({ ...c, author: user as any }))} />
                        ) : (
                            <p className="text-gray-500 italic">No active projects.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
