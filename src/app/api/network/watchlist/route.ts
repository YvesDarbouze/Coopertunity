import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        // Retrieve user's watchlists
        const watchlists = await prisma.watchlist.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" }
        });

        // For each watchlist, quickly calculate if there are "new" unread matches
        const watchlistsWithAlerts = await Promise.all(
            watchlists.map(async (wl) => {
                // Determine if any Coopertunity matches this watchlist and was created AFTER lastChecked
                const newMatchesCount = await prisma.coopertunity.count({
                    where: {
                        sector: wl.sector as any || undefined,
                        // Basic keyword matching (if keywords exist, look for overlaps in title/description/keywords)
                        OR: wl.keywords.length > 0 ? wl.keywords.map(kw => ({
                            OR: [
                                { title: { contains: kw, mode: 'insensitive' } },
                                { description: { contains: kw, mode: 'insensitive' } },
                            ]
                        })) : undefined,
                        createdAt: {
                            gt: wl.lastChecked
                        }
                    }
                });

                return {
                    ...wl,
                    hasNewAlerts: newMatchesCount > 0,
                    newAlertCount: newMatchesCount
                };
            })
        );

        return NextResponse.json(watchlistsWithAlerts);

    } catch (e) {
        console.error("Failed to fetch watchlists:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const body = await req.json();
        const { title, sector, keywords } = body;

        if (!title) return new NextResponse("Watchlist title required", { status: 400 });

        const watchlist = await prisma.watchlist.create({
            data: {
                title,
                sector: sector || null,
                keywords: keywords || [],
                userId: user.id
            }
        });

        return NextResponse.json(watchlist);

    } catch (e) {
        console.error("Failed to create watchlist:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const body = await req.json();
        const { watchlistId } = body;

        if (!watchlistId) return new NextResponse("Watchlist ID required", { status: 400 });

        // Update the lastChecked timestamp to dismiss alerts
        const updated = await prisma.watchlist.updateMany({
            where: {
                id: watchlistId,
                userId: user.id
            },
            data: {
                lastChecked: new Date()
            }
        });

        if (updated.count === 0) return new NextResponse("Watchlist not found or unauthorized", { status: 403 });

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Failed to update watchlist:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
