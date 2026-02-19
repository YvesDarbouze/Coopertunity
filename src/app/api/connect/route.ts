import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { targetId, action } = await req.json(); // action: REQUEST, ACCEPT, REJECT

        if (action === "REQUEST") {
            const request = await prisma.connectionRequest.create({
                data: {
                    senderId: session.user.id,
                    receiverId: targetId,
                    status: "PENDING"
                }
            });
            return NextResponse.json(request);
        }

        if (action === "ACCEPT" || action === "REJECT") {
            const request = await prisma.connectionRequest.updateMany({
                where: {
                    senderId: targetId,
                    receiverId: session.user.id,
                    status: "PENDING"
                },
                data: {
                    status: action === "ACCEPT" ? "ACCEPTED" : "REJECTED"
                }
            });
            return NextResponse.json(request);
        }

        return new NextResponse("Invalid Action", { status: 400 });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
