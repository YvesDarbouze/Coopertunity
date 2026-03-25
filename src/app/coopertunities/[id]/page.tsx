import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const coopertunity = await prisma.coopertunity.findUnique({
        where: { id: params.id },
        select: { title: true, type: true, description: true }
    });

    if (!coopertunity) {
        return { title: 'Not Found | Coopertunity' };
    }

    return generateSEOMetadata({
        title: coopertunity.title,
        description: coopertunity.description.substring(0, 160) + (coopertunity.description.length > 160 ? "..." : ""),
        path: `/coopertunities/${params.id}`
    });
}
import { Shield, BookOpen, MapPin, DollarSign, Calendar, Users, Zap } from "lucide-react";
import Link from "next/link";
import { ConnectAuthorButton } from "@/components/coopertunity/ConnectAuthorButton";

interface Props {
    params: {
        id: string;
    };
}

export default async function CoopertunityDetailPage({ params }: Props) {
    const coopertunity = await prisma.coopertunity.findUnique({
        where: { id: params.id },
        include: {
            author: {
                select: {
                    name: true,
                    image: true,
                    isVeteran: true,
                    location: true,
                    profession: true,
                },
            },
        },
    });

    if (!coopertunity) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-cloud-dancer pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="mb-8">
                    <Link href="/coopertunities" className="text-mocha-mousse hover:text-deep-brown mb-4 inline-block transition font-bold">
                        ← Back to Feed
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-peach-fuzz/20 text-deep-brown mb-3 uppercase tracking-wider">
                                {coopertunity.sector} • {coopertunity.type.replace(/_/g, " ")}
                            </span>
                            <h1 className="text-4xl font-black text-deep-brown mb-2 font-heading">{coopertunity.title}</h1>
                            <div className="flex items-center gap-4 text-mocha-mousse text-sm font-medium">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {coopertunity.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Posted {new Date(coopertunity.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-deep-brown mb-4 font-heading">Description</h2>
                            <p className="text-mocha-mousse whitespace-pre-wrap leading-relaxed font-body">
                                {coopertunity.description}
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {coopertunity.investmentAmount && (
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                        <DollarSign className="w-5 h-5" />
                                        <h3 className="font-bold">Investment Amount</h3>
                                    </div>
                                    <p className="text-2xl font-black text-deep-brown">
                                        ${coopertunity.investmentAmount.toLocaleString()}
                                    </p>
                                </div>
                            )}


                        </div>

                        {coopertunity.requiredSkills && (coopertunity.requiredSkills as string[]).length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm col-span-full">
                                <div className="flex items-center gap-2 text-pan-gold mb-3">
                                    <Zap className="w-5 h-5" />
                                    <h3 className="font-bold text-deep-brown">Required Skills</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(coopertunity.requiredSkills as string[]).map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-peach-fuzz/10 border border-peach-fuzz/30 text-pan-charcoal text-xs font-bold rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(coopertunity as any).stakeholders && ((coopertunity as any).stakeholders as any[]).length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm col-span-full">
                                <div className="flex items-center gap-2 text-pan-blue mb-4">
                                    <Users className="w-5 h-5" />
                                    <h3 className="font-bold text-deep-brown">Open Squad Roles</h3>
                                </div>
                                <div className="space-y-3">
                                    {((coopertunity as any).stakeholders as any[]).map((role, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                            <div>
                                                <p className="font-bold text-sm text-deep-brown">{role.role}</p>
                                                <p className="text-xs text-mocha-mousse">{role.responsibility}</p>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-wider text-pan-blue bg-pan-blue/10 px-2 py-1 rounded">
                                                NEEDED
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar: Author Info */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-sm uppercase tracking-wider text-mocha-mousse font-black mb-4">Posted By</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                    {coopertunity.author.image ? (
                                        <img src={coopertunity.author.image} alt="Author" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-deep-brown">
                                            {coopertunity.author.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-deep-brown">{coopertunity.author.name}</h3>
                                        {coopertunity.author.isVeteran && (
                                            <Shield className="text-peach-fuzz w-4 h-4" />
                                        )}
                                    </div>
                                    <p className="text-sm text-mocha-mousse">{coopertunity.author.profession}</p>
                                </div>
                            </div>

                            <ConnectAuthorButton coopertunityId={coopertunity.id} />
                            <p className="text-center text-xs text-mocha-mousse/60 mt-3 font-medium">
                                Response tracked in Interactions log
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}
