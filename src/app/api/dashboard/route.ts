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
            include: {
                // Determine what was watched -> Need to handle polymorphically in frontend or separate queries
                // For now, let's just return the IDs and types
            },
            take: 5,
            orderBy: { createdAt: "desc" }
        });

        // Fetch Matches (Simulated or from Notifications)
        // For MVP, "Matches" can be people who have sent connection requests or accepted yours
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

        return NextResponse.json({
            posts: myPosts,
            saved: savedItems,
            matches: formattedMatches
        });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
