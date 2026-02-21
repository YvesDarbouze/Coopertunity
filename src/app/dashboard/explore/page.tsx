"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Users, Loader2, Globe, Building2, Flame } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

// Types based on the API response
type Author = {
    id: string;
    name: string | null;
    image: string | null;
    profession: string | null;
    isVeteran: boolean;
    location: string | null;
};

type PostResult = {
    id: string;
    title: string;
    description: string;
    type: string;
    sector: string;
    location: string | null;
    investmentAmount: number | null;
    isNonProfit: boolean;
    createdAt: string;
    author: Author;
};

type UserResult = {
    id: string;
    name: string | null;
    image: string | null;
    profession: string | null;
    location: string | null;
    sector: string | null;
    residenceStatus: string | null;
    skillsInventory: any;
};

export default function ExplorePage() {
    const [q, setQ] = useState("");
    const [location, setLocation] = useState("");
    const [sector, setSector] = useState("");
    const [type, setType] = useState<"POSTS" | "USERS">("POSTS");

    // Results
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const SECTORS = ["PRIMARY", "SECONDARY", "TERTIARY", "QUATERNARY"];

    // Inline Debounce mechanism
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResults();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, location, sector, type]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ type });
            if (q) params.append("q", q);
            if (sector) params.append("sector", sector);
            if (location) params.append("location", location);

            const res = await fetch(`/api/explore?${params}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data.results || []);
            }
        } catch (e) {
            console.error("Explore Search Failed:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#F5F3EF] min-h-screen pb-24">

            {/* Elegant Search Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-50 to-amber-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                                <Globe className="text-emerald-600" size={32} strokeWidth={2.5} />
                                Global Explore
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">Discover opportunities, projects, and stakeholders across the network.</p>
                        </div>
                        <Link href="/coopertunities/create" className="hidden md:flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-sm">
                            <span className="text-xl leading-none">+</span>
                            New
                        </Link>
                    </div>

                    {/* Master Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">

                        {/* Keyword */}
                        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <Search className="text-gray-400" size={20} />
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search skills, titles, or keywords..."
                                className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-gray-900 placeholder:font-normal"
                            />
                        </div>

                        {/* Location */}
                        <div className="md:w-64 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <MapPin className="text-gray-400" size={20} />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City or Country..."
                                className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-gray-900 placeholder:font-normal"
                            />
                        </div>

                        {/* Sector Dropdown */}
                        <div className="md:w-48 flex items-center px-4 py-2 bg-gray-50 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <select
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                className="w-full bg-transparent border-none focus:outline-none text-sm font-bold text-gray-700 uppercase"
                            >
                                <option value="">All Sectors</option>
                                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="max-w-7xl mx-auto px-6 flex gap-6 relative z-10">
                    <button
                        onClick={() => setType("POSTS")}
                        className={clsx(
                            "pb-4 font-bold text-sm flex items-center gap-2 transition-all relative",
                            type === "POSTS" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Building2 size={18} className={type === "POSTS" ? "text-amber-500" : ""} />
                        Opportunities
                        {type === "POSTS" && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full" />}
                    </button>

                    <button
                        onClick={() => setType("USERS")}
                        className={clsx(
                            "pb-4 font-bold text-sm flex items-center gap-2 transition-all relative",
                            type === "USERS" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Users size={18} className={type === "USERS" ? "text-emerald-500" : ""} />
                        Network Members
                        {type === "USERS" && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
                    </button>
                </div>
            </div>

            {/* Results Canvas */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Scanning Network</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto mt-12">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-300 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Matches Found</h3>
                        <p className="text-gray-500">We couldn't find any {type === "POSTS" ? "opportunities" : "members"} matching your exact search criteria. Try broadening your location or keyword.</p>

                        {(q || location || sector) && (
                            <button
                                onClick={() => { setQ(""); setLocation(""); setSector(""); }}
                                className="mt-8 px-6 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-full hover:bg-gray-200 transition"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : type === "POSTS" ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((post: PostResult) => (
                            <Link href={`/coopertunities/${post.id}`} key={post.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all group flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                        {post.type.replace('_', ' ')}
                                    </span>
                                    {post.sector && (
                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
                                            <Flame size={12} /> {post.sector}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
                                    {post.description}
                                </p>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={post.author?.image || `https://ui-avatars.com/api/?name=${post.author?.name || 'U'}&background=random`}
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                            alt={post.author?.name || "User"}
                                        />
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">{post.author?.name || "Unknown Author"}</p>
                                            <p className="text-[10px] text-gray-500">{post.location || post.author?.location || "Global"}</p>
                                        </div>
                                    </div>

                                    {post.isNonProfit && post.investmentAmount ? (
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase text-gray-400">Raising</p>
                                            <p className="text-xs font-black text-emerald-700">${post.investmentAmount.toLocaleString()}</p>
                                        </div>
                                    ) : null}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((user: UserResult) => (
                            <Link href={`/profile/${user.id}`} key={user.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group flex flex-col items-center text-center">

                                <div className="relative mb-4">
                                    <img
                                        src={user.image || `https://ui-avatars.com/api/?name=${user.name || 'U'}&background=random`}
                                        className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                                        alt={user.name || "User"}
                                    />
                                    {user.residenceStatus === "DIASPORA" && (
                                        <span className="absolute -bottom-2 right-0 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm border border-white">
                                            Diaspora
                                        </span>
                                    )}
                                    {user.residenceStatus === "CONTINENTAL" && (
                                        <span className="absolute -bottom-2 right-0 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm border border-white">
                                            Continental
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                                    {user.name}
                                </h3>

                                <p className="text-sm font-medium text-gray-500 mb-3">{user.profession || "Professional Member"}</p>

                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 font-medium">
                                    <MapPin size={14} /> {user.location || "Location Unknown"}
                                </div>

                                {user.sector && (
                                    <div className="mt-auto w-full pt-4 border-t border-gray-50 flex justify-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {user.sector}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
