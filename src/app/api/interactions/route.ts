import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { targetId, targetType, action } = body; // action: PASS, WATCH, CONNECT

        if (!targetId || !targetType || !action) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // 1. Record the interaction
        const interaction = await prisma.interaction.create({
            data: {
                actorId: session.user.id,
                targetId,
                targetType, // USER, COOPERTUNITY
                action
            }
        });

        // 2. If 'CONNECT', create a Notification for the target
        if (action === "CONNECT") {
            // Determine the owner of the target
            let ownerId: string | null = null;

            if (targetType === "USER") {
                ownerId = targetId;
            } else if (targetType === "COOPERTUNITY") {
                const coop = await prisma.coopertunity.findUnique({
                    where: { id: targetId },
                    select: { authorId: true }
                });
                if (coop) ownerId = coop.authorId;
            }

            if (ownerId && ownerId !== session.user.id) {
                await prisma.notification.create({
                    data: {
                        userId: ownerId,
                        title: "New Interest!",
                        message: `${session.user.name || "A member"} wants to connect regarding your ${targetType.toLowerCase()}.`,
                        type: "MATCH",
                        link: `/dashboard/interactions` // Todo: Define route
                    }
                });
            }
        }

        return NextResponse.json(interaction);

    } catch (error) {
        console.error("[INTERACTION_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
