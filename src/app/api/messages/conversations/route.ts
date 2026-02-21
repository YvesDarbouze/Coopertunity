import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages/conversations
// Returns all active conversations for the current user
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        id: session.user.id
                    }
                }
            },
            include: {
                participants: {
                    where: {
                        id: { not: session.user.id } // Only fetch the OTHER people in the chat
                    },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        profession: true
                    }
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1 // Just get the latest message for the preview snippet
                }
            },
            orderBy: {
                updatedAt: "desc"
            }
        });

        // Format to calculate unread counts for the specific user
        const formatted = conversations.map(conv => {
            const hasUnread = conv.messages.some(m => !m.read && m.senderId !== session.user.id);
            return {
                ...conv,
                hasUnread
            };
        });

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("[CONVERSATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST /api/messages/conversations
// Creates a new conversation between the user and a target user
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { targetUserId } = body;

        if (!targetUserId) {
            return new NextResponse("Target User ID required", { status: 400 });
        }

        // Check if conversation already exists between these two exact users
        // This is a simplified check for 1-on-1 chats
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: session.user.id } } },
                    { participants: { some: { id: targetUserId } } }
                ]
            }
        });

        if (existingConversation) {
            return NextResponse.json(existingConversation);
        }

        // Create new
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

        return NextResponse.json(newConversation);

    } catch (error) {
        console.error("[CONVERSATIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
