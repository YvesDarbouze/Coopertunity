import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import ResultsFeed from "@/components/coopertunity/ResultsFeed";

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            coopertunities: true,
            _count: {
                select: {
                    coopertunities: true,
                    // followers: true // If we had followers
                }
            }
        }
    });

    if (!user) notFound();

    return (
        <main className="min-h-screen bg-cloud-dancer pb-20">
            {/* Header / Cover */}
            <div className="h-48 md:h-64 bg-pan-charcoal relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pan-black to-pan-charcoal opacity-90"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cloud-dancer shadow-xl bg-gray-200 overflow-hidden">
                        {user.image ? (
                            <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-400 bg-white">
                                {user.name?.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 md:pt-20">
                        <h1 className="text-3xl md:text-5xl font-heading font-black text-pan-black mb-2">
                            {user.name}
                        </h1>
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
                            {user.isVeteran && (
                                <div className="flex items-center gap-1 text-pan-gold">
                                    <Briefcase size={16} />
                                    Veteran
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {/* Left Sidebar */}
                    <div className="space-y-8">
                        {/* Bio (Placeholder for now as it's not in User model explicitely but maybe 'profession' or add a bio field) */}
                        <div className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm">
                            <h3 className="font-heading font-bold text-lg mb-4">About</h3>
                            <p className="text-gray-600 leading-relaxed">
                                { /* user.bio || */ "This user has not added a bio yet."}
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="bg-white p-6 rounded-2xl border border-pan-black/10 shadow-sm">
                            <h3 className="font-heading font-bold text-lg mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {/* Mock skills if skillsInventory is JSON */}
                                {(user.skillsInventory as any)?.skills?.slice(0, 5).map((skill: string) => (
                                    <span key={skill} className="bg-cloud-dancer text-pan-black px-3 py-1 rounded-full text-xs font-bold border border-pan-black/10">
                                        {skill}
                                    </span>
                                )) || <span className="text-gray-400 italic">No skills listed</span>}
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div className="md:col-span-2 space-y-8">
                        <h3 className="font-heading font-bold text-2xl border-b border-pan-black/10 pb-4">
                            Active Coopertunities
                        </h3>

                        {user.coopertunities.length > 0 ? (
                            <ResultsFeed coopertunities={user.coopertunities.map(c => ({ ...c, author: user }))} />
                        ) : (
                            <p className="text-gray-500 italic">No active projects.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
