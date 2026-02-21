import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verify this path
import ResultsFeed from "@/components/coopertunity/ResultsFeed";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MatchesPage({ searchParams }: { searchParams: { page?: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth/signin");
    }

    const page = parseInt(searchParams.page || "1", 10);
    const limit = 10;
    const skip = (page - 1) * limit;

    // Get User ID from email (since session might not have ID depending on callbacks)
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        // Handle edge case
        return <div>User not found</div>;
    }

    const matches = await prisma.match.findMany({
        where: {
            userId: user.id,
            // You might want to filter by status here, e.g., PENDING or ACCEPTED
        },
        include: {
            coopertunity: {
                include: {
                    author: true
                }
            }
        },
        orderBy: {
            score: 'desc'
        },
        take: limit,
        skip: skip
    });

    // Transform matches to the format ResultsFeed expects (array of coopertunities)
    // We might want to inject the "match score" into the coopertunity object or handle it in the feed
    // For now, let's just pass the coopertunities.
    const coopertunities = matches.map((match: any) => ({
        ...match.coopertunity,
        matchScore: match.score // Optional: if we want to display it
    }));

    return (
        <main className="min-h-screen bg-cloud-dancer">
            <div className="bg-cloud-dancer border-b border-pan-black/10 px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-pan-black tracking-tight mb-2 font-heading">
                        Matches
                    </h1>
                    <p className="text-pan-black/60 font-medium">
                        Curated opportunities tailored to your profile.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8">
                {coopertunities.length > 0 ? (
                    <>
                        <ResultsFeed coopertunities={coopertunities} />

                        {/* Server-Side Pagination Controls */}
                        <div className="mt-12 flex justify-center items-center gap-4">
                            {page > 1 ? (
                                <a
                                    href={`/dashboard/matches?page=${page - 1}`}
                                    className="px-6 py-2.5 rounded-full border border-gray-200 text-mocha-mousse font-bold hover:bg-gray-50 transition-all font-heading"
                                >
                                    Previous
                                </a>
                            ) : (
                                <button disabled className="px-6 py-2.5 rounded-full border border-gray-200 text-mocha-mousse font-bold disabled:opacity-30 font-heading">
                                    Previous
                                </button>
                            )}

                            <span className="text-sm font-bold text-deep-brown bg-peach-fuzz/20 px-4 py-1.5 rounded-full">
                                Page {page}
                            </span>

                            {coopertunities.length === limit ? (
                                <a
                                    href={`/dashboard/matches?page=${page + 1}`}
                                    className="px-6 py-2.5 rounded-full border border-gray-200 text-mocha-mousse font-bold hover:bg-gray-50 transition-all font-heading"
                                >
                                    Next
                                </a>
                            ) : (
                                <button disabled className="px-6 py-2.5 rounded-full border border-gray-200 text-mocha-mousse font-bold disabled:opacity-30 font-heading">
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-pan-black mb-2">No matches yet.</h3>
                        <p className="text-pan-black/60">Complete your profile to get better recommendations.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
