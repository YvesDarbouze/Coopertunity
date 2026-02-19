import React from "react";
import { User, DollarSign, Users, ArrowRight } from "lucide-react";
import clsx from "clsx";

interface ActivityCardProps {
    type: "investment" | "connection" | "squad_join";
    actor: {
        name: string;
        image?: string;
    };
    target: {
        name: string; // e.g., "Solar Farm Project", "John Doe", "Accra Tech Squad"
        id?: string;
    };
    timestamp: string;
}

export function ActivityCard({ type, actor, target, timestamp }: ActivityCardProps) {
    const getIcon = () => {
        switch (type) {
            case "investment":
                return <DollarSign className="w-4 h-4 text-green-600" />;
            case "connection":
                return <Users className="w-4 h-4 text-blue-600" />;
            case "squad_join":
                return <User className="w-4 h-4 text-purple-600" />;
            default:
                return <User className="w-4 h-4 text-gray-600" />;
        }
    };

    const getActionText = () => {
        switch (type) {
            case "investment":
                return "invested in";
            case "connection":
                return "connected with";
            case "squad_join":
                return "joined";
            default:
                return "interacted with";
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {actor.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-pan-charcoal flex items-center justify-center text-white font-bold">
                            {actor.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-gray-100">
                    {getIcon()}
                </div>
            </div>

            <div className="flex-1">
                <p className="text-sm text-gray-800">
                    <span className="font-bold text-pan-deep-brown">{actor.name}</span>{" "}
                    <span className="text-gray-500">{getActionText()}</span>{" "}
                    <span className="font-bold text-pan-deep-brown">{target.name}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
            </div>

            <button className="p-2 text-gray-300 hover:text-pan-gold transition-colors">
                <ArrowRight size={16} />
            </button>
        </div>
    );
}
