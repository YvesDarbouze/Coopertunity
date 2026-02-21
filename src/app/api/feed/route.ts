import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isLocationOnContinent } from "@/lib/location_utils";
import { MATCHMAKING_ENGINE } from "@/lib/matchmaking";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter") || "ALL"; // ALL, DIASPORA, CONTINENT

        // 1. Fetch Coopertunities (Projects, Deals)
        const coopertunities = await prisma.coopertunity.findMany({
            where: {
                status: "OPEN",
                // TODO: Add location filtering logic here based on 'filter'
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        location: true,
                    }
                }
            },
            take: 20,
            orderBy: { createdAt: "desc" }
        });

        // 2. Fetch Users (People) - Exclude current user
        const users = await prisma.user.findMany({
            where: {
                id: { not: session.user.id },
                // TODO: Add refined filtering for "Looking to..."
            },
            take: 20,
            orderBy: { createdAt: "desc" }
        });

        // 3. Fetch Jobs (from JobListing model)
        const jobs = await prisma.jobListing.findMany({
            take: 10,
            orderBy: { postedAt: "desc" }
        });

        // 4. Fetch the current user's full profile (needed for score calculation)
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        // 5. Fetch existing Match rows for this user × these coopertunities in one query
        const coopertunityIds = coopertunities.map((c: any) => c.id);
        const existingMatches = coopertunityIds.length > 0
            ? await prisma.match.findMany({
                where: {
                    userId: session.user.id,
                    coopertunityId: { in: coopertunityIds }
                },
                select: { coopertunityId: true, score: true }
            })
            : [];

        // Build a lookup map: coopertunityId → stored score (0.0–1.0)
        const scoreMap = new Map<string, number>(
            existingMatches.map((m: { coopertunityId: string; score: number }) => [m.coopertunityId, m.score])
        );

        // Helper: score for a coopertunity — stored score first, then inline calculation, then neutral
        const getCoopertunityScore = (c: any): number => {
            if (scoreMap.has(c.id)) {
                // Stored score is 0.0–1.0; convert to 0–100 integer
                return Math.round(scoreMap.get(c.id)! * 100);
            }
            if (currentUser) {
                const raw = MATCHMAKING_ENGINE.calculateUtilityScore({ user: currentUser, coopertunity: c });
                return Math.round(raw * 100);
            }
            return 50; // neutral fallback when user profile unavailable
        };

        // Helper: deterministic user-to-user relevance score (no random)
        const getUserScore = (u: any): number => {
            if (!currentUser) return 50;
            let score = 0;
            // Sector overlap (40 pts)
            if ((currentUser as any).sector && (currentUser as any).sector === (u as any).sector) score += 40;
            // Skills intersection (40 pts)
            const mySkills: string[] = ((currentUser as any).skillsInventory as string[]) || [];
            const theirSkills: string[] = ((u as any).skillsInventory as string[]) || [];
            if (mySkills.length > 0 && theirSkills.length > 0) {
                const overlap = mySkills.filter((s: string) =>
                    theirSkills.some((t: string) => t.toLowerCase().includes(s.toLowerCase()))
                ).length;
                score += Math.min(Math.round((overlap / mySkills.length) * 40), 40);
            }
            // Target location match (20 pts)
            if (currentUser.targetLocation && u.location &&
                u.location.toLowerCase().includes(currentUser.targetLocation.toLowerCase())) {
                score += 20;
            }
            return Math.max(score, 10); // floor at 10 so score never shows 0
        };

        // 6. Transform to FeedItems using real scores
        const feedItems = [
            ...coopertunities.map((c: any) => ({
                id: c.id,
                type: "COOPERTUNITY",
                title: c.title,
                subtitle: c.sector + (c.subSector ? ` - ${c.subSector}` : ""),
                location: c.location,
                matchScore: getCoopertunityScore(c),
                tags: c.keywords,
                isDiaspora: !isLocationOnContinent(c.location),
                image: null
            })),
            ...users.map(u => ({
                id: u.id,
                type: "USER",
                title: u.name || "Anonymous Member",
                subtitle: u.profession || "Member",
                location: u.location,
                matchScore: getUserScore(u),
                tags: (u.skillsInventory as any)?.slice(0, 5) || [],
                isDiaspora: !isLocationOnContinent(u.location),
                image: u.image
            })),
            ...jobs.map(j => ({
                id: j.id,
                type: "JOB",
                title: j.title,
                subtitle: j.company,
                location: j.location,
                matchScore: 50, // Jobs have no personal match model; neutral score
                tags: [j.source, "Employment"],
                isDiaspora: !isLocationOnContinent(j.location),
                image: null
            })),
            // "Power Stakeholder" Recommendation (static editorial card)
            {
                id: "stakeholder-1",
                type: "COOPERTUNITY",
                title: "⚡ Power Stakeholder Suggestion",
                subtitle: "You + Dr. Eze + Cocoa Plant",
                location: "Accra, Ghana",
                matchScore: 98,
                tags: ["Perfect Trifecta", "High Impact"],
                isDiaspora: false,
                image: null
            }
        ];

        // 7. Apply Filter
        let filtered = feedItems;
        if (filter === "DIASPORA") {
            filtered = feedItems.filter(item => item.isDiaspora);
        } else if (filter === "CONTINENT") {
            filtered = feedItems.filter(item => !item.isDiaspora);
        }

        // Sort by matchScore descending (highest relevance first) — no random shuffle
        const sorted = filtered.sort((a, b) => b.matchScore - a.matchScore);

        return NextResponse.json(sorted);

    } catch (error) {
        console.error("[FEED_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
