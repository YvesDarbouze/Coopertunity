import React from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Eye, Users, UserPlus } from "lucide-react";

export function VitalSignsTicker() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
                title="Profile Views"
                value="1,248"
                trend={{ value: 12, isPositive: true }}
                icon={<Eye className="w-5 h-5" />}
                color="gold"
                className="border-l-4 border-pan-gold"
            />
            <MetricCard
                title="Active Matches"
                value="8"
                trend={{ value: 2, isPositive: true }}
                icon={<Users className="w-5 h-5" />}
                color="green"
                className="border-l-4 border-pan-green"
            />
            <MetricCard
                title="Stakeholder Requests"
                value="3"
                icon={<UserPlus className="w-5 h-5" />}
                color="blue"
                className="border-l-4 border-pan-service"
            />
        </div>
    );
}
