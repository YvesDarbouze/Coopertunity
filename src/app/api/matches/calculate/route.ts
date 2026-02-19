import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MATCHMAKING_ENGINE } from "@/lib/matchmaking";

export async function POST(req: NextRequest) {
    try {
        const { userId, coopertunityId } = await req.json();

        if (!userId || !coopertunityId) {
            return NextResponse.json({ _error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const coopertunity = await prisma.coopertunity.findUnique({ where: { id: coopertunityId } });

        if (!user || !coopertunity) {
            return NextResponse.json({ _error: "User or Coopertunity not found" }, { status: 404 });
        }

        const score = MATCHMAKING_ENGINE.calculateUtilityScore({ user, coopertunity });

        // Persist match if score is above threshold (e.g., 0.5)
        if (score >= 0.5) {
            // @ts-ignore - stale prisma client
            await prisma.match.upsert({
                where: {
                    userId_coopertunityId: {
                        userId,
                        coopertunityId
                    }
                },
                update: { score },
                create: {
                    userId,
                    coopertunityId,
                    score,
                    status: "PENDING"
                }
            });
        }

        return NextResponse.json({ score, matched: score >= 0.5 });
    } catch (error) {
        console.error("Match calculation failed:", error);
        return NextResponse.json({ _error: "Internal Server Error" }, { status: 500 });
    }
}
