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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        // Build composite DTO for the Network page
        const [connections, stakeholders] = await Promise.all([
            // 1. Get all ACCEPTED ConnectionRequests to build the user's base Network
            prisma.connectionRequest.findMany({
                where: {
                    status: "ACCEPTED",
                    OR: [
                        { senderId: user.id },
                        { receiverId: user.id }
                    ]
                },
                include: {
                    sender: { select: { id: true, name: true, profession: true, image: true, location: true } },
                    receiver: { select: { id: true, name: true, profession: true, image: true, location: true } }
                }
            }),
            // 2. Get the Stakeholders owned by the user, and the nested members
            prisma.stakeholder.findMany({
                where: { ownerId: user.id },
                include: {
                    members: {
                        select: { id: true, name: true, profession: true, image: true, location: true }
                    }
                }
            })
        ]);

        // Flatten connections properly since a user can be sender or receiver
        const network = connections.map((c: any) => c.senderId === user.id ? c.receiver : c.sender);

        return NextResponse.json({
            network,
            stakeholders,
        });

    } catch (e) {
        console.error("Failed to load network data:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
