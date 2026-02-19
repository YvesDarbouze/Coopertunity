import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const [notifications, requests] = await Promise.all([
            prisma.notification.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: "desc" },
                take: 50,
            }),
            prisma.connectionRequest.findMany({
                where: {
                    receiverId: session.user.id,
                    status: "PENDING",
                },
                include: {
                    sender: { select: { id: true, name: true, image: true, profession: true } },
                },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({ notifications, requests });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id, markAllRead } = await req.json();

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: { userId: session.user.id, read: false },
                data: { read: true },
            });
            return NextResponse.json({ success: true });
        }

        if (id) {
            const updated = await prisma.notification.update({
                where: { id },
                data: { read: true },
            });
            return NextResponse.json(updated);
        }

        return new NextResponse("Bad Request", { status: 400 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
