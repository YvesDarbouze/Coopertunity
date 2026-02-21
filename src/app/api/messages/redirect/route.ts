import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages/redirect?targetId=...
// A utility router used specifically when clicking "Message User" from non-React-router contexts (like drag cards).
// It checks if a conversation exists, creates one if not, and performs a native server redirect to the inbox.
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("targetId");

    if (!targetUserId) {
        return NextResponse.redirect(new URL("/dashboard/network", req.url));
    }

    // You can't message yourself
    if (targetUserId === session.user.id) {
        return NextResponse.redirect(new URL("/dashboard/inbox", req.url));
    }

    try {
        // 1. Check for existing conversation
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: session.user.id } } },
                    { participants: { some: { id: targetUserId } } }
                ]
            }
        });

        if (existingConversation) {
            return NextResponse.redirect(new URL(`/dashboard/inbox?chat=${existingConversation.id}`, req.url));
        }

        // 2. Or create a new one
        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    connect: [
                        { id: session.user.id },
                        { id: targetUserId }
                    ]
                }
            }
        });

        return NextResponse.redirect(new URL(`/dashboard/inbox?chat=${newConversation.id}`, req.url));

    } catch (error) {
        console.error("[MESSAGE_REDIRECT]", error);
        return NextResponse.redirect(new URL("/dashboard/inbox", req.url));
    }
}
