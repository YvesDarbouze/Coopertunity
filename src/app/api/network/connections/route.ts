import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        // Fetch all PENDING requests sent TO this user
        const incomingRequests = await prisma.connectionRequest.findMany({
            where: {
                receiverId: user.id,
                status: "PENDING"
            },
            include: {
                sender: {
                    select: { id: true, name: true, profession: true, image: true, location: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(incomingRequests);

    } catch (e) {
        console.error("Failed to fetch connection requests:", e);
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
        const { requestId, action } = body; // action: "ACCEPTED" | "REJECTED"

        if (!requestId || !["ACCEPTED", "REJECTED"].includes(action)) {
            return new NextResponse("Invalid payload", { status: 400 });
        }

        const request = await prisma.connectionRequest.findUnique({ where: { id: requestId } });

        if (!request || request.receiverId !== user.id) {
            return new NextResponse("Unauthorized to modify this request", { status: 403 });
        }

        const updated = await prisma.connectionRequest.update({
            where: { id: requestId },
            data: { status: action }
        });

        // If accepted, we might want to trigger a Notification here later.

        return NextResponse.json(updated);

    } catch (e) {
        console.error("Failed to update connection request:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
