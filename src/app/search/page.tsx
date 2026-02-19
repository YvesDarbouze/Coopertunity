import { Suspense } from "react";
import SearchContent from "@/components/search/SearchContent";

export const dynamic = "force-dynamic";

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black pt-24 text-center text-white">Loading Search...</div>}>
            <SearchContent />
        </Suspense>
    );
}
