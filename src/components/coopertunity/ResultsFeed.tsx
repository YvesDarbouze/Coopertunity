"use client";

import { useState } from "react";
import CoopertunityTile from "./CoopertunityTile";
import CoopertunityModal from "./CoopertunityModal";

interface ResultsFeedProps {
    coopertunities: any[]; // Replace with proper type later
}

export default function ResultsFeed({ coopertunities }: ResultsFeedProps) {
    const [selectedCoopertunity, setSelectedCoopertunity] = useState<any | null>(null);

    return (
        <div className="relative">
            {/* Masonry Grid Layout - Simple column approach for now */}
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 p-4">
                {coopertunities.map((coop) => (
                    <CoopertunityTile
                        key={coop.id}
                        coopertunity={coop}
                        onClick={() => setSelectedCoopertunity(coop)}
                    />
                ))}
            </div>

            {/* Expanded Modal Overlay */}
            {selectedCoopertunity && (
                <CoopertunityModal
                    coopertunity={selectedCoopertunity}
                    onClose={() => setSelectedCoopertunity(null)}
                />
            )}
        </div>
    );
}
