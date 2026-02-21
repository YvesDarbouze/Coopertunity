import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages/[conversationId]
// Returns the full thread of messages for a specific conversation
export async function GET(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { conversationId } = await params;

        // Verify the user is part of this conversation before returning data
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                participants: {
                    some: { id: session.user.id }
                }
            },
            include: {
                participants: {
                    where: { id: { not: session.user.id } },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        profession: true
                    }
                },
                messages: {
                    orderBy: { createdAt: "asc" }
                }
            }
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        // Mark all unread messages in this conversation as read since the user fetched it
        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: session.user.id },
                read: false
            },
            data: {
                read: true
            }
        });

        return NextResponse.json(conversation);

    } catch (error) {
        console.error("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST /api/messages/[conversationId]
// Sends a new message into a specific conversation
export async function POST(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { conversationId } = await params;
        const body = await req.json();
        const { content, attachmentUrl } = body;

        if (!content && !attachmentUrl) {
            return new NextResponse("Message content is required", { status: 400 });
        }

        // Verify participation
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                participants: {
                    some: { id: session.user.id }
                }
            }
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                attachmentUrl,
                conversationId,
                senderId: session.user.id
            }
        });

        // Trigger an update to the conversation's updatedAt timestamp
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message);

    } catch (error) {
        console.error("[MESSAGES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
