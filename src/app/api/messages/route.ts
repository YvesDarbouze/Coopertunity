import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    try {
        // If a conversationId is given, return all messages for that conversation
        if (conversationId) {
            // Verify the user is a participant
            const conv = await prisma.conversation.findFirst({
                where: {
                    id: conversationId,
                    participants: { some: { id: session.user.id } }
                }
            });
            if (!conv) return new NextResponse("Forbidden", { status: 403 });

            const messages = await prisma.message.findMany({
                where: { conversationId },
                include: {
                    sender: { select: { id: true, name: true, image: true } }
                },
                orderBy: { createdAt: "asc" }
            });
            return NextResponse.json(messages);
        }

        // Otherwise return the list of conversations (sidebar)
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: session.user.id }
                }
            },
            include: {
                participants: {
                    select: { id: true, name: true, image: true }
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        return NextResponse.json(conversations);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { conversationId, content, attachmentUrl, recipientId } = await req.json();

        let convId = conversationId;

        // If no conversationId, create new conversation if not exists
        if (!convId && recipientId) {
            // Check if existing conversation
            const existing = await prisma.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { some: { id: session.user.id } } },
                        { participants: { some: { id: recipientId } } }
                    ]
                }
            });

            if (existing) {
                convId = existing.id;
            } else {
                const newConv = await prisma.conversation.create({
                    data: {
                        participants: {
                            connect: [{ id: session.user.id }, { id: recipientId }]
                        }
                    }
                });
                convId = newConv.id;
            }
        }

        const message = await prisma.message.create({
            data: {
                conversationId: convId,
                senderId: session.user.id,
                content,
                attachmentUrl
            }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: convId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message);

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
