import { prisma } from "@/lib/prisma";
import { MATCHMAKING_ENGINE } from "@/lib/matchmaking";

export const BACKGROUND_MATCHER = {
    findMatchesForCoopertunity: async (coopertunityId: string) => {
        // 1. Fetch the new coopertunity
        const coopertunity = await prisma.coopertunity.findUnique({
            where: { id: coopertunityId }
        });

        if (!coopertunity) return;

        // 2. Find Candidate Users 
        // In a real app, uses vector search or broad filtering.
        // MVP: Fetch recent 50 users who match the sector or location roughly
        const candidates = await prisma.user.findMany({
            where: {
                OR: [
                    // @ts-ignore - stale prisma client
                    { sector: coopertunity.sector },
                    { targetLocation: { contains: coopertunity.location || "" } },
                    { isAfrican: true } // simple fallback to get some candidates
                ]
            },
            take: 50
        });

        // 3. Calculate Scores and Persist Matches
        const matches = [];
        for (const user of candidates) {
            // Skip author
            if (user.id === coopertunity.authorId) continue;

            const score = MATCHMAKING_ENGINE.calculateUtilityScore({ user, coopertunity });

            if (score >= 0.5) {
                matches.push({
                    userId: user.id,
                    coopertunityId: coopertunity.id,
                    score,
                    status: "PENDING"
                });
            }
        }

        // 4. Batch Insert Matches
        if (matches.length > 0) {
            // @ts-ignore - stale prisma client
            await prisma.match.createMany({
                data: matches,
                skipDuplicates: true
            });
            console.log(`[MATCHING] Generated ${matches.length} matches for ${coopertunity.title}`);
        }
    }
};
