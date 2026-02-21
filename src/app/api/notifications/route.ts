import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const [notifications, requests] = await Promise.all([
            prisma.notification.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 100
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
            })
        ]);

        // Split them out by tier for easier frontend consumption
        const tier1 = notifications.filter(n => n.tier === 'TIER_1');
        const standard = notifications.filter(n => n.tier !== 'TIER_1');

        return NextResponse.json({
            tier1,
            standard,
            all: notifications,
            requests,
            unreadCountTier1: tier1.filter(n => !n.isRead).length,
            unreadCountStandard: standard.filter(n => !n.isRead).length + requests.length
        });

    } catch (e) {
        console.error("Notifications API Error:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { notificationId, markAllRead, tier } = body;

        if (markAllRead) {
            // Mark all or specific tier as read
            const whereClause: any = { userId: session.user.id, isRead: false };
            if (tier) {
                whereClause.tier = tier;
            }

            const updated = await prisma.notification.updateMany({
                where: whereClause,
                data: { isRead: true }
            });
            return NextResponse.json({ success: true, count: updated.count });
        }

        if (notificationId) {
            // Mark specific as read
            const notification = await prisma.notification.findUnique({
                where: { id: notificationId }
            });

            if (!notification || notification.userId !== session.user.id) {
                return new NextResponse("Not Found / Forbidden", { status: 404 });
            }

            const updated = await prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true }
            });
            return NextResponse.json({ success: true, notification: updated });
        }

        return new NextResponse("Bad Request", { status: 400 });

    } catch (e) {
        console.error("Notifications PATCH Error:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
