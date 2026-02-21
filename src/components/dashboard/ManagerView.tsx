"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Plus, LayoutGrid, List as ListIcon, MapPin, HandHeart, CircleDollarSign, CheckCircle2, XCircle, LayoutDashboard } from "lucide-react";
import clsx from "clsx";
import { updateMatchStatus, updateCoopertunityStatus } from "@/app/actions/manage";
// @ts-ignore
import { formatDistanceToNow } from "date-fns";

// Match type inferred from API
type Candidate = {
    id: string;
    userId: string;
    score: number;
    status: string; // PENDING, ACCEPTED, REJECTED
    user: {
        id: string;
        name: string | null;
        profession: string | null;
        location: string | null;
        image: string | null;
        skillsInventory: string[]; // JSONB
    }
};

type ManagedCoopertunity = {
    id: string;
    title: string;
    type: string;
    sector: string;
    location: string | null;
    status: string; // DRAFT, OPEN, IN_PROGRESS, CLOSED
    isNonProfit: boolean;
    investmentAmount: number | null;
    amountRaised: number;
    investorsCount: number;
    createdAt: string;
    matches: Candidate[];
};

export default function MyCoopertunitiesManager() {
    const [posts, setPosts] = useState<ManagedCoopertunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

    // Fetch initial data
    const loadPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/coopertunities/manage");
            if (res.ok) {
                const data = await res.json();
                // Ensure Drafts are explicitly categorized or filter default ones
                const sanitized = data.map((p: any) => ({
                    ...p,
                    status: p.status === "OPEN" ? "OPEN" : p.status // Base schema is OPEN default, map custom if needed
                }));
                setPosts(sanitized);
            }
        } catch (e) {
            console.error("Failed to load managed posts", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    // Action Handlers
    const handleStatusUpdate = async (coopId: string, newStatus: any) => {
        const res = await updateCoopertunityStatus(coopId, newStatus);
        if (res.success) {
            setPosts(prev => prev.map(p => p.id === coopId ? { ...p, status: newStatus } : p));
        } else {
            alert(res.message);
        }
    };

    const handleApplicantDecision = async (coopId: string, matchId: string, decision: "ACCEPTED" | "REJECTED") => {
        const res = await updateMatchStatus(matchId, decision);
        if (res.success) {
            setPosts(prev => prev.map(p => {
                if (p.id !== coopId) return p;
                return {
                    ...p,
                    matches: p.matches.map(m => m.id === matchId ? { ...m, status: decision } : m)
                };
            }));
        } else {
            alert(res.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    // --- Sub-Components --- //

    const PostTrackers = ({ post }: { post: ManagedCoopertunity }) => {
        if (post.isNonProfit) {
            const goal = post.investmentAmount || 1; // Prevent div/0
            const percentage = Math.min((post.amountRaised / goal) * 100, 100);
            return (
                <div className="mt-4 p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                        <div className="flex justify-between text-xs font-bold text-green-800 mb-1">
                            <span className="flex items-center gap-1.5"><HandHeart size={14} /> Donation Tracker</span>
                            <span>${post.amountRaised.toLocaleString()} / ${post.investmentAmount?.toLocaleString() || "Goal"}</span>
                        </div>
                        <div className="w-full bg-green-200/50 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                </div>
            );
        }

        if (post.type === "DEAL" || post.type === "LAND_DEAL") {
            return (
                <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                            <CircleDollarSign size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Commitment Tracker</p>
                            <p className="text-sm font-semibold text-amber-900">{post.investorsCount} Investors Committed</p>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    const CandidateCard = ({ post, match }: { post: ManagedCoopertunity, match: Candidate }) => {
        const percentage = Math.round(match.score * 100);
        return (
            <div className="bg-white border text-left border-gray-100 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center relative transition hover:shadow-sm">
                {/* Score badge */}
                <div className="absolute top-4 right-4 text-center">
                    <div className={clsx(
                        "w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm",
                        percentage >= 80 ? "border-green-400 text-green-700" :
                            percentage >= 50 ? "border-amber-400 text-amber-700" : "border-gray-200 text-gray-500"
                    )}>
                        {percentage}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 block">Match</span>
                </div>

                <img
                    src={match.user.image || `https://ui-avatars.com/api/?name=${match.user.name || 'U'}&background=random`}
                    alt="Applicant"
                    className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1 pr-14">
                    <h4 className="font-bold text-gray-900">{match.user.name || "Anonymous Applicant"}</h4>
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <MapPin size={12} /> {match.user.location || "Location Unknown"}
                    </p>
                    <p className="text-sm mt-1 text-gray-600 line-clamp-1">{match.user.profession || "No Title Listed"}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    {match.status === "PENDING" ? (
                        <>
                            <button
                                onClick={() => handleApplicantDecision(post.id, match.id, "REJECTED")}
                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 flex items-center gap-1 transition"
                            >
                                <XCircle size={14} /> Pass
                            </button>
                            <button
                                onClick={() => handleApplicantDecision(post.id, match.id, "ACCEPTED")}
                                className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 flex items-center gap-1 transition"
                            >
                                <CheckCircle2 size={14} /> Shortlist
                            </button>
                        </>
                    ) : (
                        <span className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 uppercase tracking-wider",
                            match.status === "ACCEPTED" ? "bg-green-100 text-green-800" : "bg-red-50 text-red-500"
                        )}>
                            {match.status === "ACCEPTED" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {match.status}
                        </span>
                    )}
                    <Link
                        href={`/messages?user=${match.user.id}`}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition whitespace-nowrap"
                    >
                        Message
                    </Link>
                </div>
            </div>
        );
    };

    // --- Render Logic --- //

    // Grouping for Kanban
    const columns = {
        OPEN: posts.filter(p => p.status === "OPEN"),
        IN_PROGRESS: posts.filter(p => p.status === "IN_PROGRESS"),
        CLOSED: posts.filter(p => p.status === "CLOSED"),
    };

    return (
        <div className="bg-[#F5F3EF] min-h-screen">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10 w-full mb-8 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <LayoutDashboard className="text-amber-600" /> Manager
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Manage your active posts, applicants, and funding trackers.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center">
                            <button
                                onClick={() => setViewMode("list")}
                                className={clsx("p-2 rounded-lg transition text-xs font-bold flex items-center gap-1", viewMode === "list" ? "bg-white shadow text-gray-900" : "text-gray-500")}
                            >
                                <ListIcon size={16} /> List
                            </button>
                            <button
                                onClick={() => setViewMode("kanban")}
                                className={clsx("p-2 rounded-lg transition text-xs font-bold flex items-center gap-1", viewMode === "kanban" ? "bg-white shadow text-gray-900" : "text-gray-500")}
                            >
                                <LayoutGrid size={16} /> Board
                            </button>
                        </div>

                        <Link
                            href="/coopertunities/create"
                            className="bg-pan-black hover:bg-pan-charcoal text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition"
                        >
                            <Plus size={16} /> Create New
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20">
                {posts.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm max-w-lg mx-auto mt-20">
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LayoutGrid size={32} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">No Active Posts</h2>
                        <p className="text-gray-500 mb-6 text-sm">You haven't published any Coopertunities yet. Create a deal, role, or project to see it appear here.</p>
                        <Link
                            href="/coopertunities/create"
                            className="bg-pan-black hover:bg-pan-charcoal text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 justify-center w-full transition"
                        >
                            <Plus size={18} /> Create Your First Post
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* KANBAN VIEW */}
                        {viewMode === "kanban" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full">
                                {Object.entries(columns).map(([statusKey, list]) => (
                                    <div key={statusKey} className="bg-gray-100/50 rounded-2xl p-4 min-h-[500px] border border-gray-200 border-dashed">
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h3 className="font-bold text-gray-700">{statusKey.replace("_", " ")}</h3>
                                            <span className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-gray-100">{list.length}</span>
                                        </div>

                                        <div className="space-y-4">
                                            {list.map(post => (
                                                <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mb-2">{post.type}</span>
                                                    <h4 className="font-bold text-sm text-gray-900 mb-1 leading-snug">{post.title}</h4>
                                                    <p className="text-xs text-gray-400 font-medium mb-3">{formatDistanceToNow(new Date(post.createdAt))} ago</p>

                                                    <PostTrackers post={post} />

                                                    <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center w-full">
                                                        <span className="text-xs font-bold text-gray-500">{post.matches.length} Applicants</span>
                                                        <select
                                                            className="text-xs font-bold text-gray-700 bg-gray-50 border-none outline-none cursor-pointer rounded-lg px-2 py-1"
                                                            value={post.status}
                                                            onChange={(e) => handleStatusUpdate(post.id, e.target.value)}
                                                        >
                                                            <option value="OPEN">Live</option>
                                                            <option value="IN_PROGRESS">Working</option>
                                                            <option value="CLOSED">Completed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                            {list.length === 0 && <p className="text-center text-gray-400 text-xs py-4 font-medium italic">Drop here</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* LIST VIEW */}
                        {viewMode === "list" && (
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                                {posts.map((post, index) => (
                                    <div key={post.id} className={clsx("border-gray-100", index !== posts.length - 1 && "border-b")}>
                                        {/* Row Header */}
                                        <div
                                            className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                                            onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className={clsx(
                                                        "text-[10px] uppercase font-black px-2 py-0.5 rounded-full",
                                                        post.status === "OPEN" ? "bg-green-100 text-green-700" :
                                                            post.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                                                    )}>
                                                        {post.status.replace("_", " ")}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{post.sector}</span>
                                                    <span className="text-[10px] text-gray-400 ml-2">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
                                            </div>

                                            <div className="flex md:items-center gap-4 w-full lg:w-auto overflow-x-auto">
                                                <div className="text-center shrink-0">
                                                    <p className="text-xl font-black text-gray-900">{post.matches.length}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applicants</p>
                                                </div>
                                                <div className="h-10 w-px bg-gray-200 hidden md:block mx-2"></div>
                                                <div className="shrink-0 min-w-[200px]">
                                                    <PostTrackers post={post} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inbox Expansion */}
                                        {expandedPostId === post.id && (
                                            <div className="bg-gray-50/80 p-6 border-t border-gray-100 inner-shadow">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-black text-xs uppercase tracking-widest text-gray-500">Interested Parties ({post.matches.length})</h4>

                                                    {/* Inline Status Changer */}
                                                    <select
                                                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 shadow-sm cursor-pointer rounded-lg px-3 py-1.5 focus:border-amber-500 outline-none transition"
                                                        value={post.status}
                                                        onChange={(e) => handleStatusUpdate(post.id, e.target.value)}
                                                    >
                                                        <option value="OPEN">Mark as Live</option>
                                                        <option value="IN_PROGRESS">Mark as Working</option>
                                                        <option value="CLOSED">Mark as Completed</option>
                                                    </select>
                                                </div>

                                                {post.matches.length === 0 ? (
                                                    <div className="text-center py-8 bg-white border border-gray-100 rounded-xl border-dashed">
                                                        <p className="text-sm font-bold text-gray-400">No applicants yet.</p>
                                                        <p className="text-xs text-gray-400 mt-1">Check back later or promote your post.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {post.matches.map(match => (
                                                            <CandidateCard key={match.id} post={post} match={match} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
