import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Edit3, Trash2, Eye, Calendar, MapPin, Tag } from "lucide-react";
import clsx from "clsx";
import { ManagePostActions } from "@/components/dashboard/ManagePostActions";

export default async function MyCoopertunitiesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const myPosts = await prisma.coopertunity.findMany({
        where: { authorId: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-black text-pan-black mb-2">My Coopertunities</h1>
                    <p className="text-gray-600">Manage the projects, roles, and deals you have launched into the network.</p>
                </div>
                <Link
                    href="/coopertunities/create"
                    className="flex items-center gap-2 bg-pan-blue text-white px-5 py-2.5 rounded-xl font-bold hover:bg-pan-blue/90 transition shadow-sm"
                >
                    <Plus size={18} /> New Coopertunity
                </Link>
            </div>

            {myPosts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-peach-fuzz/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Tag className="text-pan-terracotta w-8 h-8" />
                    </div>
                    <h3 className="tex-xl font-bold font-heading mb-2">No Active Posts found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        You haven't launched any projects or deals yet. Start building your Squad by posting a new Coopertunity.
                    </p>
                    <Link
                        href="/coopertunities/create"
                        className="inline-flex items-center gap-2 bg-pan-black text-white px-6 py-3 rounded-xl font-bold hover:bg-pan-charcoal transition"
                    >
                        <Plus size={18} /> Launch First Post
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {myPosts.map((post) => (
                        <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm hover:shadow-md transition">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={clsx(
                                        "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        post.status === "OPEN" ? "bg-pan-green/10 text-pan-green" : "bg-gray-100 text-gray-500"
                                    )}>
                                        {post.status}
                                    </span>
                                    <span className="text-xs font-bold text-pan-gold uppercase tracking-wider">{post.type}</span>
                                </div>
                                <h3 className="font-heading font-bold text-xl text-pan-black truncate mb-2">{post.title}</h3>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                                    {post.location && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <MapPin size={14} /> {post.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Tag size={14} /> {post.sector}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <ManagePostActions postId={post.id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
