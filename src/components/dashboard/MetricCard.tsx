import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
    className?: string;
    color?: "gold" | "green" | "red" | "blue";
}

export function MetricCard({
    title,
    value,
    trend,
    icon,
    className,
    color = "gold",
}: MetricCardProps) {
    const colorStyles = {
        gold: "bg-white border-l-4 border-pan-gold",
        green: "bg-white border-l-4 border-pan-green",
        red: "bg-white border-l-4 border-pan-red",
        blue: "bg-white border-l-4 border-pan-service",
    };

    return (
        <div
            className={cn(
                "p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow",
                colorStyles[color],
                className
            )}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-pan-deep-brown mt-1">
                        {value}
                    </h3>
                </div>
                {icon && (
                    <div className="p-2 rounded-full bg-gray-50 text-pan-deep-brown">
                        {icon}
                    </div>
                )}
            </div>

            {trend && (
                <div className="mt-4 flex items-center">
                    <span
                        className={cn(
                            "flex items-center text-sm font-medium",
                            trend.isPositive ? "text-pan-green" : "text-pan-red"
                        )}
                    >
                        {trend.isPositive ? (
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(trend.value)}%
                    </span>
                    <span className="ml-2 text-sm text-gray-400">vs last month</span>
                </div>
            )}
        </div>
    );
}
