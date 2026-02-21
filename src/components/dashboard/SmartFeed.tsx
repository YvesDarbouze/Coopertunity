import React from "react";
import CoopertunityCard from "@/components/coopertunity/CoopertunityCard";
import { ActivityCard } from "./ActivityCard";

// Define the discriminated union types for the feed items
type ActivityItemData = React.ComponentProps<typeof ActivityCard>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CoopertunityItemData = any; // Matching the props of CoopertunityCard which uses any

type FeedItem =
    | { type: "coopertunity"; data: CoopertunityItemData }
    | { type: "activity"; data: ActivityItemData };

export function SmartFeed() {
    // Mock Data - In a real app, this would come from a unified feed API
    const feedItems: FeedItem[] = [
        {
            type: "coopertunity",
            data: {
                id: "1",
                title: "Solar Grid Expansion in Nairobi",
                description:
                    "Seeking partners for a decentralized solar grid project serving 500 homes in peri-urban Nairobi. High impact investment with government backing.",
                sector: "PRIMARY", // Energy/Infrastructure often falls here or Secondary depending on specific taxonomy
                location: "Nairobi, Kenya",
                investmentAmount: 50000,
                willingnessToTeach: true,
                author: {
                    name: "Kwame O.",
                    image: null,
                },
            },
        },
        {
            type: "activity",
            data: {
                type: "investment",
                actor: { name: "Sarah Jenkins", image: undefined },
                target: { name: "Tech Hub Lagos" },
                timestamp: "2 hours ago",
            },
        },
        {
            type: "coopertunity",
            data: {
                id: "2",
                title: "Organic Cocoa Export Partnership",
                description:
                    "Looking for logistics partners to export premium organic cocoa beans from Ghana to European markets. Fair trade certified.",
                sector: "PRIMARY", // Agriculture
                location: "Kumasi, Ghana",
                willingnessToTeach: false,
                author: {
                    name: "Amara D.",
                    image: null,
                },
            },
        },
        {
            type: "activity",
            data: {
                type: "stakeholder_join",
                actor: { name: "David K.", image: undefined },
                target: { name: "Accra Solar Team" },
                timestamp: "1 day ago",
            },
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-pan-deep-brown mb-4 flex items-center gap-2">
                Smart Feed
                <span className="text-xs font-normal text-white bg-pan-gold px-2 py-0.5 rounded-full">
                    Recommended for You
                </span>
            </h2>

            {feedItems.map((item, index) => (
                <div key={index}>
                    {item.type === "coopertunity" ? (
                        <CoopertunityCard coopertunity={item.data} />
                    ) : (
                        <ActivityCard {...item.data} />
                    )}
                </div>
            ))}
        </div>
    );
}
