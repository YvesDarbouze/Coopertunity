"use client";

import { useState } from "react";
import { EyeOff, MapPin, ShieldAlert, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyClient({
    initialStealth,
    initialLocationPrivacy
}: {
    initialStealth: boolean,
    initialLocationPrivacy: string
}) {
    const [stealthMode, setStealthMode] = useState(initialStealth);
    const [locationPrivacy, setLocationPrivacy] = useState(initialLocationPrivacy);

    // UI states
    const [isSaving, setIsSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState("");
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        setSavedMsg("");

        try {
            const res = await fetch("/api/users/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stealthMode, locationPrivacy })
            });

            if (res.ok) {
                setSavedMsg("Privacy settings saved successfully.");
                router.refresh();
            } else {
                setSavedMsg("Failed to save settings.");
            }
        } catch (err) {
            setSavedMsg("A network error occurred.");
        } finally {
            setIsSaving(false);
            setTimeout(() => setSavedMsg(""), 3000);
        }
    };

    return (
        <div className="space-y-8">

            {/* Stealth Mode Module */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 rounded-full ${stealthMode ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                        <EyeOff className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-deep-brown">Stealth Mode</h2>

                            {/* Toggle Switch */}
                            <button
                                onClick={() => setStealthMode(!stealthMode)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out flex ${stealthMode ? 'bg-pan-gold justify-end' : 'bg-gray-200 justify-start'}`}
                            >
                                <div className="w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Designed for high-net-worth individuals and targeted networking. When active, your profile is completely hidden from Global Search and Explore feeds. You are only visible to your active connections and users you directly message.
                        </p>
                    </div>
                </div>

                {stealthMode && (
                    <div className="mt-4 bg-orange-50/50 border border-orange-100 p-4 rounded-lg flex items-center gap-2 text-sm text-orange-800">
                        <ShieldAlert className="w-5 h-5 text-orange-500" />
                        <strong>Stealth Mode is Active.</strong> Your profile is currently hidden from public discovery.
                    </div>
                )}
            </div>

            {/* Location Fuzzying Module */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-deep-brown mb-2">Location Fuzzying</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            Control the precision of the location shown on your public profile and on your active Coopertunity posts.
                        </p>

                        <div className="space-y-3 pt-2">
                            {[
                                { id: "EXACT", label: "Show Exact Location", desc: "e.g., specific street or neighborhood" },
                                { id: "CITY", label: "Show City Only", desc: "e.g., 'Lagos', 'Nairobi'" },
                                { id: "COUNTRY", label: "Show Country Only", desc: "e.g., 'Nigeria', 'Kenya', or 'Diaspora'" },
                                { id: "HIDDEN", label: "Hide Location", desc: "Location data removed completely" },
                            ].map(option => (
                                <label
                                    key={option.id}
                                    className={`flex items-start md:items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${locationPrivacy === option.id ? 'border-pan-green bg-pan-green/5' : 'border-gray-200 hover:border-pan-green hover:bg-gray-50'}`}
                                >
                                    <input
                                        type="radio"
                                        name="locationPrivacy"
                                        value={option.id}
                                        checked={locationPrivacy === option.id}
                                        onChange={(e) => setLocationPrivacy(e.target.value)}
                                        className="mt-1 md:mt-0 w-5 h-5 text-pan-green focus:ring-pan-green border-gray-300"
                                    />
                                    <div>
                                        <div className="font-bold text-deep-brown">{option.label}</div>
                                        <div className="text-sm text-gray-500">{option.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Actions */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
                <p className={`text-sm font-bold ${savedMsg.includes("Failed") ? "text-red-500" : "text-pan-green"}`}>
                    {savedMsg}
                </p>
                <button
                    onClick={handleSave}
                    disabled={isSaving || (stealthMode === initialStealth && locationPrivacy === initialLocationPrivacy)}
                    className="flex items-center gap-2 bg-deep-brown text-white px-8 py-3 rounded-full font-bold shadow hover:bg-pan-gold hover:text-deep-brown transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Preferences
                </button>
            </div>

        </div>
    );
}
