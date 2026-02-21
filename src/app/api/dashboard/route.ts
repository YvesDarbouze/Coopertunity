import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        // Fetch My Active Posts
        const myPosts = await prisma.coopertunity.findMany({
            where: { authorId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5
        });

        // Fetch Saved Items (Watched)
        const savedItems = await prisma.interaction.findMany({
            where: {
                actorId: session.user.id,
                action: "WATCH"
            },
            take: 5,
            orderBy: { createdAt: "desc" }
        });

        // Fetch Matches (Simulated or from Notifications)
        const matches = await prisma.connectionRequest.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, status: "ACCEPTED" },
                    { receiverId: session.user.id, status: "ACCEPTED" }
                ]
            },
            include: {
                sender: { select: { id: true, name: true, image: true, profession: true } },
                receiver: { select: { id: true, name: true, image: true, profession: true } }
            },
            take: 5
        });

        const formattedMatches = matches.map((m: any) => {
            const partner = m.senderId === session.user.id ? m.receiver : m.sender;
            return partner;
        });

        // Mock additional data for the new Dashboard UI
        const profileViews = Math.floor(Math.random() * 50) + 12; // Example static/random mock
        const stakeholderRequests = Math.floor(Math.random() * 5); // Example mock

        // Algorithmic "Smart Feed": Mix of Coopertunities and Network Activity
        const mockFeed = [
            {
                id: "feed_1",
                type: "RECOMMENDED",
                title: "Solar Grid Expansion in Nairobi",
                sector: "Primary",
                activityText: null,
                targetId: "coop1",
                createdAt: new Date().toISOString()
            },
            {
                id: "feed_2",
                type: "NETWORK_ACTIVITY",
                title: null,
                sector: null,
                activityText: "David Adebayo just invested in AgriTech Solutions",
                targetId: "user_david",
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: "feed_3",
                type: "RECOMMENDED",
                title: "FinTech App Developer Needed",
                sector: "Tertiary",
                activityText: null,
                targetId: "coop2",
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];

        return NextResponse.json({
            posts: myPosts,
            saved: savedItems,
            matches: formattedMatches,
            profileViews,
            stakeholderRequests,
            feed: mockFeed
        });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
