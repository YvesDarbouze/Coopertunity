"use client";

import { useEffect, useState } from "react";
import { History, X, Search } from "lucide-react";
import clsx from "clsx";

interface SearchHistoryWidgetProps {
    onSelectQuery: (query: string) => void;
}

export function SearchHistoryWidget({ onSelectQuery }: SearchHistoryWidgetProps) {
    const [history, setHistory] = useState<{ id: string; query: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/search/history");
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error("Failed to load search history", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading || history.length === 0) return null;

    return (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                <History size={14} /> Recent Searches
            </div>
            <div className="flex flex-col">
                {history.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectQuery(item.query)}
                        className="flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors group"
                    >
                        <Search size={14} className="text-gray-300 group-hover:text-emerald-500" />
                        <span className="flex-1 truncate">{item.query}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
