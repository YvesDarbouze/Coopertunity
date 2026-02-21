"use client";

import { useState } from "react";
import { ShieldCheck, UploadCloud, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerificationClient({ isCurrentlyVerified }: { isCurrentlyVerified: boolean }) {
    const [isVerified, setIsVerified] = useState(isCurrentlyVerified);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUploadMock = async () => {
        setIsUploading(true);
        setError(null);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const res = await fetch("/api/users/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVerified: true })
            });

            if (res.ok) {
                setIsVerified(true);
                router.refresh();
            } else {
                setError("Failed to verify identity. Please try again.");
            }
        } catch (err) {
            setError("A network error occurred.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">

            {/* Header / Value Prop */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-6 border-b border-gray-100">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-deep-brown flex items-center gap-2">
                        Identity Verification
                        {isVerified && <ShieldCheck className="w-6 h-6 text-pan-green" />}
                    </h2>
                    <p className="text-gray-600 max-w-2xl">
                        Verified users get <strong className="text-pan-gold font-black">3x more visibility</strong> on Investment posts and Land Deal listings.
                    </p>
                </div>

                <div className={`px-4 py-2 rounded-full font-bold text-sm ${isVerified ? 'bg-pan-green/10 text-pan-green border border-pan-green/20' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    {isVerified ? "Status: VERIFIED" : "Status: UNVERIFIED"}
                </div>
            </div>

            {/* Upload Area */}
            {!isVerified ? (
                <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-orange-800">
                            <strong>Action Required.</strong> Please upload a government-issued ID or official Business Registration document to unlock verified status and premium networking features.
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-pan-gold hover:bg-orange-50/50 transition-colors cursor-pointer group" onClick={handleUploadMock}>
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                            <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-pan-gold" />
                        </div>
                        <h3 className="font-bold text-deep-brown mb-1">Click to Upload Documents</h3>
                        <p className="text-sm text-gray-500">PDF, JPG, or PNG up to 10MB</p>

                        <button
                            disabled={isUploading}
                            className="mt-6 bg-deep-brown text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-pan-gold hover:text-deep-brown transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                        >
                            {isUploading ? "Uploading & Verifying..." : "Get Verified"}
                        </button>

                        {error && <p className="text-red-500 text-sm mt-4 font-medium">{error}</p>}
                    </div>
                </div>
            ) : (
                <div className="bg-pan-green/5 border border-pan-green/20 rounded-xl p-8 text-center space-y-4">
                    <div className="bg-white w-20 h-20 rounded-full shadow-sm flex items-center justify-center mx-auto mb-2 border border-pan-green/10">
                        <CheckCircle2 className="w-10 h-10 text-pan-green" />
                    </div>
                    <h3 className="text-xl font-bold text-deep-brown">Identity Verified Successfully</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Your identity has been validated. You now have full access to high-trust networking and elevated post visibility across the Coopertunity platform.
                    </p>

                    <div className="pt-6 mt-6 border-t border-pan-green/10 flex justify-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-100">
                            <FileText className="w-4 h-4 text-pan-gold" /> ID Document Provided
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
