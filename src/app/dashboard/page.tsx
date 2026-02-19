
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Briefcase, Users, Bookmark, MessageSquare,
    Plus, ArrowRight, Loader2, MapPin, Bell,
    TrendingUp, Clock
} from "lucide-react";
import clsx from "clsx";
import { QuickLaunchWidget } from "@/components/dashboard/QuickLaunchWidget";

// ─── Types ────────────────────────────────────────────────────────────────────

type Post = {
    id: string;
    title: string;
    sector: string;
    type: string;
    location?: string;
    status: string;
    createdAt: string;
};

type Connection = {
    id: string;
    name: string | null;
    image: string | null;
    profession: string | null;
};

type SavedItem = {
    id: string;
    targetId: string;
    targetType: string;
    createdAt: string;
};

type DashboardData = {
    posts: Post[];
    saved: SavedItem[];
    matches: Connection[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SECTOR_COLORS: Record<string, string> = {
    PRIMARY: "bg-amber-700",
    SECONDARY: "bg-blue-700",
    TERTIARY: "bg-emerald-700",
    QUATERNARY: "bg-purple-700",
};

const TYPE_LABELS: Record<string, string> = {
    PROJECT: "Project",
    ROLE: "Role",
    DEAL: "Deal",
    LAND_DEAL: "Land Deal",
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
    icon: Icon,
    label,
    value,
    color,
    href,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color: string;
    href?: string;
}) {
    const inner = (
        <div className={clsx(
            "flex items-center gap-4 p-5 rounded-xl border transition-all hover:shadow-md",
            "bg-white border-l-4",
            color
        )}>
            <div className="p-3 rounded-full bg-gray-50">
                <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">{value}</p>
            </div>
            {href && <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />}
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

function PostCard({ post }: { post: Post }) {
    return (
        <Link href={`/coopertunities/${post.id}`}>
            <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between mb-3">
                    <span className={clsx(
                        "text-[10px] font-black uppercase px-2 py-0.5 text-white rounded-sm",
                        SECTOR_COLORS[post.sector] ?? "bg-gray-500"
                    )}>
                        {post.sector}
                    </span>
                    <span className={clsx(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        post.status === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                    )}>
                        {post.status}
                    </span>
                </div>
                <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{post.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                    {post.location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {post.location}
                        </span>
                    )}
                    <span className="flex items-center gap-1 ml-auto">
                        <Clock size={11} />
                        {timeAgo(post.createdAt)}
                    </span>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    {TYPE_LABELS[post.type] ?? post.type}
                </div>
            </div>
        </Link>
    );
}

function ConnectionRow({ user }: { user: Connection }) {
    return (
        <Link href={`/profile/${user.id}`}>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {user.image ? (
                    <img src={user.image} alt={user.name ?? ""} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-sm uppercase">
                        {user.name?.[0] ?? "?"}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name ?? "Unknown"}</p>
                    {user.profession && (
                        <p className="text-xs text-gray-400 truncate">{user.profession}</p>
                    )}
                </div>
                <ArrowRight size={14} className="text-gray-300 shrink-0" />
            </div>
        </Link>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData | null>(null);
    const [msgCount, setMsgCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [dashRes, msgRes] = await Promise.all([
                    fetch("/api/dashboard"),
                    fetch("/api/messages"),
                ]);
                if (dashRes.ok) setData(await dashRes.json());
                if (msgRes.ok) {
                    const convs = await msgRes.json();
                    setMsgCount(Array.isArray(convs) ? convs.length : 0);
                }
            } catch (e) {
                console.error("Dashboard load error", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const firstName = session?.user?.name?.split(" ")[0] ?? "there";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-700 w-8 h-8" />
            </div>
        );
    }

    const posts = data?.posts ?? [];
    const connections = data?.matches ?? [];
    const saved = data?.saved ?? [];

    return (
        <div className="min-h-screen bg-[#F5F3EF]">
            {/* ── Header Banner ── */}
            <div className="bg-gradient-to-r from-[#3D2B1F] to-[#5C3D2E] text-white px-6 py-10">
                <div className="max-w-7xl mx-auto">
                    <p className="text-amber-300 text-sm font-semibold uppercase tracking-widest mb-1">Welcome back</p>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        Hey, {firstName} 👋
                    </h1>
                    <p className="text-white/60 mt-1 text-sm">
                        Here's what's happening with your Coopertunity network.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* ── Stat Bar ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={Briefcase}
                        label="My Posts"
                        value={posts.length}
                        color="border-amber-500"
                        href="/coopertunities"
                    />
                    <StatCard
                        icon={Users}
                        label="Connections"
                        value={connections.length}
                        color="border-emerald-500"
                        href="/dashboard/matches"
                    />
                    <StatCard
                        icon={Bookmark}
                        label="Saved"
                        value={saved.length}
                        color="border-blue-500"
                    />
                    <StatCard
                        icon={MessageSquare}
                        label="Conversations"
                        value={msgCount}
                        color="border-purple-500"
                        href="/messages"
                    />
                </div>

                {/* ── Two-column layout ── */}
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Left — main content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* My Coopertunities */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-amber-600" />
                                    My Coopertunities
                                </h2>
                                <Link
                                    href="/coopertunities/create"
                                    className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                                >
                                    <Plus size={16} />
                                    New
                                </Link>
                            </div>

                            <div className="p-4">
                                {posts.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        <Briefcase size={36} className="mx-auto mb-3 opacity-30" />
                                        <p className="text-sm font-medium">No posts yet.</p>
                                        <Link
                                            href="/coopertunities/create"
                                            className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-amber-700 hover:underline"
                                        >
                                            Post your first Coopertunity <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {posts.map((post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Saved Items */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Bookmark size={18} className="text-blue-500" />
                                    Saved Items
                                </h2>
                                <span className="text-xs text-gray-400 font-medium">{saved.length} item{saved.length !== 1 ? "s" : ""}</span>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {saved.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <Bookmark size={32} className="mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Nothing saved yet. Browse Coopertunities to bookmark ones you like.</p>
                                    </div>
                                ) : (
                                    saved.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 px-6 py-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                                    {item.targetType}
                                                </p>
                                                <p className="text-sm text-gray-700 font-medium truncate font-mono">
                                                    {item.targetId}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 shrink-0">{timeAgo(item.createdAt)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right — sidebar */}
                    <div className="space-y-6">
                        {/* Quick Launch */}
                        <QuickLaunchWidget />

                        {/* Connections */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Users size={16} className="text-emerald-600" />
                                    Active Connections
                                </h2>
                                <Link
                                    href="/dashboard/matches"
                                    className="text-xs font-semibold text-emerald-700 hover:underline"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="px-2 py-2">
                                {connections.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 px-4">
                                        <Users size={28} className="mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">No connections yet.</p>
                                        <Link
                                            href="/dashboard/explore"
                                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                                        >
                                            Explore people <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                ) : (
                                    connections.map((user) => (
                                        <ConnectionRow key={user.id} user={user} />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Quick Links */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Bell size={16} className="text-amber-500" />
                                Quick Links
                            </h2>
                            <div className="space-y-1">
                                {[
                                    { label: "Browse Coopertunities", href: "/coopertunities" },
                                    { label: "My Messages", href: "/messages" },
                                    { label: "Edit Profile", href: "/dashboard/settings/profile" },
                                    { label: "Explore Network", href: "/dashboard/explore" },
                                ].map(({ label, href }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors font-medium"
                                    >
                                        {label}
                                        <ArrowRight size={13} className="text-gray-300" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
