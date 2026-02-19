import React from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface ActivityItem {
    id: string;
    type: "Application" | "Match" | "Message";
    title: string;
    subtitle: string;
    date: string;
    status: "Pending" | "Active" | "Closed" | "Review";
}

const mockData: ActivityItem[] = [
    {
        id: "1",
        type: "Application",
        title: "Senior Marketing Manager",
        subtitle: "TechCorp Africa",
        date: "2 hours ago",
        status: "Pending",
    },
    {
        id: "2",
        type: "Match",
        title: "Project Collaboration",
        subtitle: "New match with Sarah Jenkins",
        date: "5 hours ago",
        status: "Active",
    },
    {
        id: "3",
        type: "Message",
        title: "Inquiry about partnership",
        subtitle: "From: Green Energy Solutions",
        date: "1 day ago",
        status: "Review",
    },
    {
        id: "4",
        type: "Application",
        title: "Regional Director",
        subtitle: "Pan-African Bank",
        date: "2 days ago",
        status: "Closed",
    },
];

const StatusBadge = ({ status }: { status: ActivityItem["status"] }) => {
    const styles = {
        Pending: "bg-yellow-100 text-yellow-800",
        Active: "bg-green-100 text-green-800",
        Closed: "bg-gray-100 text-gray-800",
        Review: "bg-blue-100 text-blue-800",
    };

    return (
        <span
            className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                styles[status]
            )}
        >
            {status}
        </span>
    );
};

export function RecentActivityTable() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-pan-deep-brown">
                    Recent Activity
                </h3>
                <button className="text-sm text-pan-gold hover:text-pan-gold/80 font-medium">
                    View All
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Details</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-pan-deep-brown">
                                    {item.type}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{item.title}</div>
                                    <div className="text-gray-500 text-xs">{item.subtitle}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-pan-deep-brown">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
