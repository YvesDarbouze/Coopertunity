import { prisma } from "@/lib/prisma";
import ResultsFeed from "@/components/coopertunity/ResultsFeed";
import { Plus } from "lucide-react";
import Link from "next/link";

// Force dynamic to ensure we get fresh data
export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
    // Fetch recent coopertunities
    // In a real app, this would use searchParams for filtering
    const coopertunities = await prisma.coopertunity.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
            author: true
        }
    });

    return (
        <main className="min-h-screen bg-cloud-dancer"> {/* Light background for the feed specifically */}

            {/* Page Header */}
            <div className="bg-cloud-dancer border-b border-pan-black/10 px-8 py-12">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-pan-black tracking-tight mb-2 font-heading">
                            Explore
                        </h1>
                        <p className="text-pan-black/60 font-medium">
                            Discover opportunities across the continent.
                        </p>
                    </div>
                    <Link href="/coopertunities/create" className="flex items-center gap-2 bg-pan-gold text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:scale-105 transition-transform">
                        <Plus size={20} />
                        New Coopertunity
                    </Link>
                </div>
            </div>

            {/* The Results Feed */}
            <div className="max-w-7xl mx-auto py-8">
                <ResultsFeed coopertunities={coopertunities} />
            </div>
        </main>
    );
}
