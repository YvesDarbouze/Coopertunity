"use client";

import React from "react";

// Simple mock data approach for a bar chart
// In a real app, you might use Recharts or Chart.js
const data = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 25 },
    { day: "Wed", value: 60 },
    { day: "Thu", value: 35 },
    { day: "Fri", value: 75 },
    { day: "Sat", value: 20 },
    { day: "Sun", value: 50 },
];

export function ActivityChart() {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-pan-deep-brown">
                    Weekly Engagement
                </h3>
                <p className="text-sm text-gray-500">
                    Profile views and interaction summary
                </p>
            </div>

            <div className="flex items-end justify-between h-48 gap-2">
                {data.map((item) => (
                    <div key={item.day} className="flex flex-col items-center flex-1 group">
                        <div className="relative w-full flex justify-center items-end h-full">
                            <div
                                className="w-full max-w-[24px] bg-pan-gold/80 rounded-t-sm hover:bg-pan-gold transition-all duration-300 relative group-hover:shadow-lg"
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-pan-deep-brown text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {item.value} views
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 mt-2">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
